import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Profile, type Membership } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Crown, Coffee, Calendar, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
        return 'bg-purple-500'
      case 'premium':
        return 'bg-blue-500'
      case 'basic':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return <Crown className="h-5 w-5" />
      case 'premium':
        return <Coffee className="h-5 w-5" />
      case 'basic':
        return <Coffee className="h-5 w-5" />
      default:
        return <Coffee className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!profile || !membership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">You need an active membership to access the member hub.</p>
          <Button onClick={() => navigate('/auth?mode=signup')}>
            Get Membership
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/Mod Brew Long.png" 
                alt="ModBrew" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold">Member Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${getMembershipBadgeColor(membership.membership_type)} text-white`}>
                {getMembershipIcon(membership.membership_type)}
                <span className="ml-1 capitalize">{membership.membership_type}</span>
              </Badge>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-white hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {profile?.name || 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {profile.name}!</h2>
          <p className="text-gray-400">Your ModBrew membership is active and ready to use.</p>
        </div>

        {/* Membership Status Card */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Crown className="h-5 w-5 mr-2" />
              Membership Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your current membership details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Membership Type</p>
                <p className="text-lg font-semibold capitalize">{membership.membership_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <Badge className="bg-green-500 text-white">
                  {membership.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(membership.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Coffee className="h-5 w-5 mr-2" />
                Exclusive Coffee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Access to our premium coffee blends and limited edition releases.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calendar className="h-5 w-5 mr-2" />
                Member Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Join exclusive tastings, workshops, and community events.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="h-5 w-5 mr-2" />
                Member Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Priority customer support and personalized recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your membership and explore member benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-black hover:bg-gray-200">
                Browse Coffee
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                View Events
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Update Profile
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
