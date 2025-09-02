import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Profile, type Membership } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { 
  Crown, 
  Coffee, 
  Calendar, 
  Settings, 
  LogOut, 
  Gift, 
  Star, 
  Users, 
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { FloatingActionButton } from '../components/ui/floating-action-button'
import { StatsCard } from '../components/ui/stats-card'

export default function MemberHub() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          return
        }

        // Fetch user membership
        const { data: membershipData, error: membershipError } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (membershipError) {
          console.error('Error fetching membership:', membershipError)
          // If no active membership, redirect to signup
          navigate('/auth?mode=signup')
          return
        }

        setProfile(profileData)
        setMembership(membershipData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case 'vip':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      case 'basic':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return <Crown className="h-4 w-4" />
      case 'premium':
        return <Star className="h-4 w-4" />
      case 'basic':
        return <Coffee className="h-4 w-4" />
      default:
        return <Coffee className="h-4 w-4" />
    }
  }

  const getMembershipBenefits = (type: string) => {
    switch (type) {
      case 'vip':
        return [
          { icon: <Crown className="h-5 w-5" />, text: 'Exclusive VIP Events', color: 'text-purple-400' },
          { icon: <Gift className="h-5 w-5" />, text: 'Monthly Gift Box', color: 'text-pink-400' },
          { icon: <Sparkles className="h-5 w-5" />, text: 'Priority Access', color: 'text-yellow-400' },
          { icon: <Heart className="h-5 w-5" />, text: 'Personal Concierge', color: 'text-red-400' }
        ]
      case 'premium':
        return [
          { icon: <Star className="h-5 w-5" />, text: 'Premium Coffee Access', color: 'text-blue-400' },
          { icon: <Calendar className="h-5 w-5" />, text: 'Member Events', color: 'text-cyan-400' },
          { icon: <Users className="h-5 w-5" />, text: 'Community Access', color: 'text-indigo-400' },
          { icon: <Zap className="h-5 w-5" />, text: 'Fast Support', color: 'text-orange-400' }
        ]
      case 'basic':
        return [
          { icon: <Coffee className="h-5 w-5" />, text: 'Coffee Discounts', color: 'text-emerald-400' },
          { icon: <Calendar className="h-5 w-5" />, text: 'Event Access', color: 'text-teal-400' },
          { icon: <Users className="h-5 w-5" />, text: 'Member Community', color: 'text-green-400' }
        ]
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your experience..." />
      </div>
    )
  }

  if (!profile || !membership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center text-white max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Coffee className="h-16 w-16 mx-auto text-white/40 mb-4" />
            <h2 className="text-2xl font-light mb-2">Access Denied</h2>
            <p className="text-white/60 font-light">You need an active membership to access the member hub.</p>
          </div>
          <Button 
            onClick={() => navigate('/auth?mode=signup')}
            className="bg-white text-black hover:bg-white/90 transition-all duration-200"
          >
            Get Membership
          </Button>
        </motion.div>
      </div>
    )
  }

  const benefits = getMembershipBenefits(membership.membership_type)
  
  // Calculate membership duration
  const startDate = new Date(membership.start_date)
  const now = new Date()
  const daysActive = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

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
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <motion.img 
                src="/images/Mod Brew Long.png" 
                alt="ModBrew" 
                className="h-8 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <h1 className="text-lg font-light tracking-wide">Member Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-white/10 text-white text-sm">
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence>
          {/* Welcome Section */}
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
                  Welcome back, <span className="text-white">{profile.name}</span>
                </h2>
                <p className="text-white/60 font-light text-lg">
                  Your ModBrew membership is active and ready to use
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weekly Challenges Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-12"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-light text-white mb-2">
                      Weekly Challenge
                    </CardTitle>
                    <CardDescription className="text-white/60 font-light">
                      Upload 5 images of ModBrew for 20% off your next purchase
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Challenge Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-white/10">
                        <Coffee className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Upload 5 ModBrew Images</p>
                        <p className="text-white/60 text-sm">Get 20% off your next purchase</p>
                      </div>
                    </div>
                    <Button className="bg-white text-black hover:bg-white/90 transition-all duration-200">
                      Participate
                    </Button>
                  </div>

                  {/* Challenge Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">3</div>
                      <div className="text-white/60 text-sm">Days Left</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">127</div>
                      <div className="text-white/60 text-sm">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">20%</div>
                      <div className="text-white/60 text-sm">Discount</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Membership Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-12"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-light text-white mb-2">
                      Membership Status
                    </CardTitle>
                    <CardDescription className="text-white/60 font-light">
                      Your current membership details and benefits
                    </CardDescription>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getMembershipIcon(membership.membership_type)}
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Type</p>
                    <p className="text-xl font-light capitalize text-white">{membership.membership_type}</p>
                  </div>
                                     <div className="space-y-2">
                     <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Status</p>
                     <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div>
                       <span className="text-emerald-400 text-sm font-medium uppercase tracking-wide">{membership.status}</span>
                     </div>
                   </div>
                                     <div className="space-y-2">
                     <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Member Since</p>
                     <p className="text-xl font-light text-white">
                       {new Date(membership.start_date).toLocaleDateString('en-US', { 
                         weekday: 'long',
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-light mb-2">Your Stats</h3>
              <p className="text-white/60 font-light">Your membership activity and achievements</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                icon={Clock}
                title="Days Active"
                value={daysActive}
                description="Time as a member"
                color="text-blue-400"
                delay={0.3}
              />
              <StatsCard
                icon={Star}
                title="Membership Level"
                value={membership.membership_type.toUpperCase()}
                description="Your current tier"
                color="text-yellow-400"
                delay={0.4}
              />
              <StatsCard
                icon={Heart}
                title="Status"
                value={membership.status.toUpperCase()}
                description="Account status"
                color="text-emerald-400"
                delay={0.5}
              />
            </div>
          </motion.div>

          {/* Member Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-light mb-2">Your Benefits</h3>
              <p className="text-white/60 font-light">Explore what your membership includes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full group hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300 ${benefit.color}`}>
                          {benefit.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-2">{benefit.text}</h4>
                          <p className="text-white/60 text-sm font-light">
                            Enjoy exclusive access to premium features and experiences
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-light text-white">Quick Actions</CardTitle>
                <CardDescription className="text-white/60 font-light">
                  Manage your membership and explore member benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/coffee')}
                      className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Browse Coffee
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Events
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12">
                      <Users className="h-4 w-4 mr-2" />
                      Contact Support
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Coffee}
        onClick={() => navigate('/')}
        label="Browse Coffee"
      />
    </div>
  )
}
