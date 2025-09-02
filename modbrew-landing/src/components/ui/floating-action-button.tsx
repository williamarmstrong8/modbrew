import { motion } from 'framer-motion'
import { Button } from './button'
import { LucideIcon } from 'lucide-react'

interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  label: string
  className?: string
}

export function FloatingActionButton({ 
  icon: Icon, 
  onClick, 
  label, 
  className = '' 
}: FloatingActionButtonProps) {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        className="h-14 w-14 rounded-full bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <Icon className="h-6 w-6" />
      </Button>
      <motion.div
        className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}
