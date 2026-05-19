import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader2, X, ShoppingBag, Image as ImageIcon, Target, Tag, ExternalLink, Wand2, FileSpreadsheet, Download, Search, Sparkles, CheckCircle2, ListPlus, Edit3, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8787' : 'https://api.hepibesday.com')

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

  // Shopee Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importFormData, setImportFormData] = useState({
    name: '', price_range: '', image_url: '', shopee_url: '', gender_target: 'U', tags: '', relationship_target: 'U'
  })
  const [isImportingItem, setIsImportingItem] = useState(false)

  const uniquePresets = [
    { label: '🎁 Hadiah Kelakar', query: 'funny creative gift' },
    { label: '✨ Aesthetic Deco', query: 'aesthetic room decoration' },
    { label: '🧸 Customized Gift', query: 'customized gift' },
    { label: '💡 Gadget Kreatif', query: 'creative smart gadget' },
    { label: '🎮 Desk Toy / Keycap', query: 'funny desk toy' }
  ]

  const fetchProducts = async () => {
    try {
      const apiUrl = API_URL
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
      const apiUrl = API_URL
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

    const apiUrl = API_URL

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
        const apiUrl = API_URL
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
      const apiUrl = API_URL
      await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchProducts()
    } catch (err) {}
  }

  const handleSearch = async (queryToSearch) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery
    if (!q || !q.trim()) return alert('Sila masukkan kata kunci carian')
    
    setSearchLoading(true)
    setSearchError(null)
    setSearchResults([])

    try {
      const apiUrl = API_URL
      const res = await fetch(`${apiUrl}/api/admin/search-shopee?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      const data = await res.json()
      if (res.ok) {
        if (data.success === false) {
          setSearchError(data.message || 'Gagal mencari produk.')
        } else {
          setSearchResults(data.results || [])
          if (!data.results || data.results.length === 0) {
            setSearchError('Tiada hasil carian ditemui. Cuba kata kunci lain.')
          }
        }
      } else {
        setSearchError(data.error || 'Gagal mencari produk')
      }
    } catch (err) {
      setSearchError('Masalah rangkaian. Sila cuba lagi.')
    } finally {
      setSearchLoading(false)
    }
  }

  const triggerImport = (item) => {
    setImportFormData({
      name: item.name,
      price_range: `RM ${item.price}`,
      image_url: item.image_url,
      shopee_url: item.shopee_url,
      gender_target: 'U',
      relationship_target: 'U',
      tags: ''
    })
    setIsImportModalOpen(true)
  }

  const handleImportSave = async () => {
    setIsImportingItem(true)
    try {
      const apiUrl = API_URL
      
      // Step 1: Run AI Polish to generate descriptions & clean up tags
      const aiRes = await fetch(`${apiUrl}/api/admin/scrape-product`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ 
          url: importFormData.shopee_url, 
          name: importFormData.name 
        })
      });
      
      const aiData = await aiRes.json();
      
      // Combine user manual settings with AI output
      const finalTags = [
        importFormData.tags,
        aiData.tags
      ].filter(Boolean).join(', ')

      // Step 2: Save to DB
      const saveRes = await fetch(`${apiUrl}/api/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: importFormData.name || aiData.name || 'Produk Baru',
          description: aiData.description || 'Hadiah menarik dari Shopee!',
          price_range: importFormData.price_range || aiData.price_range || 'RM -',
          image_url: importFormData.image_url || aiData.image_url,
          shopee_url: importFormData.shopee_url,
          gender_target: importFormData.gender_target,
          tags: finalTags,
          relationship_target: importFormData.relationship_target
        })
      });

      if (saveRes.ok) {
        setIsImportModalOpen(false)
        alert('Berjaya import produk ke dalam Inventory!')
        fetchProducts()
      } else {
        alert('Gagal menyimpan produk')
      }
    } catch (err) {
      alert('Masalah memproses data. Cuba lagi.')
    } finally {
      setIsImportingItem(false)
    }
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
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'magic' ? 'bg-indigo-950 text-white shadow-lg' : 'bg-white text-indigo-950/40 hover:bg-indigo-50'}`}
            >
              <Wand2 className="w-4 h-4" />
              Magic Bulk Importer
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'search' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-indigo-950/40 hover:bg-pink-50'}`}
            >
              <Search className="w-4 h-4" />
              Cari di Shopee
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

      {activeTab === 'inventory' && (
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
      )}

      {activeTab === 'magic' && (
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

      {activeTab === 'search' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
          {/* Carian Box */}
          <div className="bg-white border-2 border-white rounded-[3rem] p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-indigo-950">Shopee Direct Search 🔍</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cari & Import Hadiah Unik Terus dari Shopee Malaysia</p>
              </div>
            </div>

            {/* Input Carian */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Taip kata kunci (contoh: tabung kucing pelik, cawan aesthetic)..."
                className="flex-1 bg-slate-50 border-2 border-slate-50 focus:border-pink-200 rounded-2xl px-6 py-4 text-sm font-bold text-indigo-950 outline-none transition-all shadow-inner"
              />
              <button
                onClick={() => handleSearch()}
                disabled={searchLoading}
                className="px-8 py-4 bg-indigo-950 text-white rounded-2xl font-black hover:bg-pink-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                CARI HADIAH
              </button>
            </div>

            {/* Preset Buttons for Unique Gifts */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Inspirasi Hadiah Unik:</p>
              <div className="flex flex-wrap gap-2">
                {uniquePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(preset.query)
                      handleSearch(preset.query)
                    }}
                    className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-xs font-black transition-all border border-pink-100 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {searchError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-500 font-bold text-sm">
              {searchError}
            </div>
          )}

          {/* Search Results Grid */}
          {searchResults.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-2">Hasil Carian Shopee ({searchResults.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white border-2 border-white rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col shadow-lg">
                    {/* Image Container */}
                    <div className="relative h-44 w-full bg-white p-4 flex items-center justify-center border-b border-slate-50">
                      <img src={item.image_url} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow">
                        RM {item.price}
                      </div>
                      {item.rating && (
                        <div className="absolute bottom-2 left-2 bg-indigo-950/80 backdrop-blur text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                          ⭐ {item.rating}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <h5 className="font-black text-indigo-950 text-xs leading-tight line-clamp-2" title={item.name}>
                        {item.name}
                      </h5>

                      <div className="space-y-2">
                        <button
                          onClick={() => triggerImport(item)}
                          className="w-full py-2.5 bg-indigo-950 text-white rounded-xl font-black text-[10px] flex items-center justify-center gap-1.5 hover:bg-pink-500 transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          IMPORT MAGIK
                        </button>
                        
                        <a
                          href={item.shopee_url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 text-center text-slate-400 hover:text-indigo-950 font-black text-[9px] flex items-center justify-center gap-1 uppercase tracking-wider"
                        >
                          Tengok Shopee <ExternalLink size={8} />
                        </a>
                      </div>
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

      {/* Import Confirmation Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-950/5">
                <h3 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                  <Sparkles className="text-pink-500 w-5 h-5" /> Import Produk Dengan AI
                </h3>
                <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all"><X /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <img src={importFormData.image_url} alt={importFormData.name} className="w-16 h-16 object-contain bg-white rounded-xl p-1 shadow-sm border border-slate-100 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-black text-indigo-950 text-sm truncate">{importFormData.name}</p>
                    <p className="text-xs font-black text-pink-500 mt-1">{importFormData.price_range}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Nama Produk (Boleh Edit)</label>
                  <input value={importFormData.name} onChange={e => setImportFormData({...importFormData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Jantina Target</label>
                    <select value={importFormData.gender_target} onChange={e => setImportFormData({...importFormData, gender_target: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all appearance-none">
                      <option value="U">Unisex</option>
                      <option value="M">Lelaki</option>
                      <option value="F">Wanita</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Hubungan Target</label>
                    <select value={importFormData.relationship_target} onChange={e => setImportFormData({...importFormData, relationship_target: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all appearance-none">
                      <option value="U">Semua (General)</option>
                      <option value="P">Pasangan</option>
                      <option value="K">Kawan</option>
                      <option value="F">Keluarga</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-950/40 uppercase tracking-widest ml-1">Tags Tambahan (Hobi) - Pisahkan dengan koma</label>
                  <input value={importFormData.tags} onChange={e => setImportFormData({...importFormData, tags: e.target.value})} placeholder="Gaming, Travel, Coffee (AI juga akan menambah secara automatik)" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-50 focus:border-pink-200 outline-none transition-all" />
                </div>

                <button 
                  onClick={handleImportSave}
                  disabled={isImportingItem}
                  className="w-full py-6 bg-indigo-950 text-white rounded-[2.5rem] font-black text-xl mt-4 shadow-2xl hover:bg-pink-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isImportingItem ? <Loader2 className="animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  {isImportingItem ? 'MENJANA DESKRIPSI AI & MENYIMPAN...' : 'SAHKAN & IMPORT SEKARANG'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
