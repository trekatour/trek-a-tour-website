import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TripSection from "@/components/TripSection";
import { tripService, Trip } from "@/lib/supabaseService";

const UpcomingTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive(); // Only load active trips
      // Show all active trips as upcoming
      setTrips(data);
      console.log(`📅 Upcoming page loaded ${data.length} active trips from Supabase`);
    } catch (error) {
      console.error('Failed to load upcoming trips:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading upcoming trips from Supabase...</p>
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
          title={<>Upcoming <span className="text-orange-600">Trips</span></>}
          subtitle="Join us on these exciting adventures coming up soon - limited spots available!"
          trips={trips}
          viewAllPath="/trips"
          maxDisplay={50}
          onTripDeleted={loadTrips}
        />
      </motion.div>
    </div>
  );
};

export default UpcomingTrips;
