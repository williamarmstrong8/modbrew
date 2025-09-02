import { motion } from 'framer-motion'
import { Card, CardContent } from './card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  description?: string
  color?: string
  delay?: number
}

export function StatsCard({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  color = 'text-white',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300 card-override">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <motion.div
              className="text-2xl font-light text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {value}
            </motion.div>
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">{title}</h3>
            {description && (
              <p className="text-white/60 text-sm font-light">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
