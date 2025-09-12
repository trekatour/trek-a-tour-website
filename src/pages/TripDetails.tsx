import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { tripService, bookingService, Trip, ItineraryDay, FAQ } from "@/lib/supabaseService";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Trip>>({});
  
  // Section-specific editing states
  const [editingSections, setEditingSections] = useState({
    overview: false,
    itinerary: false,
    inclusions: false,
    essentials: false,
    transport: false,
    policy: false,
    cancellation: false,
    refund: false,
    hero: false,
    pricing: false,
    details: false
  });
  
  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Comprehensive edit data
  const [tempEditData, setTempEditData] = useState({
    title: '',
    category: '',
    base_price: 0,
    duration: '',
    difficulty: '',
    overview_content: '',
    transportation: '',
    cancellation_policy: '',
    inclusions: [] as string[],
    exclusions: [] as string[],
    essentials: [] as string[],
    newInclusion: '',
    newExclusion: '',
    newEssential: ''
  });

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const updateTempData = (field: string, value: any) => {
    setTempEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadTrip = async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      const tripData = await tripService.getById(tripId);
      if (tripData) {
        // Check for stored images in localStorage
        const imageStorageKey = `trip_image_${tripData.slug}`;
        const storedImage = localStorage.getItem(imageStorageKey);
        
        if (storedImage) {
          tripData.image_url = storedImage;
        }
        
        // Check for stored edits in localStorage
        const editsKey = `trip_edits_${tripId}`;
        const storedEdits = localStorage.getItem(editsKey);
        
        if (storedEdits) {
          try {
            const parsedEdits = JSON.parse(storedEdits);
            Object.assign(tripData, parsedEdits);
          } catch (e) {
            console.error('Error parsing stored edits:', e);
          }
        }
        
        setTrip(tripData);
        setEditData(tripData);
        // Initialize temp edit data
        setTempEditData({
          title: tripData.title || '',
          category: tripData.category || '',
          base_price: tripData.base_price || 0,
          duration: tripData.duration || '',
          difficulty: tripData.difficulty || '',
          overview_content: tripData.overview_content || tripData.short_desc || '',
          transportation: tripData.transportation || '',
          cancellation_policy: tripData.cancellation_policy || '',
          inclusions: tripData.inclusions || [],
          exclusions: tripData.exclusions || [],
          essentials: tripData.essentials || [],
          newInclusion: '',
          newExclusion: '',
          newEssential: ''
        });
      } else {
        toast({
          title: "Trip Not Found",
          description: "The requested trip could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!trip || !tripId) return;
    
    try {
      // Prepare update data from both tempEditData and editData
      const updateData: Partial<Trip> = {};
      
      // Handle hero section edits (from tempEditData)
      if (tempEditData.title && tempEditData.title !== trip.title) {
        updateData.title = tempEditData.title;
      }
      if (tempEditData.category && tempEditData.category !== trip.category) {
        updateData.category = tempEditData.category;
      }
      if (tempEditData.base_price && tempEditData.base_price !== trip.base_price) {
        updateData.base_price = tempEditData.base_price;
      }
      if (tempEditData.duration && tempEditData.duration !== trip.duration) {
        updateData.duration = tempEditData.duration;
      }
      if (tempEditData.difficulty && tempEditData.difficulty !== trip.difficulty) {
        updateData.difficulty = tempEditData.difficulty;
      }
      if (tempEditData.location && tempEditData.location !== trip.location) {
        updateData.location = tempEditData.location;
      }
      
      // Handle section edits (from editData)
      if (editData.overview_content && editData.overview_content !== trip.overview_content) {
        updateData.overview_content = editData.overview_content;
        updateData.short_desc = editData.overview_content; // Also update short_desc
      }
      if (editData.difficulty && editData.difficulty !== trip.difficulty) {
        updateData.difficulty = editData.difficulty;
      }
      if (editData.duration && editData.duration !== trip.duration) {
        updateData.duration = editData.duration;
      }
      if (editData.category && editData.category !== trip.category) {
        updateData.category = editData.category;
      }
      if (editData.itinerary && JSON.stringify(editData.itinerary) !== JSON.stringify(trip.itinerary)) {
        updateData.itinerary = editData.itinerary;
      }
      if (editData.cancellation_policy && editData.cancellation_policy !== trip.cancellation_policy) {
        updateData.cancellation_policy = editData.cancellation_policy;
      }
      if (editData.refund_policy && editData.refund_policy !== trip.refund_policy) {
        updateData.refund_policy = editData.refund_policy;
      }
      if (editData.transportation && editData.transportation !== trip.transportation) {
        updateData.transportation = editData.transportation;
      }
      if (editData.things_to_remember && editData.things_to_remember !== trip.things_to_remember) {
        updateData.things_to_remember = editData.things_to_remember;
      }
      
      // Handle inclusions and exclusions from tempEditData
      if (tempEditData.inclusions && tempEditData.inclusions.length > 0) {
        updateData.inclusions = tempEditData.inclusions;
      }
      if (tempEditData.exclusions && tempEditData.exclusions.length > 0) {
        updateData.exclusions = tempEditData.exclusions;
      }
      if (tempEditData.essentials && tempEditData.essentials.length > 0) {
        updateData.essentials = tempEditData.essentials;
      }
      
      // Store changes in localStorage for persistence
      const storageKey = `trip_edits_${tripId}`;
      const existingEdits = localStorage.getItem(storageKey);
      const allEdits = existingEdits ? { ...JSON.parse(existingEdits), ...updateData } : updateData;
      localStorage.setItem(storageKey, JSON.stringify(allEdits));
      
      // Update the trip state immediately
      setTrip(prev => prev ? { ...prev, ...updateData } : null);
      
      // Reset editing states
      setIsEditing(false);
      setEditData({});
      setTempEditData({
        title: '',
        category: '',
        base_price: 0,
        duration: '',
        difficulty: '',
        overview_content: '',
        transportation: '',
        cancellation_policy: '',
        inclusions: [] as string[],
        exclusions: [] as string[],
        essentials: [] as string[],
        newInclusion: '',
        newExclusion: '',
        newEssential: ''
      });
      setEditingSections({
        overview: false,
        itinerary: false,
        inclusions: false,
        essentials: false,
        transport: false,
        policy: false,
        cancellation: false,
        refund: false,
        hero: false,
        pricing: false,
        details: false
      });
      
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
      
    } catch (error) {
      console.error('Error saving edits:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const updateItineraryDay = (dayIndex: number, field: string, value: any) => {
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const updatedItinerary = [...currentItinerary];
      
      if (!updatedItinerary[dayIndex]) {
        updatedItinerary[dayIndex] = { day: dayIndex + 1, title: '', description: '', activities: [] };
      }
      
      updatedItinerary[dayIndex] = {
        ...updatedItinerary[dayIndex],
        [field]: value
      };
      
      return {
        ...prev,
        itinerary: updatedItinerary
      };
    });
  };

  const addItineraryDay = () => {
    console.log('Adding itinerary day...'); // Debug log
    
    // First ensure we're in edit mode
    if (!editingSections.itinerary) {
      setEditingSections(prev => ({ ...prev, itinerary: true }));
    }
    
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const newDay = {
        day: currentItinerary.length + 1,
        title: `Day ${currentItinerary.length + 1}`,
        description: '',
        activities: []
      };
      
      const updatedItinerary = [...currentItinerary, newDay];
      console.log('New itinerary:', updatedItinerary); // Debug log
      
      return {
        ...prev,
        itinerary: updatedItinerary
      };
    });
    
    // Show success message
    toast({
      title: "Day Added",
      description: `Day ${(editData.itinerary?.length || 0) + 1} has been added to the itinerary.`,
    });
  };

  const removeItineraryDay = (dayIndex: number) => {
    setEditData(prev => {
      const currentItinerary = prev.itinerary || trip?.itinerary || [];
      const updatedItinerary = currentItinerary.filter((_, index) => index !== dayIndex);
      
      // Renumber days
      const renumberedItinerary = updatedItinerary.map((day, index) => ({
        ...day,
        day: index + 1
      }));
      
      return {
        ...prev,
        itinerary: renumberedItinerary
      };
    });
  };

  const toggleSectionEdit = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Initialize editData with current trip content when entering edit mode
    if (!editingSections[section] && trip) {
      if (section === 'overview') {
        setEditData(prev => ({
          ...prev,
          overview_content: trip.overview_content || trip.short_desc || '',
          difficulty: trip.difficulty || 'Moderate',
          duration: trip.duration || '',
          category: trip.category || '',
          group_experience: 'Join like-minded adventurers from around the world'
        }));
      } else if (section === 'itinerary') {
        setEditData(prev => ({
          ...prev,
          itinerary: trip.itinerary || []
        }));
      } else if (section === 'inclusions') {
        setTempEditData(prev => ({
          ...prev,
          inclusions: trip.inclusions || [],
          exclusions: trip.exclusions || [],
          newInclusion: '',
          newExclusion: ''
        }));
      } else if (section === 'essentials') {
        setTempEditData(prev => ({
          ...prev,
          essentials: trip.essentials || [],
          newEssential: ''
        }));
      } else if (section === 'cancellation') {
        setEditData(prev => ({
          ...prev,
          cancellation_policy: trip.cancellation_policy || ''
        }));
      } else if (section === 'refund') {
        setEditData(prev => ({
          ...prev,
          refund_policy: trip.refund_policy || ''
        }));
      }
    }
  };

  const addToList = (listType: 'inclusions' | 'exclusions' | 'essentials') => {
    const newItemKey = `new${listType.charAt(0).toUpperCase() + listType.slice(1, -1)}` as keyof typeof tempEditData;
    const newItem = tempEditData[newItemKey] as string;
    
    if (newItem.trim()) {
      setTempEditData(prev => ({
        ...prev,
        [listType]: [...prev[listType], newItem.trim()],
        [newItemKey]: ''
      }));
    }
  };

  const removeFromList = (listType: 'inclusions' | 'exclusions' | 'essentials', index: number) => {
    setTempEditData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !trip) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "Image size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    
    try {
      // Convert image to base64 with compression
      // Process and store the uploaded image
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize image to max 800px width
            const maxWidth = 800;
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Store in localStorage with consistent key (same as create form)
      const storageKey = `trip_image_${trip.slug}`;
      localStorage.setItem(storageKey, imageUrl);
      
      // Update the UI immediately
      setTrip(prev => prev ? { ...prev, image_url: imageUrl } : null);
      
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Error", 
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Get consistent image (same logic as other pages)
  const getConsistentImage = () => {
    // Priority: localStorage uploaded image → database image_url → placeholder
    const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
    if (localImage) return localImage;
    if (trip.image_url) return trip.image_url;
    return "/hero-image.jpg"; // Placeholder
  };

  const mainImage = getConsistentImage();

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/trips')} className="hover:text-orange-600">{trip.category}</button>
            <span>/</span>
            <span className="text-gray-900">{trip.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={mainImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              onClick={() => navigate(-1)}
              className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploadingImage}
              />
              
              {/* Change Image Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                disabled={isUploadingImage}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingImage ? 'Uploading...' : 'Change Image'}
              </Button>
              {!isEditing ? (
                <Button
                  onClick={() => {
                    setIsEditing(true);
                    // Initialize tempEditData with current trip data
                    setTempEditData({
                      title: trip.title,
                      category: trip.category,
                      base_price: trip.base_price,
                      duration: trip.duration,
                      difficulty: trip.difficulty,
                      location: trip.location,
                    });
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Trip
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 backdrop-blur-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setTempEditData({});
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Trip Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="text-white mb-4 md:mb-0">
                  <Badge className="bg-orange-600 text-white mb-2">
                    {isEditing ? (
                      <Input
                        value={tempEditData.category || trip.category}
                        onChange={(e) => updateTempData('category', e.target.value)}
                        className="bg-white/20 border-white/30 text-white w-32"
                      />
                    ) : (
                      trip.category
                    )}
                  </Badge>
                  
                  {isEditing ? (
                    <Input
                      value={tempEditData.title || trip.title}
                      onChange={(e) => updateTempData('title', e.target.value)}
                      className="text-3xl md:text-5xl font-bold bg-white/20 border-white/30 text-white mb-2 w-full"
                    />
                  ) : (
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">
                      {trip.title}
                    </h1>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm md:text-base">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <Input
                          value={tempEditData.duration || trip.duration}
                          onChange={(e) => updateTempData('duration', e.target.value)}
                          className="bg-white/20 border-white/30 text-white w-32"
                        />
                      ) : (
                        trip.duration
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <select
                          value={tempEditData.difficulty || trip.difficulty}
                          onChange={(e) => updateTempData('difficulty', e.target.value)}
                          className="bg-white/20 border-white/30 text-white rounded px-2 py-1"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        >
                          <option value="Easy" style={{ backgroundColor: '#1f2937', color: 'white' }}>Easy</option>
                          <option value="Moderate" style={{ backgroundColor: '#1f2937', color: 'white' }}>Moderate</option>
                          <option value="Challenging" style={{ backgroundColor: '#1f2937', color: 'white' }}>Challenging</option>
                          <option value="Expert" style={{ backgroundColor: '#1f2937', color: 'white' }}>Expert</option>
                        </select>
                      ) : (
                        trip.difficulty || 'Moderate'
                      )}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {isEditing ? (
                        <Input
                          value={tempEditData.location || trip.location}
                          onChange={(e) => updateTempData('location', e.target.value)}
                          className="bg-white/20 border-white/30 text-white w-40"
                        />
                      ) : (
                        trip.location
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-white text-right">
                  <div className="text-3xl md:text-4xl font-bold">
                    ₹{isEditing ? (
                      <Input
                        type="number"
                        value={tempEditData.base_price || trip.base_price}
                        onChange={(e) => updateTempData('base_price', parseInt(e.target.value))}
                        className="bg-white/20 border-white/30 text-white w-32 inline-block ml-1"
                      />
                    ) : (
                      trip.base_price.toLocaleString()
                    )}
                  </div>
                  <div className="text-sm opacity-90">per person</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusion/Exclusions</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                  <TabsTrigger value="things-to-remember">Things to Remember</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Trip Overview
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('overview')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.overview ? 'Cancel Edit' : 'Edit Content'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.overview ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Trip Description</Label>
                            <Textarea
                              value={editData.overview_content || editData.short_desc || ''}
                              onChange={(e) => setEditData({...editData, overview_content: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter detailed trip description..."
                            />
                          </div>
                          <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-lg border-l-4 border-orange-500 mb-6">
                            <h3 className="text-lg font-semibold text-orange-800 mb-3">About This Adventure</h3>
                            <p className="text-gray-700 leading-relaxed">
                              {trip.overview_content || trip.short_desc || 'No description available yet.'}
                            </p>
                          </div>
                          
                          {/* Trip Highlights Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                <Star className="w-5 h-5 mr-2" />
                                Experience Level
                              </h4>
                              {editingSections.overview ? (
                                <select
                                  value={editData.difficulty || trip.difficulty || 'Moderate'}
                                  onChange={(e) => setEditData({...editData, difficulty: e.target.value})}
                                  className="w-full p-2 border rounded-md bg-white"
                                >
                                  <option value="Easy">Easy</option>
                                  <option value="Moderate">Moderate</option>
                                  <option value="Challenging">Challenging</option>
                                  <option value="Expert">Expert</option>
                                </select>
                              ) : (
                                <p className="text-blue-700">{trip.difficulty || 'Moderate'} - Suitable for adventure enthusiasts</p>
                              )}
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Duration
                              </h4>
                              {editingSections.overview ? (
                                <Input
                                  value={editData.duration || trip.duration}
                                  onChange={(e) => setEditData({...editData, duration: e.target.value})}
                                  className="bg-white"
                                  placeholder="e.g., 3 Days 2 Nights"
                                />
                              ) : (
                                <p className="text-green-700">{trip.duration} of unforgettable adventure</p>
                              )}
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Group Experience
                              </h4>
                              {editingSections.overview ? (
                                <Input
                                  value={editData.group_experience || 'Join like-minded adventurers from around the world'}
                                  onChange={(e) => setEditData({...editData, group_experience: e.target.value})}
                                  className="bg-white"
                                  placeholder="Describe the group experience"
                                />
                              ) : (
                                <p className="text-purple-700">Join like-minded adventurers from around the world</p>
                              )}
                            </div>
                            
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Category
                              </h4>
                              {editingSections.overview ? (
                                <Input
                                  value={editData.category || trip.category}
                                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                                  className="bg-white"
                                  placeholder="e.g., Trekking, Adventure, Cultural"
                                />
                              ) : (
                                <p className="text-orange-700">{trip.category} adventure experience</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                          Day-wise Itinerary
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleSectionEdit('itinerary')}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              {editingSections.itinerary ? 'Close Edit' : 'Edit'}
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.itinerary ? (
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h4 className="font-medium text-blue-800 mb-2">Itinerary Editor</h4>
                            <p className="text-blue-700 text-sm">Edit day-wise itinerary details below. Click Save Changes when done.</p>
                          </div>
                          
                          {(editData.itinerary && editData.itinerary.length > 0) || (trip.itinerary && trip.itinerary.length > 0) ? (
                            <div className="space-y-4">
                              {(editData.itinerary || trip.itinerary || []).map((day, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label>Day Number</Label>
                                      <Input
                                        type="number"
                                        value={editData.itinerary?.[index]?.day || day.day}
                                        onChange={(e) => updateItineraryDay(index, 'day', parseInt(e.target.value))}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label>Day Title</Label>
                                      <Input
                                        value={editData.itinerary?.[index]?.title || day.title}
                                        onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                        className="mt-1"
                                        placeholder="e.g., Arrival & Check-in"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mb-4">
                                    <Label>Day Description</Label>
                                    <Textarea
                                      value={editData.itinerary?.[index]?.description || day.description}
                                      onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                      rows={3}
                                      className="mt-1"
                                      placeholder="Describe the day's activities and schedule..."
                                    />
                                  </div>
                                  
                                  <div className="mb-4">
                                    <Label>Activities (one per line)</Label>
                                    <Textarea
                                      value={editData.itinerary?.[index]?.activities?.join('\n') || day.activities?.join('\n') || ''}
                                      onChange={(e) => updateItineraryDay(index, 'activities', e.target.value.split('\n').filter(a => a.trim()))}
                                      rows={3}
                                      className="mt-1"
                                      placeholder="Activity 1&#10;Activity 2&#10;Activity 3"
                                    />
                                  </div>
                                  
                                  <Button
                                    onClick={() => removeItineraryDay(index)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Day
                                  </Button>
                                </div>
                              ))}
                              
                              <Button
                                onClick={addItineraryDay}
                                variant="outline"
                                className="w-full border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Day
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Yet</h3>
                              <p className="text-gray-500 mb-4">Start by adding the first day of your trip.</p>
                              <Button
                                onClick={addItineraryDay}
                                variant="outline"
                                className="border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Day
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-4 border-t">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('itinerary')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {trip.itinerary && trip.itinerary.length > 0 ? (
                        <div className="space-y-6">
                          {trip.itinerary.map((day, index) => (
                            <div key={index} className="relative">
                              {/* Timeline connector */}
                              {index < trip.itinerary!.length - 1 && (
                                <div className="absolute left-6 top-12 w-0.5 h-full bg-orange-200 -z-10"></div>
                              )}
                              
                              <div className="flex items-start space-x-4">
                                {/* Day number circle */}
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                                  {day.day}
                                </div>
                                
                                {/* Day content */}
                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900">{day.title}</h3>
                                    {isAdmin && isEditing && (
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost">
                                          <Edit3 className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-600">
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-600 mb-4 leading-relaxed">{day.description}</p>
                                  
                                  {/* Activities */}
                                  {day.activities && day.activities.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                        <Star className="w-4 h-4 mr-2 text-orange-500" />
                                        Activities
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {day.activities.map((activity, i) => (
                                          <div key={i} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                            {activity}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Meals and Accommodation */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {day.meals && day.meals.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Meals Included:</h4>
                                        <div className="flex flex-wrap gap-1">
                                          {day.meals.map((meal, i) => (
                                            <Badge key={i} variant="secondary" className="bg-green-100 text-green-700">
                                              {meal}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {day.accommodation && (
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Accommodation:</h4>
                                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                          {day.accommodation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Available</h3>
                          <p className="text-gray-500 mb-4">The detailed day-wise itinerary will be shared upon booking confirmation.</p>
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                toggleSectionEdit('itinerary');
                                addItineraryDay();
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Itinerary
                            </Button>
                          )}
                        </div>
                      )}
                      </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inclusions Tab */}
                <TabsContent value="inclusions" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* What's Included */}
                    <Card className="border-green-200">
                      <CardHeader className="bg-green-50">
                        <CardTitle className="text-green-800 flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            What's Included
                          </div>
                          {isAdmin && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-300"
                              onClick={() => toggleSectionEdit('inclusions')}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              {editingSections.inclusions ? 'Save' : 'Edit'}
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {editingSections.inclusions ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Inclusions Editor */}
                              <div>
                                <h4 className="font-medium mb-3">Edit Inclusions</h4>
                                {tempEditData.inclusions.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 mb-2">
                                    <Input value={item} readOnly className="flex-1" />
                                    <Button 
                                      onClick={() => removeFromList('inclusions', index)} 
                                      size="sm" 
                                      variant="destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add inclusion..."
                                    value={tempEditData.newInclusion}
                                    onChange={(e) => updateTempData('newInclusion', e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        addToList('inclusions');
                                      }
                                    }}
                                  />
                                  <Button onClick={() => addToList('inclusions')} size="sm">
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Exclusions Editor */}
                              <div>
                                <h4 className="font-medium mb-3">Edit Exclusions</h4>
                                {tempEditData.exclusions.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 mb-2">
                                    <Input value={item} readOnly className="flex-1" />
                                    <Button 
                                      onClick={() => removeFromList('exclusions', index)} 
                                      size="sm" 
                                      variant="destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add exclusion..."
                                    value={tempEditData.newExclusion}
                                    onChange={(e) => updateTempData('newExclusion', e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        addToList('exclusions');
                                      }
                                    }}
                                  />
                                  <Button onClick={() => addToList('exclusions')} size="sm">
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save All Changes
                            </Button>
                          </div>
                        ) : (
                          <>
                            {(trip.inclusions && trip.inclusions.length > 0) ? (
                          <div className="space-y-3">
                            {trip.inclusions.map((item, index) => (
                              <div key={index} className="flex items-start group">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 mb-4">No inclusions listed yet</p>
                            {isAdmin && (
                              <Button 
                                onClick={() => toggleSectionEdit('inclusions')}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Inclusions
                              </Button>
                            )}
                          </div>
                        )}
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* What's Not Included */}
                  <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-800 flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 mr-2" />
                          What's Not Included
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-300"
                            onClick={() => toggleSectionEdit('inclusions')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.inclusions ? 'Save' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {editingSections.inclusions ? (
                        <div className="space-y-4">
                          {(editData.exclusions || trip.exclusions || []).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input value={item} readOnly className="flex-1" />
                              <Button 
                                onClick={() => removeListItem('exclusions', index)} 
                                size="sm" 
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add exclusion..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addListItem('exclusions', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addListItem('exclusions', input.value);
                                input.value = '';
                              }}
                              size="sm"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {(trip.exclusions && trip.exclusions.length > 0) ? (
                            <div className="space-y-3">
                              {trip.exclusions.map((item, index) => (
                                <div key={index} className="flex items-start group">
                                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-700">{item}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No exclusions listed yet</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('inclusions')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Exclusions
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                  </div>

                  {/* Important Notes */}
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-yellow-900 font-bold text-sm">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                          <p className="text-yellow-700 text-sm">
                            Please review the inclusions and exclusions carefully before booking. 
                            For any clarifications, feel free to contact our team.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Policy Tab */}
                <TabsContent value="policy" className="space-y-6">
                  
                  {/* Cancellation Policy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 mr-2 text-red-600" />
                          Cancellation Policy
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('cancellation')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.cancellation ? 'Cancel Edit' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.cancellation ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Cancellation Policy Content</Label>
                            <Textarea
                              value={editData.cancellation_policy || trip.cancellation_policy || ''}
                              onChange={(e) => setEditData({...editData, cancellation_policy: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter cancellation policy details, timelines, and fees..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('cancellation')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {trip.cancellation_policy ? (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {trip.cancellation_policy}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No cancellation policy available</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('cancellation')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Cancellation Policy
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Refund Policy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                          Refund Policy
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('refund')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections.refund ? 'Cancel Edit' : 'Edit'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections.refund ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Refund Policy Content</Label>
                            <Textarea
                              value={editData.refund_policy || trip.refund_policy || ''}
                              onChange={(e) => setEditData({...editData, refund_policy: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter refund policy details, process, and conditions..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button onClick={() => toggleSectionEdit('refund')} variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {trip.refund_policy ? (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {trip.refund_policy}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 mb-4">No refund policy available</p>
                              {isAdmin && (
                                <Button 
                                  onClick={() => toggleSectionEdit('refund')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Refund Policy
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Transportation Tab */}
                <TabsContent value="things-to-remember" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                          Things to Remember
                        </div>
                        {isAdmin && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleSectionEdit('things-to-remember')}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {editingSections['things-to-remember'] ? 'Cancel Edit' : 'Edit Things to Remember'}
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editingSections['things-to-remember'] ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Things to Remember</Label>
                            <Textarea
                              value={editData.things_to_remember || ''}
                              onChange={(e) => setEditData({...editData, things_to_remember: e.target.value})}
                              rows={6}
                              className="mt-2"
                              placeholder="Enter important things to remember for this trip..."
                            />
                          </div>
                          <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {trip.things_to_remember ? (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                              <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {trip.things_to_remember}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Important Notes Available</h3>
                              <p className="text-gray-500 mb-4">Important things to remember will be added here.</p>
                              {isAdmin && (
                                <Button variant="outline">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Things to Remember
                                </Button>
                              )}
                            </div>
                          )}

                          {/* General Tips */}
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">Pack Light</h4>
                              <p className="text-sm text-gray-600">Carry only essentials</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-green-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">Stay Hydrated</h4>
                              <p className="text-sm text-gray-600">Carry enough water</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-purple-600" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">Be Punctual</h4>
                              <p className="text-sm text-gray-600">Follow the schedule</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Trip</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      ₹{trip.base_price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      Group Trip
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-gray-500" />
                      {trip.difficulty || 'Moderate'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      Available
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate(`/booking/${tripId}`)}
                    className="w-full text-white font-semibold py-3 orange-book-button"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 space-y-1">
                    <p>✓ Instant confirmation</p>
                    <p>✓ Best price guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TripDetails;
