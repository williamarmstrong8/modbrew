import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert } from '../ui/alert'
import { Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
  onModeChange?: (mode: AuthMode) => void
  initialMode?: AuthMode
}

type AuthMode = 'signin' | 'signup'

export function AuthForm({ onModeChange, initialMode = 'signin' }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    onModeChange?.(mode)
  }, [mode, onModeChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'signup') {
      // Validate password
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Validate name
      if (!name.trim()) {
        setError('Name is required')
        return
      }
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim()
            }
          }
        })
        
        if (error) throw error

        // Note: Profile and membership are created automatically by the database trigger
        // when a new user signs up, so we don't need to manually insert them here

        // Navigate to brewery after successful signup
        navigate('/brewery')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        navigate('/brewery')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  return (
    <div className="mt-8">
      {error && (
        <Alert variant={error.includes('check your email') ? 'default' : 'destructive'} className="mb-4 bg-red-500/20 border-red-500/30 text-red-200">
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <div>
            <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-white font-medium">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-white font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
              placeholder="••••••••"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1 h-full px-3 hover:bg-white/10 text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {mode === 'signup' && (
            <p className="text-sm text-white/60 mt-1">
              Must be at least 6 characters long
            </p>
          )}
        </div>

        {mode === 'signup' && (
          <div>
            <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
                placeholder="••••••••"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1 h-full px-3 hover:bg-white/10 text-white/70 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12 font-medium"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            </div>
          ) : mode === 'signin' ? (
            'Login'
          ) : (
            'Sign up'
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleModeChange}
            className="text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  )
}
