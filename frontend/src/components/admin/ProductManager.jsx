import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'

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
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/products', {
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
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await fetch(import.meta.env.VITE_API_URL + `/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      fetchProducts()
    } catch (err) {
      alert('Delete failed')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        },
        body: JSON.stringify(formData)
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        window.location.href = '/admin/login'
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.details || data.error || 'Failed to save')
      
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      alert(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-slate-800">Product Manager</h2>
        <button 
          onClick={() => {
            setFormData({ name: '', description: '', price_range: '', image_url: '', shopee_url: '', gender_target: 'U' })
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Product Details</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.price_range} • Target: {p.gender_target}</div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Price Range (e.g. RM 50 - 100)</label>
                  <input required value={formData.price_range} onChange={e => setFormData({...formData, price_range: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all h-24" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Image URL</label>
                  <input required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Store Affiliate URL</label>
                  <input required value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Gender Target</label>
                <select value={formData.gender_target} onChange={e => setFormData({...formData, gender_target: e.target.value})} className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 text-slate-800 outline-none transition-all">
                  <option value="U">Unisex (All)</option>
                  <option value="M">Male Only</option>
                  <option value="F">Female Only</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
