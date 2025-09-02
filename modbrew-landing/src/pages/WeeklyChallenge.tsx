import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

import { Label } from '../components/ui/label'
import { 
  Upload, 
  X, 
  CheckCircle, 
  Camera, 
  ArrowLeft,
  Sparkles,
  Coffee
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/loading-spinner'

interface ChallengePhoto {
  id: string
  file: File
  preview: string
  uploaded: boolean
  url?: string
}

export default function WeeklyChallenge() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<ChallengePhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
  }, [user, navigate])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newPhotos: ChallengePhoto[] = Array.from(files).map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }))

    // Limit to 5 photos
    const totalPhotos = photos.length + newPhotos.length
    if (totalPhotos > 5) {
      setError('You can only upload a maximum of 5 photos')
      return
    }

    setPhotos(prev => [...prev, ...newPhotos])
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (photos.length < 5) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (photos.length >= 5) return

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length === 0) {
      setError('Please drop image files only')
      return
    }

    const newPhotos: ChallengePhoto[] = files.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }))

    // Limit to 5 photos
    const totalPhotos = photos.length + newPhotos.length
    if (totalPhotos > 5) {
      setError('You can only upload a maximum of 5 photos')
      return
    }

    setPhotos(prev => [...prev, ...newPhotos])
    setError(null)
  }

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== id)
    })
  }

  const uploadPhoto = async (photo: ChallengePhoto): Promise<string> => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    const fileExt = photo.file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error } = await supabase.storage
      .from('modbrew-5')
      .upload(fileName, photo.file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`Failed to upload ${photo.file.name}: ${error.message}`)
    }

    // Create 1-year signed URL for better access control
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('modbrew-5')
      .createSignedUrl(fileName, 31536000) // 1 year in seconds

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError)
      // Fallback to public URL if signed URL fails
      const { data: { publicUrl } } = supabase.storage
        .from('modbrew-5')
        .getPublicUrl(fileName)
      return publicUrl
    }

    return signedUrlData.signedUrl
  }

  const handleSubmit = async () => {
    if (photos.length < 5) {
      setError('Please upload exactly 5 photos to participate')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Upload all photos first
      setUploading(true)
      const uploadPromises = photos.map(uploadPhoto)
      const photoUrls = await Promise.all(uploadPromises)

      // Update photos with URLs
      setPhotos(prev => prev.map((photo, index) => ({
        ...photo,
        uploaded: true,
        url: photoUrls[index]
      })))

      // Create challenge record
      const { error: challengeError } = await supabase
        .from('weekly_challenges')
        .insert({
          user_id: user?.id,
          challenge_name: 'Weekly Photo Challenge',
          status: 'completed',
          photo_urls: photoUrls,
          submitted_at: new Date().toISOString()
        })

      if (challengeError) {
        console.error('Challenge creation error:', challengeError)
        throw new Error(`Failed to create challenge record: ${challengeError.message}`)
      }

      setSuccess(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit challenge')
    } finally {
      setUploading(false)
      setSubmitting(false)
    }
  }

  const canSubmit = photos.length === 5 && !uploading && !submitting

  if (success) {
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
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="mb-8">
              <CheckCircle className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
              <h1 className="text-3xl font-light text-white mb-3">Challenge Submitted!</h1>
              <p className="text-white/60 text-lg">Your 5 photos have been uploaded successfully.</p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/brewery')}
                className="bg-white text-black hover:bg-white/90 transition-all duration-200 w-full"
              >
                Return to Brewery
              </Button>
            </div>
          </motion.div>
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
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-light tracking-wide">Weekly Photo Challenge</h1>
            </div>
            <p className="text-white/60 text-xl font-light">Upload 5 photos of your ModBrew experience to earn rewards!</p>
          </div>
        </div>

        {/* Challenge Info Card */}
        <Card className="mb-12 bg-white/5 border-white/10 backdrop-blur-sm card-override">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-light text-white mb-2">
              <Coffee className="h-6 w-6 mr-3 text-white" />
              Challenge Details
            </CardTitle>
            <CardDescription className="text-white/60 font-light text-lg">
              Share your ModBrew moments and get 20% off your next purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">5</div>
                <div className="text-white/60 font-light">Photos Required</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">20%</div>
                <div className="text-white/60 font-light">Discount Reward</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl font-light text-white mb-2">∞</div>
                <div className="text-white/60 font-light">Unlimited Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Section */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm card-override">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-white mb-2">Upload Your Photos</CardTitle>
            <CardDescription className="text-white/60 font-light text-lg">
              Select up to 5 photos that showcase your ModBrew experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* File Input */}
            <div className="mb-8">
              <Label htmlFor="photo-upload" className="block mb-4 text-lg font-medium text-white">
                Choose Photos
              </Label>
              
              {/* Modern Drag & Drop Zone */}
              <div className="relative">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={photos.length >= 5}
                />
                
                <div 
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                    ${photos.length >= 5 
                      ? 'border-white/20 bg-white/5 cursor-not-allowed' 
                      : isDragOver 
                        ? 'border-white/60 bg-white/20 scale-105' 
                        : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10 cursor-pointer'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-white/10">
                        <Upload className="h-8 w-8 text-white/60" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-white">
                        {photos.length >= 5 ? 'Maximum Photos Selected' : isDragOver ? 'Drop photos here!' : 'Drop photos here or click to browse'}
                      </h3>
                      <p className="text-white/60">
                        {photos.length >= 5 
                          ? 'You can remove photos to add more' 
                          : 'Select up to 5 photos (JPG, PNG, WebP)'
                        }
                      </p>
                    </div>
                    
                    {photos.length < 5 && (
                      <div className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                        <span className="text-white font-medium">Browse Files</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Photo Counter */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${photos.length === 5 ? 'bg-emerald-400' : 'bg-white/40'}`} />
                  <span className="text-sm text-white/60">
                    {photos.length === 5 ? 'Ready to submit' : `${photos.length}/5 photos selected`}
                  </span>
                </div>
                
                {photos.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPhotos([])
                      setError(null)
                    }}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-6">Selected Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors">
                        <img
                          src={photo.preview}
                          alt="Challenge photo"
                          className="w-full h-full object-cover"
                        />
                        {photo.uploaded && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      <div className="mt-3 text-center">
                        <p className="text-xs text-white/60 truncate">
                          {photo.file.name}
                        </p>
                        {photo.uploaded && (
                          <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Uploaded
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-8 p-8 bg-white/5 border border-white/20 rounded-xl">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <LoadingSpinner className="h-8 w-8 text-emerald-400" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-white mb-1">Uploading Photos</h3>
                    <p className="text-white/60">Please wait while we upload your images...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-white text-black hover:bg-white/90 transition-all duration-200 px-10 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner className="h-5 w-5 mr-3 text-black" />
                    Submitting Challenge...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-3" />
                    Submit Challenge
                  </>
                )}
              </Button>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  )
}
