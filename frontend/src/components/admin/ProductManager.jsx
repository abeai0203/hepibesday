import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader2, X, ShoppingBag, Image as ImageIcon, Target, Tag, ExternalLink, Wand2, FileSpreadsheet, Download, Search, Sparkles, CheckCircle2, ListPlus, Edit3, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory' or 'magic'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  
  // Magic Importer State
  const [bulkUrls, setBulkUrls] = useState('')
  const [importStatus, setImportStatus] = useState([]) 
  const [isImporting, setIsImporting] = useState(false)
  
  const fileInputRef = useRef(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', price_range: '', image_url: '', shopee_url: '', gender_target: 'U', tags: '', relationship_target: 'U'
  })

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      const res = await fetch(`${apiUrl}/api/admin/products`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      const data = await res.json()
      if (res.ok) setProducts(data.results || data.products || [])
    } catch (err) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    if (!window.XLSX) {
      const script = document.createElement('script')
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"
      document.head.appendChild(script)
    }
  }, [])

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      price_range: product.price_range,
      image_url: product.image_url,
      shopee_url: product.shopee_url,
      gender_target: product.gender_target || 'U',
      tags: product.tags || '',
      relationship_target: product.relationship_target || 'U'
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${apiUrl}/api/admin/products/${editingId}` : `${apiUrl}/api/admin/products`
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingId(null)
        fetchProducts()
      } else {
        alert('Gagal simpan')
      }
    } catch (err) {
      alert('Ralat rangkaian')
    } finally {
      setSaving(false)
    }
  }

  const startMagicImport = async () => {
    const lines = bulkUrls.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    if (lines.length === 0) return alert('Sila masukkan sekurang-kurangnya satu baris Link Affiliate | Link Original')

    setIsImporting(true)
    const initialStatus = lines.map(line => ({ url: line, status: 'pending' }))
    setImportStatus(initialStatus)

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let affiliateUrl = line
      let scrapeUrl = line

      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim())
        affiliateUrl = parts[0]
        scrapeUrl = parts[1] || parts[0]
      }

      setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'loading' } : s))

      try {
        // Try Frontend Scrape first via allorigins proxy (often more reliable than server)
        let scrapedData = null
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(scrapeUrl)}`
          const proxyRes = await fetch(proxyUrl)
          const proxyJson = await proxyRes.json()
          const html = proxyJson.contents
          
          const ogTitle = html.match(/property="og:title"\s+content="(.*?)"/i)?.[1] || html.match(/<title>(.*?)<\/title>/i)?.[1]
          const ogImage = html.match(/property="og:image"\s+content="(.*?)"/i)?.[1]
          
          if (ogTitle && ogTitle.toLowerCase() !== 'shopee') {
            scrapedData = {
              name: ogTitle.split('|')[0].split('-')[0].trim(),
              image_url: ogImage
            }
          }
        } catch (e) {
          console.log("Frontend scrape failed, falling back to worker")
        }

        // Call backend for AI Polish and DB Save
        const aiRes = await fetch(`${apiUrl}/api/admin/scrape-product`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({ 
            url: scrapeUrl, 
            name: scrapedData?.name || '' // Pass what we found to AI
          })
        });
        
        const aiData = await aiRes.json();

        const saveRes = await fetch(`${apiUrl}/api/admin/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({
            name: aiData.name || scrapedData?.name || 'Produk Baru',
            description: aiData.description,
            price_range: aiData.price_range || 'RM -',
            image_url: scrapedData?.image_url || aiData.image_url,
            shopee_url: affiliateUrl,
            gender_target: 'U',
            tags: aiData.tags || '',
            relationship_target: 'U'
          })
        });

        if (saveRes.ok) {
          setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success', name: aiData.name || scrapedData?.name } : s))
        } else {
          throw new Error('Save failed')
        }
      } catch (err) {
        setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error' } : s))
      }
    }
    setIsImporting(false)
    fetchProducts()
  }

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBulkLoading(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result
        const wb = window.XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = window.XLSX.utils.sheet_to_json(ws)
        if (data.length === 0) throw new Error('Fail Excel kosong')
        const normalizedData = data.map(item => ({
          name: item['Nama Produk'] || item.name || '',
          description: item['Deskripsi'] || item.description || '',
          price_range: item['Harga'] || item.price_range || 'RM ',
          image_url: item['Gambar'] || item.image_url || '',
          shopee_url: item['URL'] || item.shopee_url || '',
          gender_target: item['Target Jantina'] || item.gender_target || 'U',
          tags: item['Tags (Hobi)'] || item.tags || '',
          relationship_target: item['Target Hubungan'] || item.relationship_target || 'U'
        }))
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
        const res = await fetch(`${apiUrl}/api/admin/bulk-products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
          body: JSON.stringify(normalizedData)
        })
        if (!res.ok) throw new Error('Gagal upload')
        alert(`Berjaya upload ${normalizedData.length} produk!`)
        fetchProducts()
      } catch (err) {
        alert(`Upload Gagal: ${err.message}`)
      } finally {
        setBulkLoading(false)
        e.target.value = null
      }
    }
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const template = [{ 'Nama Produk': '...', 'Deskripsi': '...', 'Harga': 'RM ', 'Gambar': '...', 'URL': '...', 'Target Jantina': 'U', 'Tags (Hobi)': '...', 'Target Hubungan': 'U' }]
    const ws = window.XLSX.utils.json_to_sheet(template)
    const wb = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(wb, ws, "Produk")
    const refData = [
      { 'Kategori': 'Target Jantina', 'Kod': 'M', 'Maksud': 'Lelaki' },
      { 'Kategori': 'Target Jantina', 'Kod': 'F', 'Maksud': 'Wanita' },
      { 'Kategori': 'Target Jantina', 'Kod': 'U', 'Maksud': 'Unisex' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'P', 'Maksud': 'Pasangan' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'K', 'Maksud': 'Kawan' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'F', 'Maksud': 'Keluarga' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'U', 'Maksud': 'Semua (General)' }
    ]
    const wsRef = window.XLSX.utils.json_to_sheet(refData)
    window.XLSX.utils.book_append_sheet(wb, wsRef, "Rujukan_Kod")
    window.XLSX.writeFile(wb, "Hepibesday_Template_Bulk.xlsx")
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchProducts()
    } catch (err) {}
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="text-indigo-950 font-black uppercase tracking-widest text-xs">Memuatkan Sistem...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white/50 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white shadow-xl">
        <div>
          <h2 className="text-4xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
            Admin Dashboard <Sparkles className="text-pink-500 w-8 h-8" />
          </h2>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'inventory' ? 'bg-indigo-950 text-white shadow-lg' : 'bg-white text-indigo-950/40 hover:bg-indigo-50'}`}
            >
              Inventory ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('magic')}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'magic' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-indigo-950/40 hover:bg-pink-50'}`}
            >
              <Wand2 className="w-4 h-4" />
              Magic Bulk Importer
            </button>
          </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="flex flex-wrap gap-3">
            <input type="file" ref={fileInputRef} onChange={handleBulkUpload} accept=".xlsx, .xls, .csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={bulkLoading} className="flex items-center space-x-3 px-6 py-4 bg-white border-2 border-indigo-950/10 text-indigo-950 rounded-2xl hover:border-indigo-950 font-black transition-all shadow-sm">
              {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5 text-green-600" />}
              <span>Import Excel</span>
            </button>
            <button onClick={downloadTemplate} className="p-4 bg-white border-2 border-indigo-950/10 text-indigo-950 rounded-2xl hover:border-indigo-950 transition-all shadow-sm">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={() => { setEditingId(null); setFormData({ name: '', description: '', price_range: 'RM ', image_url: '', shopee_url: '', gender_target: 'U', tags: '', relationship_target: 'U' }); setIsModalOpen(true); }} className="px-8 py-4 bg-indigo-950 text-white rounded-2xl hover:bg-pink-500 font-black transition-all shadow-xl hover:-translate-y-1">
              + Tambah Manual
            </button>
          </div>
        )}
      </div>

      {activeTab === 'inventory' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl border-2 border-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-indigo-950/5 text-indigo-950/50 text-[10px] uppercase font-black tracking-widest border-b border-indigo-950/5">
                  <th className="px-8 py-6">Imej & Nama</th>
                  <th className="px-8 py-6">Target & Harga</th>
                  <th className="px-8 py-6 hidden md:table-cell">Deskripsi</th>
                  <th className="px-8 py-6 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/5">
                {products.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-pink-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-contain rounded-xl bg-white p-2 shadow-inner border border-slate-100" />
                        </div>
                        <div className="max-w-[150px] md:max-w-xs">
                          <p className="font-black text-indigo-950 text-sm truncate group-hover:text-pink-500 transition-colors">{p.name}</p>
                          <a href={p.shopee_url} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-slate-400 flex items-center gap-1 hover:text-indigo-950 uppercase tracking-tighter">
                            Shopee <ExternalLink size={8} />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white ${p.gender_target === 'M' ? 'bg-blue-400' : p.gender_target === 'F' ? 'bg-pink-400' : 'bg-purple-400'}`}>
                            {p.gender_target === 'M' ? 'LELAKI' : p.gender_target === 'F' ? 'WANITA' : 'UNISEX'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-950/10 text-[8px] font-black text-indigo-950">
                            {p.relationship_target === 'P' ? 'PASANGAN' : p.relationship_target === 'K' ? 'KAWAN' : p.relationship_target === 'F' ? 'KELUARGA' : 'SEMUA'}
                          </span>
                        </div>
                        <span className="font-black text-indigo-950 text-xs">
                          {p.price_range ? (p.price_range.startsWith('RM') ? p.price_range : `RM ${p.price_range}`) : 'RM -'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2 max-w-xs italic leading-relaxed">"{p.description}"</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(p)} className="p-3 text-slate-300 hover:text-indigo-950 hover:bg-white rounded-2xl transition-all shadow-sm"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border-2 border-white rounded-[3rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <ListPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-indigo-950">Magic Bulk Importer 2.0</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Format: Link Affiliate | Link Shopee Biasa</p>
              </div>
            </div>

            <textarea 
              value={bulkUrls}
              onChange={e => setBulkUrls(e.target.value)}
              placeholder="https://shope.ee/aff-link | https://shopee.com.my/real-product-link"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-200 rounded-[2rem] p-8 text-sm font-bold text-indigo-950 outline-none transition-all min-h-[250px] shadow-inner"
            />

            <button 
              onClick={startMagicImport}
              disabled={isImporting || !bulkUrls}
              className="w-full py-6 bg-indigo-950 text-white rounded-[2rem] font-black text-lg hover:bg-pink-500 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              {isImporting ? 'MAGIC SEARCHING...' : 'START AUTO-IMPORTER'}
            </button>
          </div>

          {importStatus.length > 0 && (
            <div className="bg-white/50 backdrop-blur-xl border-2 border-white rounded-[3rem] p-8 shadow-xl">
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-6">Status Magic Import</h4>
              <div className="space-y-3">
                {importStatus.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                    <div className="flex items-center gap-4 truncate mr-4">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {idx + 1}
                      </div>
                      <p className="text-xs font-bold text-indigo-950 truncate max-w-md">{s.name || s.url}</p>
                    </div>
                    <div>
                      {s.status === 'loading' && <Loader2 className="w-5 h-5 text-indigo-950 animate-spin" />}
                      {s.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {s.status === 'error' && <X className="w-5 h-5 text-red-500" />}
                      {s.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-950/5">
                <h3 className="text-xl font-black text-indigo-950">{editingId ? 'Edit Produk' : 'Tambah Manual'}</h3>
                <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="p-2 hover:bg-white rounded-full transition-all"><X /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Nama Produk</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Harga (RM)</label>
                    <input value={formData.price_range} onChange={e => setFormData({...formData, price_range: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Deskripsi & Alasan AI</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold h-32 border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Jantina Target</label>
                    <select value={formData.gender_target} onChange={e => setFormData({...formData, gender_target: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all appearance-none">
                      <option value="U">Unisex</option>
                      <option value="M">Lelaki</option>
                      <option value="F">Wanita</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Hubungan Target</label>
                    <select value={formData.relationship_target} onChange={e => setFormData({...formData, relationship_target: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all appearance-none">
                      <option value="U">Semua (General)</option>
                      <option value="P">Pasangan</option>
                      <option value="K">Kawan</option>
                      <option value="F">Keluarga</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Tags (Hobi) - Pisahkan dengan koma</label>
                  <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Gaming, Travel, Coffee" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">URL Imej</label>
                  <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">URL Shopee / Affiliate</label>
                  <input value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-6 bg-indigo-950 text-white rounded-[2.5rem] font-black text-xl mt-4 shadow-2xl hover:bg-pink-500 transition-all flex items-center justify-center gap-3"
                >
                  {saving ? <Loader2 className="animate-spin" /> : editingId ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {saving ? 'SAVING...' : editingId ? 'KEMASKINI SEKARANG' : 'TAMBAH PRODUK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
