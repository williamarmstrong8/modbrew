import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, type Profile } from '../../lib/supabase'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setProfile(data)
        }
      }
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="w-full px-24">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/" className="cursor-pointer">
              <img 
                src="/images/Mod Brew Long.png" 
                alt="ModBrew" 
                className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <Button asChild variant="ghost" className="font-medium tracking-wide text-white hover:underline">
              <a href="/gallery">
                Gallery
              </a>
            </Button>
            {user ? (
              <>
                <Button asChild className="bg-transparent text-white border border-white/50 font-medium tracking-wide hover:underline">
                  <a href="/member-hub">
                    Member Hub
                  </a>
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="font-medium tracking-wide text-white hover:underline"
                >
                  {profile?.name || 'Sign Out'}
                </Button>
              </>
            ) : (
              <Button asChild className="bg-transparent text-white border border-white/50 font-medium tracking-wide hover:underline">
                <a href="/auth">
                  Login
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
