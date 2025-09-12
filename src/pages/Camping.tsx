import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tent, MapPin, Users, Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import { tripService, Trip } from "@/lib/supabaseService";

const Camping = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampingTrips();
  }, []);

  const loadCampingTrips = async () => {
    try {
      setLoading(true);
      const allTrips = await tripService.getActive(); // Only load active trips
      // Filter for camping trips when you add them
      const campingTrips = allTrips.filter(trip => 
        trip.category?.toLowerCase().includes('camping')
      );
      setTrips(campingTrips);
    } catch (error) {
      console.error('Failed to load camping trips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Camping Adventures | Trek A Tour"
        description="Discover amazing camping experiences and outdoor adventures. Book your perfect camping trip today."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Tent className="w-12 h-12 mr-4" />
                  <h1 className="text-4xl md:text-6xl font-bold">
                    Camping <span className="text-orange-600">Adventures</span>
                  </h1>
                </div>
                <p className="text-xl md:text-2xl opacity-90">
                  Experience the great outdoors with our camping <span className="text-orange-600">packages</span>
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Camping <span className="text-orange-600">Packages</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ready for your camping adventures to be added here
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : trips.length > 0 ? (
                // Display camping trips when available
                trips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {(() => {
                        const localImage = localStorage.getItem(`trip_image_${trip.slug}`);
                        const imageUrl = localImage || trip.image_url || trip.hero_images?.[0];
                        
                        return imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={trip.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-camping.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <Tent className="w-16 h-16 text-white/50" />
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {trip.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {trip.short_desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{trip.base_price?.toLocaleString()}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {trip.duration}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Empty state - ready for packages to be added
                <div className="col-span-full text-center py-16">
                  <Tent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Camping Packages Yet
                  </h3>
                  <p className="text-gray-600">
                    Camping packages will appear here when added to the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Camping;
