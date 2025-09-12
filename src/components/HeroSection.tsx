import { Button } from "@/components/ui/button";
import { ArrowRight, Edit3, Save, X, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tripService, Trip } from "@/lib/supabaseService";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [heroImage, setHeroImage] = useState<string>("/hero-image.jpg");
  
  // Upcoming adventures state
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [featuredTripIds, setFeaturedTripIds] = useState<string[]>([]);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  
  // Hero text state
  const [heroText, setHeroText] = useState({
    title: "Treking Adventure Touring",
    description: "Experience breathtaking journeys, create lasting memories, and push your boundaries with our expertly curated adventure packages across India."
  });
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempHeroText, setTempHeroText] = useState(heroText);

  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: 0.3 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.6 }
    }
  };

  // Load saved hero text and image
  useEffect(() => {
    const savedText = localStorage.getItem('heroText');
    const savedImage = localStorage.getItem('heroImage');
    const savedFeatured = localStorage.getItem('featuredTripIds');
    
    if (savedText) {
      const parsed = JSON.parse(savedText);
      setHeroText(parsed);
      setTempHeroText(parsed);
    }
    
    if (savedImage) {
      setHeroImage(savedImage);
    }

    if (savedFeatured) {
      setFeaturedTripIds(JSON.parse(savedFeatured));
    }

    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive(); // Only load active trips for customers
      setAllTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  const getFeaturedTrips = () => {
    return allTrips.filter(trip => featuredTripIds.includes(trip.id));
  };

  const saveFeaturedTrips = () => {
    localStorage.setItem('featuredTripIds', JSON.stringify(featuredTripIds));
    setIsEditingFeatured(false);
    toast({
      title: "Success",
      description: "Featured trips updated successfully",
    });
  };

  const toggleFeaturedTrip = (tripId: string) => {
    setFeaturedTripIds(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const saveHeroText = () => {
    setHeroText(tempHeroText);
    localStorage.setItem('heroText', JSON.stringify(tempHeroText));
    setIsEditingText(false);
    toast({
      title: "Success",
      description: "Hero text updated successfully",
    });
  };

  const cancelEditText = () => {
    setTempHeroText(heroText);
    setIsEditingText(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setHeroImage(imageUrl);
        localStorage.setItem('heroImage', imageUrl);
        toast({
          title: "Success",
          description: "Hero image updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
    setIsEditing(false);
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Full Width Hero Image */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full"
      >
        <div className="relative overflow-hidden">
          <img 
            src={heroImage}
            alt="Adventure Travel"
            className="w-full h-[70vh] md:h-[80vh] lg:h-screen object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="space-y-8">
                
                {/* Hero Text Section */}
                <motion.div
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center space-y-6"
                >
                  {isEditingText ? (
                    <div className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                      <Input
                        value={tempHeroText.title}
                        onChange={(e) => setTempHeroText({...tempHeroText, title: e.target.value})}
                        className="text-2xl font-bold text-center bg-white/20 border-white/30 text-white placeholder-white/70"
                        placeholder="Hero Title"
                      />
                      <Textarea
                        value={tempHeroText.description}
                        onChange={(e) => setTempHeroText({...tempHeroText, description: e.target.value})}
                        className="text-center bg-white/20 border-white/30 text-white placeholder-white/70"
                        placeholder="Hero Description"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button onClick={saveHeroText} size="sm" className="bg-green-600 hover:bg-green-700 text-white border border-green-700 shadow-lg">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button onClick={cancelEditText} size="sm" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                          Treking <span className="text-orange-500">Adventure</span> Touring
                        </h1>
                        {isAdmin && (
                          <Button
                            onClick={() => setIsEditingText(true)}
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        {heroText.description}
                      </p>
                    </>
                  )}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-adventure text-white px-10 py-4 text-xl font-semibold rounded-md hover:shadow-glow hover:scale-105 transform transition-all duration-300"
                    onClick={() => navigate('/contact')}
                  >
                    Book Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Admin Image Edit Controls */}
          {isAdmin && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit Image
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Horizontal Scrolling Upcoming Adventures Section */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Upcoming <span className="text-orange-600">Adventures</span>
            </h2>
            {isAdmin && (
              <Button
                onClick={() => setIsEditingFeatured(true)}
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 mt-4"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Featured
              </Button>
            )}
          </div>

          {getFeaturedTrips().length > 0 ? (
            <div className="relative">
              <div className="flex animate-scroll space-x-6">
                {/* Duplicate the trips for seamless loop */}
                {[...getFeaturedTrips(), ...getFeaturedTrips()].map((trip, index) => (
                  <div
                    key={`${trip.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
                      {/* Trip Image */}
                      {(() => {
                        const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
                        const imageUrl = localImage || trip.image_url;
                        
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to gradient if image fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : null;
                      })()}
                      
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-orange-600 font-semibold px-3 py-1 rounded-full text-sm">
                          {trip.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold line-clamp-2">
                          {trip.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {trip.duration && (
                          <p className="text-gray-600 text-sm">⏱️ {trip.duration}</p>
                        )}
                        {trip.short_desc && (
                          <p className="text-gray-600 text-sm line-clamp-2">{trip.short_desc}</p>
                        )}
                        {trip.base_price && (
                          <div className="text-2xl font-bold text-orange-600">
                            ₹{trip.base_price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No upcoming adventures selected</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Trips Selection Modal */}
      {isEditingFeatured && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Select Upcoming Adventures</h3>
              <div className="flex gap-2">
                <Button onClick={saveFeaturedTrips} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => setIsEditingFeatured(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    featuredTripIds.includes(trip.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => toggleFeaturedTrip(trip.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2">{trip.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{trip.category}</p>
                      {trip.base_price && (
                        <p className="text-sm font-bold text-orange-600 mt-2">₹{trip.base_price}</p>
                      )}
                    </div>
                    {featuredTripIds.includes(trip.id) && (
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {allTrips.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No trips available. Add trips from the admin panel first.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Hero Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
