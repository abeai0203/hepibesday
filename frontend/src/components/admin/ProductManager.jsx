import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, X, ShoppingBag, Image as ImageIcon, Target, Tag, ExternalLink, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', price_range: '', image_url: '', shopee_url: '', gender_target: 'U'
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
  }, [])

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-indigo-950">Arkib Hadiah</h2>
          <p className="text-slate-500 font-bold text-sm">Uruskan senarai cadangan hadiah untuk sistem AI.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', description: '', price_range: 'RM ', image_url: '', shopee_url: '', gender_target: 'U' })
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-3 px-8 py-4 bg-indigo-950 text-white rounded-2xl hover:bg-pink-500 font-black transition-all shadow-xl hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Produk Baru</span>
        </button>
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
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
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
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Target: {p.gender_target === 'U' ? 'Semua' : p.gender_target === 'M' ? 'Lelaki' : 'Perempuan'}</p>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 max-w-xs italic">"{p.description}"</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
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
                          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
                          const res = await fetch(`${apiUrl}/api/admin/scrape-product`, {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                            },
                            body: JSON.stringify({ url })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setFormData(prev => ({
                              ...prev,
                              name: data.name || prev.name,
                              image_url: data.image_url || prev.image_url,
                              description: data.description || prev.description,
                              shopee_url: data.shopee_url || url
                            }));
                          } else {
                            alert(data.error || 'Gagal menarik data');
                          }
                        } catch (err) {
                          alert('Ralat teknikal semasa menarik data');
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
                  <p className="text-[9px] text-indigo-400 font-bold italic">Sistem akan automatik tarik Nama, Gambar & Deskripsi menggunakan AI.</p>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Jantina</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['U', 'M', 'F'].map(target => (
                      <button
                        key={target}
                        type="button"
                        onClick={() => setFormData({...formData, gender_target: target})}
                        className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${formData.gender_target === target ? 'bg-indigo-950 text-white border-indigo-950 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200'}`}
                      >
                        {target === 'U' ? 'Unisex' : target === 'M' ? 'Lelaki' : 'Perempuan'}
                      </button>
                    ))}
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
