import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero.jpeg)'
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/20" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          >
            <motion.img 
              src="/images/Mod Brew Long.png" 
              alt="ModBrew" 
              className="w-96 sm:w-[28rem] md:w-[32rem] lg:w-[40rem] xl:w-[48rem] mx-auto mb-6 opacity-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            />
          </motion.div>

          <motion.div 
            className="w-24 h-px bg-white/40 mx-auto mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          />
          <motion.p 
            className="text-white/80 text-lg font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
          >
            An exclusive coffee experience
          </motion.p>
        </div>
      </div>
    </section>
  )
}
