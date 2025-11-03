import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { ImageModal } from '../components/ui/image-modal'
import { 
  ArrowLeft,
  Image,
  Share2,
  Camera
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/loading-spinner'

interface SubmissionImage {
  id: string
  name: string
  url: string
  size: number
  created_at: string
  user_id: string
}

export default function ChallengeSubmissions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [images, setImages] = useState<SubmissionImage[]>([])
  const [allImages, setAllImages] = useState<SubmissionImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<SubmissionImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  
  // Determine challenge type from URL parameter
  const challengeType = searchParams.get('type') || 'photo' // 'photo' or 'story'
  const isStoryChallenge = challengeType === 'story'

  const [displayedCount, setDisplayedCount] = useState(15)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Check if we have cached data in sessionStorage (persists during browser session)
    const cacheKey = `challengeSubmissions-${challengeType}`
    const countCacheKey = `challengeParticipantCount-${challengeType}`
    const cachedData = sessionStorage.getItem(cacheKey)
    const cachedParticipantCount = sessionStorage.getItem(countCacheKey)
    
    if (cachedData && cachedParticipantCount) {
      try {
        const parsedData = JSON.parse(cachedData)
        setAllImages(parsedData)
        setImages(parsedData.slice(0, displayedCount))
        setParticipantCount(parseInt(cachedParticipantCount))

        
        // For cached data, just show the page immediately - no preloading needed
        if (parsedData.length > 0) {
          console.log(`Using cached data: ${parsedData.length} images available for ${challengeType} challenge`)
          setShowContent(true) // Trigger content animation
          setTimeout(() => {
            setLoading(false) // Hide loading after animation starts
          }, 200)
        } else {
          setLoading(false) // No images to load
        }
        
        return // Exit early, don't fetch fresh data
      } catch (err) {
        console.error('Error parsing cached data:', err)
        // If parsing fails, clear cache and fetch fresh data
        sessionStorage.removeItem(cacheKey)
        sessionStorage.removeItem(countCacheKey)
      }
    }

    // No cached data or parsing failed, fetch fresh data
    fetchSubmissions()
  }, [user, navigate])

  // Handle page visibility changes (when user swipes away and back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible again, no need to change loading state
        // Loading is already handled properly in fetchSubmissions
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Clear cache when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Clear sessionStorage when leaving the page
      const cacheKey = `challengeSubmissions-${challengeType}`
      const countCacheKey = `challengeParticipantCount-${challengeType}`
      sessionStorage.removeItem(cacheKey)
      sessionStorage.removeItem(countCacheKey)
    }
  }, [challengeType])

  // Track when all images are loaded (for display purposes only)
  useEffect(() => {
    if (images.length > 0 && imagesLoaded === images.length) {
      // All images loaded, but loading state is already handled in fetchSubmissions
      console.log('All images loaded successfully')
    }
  }, [imagesLoaded, images.length])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }

  const loadMoreImages = () => {
    if (displayedCount >= allImages.length) return
    
    setLoadingMore(true)
    const nextBatch = allImages.slice(displayedCount, displayedCount + 15)
    setImages(prev => [...prev, ...nextBatch])
    setDisplayedCount(prev => prev + 15)
    setImagesLoaded(prev => prev + nextBatch.length)
    setLoadingMore(false)
  }

  const hasMoreImages = displayedCount < allImages.length

  const fetchParticipantCount = async () => {
    try {
      // Fetch from the relevant challenge table based on challenge type
      const tableName = isStoryChallenge ? 'weekly_challenges_2' : 'weekly_challenges'
      const { data: challenges, error } = await supabase
        .from(tableName)
        .select('*')

      if (error) {
        console.error(`Error fetching ${tableName}:`, error)
        return 0
      }

      // Count unique participants (filter out null/undefined user_ids)
      const validUserIds = challenges?.filter(challenge => challenge.user_id && challenge.user_id !== '') || []
      
      // Extract user IDs and count unique participants
      const userIds = validUserIds.map(challenge => challenge.user_id)
      const uniqueParticipants = new Set(userIds)
      const count = uniqueParticipants.size
      
      return count // Return the count for caching
      
    } catch (err) {
      console.error('Error fetching participant count:', err)
      return 0
    }
  }

  const openImageModal = (image: SubmissionImage) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const closeImageModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1])
    }
  }

  const hasPrevious = selectedImage ? images.findIndex(img => img.id === selectedImage.id) > 0 : false
  const hasNext = selectedImage ? images.findIndex(img => img.id === selectedImage.id) < images.length - 1 : false

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      setImagesLoaded(0) // Reset image load counter for new images

      // First, get the photo URLs from the relevant challenge table
      const tableName = isStoryChallenge ? 'weekly_challenges_2' : 'weekly_challenges'
      const { data: challenges, error: challengesError } = await supabase
        .from(tableName)
        .select('*')

      if (challengesError) {
        throw new Error(`Failed to fetch challenges: ${challengesError.message}`)
      }

      if (!challenges || challenges.length === 0) {
        setAllImages([])
        setImages([])
        setParticipantCount(0)
        setShowContent(true)
        setTimeout(() => {
          setLoading(false)
        }, 200)
        return
      }

      // Extract photo URLs from challenges
      const photoUrls: string[] = []
      challenges.forEach(challenge => {
        if (isStoryChallenge) {
          // For story challenges, we have a single photo_url
          if (challenge.photo_url) {
            photoUrls.push(challenge.photo_url)
          }
        } else {
          // For photo challenges, we have an array of photo_urls
          if (challenge.photo_urls && Array.isArray(challenge.photo_urls)) {
            photoUrls.push(...challenge.photo_urls)
          }
        }
      })

      // Transform URLs into submission images
      const submissionImages: SubmissionImage[] = photoUrls.map((url, index) => ({
        id: `submission-${index}`,
        name: `submission-${index}`,
        url: url,
        size: 0, // We don't have size info from the URL
        created_at: new Date().toISOString(),
        user_id: 'Anonymous'
      }))

      setAllImages(submissionImages)
      setImages(submissionImages.slice(0, displayedCount))
      
      // Fetch and cache participant count along with images
      const participantCount = await fetchParticipantCount()
      if (participantCount !== undefined) {
        setParticipantCount(participantCount)
        // Cache both images and participant count together
        const cacheKey = `challengeSubmissions-${challengeType}`
        const countCacheKey = `challengeParticipantCount-${challengeType}`
        sessionStorage.setItem(cacheKey, JSON.stringify(submissionImages))
        sessionStorage.setItem(countCacheKey, participantCount.toString())
      }
      
      console.log(`Fetched ${submissionImages.length} images for ${challengeType} challenge - will load on demand`)
      
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions')
    } finally {
      // Only hide loading after everything is fetched AND images are loaded
      setShowContent(true) // Trigger content animation
      setTimeout(() => {
        setLoading(false) // Hide loading after animation starts
      }, 200)
    }
  }




  if (loading) {
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
        
        <motion.div 
          className="relative z-10 flex items-center justify-center min-h-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: showContent ? 0 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading submissions..." />

          </div>
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

      <motion.div 
        className="relative z-10 container mx-auto px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-6 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/brewery')}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <h1 className="text-lg font-light tracking-wide">
              {isStoryChallenge ? 'Story Challenge Submissions' : 'Challenge Submissions'}
            </h1>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                {isStoryChallenge ? <Share2 className="h-8 w-8 text-white" /> : <Camera className="h-8 w-8 text-white" />}
              </div>
              <h1 className="text-4xl font-light tracking-wide">
                {isStoryChallenge ? 'Story Challenge Submissions' : 'Challenge Submissions'}
              </h1>
            </div>
            <p className="text-white/60 text-xl font-light">
              {isStoryChallenge 
                ? 'View all ModBrew story challenge submissions' 
                : 'View all ModBrew challenge submissions'}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-12 bg-white/5 border-white/10 backdrop-blur-sm card-override">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-white mb-2">Submission Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">{allImages.length}</div>
                <div className="text-white/60 font-light">Total Photos</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">
                  {participantCount}
                </div>
                <div className="text-white/60 font-light">Participants</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">
                  {images.length > 0 ? 'Active' : 'None'}
                </div>
                <div className="text-white/60 font-light">Challenge Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Images Grid */}
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override overflow-hidden hover:bg-white/10 transition-all duration-300">
                    <div className="overflow-hidden cursor-pointer relative group" style={{ aspectRatio: '9/16' }} onClick={() => openImageModal(image)}>
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxMTYuNTY5IDEzMCAxMDBDMTMwIDgzLjQzMTUgMTE2LjU2kgMTMwIDEyNiAxMDAgMTI2QzgzLjQzMTUgNzAgNzAgMTI5LjQzMSA3MCAxMzNDNzAgMTM2LjU2OSA4My40MzE1IDE0MCAxMDAgMTQweiIgZmlsbD0iIzdDMzQ1QTAiLz4KPC9zdmc+Cg=='
                        }}
                        onLoad={handleImageLoad}
                      />
                      {/* Hover overlay with click indicator */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Image className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreImages && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMoreImages}
                  disabled={loadingMore}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 text-lg font-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Image className="h-16 w-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
            <p className="text-white/60">Be the first to submit your ModBrew challenge photos!</p>
          </div>
        )}
      </motion.div>
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeImageModal}
          image={selectedImage}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </div>
  )
}
