import Modal from './Modal'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-ghost">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger flex items-center gap-2">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}
