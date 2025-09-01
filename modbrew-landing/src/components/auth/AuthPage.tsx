import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AuthForm } from './AuthForm'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/member-hub')
      }
      setIsLoading(false)
    })
  }, [navigate])

  // Allow forcing signup view via URL (e.g., /auth?mode=signup or /signup route wrapper)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const mode = params.get('mode')
    if (mode === 'signup') {
      setAuthMode('signup')
    }
  }, [location.search])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/images/Mod Brew Long.png"
            alt="ModBrew"
            className="mx-auto h-16 w-auto mb-6"
          />
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {authMode === 'signin' ? 'Welcome back' : 'Join ModBrew'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {authMode === 'signin' 
              ? 'Login to access your account'
              : 'Create an account to get started'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <AuthForm
            onModeChange={setAuthMode}
            initialMode={authMode}
          />
        </div>
      </div>
    </div>
  )
}
