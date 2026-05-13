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
      const data = await res.json()
      if (res.ok) setProducts(data.products || [])
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
      await fetch(import.meta.env.VITE_API_URL + '/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
        },
        body: JSON.stringify(formData)
      })
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      alert('Save failed')
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
        <h2 className="text-2xl font-heading font-semibold text-white">Product Manager</h2>
        <button 
          onClick={() => {
            setFormData({ name: '', description: '', price_range: '', image_url: '', shopee_url: '', gender_target: 'U' })
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-slate-900 rounded-lg hover:bg-amber-400 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Product Details</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.price_range} • Target: {p.gender_target}</div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl font-semibold text-white">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Price Range (e.g. RM 50 - 100)</label>
                  <input required value={formData.price_range} onChange={e => setFormData({...formData, price_range: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Image URL</label>
                  <input required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Shopee Affiliate URL</label>
                  <input required value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Gender Target</label>
                <select value={formData.gender_target} onChange={e => setFormData({...formData, gender_target: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                  <option value="U">Unisex (All)</option>
                  <option value="M">Male Only</option>
                  <option value="F">Female Only</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-accent text-slate-900 rounded-lg hover:bg-amber-400 font-medium">
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
