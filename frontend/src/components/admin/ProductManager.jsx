import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Loader2, X, ShoppingBag, Image as ImageIcon, Target, Tag, ExternalLink, Wand2, FileSpreadsheet, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
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
    
    // Load XLSX library from CDN
    if (!window.XLSX) {
      const script = document.createElement('script')
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"
      document.head.appendChild(script)
    }
  }, [])

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

        // Normalize headers to match template
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
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
          },
          body: JSON.stringify(normalizedData)
        })

        if (!res.ok) throw new Error('Gagal upload ke server')
        
        alert(`Berjaya upload ${normalizedData.length} produk!`)
        fetchProducts()
      } catch (err) {
        alert(`Upload Gagal: ${err.message}`)
      } finally {
        setBulkLoading(false)
        e.target.value = null // Reset input
      }
    }
    
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const template = [
      {
        'Nama Produk': 'Contoh Produk',
        'Deskripsi': 'Hadiah ni memang style sebab...',
        'Harga': 'RM 50 - 150',
        'Gambar': 'https://link-gambar.com/produk.jpg',
        'URL': 'https://shope.ee/abc',
        'Target Jantina': 'U',
        'Tags (Hobi)': 'Gaming, Travel',
        'Target Hubungan': 'U'
      },
      {
        'Nama Produk': '', 'Deskripsi': '', 'Harga': 'RM ', 'Gambar': '', 'URL': '', 'Target Jantina': '', 'Tags (Hobi)': '', 'Target Hubungan': ''
      }
    ]

    const ws = window.XLSX.utils.json_to_sheet(template)
    
    // Add Data Validation (Dropdowns)
    // Note: Standard XLSX library has limited support for validation via json_to_sheet, 
    // but we can add a 'Rujukan' sheet to help the user.
    const wb = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(wb, ws, "Produk")

    // Reference Sheet
    const refData = [
      { 'Kategori': 'Target Jantina', 'Kod': 'M', 'Maksud': 'Lelaki' },
      { 'Kategori': 'Target Jantina', 'Kod': 'F', 'Maksud': 'Wanita' },
      { 'Kategori': 'Target Jantina', 'Kod': 'U', 'Maksud': 'Unisex' },
      { 'Kategori': '', 'Kod': '', 'Maksud': '' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'P', 'Maksud': 'Pasangan' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'K', 'Maksud': 'Kawan' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'F', 'Maksud': 'Keluarga' },
      { 'Kategori': 'Target Hubungan', 'Kod': 'U', 'Maksud': 'Semua (General)' },
      { 'Kategori': '', 'Kod': '', 'Maksud': '' },
      { 'Kategori': 'Tags (Hobi) Contoh', 'Kod': 'Gaming', 'Maksud': 'Suka main game' },
      { 'Kategori': 'Tags (Hobi) Contoh', 'Kod': 'Travel', 'Maksud': 'Suka melancong' },
      { 'Kategori': 'Tags (Hobi) Contoh', 'Kod': 'Beauty', 'Maksud': 'Suka mekap/skincare' }
    ]
    const wsRef = window.XLSX.utils.json_to_sheet(refData)
    window.XLSX.utils.book_append_sheet(wb, wsRef, "Rujukan_Kod")

    window.XLSX.writeFile(wb, "Hepibesday_Template_Bulk.xlsx")
    alert('Template dimuat turun! Sila rujuk sheet "Rujukan_Kod" untuk pilihan Jantina & Hubungan.')
  }

  const handleDelete = async (id) => {
    if (!confirm('Adakah anda pasti mahu memadam produk ini?')) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchProducts()
    } catch (err) {
      alert('Padam gagal')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      const res = await fetch(`${apiUrl}/api/admin/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.details || data.error || 'Gagal menyimpan')
      
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      alert(`Simpan gagal: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="text-indigo-950 font-black uppercase tracking-widest text-xs">Memuatkan Produk...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-indigo-950 tracking-tight">Arkib Hadiah</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Uruskan senarai cadangan hadiah untuk sistem AI.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Bulk Upload Button */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={bulkLoading}
            className="flex items-center space-x-3 px-6 py-4 bg-white border-2 border-indigo-950/10 text-indigo-950 rounded-2xl hover:border-indigo-950 font-black transition-all shadow-sm disabled:opacity-50"
          >
            {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5 text-green-600" />}
            <span>{bulkLoading ? 'Uploading...' : 'Import Excel'}</span>
          </button>

          <button 
            onClick={downloadTemplate}
            className="p-4 bg-white border-2 border-indigo-950/10 text-indigo-950 rounded-2xl hover:border-indigo-950 transition-all shadow-sm"
            title="Download Template Excel"
          >
            <Download className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              setFormData({ name: '', description: '', price_range: 'RM ', image_url: '', shopee_url: '', gender_target: 'U', tags: '', relationship_target: 'U' })
              setIsModalOpen(true)
            }}
            className="flex items-center space-x-3 px-8 py-4 bg-indigo-950 text-white rounded-2xl hover:bg-pink-500 font-black transition-all shadow-xl hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Manual</span>
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-2 border-white rounded-[3rem] shadow-2xl overflow-hidden">
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
                <tr 
                  key={p.id || idx}
                  className="hover:bg-pink-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain rounded-xl bg-white p-2 shadow-inner border border-slate-100" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
                          <Target className={`w-3 h-3 ${p.gender_target === 'M' ? 'text-blue-500' : p.gender_target === 'F' ? 'text-pink-500' : 'text-purple-500'}`} />
                        </div>
                      </div>
                      <div className="max-w-[150px] md:max-w-xs">
                        <p className="font-black text-indigo-950 truncate group-hover:text-pink-500 transition-colors">{p.name}</p>
                        <a href={p.shopee_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-indigo-950">
                          Shopee Link <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-indigo-950 shadow-sm">
                      {p.price_range ? (p.price_range.startsWith('RM') ? p.price_range : `RM ${p.price_range}`) : 'RM -'}
                    </span>
                    <div className="flex gap-1 mt-1">
                        {p.tags && p.tags.split(',').slice(0, 2).map(tag => (
                            <span key={tag} className="text-[8px] font-bold text-pink-400 uppercase tracking-tighter bg-pink-50 px-1.5 py-0.5 rounded">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 max-w-xs italic">"{p.description}"</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Padam"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-2 border-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-950 rounded-xl flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-indigo-950">Tambah Produk Baharu</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-950 shadow-sm transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                {/* Magic Autofill Section */}
                <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-950 font-black text-[10px] uppercase tracking-widest">
                    <Wand2 className="w-4 h-4 text-pink-500" />
                    Magic Autofill
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="magic-url"
                      placeholder="Tampal link Shopee di sini..." 
                      className="flex-1 bg-white border-2 border-white rounded-xl px-4 py-3 text-sm font-bold text-indigo-950 shadow-sm focus:outline-none focus:border-indigo-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const url = document.getElementById('magic-url').value;
                        if (!url) return alert('Sila masukkan URL');
                        
                        const btn = document.activeElement;
                        const originalText = btn.innerHTML;
                        btn.disabled = true;
                        btn.innerHTML = '<span class="animate-spin">🌀</span>';

                        try {
                          let html = '';
                          
                          try {
                            const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
                            html = await res.text();
                          } catch (e) {
                            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                            const data = await res.json();
                            html = data.contents;
                          }

                          if (!html) throw new Error('Gagal mengambil data dari Shopee');
                          
                          const ogTitleMatch = html.match(/property="og:title"\s+content="(.*?)"/i) || html.match(/<title>(.*?)<\/title>/i);
                          const ogImageMatch = html.match(/property="og:image"\s+content="(.*?)"/i);
                          
                          let extractedName = ogTitleMatch ? ogTitleMatch[1].split('|')[0].split('-')[0].replace('Google Translate', '').trim() : '';
                          let extractedImage = ogImageMatch ? ogImageMatch[1] : '';

                          if (!extractedName || extractedName.toLowerCase().includes('shopee.com.my')) {
                            throw new Error('Nama produk tidak dijumpai. Sila guna pautan panjang.');
                          }

                          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
                          const aiRes = await fetch(`${apiUrl}/api/admin/scrape-product`, {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                            },
                            body: JSON.stringify({ url, name: extractedName })
                          });
                          
                          const aiData = await aiRes.json();
                          setFormData(prev => ({
                            ...prev,
                            name: aiData.name || extractedName,
                            image_url: extractedImage || aiData.image_url,
                            description: aiData.description || 'Hadiah menarik dari Shopee!',
                            tags: aiData.tags || prev.tags,
                            shopee_url: url
                          }));

                        } catch (err) {
                          alert(err.message || 'Gagal menarik data. Sila isi secara manual.');
                        } finally {
                          btn.disabled = false;
                          btn.innerHTML = originalText;
                        }
                      }}
                      className="px-6 py-3 bg-indigo-950 text-white rounded-xl font-black text-xs hover:bg-pink-500 transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>🪄 Autofill</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Produk</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-12 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner" placeholder="E.g. Jam Tangan Elegan" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Julat Harga</label>
                    <div className="relative">
                      <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input required value={formData.price_range} onChange={e => setFormData({...formData, price_range: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-12 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner" placeholder="E.g. RM 50 - 150" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hobi / Minat (Tags)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-12 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner" placeholder="E.g. Gaming, Travel, Beauty" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deskripsi / Alasan Hadiah</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-6 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner min-h-[100px] resize-none" placeholder="Kenapa AI patut pilih hadiah ni?" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Imej</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-12 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Shopee / Affiliate</label>
                    <div className="relative">
                      <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input required value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-pink-300 rounded-2xl px-12 py-4 text-indigo-950 font-bold outline-none transition-all shadow-inner" placeholder="https://shope.ee/..." />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Jantina</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['U', 'M', 'F'].map(target => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => setFormData({...formData, gender_target: target})}
                          className={`py-3 rounded-xl font-black text-[10px] transition-all border-2 ${formData.gender_target === target ? 'bg-indigo-950 text-white border-indigo-950 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200'}`}
                        >
                          {target === 'U' ? 'UNISEX' : target === 'M' ? 'LELAKI' : 'WANITA'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Hubungan</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        {id: 'U', label: 'SEMUA'},
                        {id: 'P', label: 'PASANGAN'},
                        {id: 'K', label: 'KAWAN'},
                        {id: 'F', label: 'KELUARGA'}
                      ].map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setFormData({...formData, relationship_target: r.id})}
                          className={`py-3 rounded-xl font-black text-[9px] transition-all border-2 ${formData.relationship_target === r.id ? 'bg-indigo-950 text-white border-indigo-950 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200'}`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 hover:text-indigo-950 font-black uppercase tracking-widest text-xs transition-colors">Batal</button>
                  <button type="submit" disabled={saving} className="flex-[2] py-5 bg-indigo-950 text-white rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-pink-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Simpan Produk</span> <Plus className="w-5 h-5" /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
