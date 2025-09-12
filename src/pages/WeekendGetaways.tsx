import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TripSection from "@/components/TripSection";
import { tripService, Trip } from "@/lib/supabaseService";

const WeekendGetaways = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripService.getActive(); // Only load active trips
      // Filter for weekend trips
      const weekendTrips = data.filter(trip => 
        trip.category.toLowerCase().includes('weekend') ||
        trip.category.toLowerCase().includes('getaway')
      );
      setTrips(weekendTrips);
      console.log(`🏖️ Weekend page loaded ${weekendTrips.length} active trips from Supabase`);
    } catch (error) {
      console.error('Failed to load weekend getaways:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading weekend getaways from Supabase...</p>
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
          title={<>Weekend <span className="text-orange-600">Gateaways</span></>}
          subtitle="Perfect short escapes for busy professionals - recharge and reconnect with nature"
          trips={trips}
          viewAllPath="/weekend"
          maxDisplay={50}
          onTripDeleted={loadTrips}
        />
      </motion.div>
    </div>
  );
};

export default WeekendGetaways;
