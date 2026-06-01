import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import menuAPI from '@/api/menuAPI'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ImageUpload from '@/components/ui/ImageUpload'
import { PageSpinner } from '@/components/ui/Spinner'
import { useCategories } from '@/hooks/useDishes'
import { formatCurrency } from '@/utils/formatters'

export default function AdminMenuDishes() {
  const [addOpen,    setAddOpen]    = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [deleteId,   setDeleteId]   = useState(null)
  const qc = useQueryClient()

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['admin-dishes'],
    queryFn: async () => { const r = await menuAPI.getDishes(); return r.data.results || r.data },
  })
  const { data: categories = [] } = useCategories()

  const { mutate: deleteDish, isPending: deleting } = useMutation({
    mutationFn: (id) => menuAPI.deleteDish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-dishes'] })
      toast.success('Dish deleted.')
      setDeleteId(null)
    },
    onError: () => toast.error('Delete failed.'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-navy-DEFAULT dark:text-white">Menu Dishes</h1>
          <p className="text-gray-500 text-sm mt-1">{dishes.length} dishes total</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Dish
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                {['Image','Name','Category','Price','Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500
                                         dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    {dish.image_url
                      ? <img src={dish.image_url} alt={dish.name} className="w-14 h-14 rounded-xl object-cover" />
                      : <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-2xl">🍽️</div>
                    }
                  </td>
                  <td className="px-6 py-4 font-medium text-navy-DEFAULT dark:text-white">{dish.name}</td>
                  <td className="px-6 py-4">
                    <span className="badge-green">{dish.category_name}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-DEFAULT">{formatCurrency(dish.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditItem(dish)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteId(dish.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dishes.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🍽️</p>
              <p>No dishes added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <DishFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        categories={categories}
        onSuccess={() => qc.invalidateQueries({ queryKey: ['admin-dishes'] })}
      />

      {/* Edit Modal */}
      {editItem && (
        <DishFormModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          categories={categories}
          editData={editItem}
          onSuccess={() => { qc.invalidateQueries({ queryKey: ['admin-dishes'] }); setEditItem(null) }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteDish(deleteId)}
        loading={deleting}
        title="Delete Dish"
        message="Are you sure you want to delete this dish? This action cannot be undone."
      />
    </div>
  )
}

function DishFormModal({ isOpen, onClose, categories, editData, onSuccess }) {
  const [name,     setName]     = useState(editData?.name  || '')
  const [price,    setPrice]    = useState(editData?.price || '')
  const [category, setCategory] = useState(editData?.category || '')
  const [image,    setImage]    = useState(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('price', price)
      fd.append('category', category)
      if (image) fd.append('image', image)
      return editData ? menuAPI.updateDish(editData.id, fd) : menuAPI.createDish(fd)
    },
    onSuccess: () => {
      toast.success(editData ? 'Dish updated!' : 'Dish added!')
      onSuccess()
      onClose()
    },
    onError: () => toast.error('Operation failed.'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Dish' : 'Add New Dish'} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dish name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (Rs.) *</label>
          <input className="input-field" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 350" />
        </div>
        <ImageUpload value={image} onChange={setImage} label="Dish Image" />
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending || !name || !price || !category}
            className="btn-primary flex-1">
            {isPending ? 'Saving...' : editData ? 'Update Dish' : 'Add Dish'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
