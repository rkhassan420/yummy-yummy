import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactAPI } from '@/api/index'
import useAuthStore from '@/store/useAuthStore'
import Footer from '@/components/layout/Footer'

const schema = z.object({
  name:        z.string().min(2, 'Name required'),
  email:       z.string().email('Valid email required'),
  cell_number: z.string().optional(),
  msg:         z.string().min(10, 'Message too short (min 10 chars)'),
})

const INFO = [
  { Icon: Phone, title: 'Phone',    text: '+92 324 5396 002\nMon–Sun, 10 AM – 1 AM' },
  { Icon: Mail,  title: 'Email',    text: 'support@Yummy-Yummy.com\nReply within 24 hours' },
  { Icon: MapPin,title: 'Location', text: 'Yummy-Yummy, Anwar Town,\nPhool Nagar, Multan Rd, Kasur' },
  { Icon: Clock, title: 'Hours',    text: 'Monday to Sunday\n10:00 AM – 1:00 AM' },
]

export default function ContactPage() {
  const user = useAuthStore((s) => s.user)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        user?.first_name || '',
      email:       user?.email      || '',
      cell_number: user?.cnumber    || '',
    },
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => contactAPI.submit(data),
    onSuccess:  () => { toast.success('Message sent! We\'ll get back to you soon 📬'); reset() },
    onError:    () => toast.error('Failed to send message.'),
  })

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-[5%] py-14">
        <div className="mb-10">
          <p className="section-tag mb-2">Get In Touch</p>
          <h1 className="section-title">Contact Us</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} className="card p-8">
            <h2 className="font-display text-2xl text-navy-DEFAULT dark:text-white mb-6">
              Send Us a Message
            </h2>

            {isSuccess && (
              <div className="bg-green-light dark:bg-green-900/20 border border-green-DEFAULT/30
                              text-green-dark rounded-xl p-4 mb-6 text-sm">
                ✅ Message sent! We'll reply within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit(mutate)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input {...register('name')} className="input-field" placeholder="Your name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input {...register('email')} type="email" className="input-field" placeholder="you@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input {...register('cell_number')} className="input-field" placeholder="+92 300 0000000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea {...register('msg')} rows={4} className="input-field resize-none"
                  placeholder="How can we help you?" />
                {errors.msg && <p className="text-red-500 text-xs mt-1">{errors.msg.message}</p>}
              </div>
              <button type="submit" disabled={isPending} className="btn-secondary w-full py-4 text-base">
                {isPending ? 'Sending...' : 'Send Message 📨'}
              </button>
            </form>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }}
            className="flex flex-col gap-5"
          >
            {INFO.map(({ Icon, title, text }) => (
              <div key={title}
                className="card p-5 flex gap-4 items-start
                           hover:border-green-DEFAULT hover:-translate-x-1 transition-all duration-200">
                <div className="w-11 h-11 bg-green-light dark:bg-green-900/30 rounded-xl
                                flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-green-DEFAULT" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-DEFAULT dark:text-white text-sm mb-1">{title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
