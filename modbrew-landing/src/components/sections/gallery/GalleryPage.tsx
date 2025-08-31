import { Card, CardContent } from '../../ui/card'

export default function GalleryPage() {
  // Placeholder gallery images - you can replace these with actual coffee shop images
  const galleryImages = [
    { id: 1, src: '/images/hero.jpeg', alt: 'Coffee Shop Interior' },
    { id: 2, src: '/images/hero.jpeg', alt: 'Coffee Beans' },
    { id: 3, src: '/images/hero.jpeg', alt: 'Coffee Making Process' },
    { id: 4, src: '/images/hero.jpeg', alt: 'Customer Experience' },
    { id: 5, src: '/images/hero.jpeg', alt: 'Coffee Shop Atmosphere' },
    { id: 6, src: '/images/hero.jpeg', alt: 'Barista at Work' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
            Coffee Gallery
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
            Take a visual journey through the world of coffee and see how ModBrew helps create amazing coffee experiences.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
