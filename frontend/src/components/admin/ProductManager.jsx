import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader2, X, ShoppingBag, Image as ImageIcon, Target, Tag, ExternalLink, Wand2, FileSpreadsheet, Download, Search, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory' or 'hunter'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  
  // Shopee Hunter State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [importingId, setImportingId] = useState(null)
  
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

  const handleShopeeSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery) return
    setSearchLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      const res = await fetch(`${apiUrl}/api/admin/search-shopee?q=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch (err) {
      alert('Gagal mencari di Shopee')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleImportProduct = async (shopeeItem) => {
    setImportingId(shopeeItem.id)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      
      // 1. Get AI Polish for the product
      const aiRes = await fetch(`${apiUrl}/api/admin/scrape-product`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ url: shopeeItem.shopee_url, name: shopeeItem.name })
      });
      
      const aiData = await aiRes.json();
      
      // 2. Save to our database
      const saveRes = await fetch(`${apiUrl}/api/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: aiData.name || shopeeItem.name,
          description: aiData.description || 'Hadiah menarik dari Shopee!',
          price_range: `RM ${shopeeItem.price}`,
          image_url: shopeeItem.image_url,
          shopee_url: shopeeItem.shopee_url,
          gender_target: 'U',
          tags: aiData.tags || '',
          relationship_target: 'U'
        })
      });

      if (saveRes.ok) {
        setSearchResults(prev => prev.map(item => item.id === shopeeItem.id ? { ...item, imported: true } : item))
        fetchProducts()
      } else {
        throw new Error('Gagal simpan ke database')
      }
    } catch (err) {
      alert(`Gagal import: ${err.message}`)
    } finally {
      setImportingId(null)
    }
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
    if (!confirm('Pasti?')) return
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
              onClick={() => setActiveTab('hunter')}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'hunter' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-indigo-950/40 hover:bg-pink-50'}`}
            >
              <Search className="w-4 h-4" />
              Shopee Hunter
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
            <button onClick={() => { setFormData({ name: '', description: '', price_range: 'RM ', image_url: '', shopee_url: '', gender_target: 'U', tags: '', relationship_target: 'U' }); setIsModalOpen(true); }} className="px-8 py-4 bg-indigo-950 text-white rounded-2xl hover:bg-pink-500 font-black transition-all shadow-xl hover:-translate-y-1">
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
                  <th className="px-8 py-6">Kategori & Harga</th>
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
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
                            <Target className={`w-2.5 h-2.5 ${p.gender_target === 'M' ? 'text-blue-500' : p.gender_target === 'F' ? 'text-pink-500' : 'text-purple-500'}`} />
                          </div>
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
                      <span className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-indigo-950 shadow-sm">
                        {p.price_range ? (p.price_range.startsWith('RM') ? p.price_range : `RM ${p.price_range}`) : 'RM -'}
                      </span>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2 max-w-xs italic leading-relaxed">"{p.description}"</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Hunter Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleShopeeSearch} className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-950/20 w-6 h-6" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari apa-apa barang kat Shopee... (cth: Moon Lamp)" 
                className="w-full bg-white border-4 border-white rounded-[2.5rem] px-16 py-6 text-lg font-black text-indigo-950 shadow-2xl focus:border-pink-200 outline-none transition-all placeholder:text-indigo-950/10"
              />
              <button 
                type="submit"
                disabled={searchLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-950 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-pink-500 transition-all disabled:opacity-50"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'BURU!'}
              </button>
            </form>
          </div>

          {/* Hunter Results */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {searchResults.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border-2 border-white rounded-[2.5rem] overflow-hidden group shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 bg-slate-50 p-4">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-pink-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg">
                      RM {item.price}
                    </div>
                    {item.rating > 0 && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black text-indigo-950 shadow-sm flex items-center gap-1">
                        ⭐ {item.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <h4 className="text-xs font-black text-indigo-950 line-clamp-2 leading-tight">{item.name}</h4>
                    
                    {item.imported ? (
                      <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-black text-[10px] flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> IMPORTED
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleImportProduct(item)}
                        disabled={importingId === item.id}
                        className="w-full py-3 bg-indigo-50 text-indigo-950 rounded-xl font-black text-[10px] hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        {importingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        IMPORT MAGIK
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {searchResults.length === 0 && !searchLoading && (
            <div className="text-center py-20 bg-indigo-950/5 rounded-[3rem] border-4 border-dashed border-indigo-950/10">
              <ShoppingBag className="w-16 h-16 text-indigo-950/10 mx-auto mb-4" />
              <p className="text-indigo-950/30 font-black uppercase tracking-widest text-sm">Sedia untuk memburu hadiah unik...</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Manual Add Modal (Existing) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-black text-indigo-950">Tambah Manual</h3>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <div className="p-8 overflow-y-auto">
                {/* Re-using existing form fields here... */}
                <p className="text-xs text-slate-400 mb-8 italic text-center">Isi borang di bawah untuk masukkan produk secara manual.</p>
                <div className="space-y-6">
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Produk" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                    <input value={formData.price_range} onChange={e => setFormData({...formData, price_range: e.target.value})} placeholder="Harga (RM)" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi" className="w-full p-4 bg-slate-50 rounded-2xl font-bold h-32" />
                    <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="URL Imej" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                    <input value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} placeholder="URL Shopee" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                </div>
                <button 
                  onClick={async () => {
                    setSaving(true);
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
                    await fetch(`${apiUrl}/api/admin/products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                        body: JSON.stringify(formData)
                    });
                    setSaving(false);
                    setIsModalOpen(false);
                    fetchProducts();
                  }}
                  className="w-full py-5 bg-indigo-950 text-white rounded-[2rem] font-black text-lg mt-8 shadow-xl hover:bg-pink-500 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin mx-auto" /> : 'SIMPAN SEKARANG'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
