import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

export default function ImageUpload({ value, onChange, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    onChange(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const clear = () => { onChange(null); setPreview(null); inputRef.current.value = '' }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>}
      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center
                   cursor-pointer hover:border-green-DEFAULT transition-colors relative"
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="h-32 mx-auto object-cover rounded-lg" />
            <button type="button" onClick={(e) => { e.stopPropagation(); clear() }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload size={32} />
            <p className="text-sm">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  )
}
