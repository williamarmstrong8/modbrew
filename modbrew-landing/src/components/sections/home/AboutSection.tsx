import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Coffee, Eye, Lock, Star } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="mb-8">
            <img 
              src="/images/White-Mod-Brew.png" 
              alt="ModBrew" 
              className="h-12 mx-auto mb-6 opacity-60"
            />
          </div>
          <h2 className="text-3xl font-light text-white mb-8 tracking-wider">
            What We Offer
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <Card className="text-center bg-transparent border-white/20 hover:border-white/40 transition-all duration-300">
            <CardHeader>
              <Coffee className="h-8 w-8 text-white/80 mx-auto mb-4" />
              <CardTitle className="text-white font-light tracking-wide">Exclusive Blends</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/60 text-sm">
                Rare, single-origin coffees available only to members.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-white/20 hover:border-white/40 transition-all duration-300">
            <CardHeader>
              <Eye className="h-8 w-8 text-white/80 mx-auto mb-4" />
              <CardTitle className="text-white font-light tracking-wide">Private Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/60 text-sm">
                Members-only experiences and exclusive events.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-white/20 hover:border-white/40 transition-all duration-300">
            <CardHeader>
              <Lock className="h-8 w-8 text-white/80 mx-auto mb-4" />
              <CardTitle className="text-white font-light tracking-wide">Discretion</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/60 text-sm">
                Your membership remains private and confidential.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-transparent border-white/20 hover:border-white/40 transition-all duration-300">
            <CardHeader>
              <Star className="h-8 w-8 text-white/80 mx-auto mb-4" />
              <CardTitle className="text-white font-light tracking-wide">Curated Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/60 text-sm">
                Every detail crafted for the discerning palate.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
