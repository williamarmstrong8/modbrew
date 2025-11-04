import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Membership } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { 
  Coffee, 
  Calendar, 
  Settings, 
  LogOut, 
  Star, 
  Users, 
  Clock,
  ArrowRight,
  Heart,
  CheckCircle,
  BarChart3,
  Share2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { FloatingActionButton } from '../components/ui/floating-action-button'
import { StatsCard } from '../components/ui/stats-card'

export default function MemberHub() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [storyChallengeStatus, setStoryChallengeStatus] = useState<'not_started' | 'in_progress' | 'completed' | null>(null)

  const [loading, setLoading] = useState(true)

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
          // If no active membership, redirect to signup
          navigate('/auth?mode=signup')
          return
        }

        // If no membership found, redirect to signup
        if (!membershipData) {
          console.log('No membership found for user, redirecting to signup')
          navigate('/auth?mode=signup')
          return
        }

        // Fetch weekly challenge status using raw SQL to avoid query builder issues
        const { error: challengeError } = await supabase
          .rpc('get_user_challenge_status', { user_uuid: user.id })

        if (challengeError) {
          console.error('Error fetching challenge status:', challengeError)
        }

        // Fetch story challenge status
        const { data: storyChallengeData, error: storyChallengeError } = await supabase
          .rpc('get_user_challenge_2_status', { user_uuid: user.id })

        if (storyChallengeError) {
          console.error('Error fetching story challenge status:', storyChallengeError)
        }

        // Determine story challenge status
        let storyStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started'
        if (storyChallengeData && storyChallengeData.length > 0) {
          const challenge = storyChallengeData[0]
          if (challenge.status === 'completed') {
            storyStatus = 'completed'
          } else if (challenge.status === 'in_progress') {
            storyStatus = 'in_progress'
          }
        }

        setMembership(membershipData)
        setStoryChallengeStatus(storyStatus)
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

  const refreshChallengeStatus = useCallback(async () => {
    if (!user?.id) return

    try {
      const { error: challengeError } = await supabase
        .rpc('get_user_challenge_status', { user_uuid: user.id })

      if (challengeError) {
        console.error('Error fetching challenge status:', challengeError)
        return
      }

      const { data: storyChallengeData, error: storyChallengeError } = await supabase
        .rpc('get_user_challenge_2_status', { user_uuid: user.id })

      if (storyChallengeError) {
        console.error('Error fetching story challenge status:', storyChallengeError)
        return
      }

      let storyStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started'
      if (storyChallengeData && storyChallengeData.length > 0) {
        const challenge = storyChallengeData[0]
        if (challenge.status === 'completed') {
          storyStatus = 'completed'
        } else if (challenge.status === 'in_progress') {
          storyStatus = 'in_progress'
        }
      }

      setStoryChallengeStatus(storyStatus)
    } catch (error) {
      console.error('Error refreshing challenge status:', error)
    }
  }, [user?.id])

  // Refresh challenge status when component mounts
  useEffect(() => {
    if (user && !loading) {
      refreshChallengeStatus()
    }
  }, [user, loading, refreshChallengeStatus])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }





  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your experience..." />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <motion.img 
                src="/images/Mod Brew Long.png" 
                alt="ModBrew" 
                className="h-6 w-auto sm:h-8"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <Separator orientation="vertical" className="h-6 bg-white/20 hidden sm:block" />
              <h1 className="text-base sm:text-lg font-light tracking-wide hidden sm:block">Member Hub</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/brewery/account')}
                className="p-0 h-auto hover:bg-white/10 transition-all duration-200"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer hover:scale-105 transition-transform duration-200">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-white/10 text-white text-sm sm:text-base">
                    {membership.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-2.5 sm:p-2"
                size="sm"
              >
                <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
                  Welcome back, <span className="text-white">{membership.name}</span>
                </h2>
                <p className="text-white/60 font-light text-lg">
                  Your ModBrew membership is active and ready to use
                </p>
              </div>
            </div>
          </motion.div>

          {/* Featured Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-12"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override overflow-hidden group hover:bg-white/10 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:h-96">
                {/* Product Image */}
                <div className="h-64 md:h-full bg-black/20 flex items-center justify-center relative overflow-hidden md:w-auto">
                  <img 
                    src="/images/hoodie-mockup.png" 
                    alt="Mod Brew Hoodie" 
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/10 text-white/90 border-white/20 backdrop-blur-sm">
                    Featured
                  </Badge>
                </div>
                
                {/* Product Content */}
                <div className="flex flex-col flex-1">
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl font-light text-white mb-2">
                      Exclusive Member Blend
                    </CardTitle>
                    <CardDescription className="text-white/60 font-light">
                      A limited edition coffee crafted exclusively for ModBrew members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between space-y-4 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-light text-emerald-400">
                          $49
                        </div>
                        <div className="text-lg text-white/40 line-through">
                          $59
                        </div>
                      </div>
                      <p className="text-white/80 font-light text-sm leading-relaxed">
                        Made from premium quality materials, this exclusive Mod Brew hoodie features our 
                        iconic branding and is perfect for representing your ModBrew membership in style. 
                        Experience premium comfort with our exclusive pullover design. The classic design 
                        pairs perfectly with any outfit while showcasing your connection to the ModBrew 
                        community. With front kangaroo pocket and comfortable fit for everyday wear, this 
                        is the perfect way to show your ModBrew pride. Members save 15% on this exclusive offering.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => navigate('/brewery/product/hoodie')}
                        className="flex-1 bg-white text-black hover:bg-white/90 transition-all duration-200"
                      >
                        View Product
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button 
                        onClick={() => navigate('/brewery/preorder')}
                        className="flex-1 bg-white text-black hover:bg-white/90 transition-all duration-200"
                      >
                        Preorder
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Admin Section - Only visible to admin users */}
          {membership.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
                <CardHeader className="pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div>
                      <CardTitle className="text-2xl font-light text-white mb-2">
                        Admin Dashboard
                      </CardTitle>
                      <CardDescription className="text-white/60 font-light">
                        Access business analytics and manage operations
                      </CardDescription>
                    </div>
                    <Badge className="bg-white/10 text-white/80 border-white/20 mt-1">
                      Admin
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-white/10 flex-shrink-0">
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium">Business Analytics</p>
                          <p className="text-white/60 text-sm">
                            View sales data, customer insights, and performance metrics
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate('/admin')}
                        className="w-full sm:w-auto bg-white text-black hover:bg-white/90 transition-all duration-200"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Weekly Challenges Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: membership.role === 'admin' ? 0.3 : 0.2 }}
            className="mb-12"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <CardTitle className="text-2xl font-light text-white mb-2">
                      Story Challenge
                    </CardTitle>
                    <CardDescription className="text-white/60 font-light">
                      Share a screenshot of your ModBrew story for a chance to win free merch
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mt-1">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Challenge Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-white/10 flex-shrink-0">
                        <AnimatePresence mode="wait">
                          {storyChallengeStatus === 'completed' ? (
                            <motion.div 
                              key="icon-completed"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="icon-not-completed"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Share2 className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">Submit Story Screenshot</p>
                        <p className="text-white/60 text-sm">
                          {storyChallengeStatus === 'completed' 
                            ? 'Challenge completed! You\'re entered in the raffle' 
                            : 'Enter the raffle for free merch'
                          }
                        </p>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {storyChallengeStatus === 'completed' ? (
                        <motion.div 
                          key="story-challenge-completed"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <Button 
                            onClick={() => navigate('/brewery/challenge-submissions?type=story')}
                            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 transition-all duration-200"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            View Submissions
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="story-challenge-not-completed"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <Button 
                            onClick={() => navigate('/brewery/weekly-challenge?type=story')}
                            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 transition-all duration-200"
                          >
                            {storyChallengeStatus === 'in_progress' ? 'Continue' : 'Participate'}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Challenge Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">
                        {storyChallengeStatus === 'completed' ? '✓' : '∞'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {storyChallengeStatus === 'completed' ? 'Completed' : 'Always Open'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">
                        {storyChallengeStatus === 'completed' ? '1' : '1'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {storyChallengeStatus === 'completed' ? 'Screenshot Uploaded' : 'Screenshot Required'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-medium text-white mb-1">Free Merch</div>
                      <div className="text-white/60 text-sm">
                        {storyChallengeStatus === 'completed' ? 'Raffle Entry' : 'Raffle Ticket'}
                      </div>
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
            transition={{ duration: 0.6, delay: membership.role === 'admin' ? 0.35 : 0.25 }}
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
            transition={{ duration: 0.6, delay: membership.role === 'admin' ? 0.45 : 0.35 }}
            className="mb-12"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-light mb-2">Your Stats</h3>
              <p className="text-white/60 font-light">Your membership activity and achievements</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatsCard
                icon={Clock}
                title="Days Active"
                value={daysActive}
                description="Time as a member"
                color="text-blue-400"
                delay={membership.role === 'admin' ? 0.45 : 0.35}
              />
              <StatsCard
                icon={Star}
                title="Membership Level"
                value={membership.membership_type.toUpperCase()}
                description="Your current tier"
                color="text-yellow-400"
                delay={membership.role === 'admin' ? 0.55 : 0.45}
              />
              <StatsCard
                icon={Heart}
                title="Status"
                value={membership.status.toUpperCase()}
                description="Account status"
                color="text-emerald-400"
                delay={membership.role === 'admin' ? 0.65 : 0.55}
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: membership.role === 'admin' ? 0.7 : 0.6 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-light text-white">Quick Actions</CardTitle>
                <CardDescription className="text-white/60 font-light">
                  Manage your membership and explore member benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/brewery/coffee')}
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
                    <Button 
                      onClick={() => navigate('/brewery/account')}
                      className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/brewery/contact-support')}
                      className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 h-12"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Contact Support
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={Coffee}
        onClick={() => navigate('/brewery/coffee')}
        label="Browse Coffee"
      />
    </div>
  )
}

