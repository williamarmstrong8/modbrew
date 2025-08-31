import Navigation from '../components/layout/Navigation'
import Footer from '../components/layout/Footer'

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Modern Gallery Grid */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gallery images with containers sized to fit images */}
            <div className="group cursor-pointer">
              <img 
                src="/images/DSCF2304.jpg" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="group cursor-pointer">
              <img 
                src="/images/DSCF2309.jpg" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="group cursor-pointer">
              <img 
                src="/images/DSCF2328.jpg" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="group cursor-pointer">
              <img 
                src="/images/DSCF3655.JPG" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="group cursor-pointer">
              <img 
                src="/images/DSCF3661.JPG" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="group cursor-pointer">
              <img 
                src="/images/hero.jpeg" 
                alt="ModBrew Gallery" 
                className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
