import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import menuAPI from '@/api/menuAPI'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ImageUpload from '@/components/ui/ImageUpload'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatters'

export default function AdminPopularDishes() {
  const [addOpen,  setAddOpen]  = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const qc = useQueryClient()

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['admin-popular'],
    queryFn: async () => { const r = await menuAPI.getPopular(); return r.data.results || r.data },
  })

  const { mutate: deleteDish, isPending: deleting } = useMutation({
    mutationFn: (id) => menuAPI.deletePopular(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-popular'] }); toast.success('Deleted.'); setDeleteId(null) },
    onError: () => toast.error('Delete failed.'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-navy-DEFAULT dark:text-white">Popular Dishes</h1>
          <p className="text-gray-500 text-sm mt-1">{dishes.length} featured dishes</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Popular Dish
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {dishes.map((dish) => (
          <div key={dish.id} className="card overflow-hidden group">
            <div className="h-44 bg-gray-100 dark:bg-slate-700 overflow-hidden relative">
              {dish.image_url
                ? <img src={dish.image_url} alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center text-5xl">⭐</div>
              }
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditItem(dish)}
                  className="p-1.5 bg-white rounded-lg shadow text-blue-500 hover:bg-blue-50">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteId(dish.id)}
                  className="p-1.5 bg-white rounded-lg shadow text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-navy-DEFAULT dark:text-white truncate">{dish.name}</h3>
              <p className="text-green-DEFAULT font-bold mt-1">{formatCurrency(dish.price)}</p>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button onClick={() => setAddOpen(true)}
          className="card flex flex-col items-center justify-center h-56 border-dashed
                     hover:border-green-DEFAULT text-gray-400 hover:text-green-DEFAULT transition-colors">
          <Plus size={32} className="mb-2" />
          <span className="text-sm font-medium">Add New</span>
        </button>
      </div>

      <PopularFormModal isOpen={addOpen} onClose={() => setAddOpen(false)}
        onSuccess={() => qc.invalidateQueries({ queryKey: ['admin-popular'] })} />

      {editItem && (
        <PopularFormModal isOpen={!!editItem} onClose={() => setEditItem(null)} editData={editItem}
          onSuccess={() => { qc.invalidateQueries({ queryKey: ['admin-popular'] }); setEditItem(null) }} />
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteDish(deleteId)} loading={deleting}
        title="Delete Popular Dish" message="Remove this dish from the popular section?" />
    </div>
  )
}

function PopularFormModal({ isOpen, onClose, editData, onSuccess }) {
  const [name,  setName]  = useState(editData?.name  || '')
  const [price, setPrice] = useState(editData?.price || '')
  const [image, setImage] = useState(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('name', name); fd.append('price', price)
      if (image) fd.append('image', image)
      return editData ? menuAPI.updatePopular(editData.id, fd) : menuAPI.createPopular(fd)
    },
    onSuccess: () => { toast.success(editData ? 'Updated!' : 'Added!'); onSuccess(); onClose() },
    onError: () => toast.error('Operation failed.'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Popular Dish' : 'Add Popular Dish'}>
      <div className="space-y-4">
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
          <button onClick={() => mutate()} disabled={isPending || !name || !price} className="btn-primary flex-1">
            {isPending ? 'Saving...' : editData ? 'Update' : 'Add Dish'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
