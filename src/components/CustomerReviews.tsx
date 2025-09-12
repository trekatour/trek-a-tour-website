import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Play, Edit3, Plus, Trash2, Save, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { getCustomerReviews, saveCustomerReview, updateCustomerReview, deleteCustomerReview, CustomerReview } from "@/lib/reviewStorage";
import { uploadReviewImage } from "@/lib/imageUpload";

interface CustomerReviewsProps {
  tripId: string;
}

const CustomerReviews = ({ tripId }: CustomerReviewsProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    reviewText: '',
    photos: [] as string[],
    youtubeLinks: [] as string[],
    reviewDate: new Date().toISOString().split('T')[0]
  });

  const loadReviews = useCallback(() => {
    const tripReviews = getCustomerReviews(tripId);
    setReviews(tripReviews);
  }, [tripId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSaveReview = () => {
    if (!newReview.customerName || !newReview.reviewText) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and review text.",
        variant: "destructive"
      });
      return;
    }

    saveCustomerReview({
      tripId,
      ...newReview,
      isActive: true
    });

    setNewReview({
      customerName: '',
      rating: 5,
      reviewText: '',
      photos: [],
      youtubeLinks: [],
      reviewDate: new Date().toISOString().split('T')[0]
    });
    setIsAddingReview(false);
    loadReviews();
    
    toast({
      title: "Review Added",
      description: "Customer review has been added successfully."
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    deleteCustomerReview(reviewId);
    loadReviews();
    toast({
      title: "Review Deleted",
      description: "Customer review has been removed."
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingPhotos(true);
    const uploadedPhotos: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const imageUrl = await uploadReviewImage(file);
          uploadedPhotos.push(imageUrl);
        }
      }

      setNewReview(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos]
      }));

      toast({
        title: "Photos Uploaded",
        description: `${uploadedPhotos.length} photo(s) uploaded to Supabase successfully.`
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photos to Supabase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addYoutubeLink = (url: string) => {
    if (url.trim()) {
      setNewReview(prev => ({
        ...prev,
        youtubeLinks: [...prev.youtubeLinks, url.trim()]
      }));
    }
  };

  const removeYoutubeLink = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index)
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getYoutubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-gray-600">Real experiences from our travelers</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsAddingReview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        )}
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.reviewDate}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                  
                  {/* Photos */}
                  {review.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {review.photos.map((photo, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photo}
                          alt={`Review photo ${photoIndex + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* YouTube Videos */}
                  {review.youtubeLinks && review.youtubeLinks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Play className="h-4 w-4 mr-1 text-red-600" />
                        Customer Videos ({review.youtubeLinks.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {review.youtubeLinks.map((link, linkIndex) => {
                          const thumbnail = getYoutubeThumbnail(link);
                          return (
                            <div
                              key={linkIndex}
                              className="relative cursor-pointer group border rounded-lg overflow-hidden hover:shadow-md transition-all"
                              onClick={() => window.open(link, '_blank')}
                              title="Click to watch on YouTube"
                            >
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt="YouTube video thumbnail"
                                  className="w-full h-24 object-cover group-hover:opacity-90 transition-opacity"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                                  <Play className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-red-600 rounded-full p-3 group-hover:bg-red-700 transition-colors shadow-lg">
                                  <Play className="h-5 w-5 text-white fill-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                YouTube
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">
              {isAdmin ? "Add the first customer review to get started!" : "Be the first to share your experience!"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Review Dialog */}
      <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Customer Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  value={newReview.customerName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-md"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Review Date</label>
              <Input
                type="date"
                value={newReview.reviewDate}
                onChange={(e) => setNewReview(prev => ({ ...prev, reviewDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Review Text</label>
              <Textarea
                value={newReview.reviewText}
                onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Enter customer review..."
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Customer Photos</label>
              <div className="space-y-3">
                {/* Photo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhotos}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingPhotos ? "Uploading..." : "Upload Photos"}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Select multiple images (JPG, PNG, etc.)
                  </p>
                </div>

                {/* Uploaded Photos Preview */}
                {newReview.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {newReview.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">YouTube Videos</label>
              <div className="space-y-2">
                {newReview.youtubeLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={link} readOnly />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeYoutubeLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter YouTube URL (e.g., https://youtu.be/FzNg5qqV-8c)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addYoutubeLink((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addYoutubeLink(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveReview} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Review
              </Button>
              <Button variant="outline" onClick={() => setIsAddingReview(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerReviews;
