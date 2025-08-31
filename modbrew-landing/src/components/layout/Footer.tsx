

export default function Footer() {
  return (
    <footer className="bg-black text-white/60 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img 
              src="/images/Black-Mod-Brew.png" 
              alt="ModBrew" 
              className="h-6 w-auto opacity-80"
            />
            <span className="text-lg font-light tracking-wider">ModBrew</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/40 text-sm tracking-wide">
              © 2024 ModBrew. All rights reserved.
            </p>
            <p className="text-white/30 text-xs mt-2 tracking-widest">
              MEMBERSHIP BY INVITATION ONLY
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
