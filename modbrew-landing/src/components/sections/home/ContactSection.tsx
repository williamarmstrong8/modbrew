import { Button } from '../../ui/button'

export default function ContactSection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-light text-white mb-8 tracking-wider">
          Join ModBrew
        </h2>
        <div className="w-16 h-px bg-white/30 mx-auto mb-12"></div>
        <p className="text-white/70 mb-12 text-lg font-light max-w-2xl mx-auto">
          Membership is by invitation only. 
          <br />
          <span className="text-white/50 text-sm">Applications are reviewed quarterly.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-light tracking-wide">
            Request Invitation
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white/80 hover:bg-white/5 font-light tracking-wide">
            <a href="/admin">Member Access</a>
          </Button>
        </div>
        <p className="text-white/40 text-xs mt-8 tracking-widest">
          DISCRETION GUARANTEED
        </p>
      </div>
    </section>
  )
}
