import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PlusCircle } from 'lucide-react'
import { feedbackAPI } from '@/api/index'
import useAuthStore from '@/store/useAuthStore'
import Modal from '@/components/ui/Modal'
import { StarDisplay, StarInput } from '@/components/ui/StarRating'
import { formatDate } from '@/utils/formatters'
import { useNavigate } from 'react-router-dom'

export default function FeedbackPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [review,    setReview]    = useState('')
  const [rating,    setRating]    = useState(5)
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn)
  const navigate    = useNavigate()
  const qc          = useQueryClient()

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const res = await feedbackAPI.getAll()
      return res.data.results || res.data
    },
  })

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => feedbackAPI.submit({ review, rating }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback'] })
      toast.success('Thank you for your feedback! 🙏')
      setModalOpen(false)
      setReview('')
      setRating(5)
    },
    onError: () => toast.error('Failed to submit feedback.'),
  })

  const handleAddClick = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    setModalOpen(true)
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-[5%] py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-tag mb-2">Community</p>
          <h1 className="section-title">
            Customer Reviews
            <span className="ml-3 text-2xl text-gray-400 font-sans font-normal">({feedbacks.length})</span>
          </h1>
        </div>
        {/* <button onClick={handleAddClick} className="btn-primary flex items-center gap-2 px-6 py-3">
          <PlusCircle size={18} /> Write a Review
        </button> */}
      </div>

      {/* Average rating banner */}
      {feedbacks.length > 0 && (
        <div className="bg-gradient-to-r from-navy-DEFAULT to-navy-light rounded-2xl p-6 mb-10
                        flex items-center gap-6">
          <div className="text-center">
            <p className="font-display text-5xl text-white">
              {(feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)}
            </p>
            <StarDisplay
              rating={Math.round(feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length)}
              size={20}
            />
            <p className="text-white/60 text-xs mt-1">Average Rating</p>
          </div>
          <div className="h-16 w-px bg-white/20" />
          <div>
            <p className="text-white text-2xl font-bold">{feedbacks.length}</p>
            <p className="text-white/60 text-sm">Total Reviews</p>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No reviews yet</h3>
          <p className="text-gray-400 text-sm mb-6">Be the first to share your experience!</p>
          <button onClick={handleAddClick} className="btn-primary">Write a Review</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb, i) => (
            <motion.div
              key={fb.id}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 hover:border-green-DEFAULT hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-DEFAULT flex items-center
                                  justify-center text-white text-sm font-bold flex-shrink-0">
                    {fb.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-DEFAULT dark:text-white text-sm">{fb.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(fb.created_at)}</p>
                  </div>
                </div>
                <StarDisplay rating={fb.rating} size={14} />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">
                "{fb.review}"
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Share Your Experience">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Your Rating
            </label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Tell us about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button
              onClick={() => submit()}
              disabled={isPending || !review.trim()}
              className="btn-primary flex-1"
            >
              {isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
