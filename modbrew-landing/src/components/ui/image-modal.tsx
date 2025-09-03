import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { useEffect } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  image: {
    url: string
    name: string
    size: number
    created_at: string
    user_id: string
  } | null
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function ImageModal({
  isOpen,
  onClose,
  image,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}: ImageModalProps) {
  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleDownload = async () => {
    if (!image) return

    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = image.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (!image) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation arrows */}
            {hasPrevious && onPrevious && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white border border-white/20 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPrevious()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </motion.div>
            )}

            {hasNext && onNext && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white border border-white/20 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onNext()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
            )}

            {/* Image container */}
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl max-w-[85vw] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={image.url}
                alt={image.name}
                className="w-auto h-auto max-w-[85vw] max-h-[80vh] object-contain rounded-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Download button overlaid on image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm z-10"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>




          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
