import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { 
  ArrowLeft,
  Image
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  const [images, setImages] = useState<SubmissionImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    fetchSubmissions()
  }, [user, navigate])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)

      // List all files in the modbrew-5 bucket (no subfolders)
      const { data: files, error: listError } = await supabase.storage
        .from('modbrew-5')
        .list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (listError) {
        throw new Error(`Failed to list files: ${listError.message}`)
      }

      // Transform files into submission images
      const submissionImages: SubmissionImage[] = await Promise.all(
        files
          .filter(file => file.name && !file.name.endsWith('/') && file.metadata?.size > 0) // Filter out folders and empty files
          .map(async (file) => {
            // Create 1-year signed URL for better access control
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('modbrew-5')
              .createSignedUrl(file.name, 31536000) // 1 year in seconds

            if (signedUrlError) {
              console.error('Error creating signed URL:', signedUrlError)
              // Fallback to public URL if signed URL fails
              const { data: { publicUrl } } = supabase.storage
                .from('modbrew-5')
                .getPublicUrl(file.name)
              return {
                id: file.id || file.name,
                name: file.name,
                url: publicUrl,
                size: file.metadata?.size || 0,
                created_at: file.created_at || new Date().toISOString(),
                user_id: 'Anonymous' // Since we're not using user ID folders
              }
            }

            return {
              id: file.id || file.name,
              name: file.name,
              url: signedUrlData.signedUrl,
              size: file.metadata?.size || 0,
              created_at: file.created_at || new Date().toISOString(),
              user_id: 'Anonymous' // Since we're not using user ID folders
            }
          })
      )

      setImages(submissionImages)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions')
    } finally {
      setLoading(false)
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
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading submissions..." />
          </div>
        </div>
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

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/brewery')}
            className="mb-6 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brewery
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-light tracking-wide">Challenge Submissions</h1>
            </div>
            <p className="text-white/60 text-xl font-light">View all ModBrew challenge submissions</p>
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
                <div className="text-3xl font-light text-white mb-2">{images.length}</div>
                <div className="text-white/60 font-light">Total Photos</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">
                  {new Set(images.map(img => img.user_id)).size}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxMTYuNTY5IDEzMCAxMDBDMTMwIDgzLjQzMTUgMTE2LjU2OSA3MCAxMDAgNzBDODMuNDMxNSA3MCA3MCA4My40MzE1IDcwIDEwMEM3MCAxMTYuNTY5IDgzLjQzMTUgMTMwIDEwMCAxMzBaIiBmaWxsPSIjN0MzQ1QwIi8+CjxwYXRoIGQ9Ik0xMDAgMTQwQzExNi41NjkgMTQwIDEzMCAxMzYuNTY5IDEzMCAxMzNDMTMwIDEyOS40MzEgMTE2LjU2OSAxMjYgMTAwIDEyNkM4My40MzE1IDEyNiA3MCAxMjkuNDMxIDcwIDEzM0M3MCAxMzYuNTY5IDgzLjQzMTUgMTQwIDEwMCAxNDB6IiBmaWxsPSIjN0MzNDVBMCIvPgo8L3N2Zz4K'
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Image className="h-16 w-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-medium text-white mb-2">No Submissions Yet</h3>
            <p className="text-white/60">Be the first to submit your ModBrew challenge photos!</p>
          </div>
        )}
      </div>
    </div>
  )
}
