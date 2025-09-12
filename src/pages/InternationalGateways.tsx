import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Users, Calendar, Plane } from "lucide-react";
import SEO from "@/components/SEO";
import { tripService, Trip } from "@/lib/supabaseService";

const InternationalGateways = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternationalTrips();
  }, []);

  const loadInternationalTrips = async () => {
    try {
      setLoading(true);
      const allTrips = await tripService.getActive(); // Only load active trips
      // Filter for international trips when you add them
      const internationalTrips = allTrips.filter(trip => 
        trip.category?.toLowerCase().includes('international')
      );
      setTrips(internationalTrips);
    } catch (error) {
      console.error('Failed to load international trips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="International Gateways | Trek A Tour"
        description="Explore amazing international destinations and global adventures. Book your perfect international trip today."
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Globe className="w-12 h-12 mr-4" />
                  <h1 className="text-4xl md:text-6xl font-bold">
                    International Gateways
                  </h1>
                </div>
                <p className="text-xl md:text-2xl opacity-90">
                  Discover amazing destinations around the world
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
                International Packages
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ready for your international adventures to be added here
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
                // Display international trips when available
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
                              target.src = "/placeholder-international.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                            <Globe className="w-16 h-16 text-white/50" />
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
                        <span className="text-2xl font-bold text-blue-600">
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
                  <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No International Packages Yet
                  </h3>
                  <p className="text-gray-600">
                    International packages will appear here when added to the system.
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

export default InternationalGateways;
