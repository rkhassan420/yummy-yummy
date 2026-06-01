import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import menuAPI from '@/api/menuAPI'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { PageSpinner } from '@/components/ui/Spinner'

export default function AdminCategories() {
  const [addOpen,  setAddOpen]  = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const qc = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const r = await menuAPI.getCategories(); return r.data.results || r.data },
  })

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: (id) => menuAPI.deleteCategory(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Deleted.'); setDeleteId(null) },
    onError: () => toast.error('Delete failed.'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-navy-DEFAULT dark:text-white">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id}
            className="card p-5 flex items-center justify-between
                       hover:border-green-DEFAULT transition-colors group">
            <div>
              <h3 className="font-semibold text-navy-DEFAULT dark:text-white">{cat.name}</h3>
              <p className="text-gray-400 text-xs mt-1">{cat.dish_count} dishes</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditItem(cat)}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => setDeleteId(cat.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormModal isOpen={addOpen} onClose={() => setAddOpen(false)}
        onSuccess={() => qc.invalidateQueries({ queryKey: ['admin-categories'] })} />

      {editItem && (
        <CategoryFormModal isOpen={!!editItem} onClose={() => setEditItem(null)} editData={editItem}
          onSuccess={() => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setEditItem(null) }} />
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCategory(deleteId)} loading={deleting}
        title="Delete Category" message="Deleting this category will also remove all its dishes. Continue?" />
    </div>
  )
}

function CategoryFormModal({ isOpen, onClose, editData, onSuccess }) {
  const [name, setName] = useState(editData?.name || '')

  const { mutate, isPending } = useMutation({
    mutationFn: () => editData
      ? menuAPI.updateCategory(editData.id, { name })
      : menuAPI.createCategory({ name }),
    onSuccess: () => { toast.success(editData ? 'Updated!' : 'Added!'); onSuccess(); onClose() },
    onError: () => toast.error('Operation failed.'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Category' : 'Add Category'} size="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. BBQ, Desserts" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending || !name.trim()} className="btn-primary flex-1">
            {isPending ? 'Saving...' : editData ? 'Update' : 'Add Category'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
