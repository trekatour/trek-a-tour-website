import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TripSection from "@/components/TripSection";
import { tripService, Trip } from "@/lib/supabaseService";

const BackpackingTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive(); // Only load active trips
      // Filter for backpacking trips
      const backpackingTrips = data.filter(trip => 
        trip.category.toLowerCase().includes('backpacking')
      );
      setTrips(backpackingTrips);
      console.log(`🎒 Backpacking page loaded ${backpackingTrips.length} active trips from Supabase`);
    } catch (error) {
      console.error('Failed to load backpacking trips:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading backpacking adventures from Supabase...</p>
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
          title={<>Backpacking <span className="text-orange-600">Adventures</span></>}
          subtitle="Budget-friendly journeys for the adventurous soul - explore more, spend less"
          trips={trips}
          viewAllPath="/backpacking"
          maxDisplay={50}
          onTripDeleted={loadTrips}
        />
      </motion.div>
    </div>
  );
};

export default BackpackingTrips;
