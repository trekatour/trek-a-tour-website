import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TripSection from "@/components/TripSection";
import { tripService, Trip } from "@/lib/supabaseService";

const HimalayanTreks = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive(); // Only load active trips
      // Filter for Himalayan treks
      const himalayanTrips = data.filter(trip => 
        trip.category.toLowerCase().includes('himalayan') ||
        trip.category.toLowerCase().includes('trek')
      );
      setTrips(himalayanTrips);
      console.log(`🏔️ Himalayan page loaded ${himalayanTrips.length} active trips from Supabase`);
    } catch (error) {
      console.error('Failed to load Himalayan treks:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Himalayan treks from Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TripSection
          title="Himalayan Treks"
          subtitle="Conquer the world's highest peaks with expert guides and unforgettable experiences"
          trips={trips}
          viewAllPath="/himalayan"
          maxDisplay={50}
          onTripDeleted={loadTrips}
        />
      </motion.div>
    </div>
  );
};

export default HimalayanTreks;
