import { Button } from '../../ui/button'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero.jpeg)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="mb-8">
            <img 
              src="/images/Mod Brew Long.png" 
              alt="ModBrew" 
              className="h-24 md:h-32 mx-auto mb-6 opacity-100"
            />
          </div>

          <div className="w-24 h-px bg-white/40 mx-auto mb-6"></div>
          <p className="text-white/80 text-lg font-light tracking-wide">
            An exclusive coffee experience
          </p>
        </div>
        <Button size="lg" className="bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur-sm font-light tracking-wide">
          Request Invitation
        </Button>
      </div>
    </section>
  )
}
