import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Membership } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Crown,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/loading-spinner'

export default function AccountSettings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const fetchUserData = async () => {
      try {
        // Fetch user membership (now contains profile data)
        const { data: membershipData, error: membershipError } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle()

        if (membershipError) {
          console.error('Error fetching membership:', membershipError)
          return
        }

        // If no membership found, redirect to signup
        if (!membershipData) {
          console.log('No membership found for user, redirecting to signup')
          navigate('/auth?mode=signup')
          return
        }

        setMembership(membershipData)
        setFormData({
          name: membershipData.name || '',
          email: membershipData.email || ''
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        // If there's an error, redirect to signup as a fallback
        navigate('/auth?mode=signup')
        return
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, navigate])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('memberships')
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      // Update local state
      if (membership) {
        setMembership({
          ...membership,
          name: formData.name
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 'premium':
        return <CheckCircle className="h-5 w-5 text-blue-400" />
      case 'basic':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'vip':
        return 'text-yellow-400'
      case 'premium':
        return 'text-blue-400'
      case 'basic':
        return 'text-emerald-400'
      default:
        return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your account..." />
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center text-white max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <AlertCircle className="h-16 w-16 mx-auto text-white/40 mb-4" />
            <h2 className="text-2xl font-light mb-2">Account Not Found</h2>
            <p className="text-white/60 font-light">Unable to load your account information.</p>
          </div>
          <Button 
            onClick={() => navigate('/brewery')}
            className="bg-white text-black hover:bg-white/90 transition-all duration-200"
          >
            Back to Member Hub
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <motion.header 
        className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/brewery')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <h1 className="text-lg font-light tracking-wide">Account Settings</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <motion.div 
              className="w-1 h-8 bg-gradient-to-b from-white to-white/40"
              initial={{ height: 0 }}
              animate={{ height: 32 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <div>
              <h2 className="text-4xl font-light tracking-wide mb-2">
                Account Settings
              </h2>
              <p className="text-white/60 font-light text-lg">
                Manage your profile and membership details
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <User className="h-6 w-6 text-white/60" />
                <CardTitle className="text-2xl font-light text-white">Profile Information</CardTitle>
              </div>
              <CardDescription className="text-white/60 font-light">
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Display */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-white/10 text-white text-2xl">
                    {membership.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Profile Picture</p>
                  <p className="text-white/60 text-sm">Avatar displays your first name initial</p>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80 font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
                />
                <p className="text-white/40 text-sm">Email cannot be changed</p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving || formData.name === membership.name}
                    className="bg-white text-black hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>

              {/* Message Display */}
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg border ${
                      message.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {message.type === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{message.text}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Membership Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-12"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="h-6 w-6 text-white/60" />
                <CardTitle className="text-2xl font-light text-white">Membership Details</CardTitle>
              </div>
              <CardDescription className="text-white/60 font-light">
                Your current membership status and benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Membership Type */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getMembershipIcon(membership.membership_type)}
                    <div>
                      <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Type</p>
                      <p className={`text-2xl font-light capitalize ${getMembershipColor(membership.membership_type)}`}>
                        {membership.membership_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Status</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div>
                      <span className="text-emerald-400 text-sm font-medium uppercase tracking-wide">
                        {membership.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Membership Dates */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Member Since</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-white/40" />
                      <p className="text-xl font-light text-white">
                        {new Date(membership.start_date).toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {membership.end_date && (
                    <div className="space-y-2">
                      <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Expires</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-white/40" />
                        <p className="text-xl font-light text-white">
                          {new Date(membership.end_date).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


      </div>
    </div>
  )
}
