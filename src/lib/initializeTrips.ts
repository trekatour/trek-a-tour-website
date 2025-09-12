import { upcomingTrips, weekendGetaways, himalayanTreks, backpackingTrips, internationalTrips } from "@/data/trips";
import { AdminTrip, getAdminTrips, saveAdminTrips } from "./adminStorage";

export const initializeTripsFromData = (): void => {
  const existingTrips = getAdminTrips();
  
  // Only initialize if no trips exist in admin storage
  if (existingTrips.length > 0) return;

  const allTrips = [
    ...upcomingTrips,
    ...weekendGetaways, 
    ...himalayanTreks,
    ...backpackingTrips,
    ...internationalTrips
  ];

  const adminTrips: AdminTrip[] = allTrips.map((trip, index) => ({
    id: `trip_${index + 1}`,
    slug: trip.slug,
    title: trip.title,
    category: trip.category,
    region: trip.region,
    difficulty: trip.difficulty,
    basePrice: trip.basePrice,
    currency: trip.currency,
    duration: trip.duration,
    shortDesc: trip.shortDesc,
    image: trip.image || "https://logout.world/api/placeholder/400/300",
    features: trip.features || [],
    highlights: trip.highlights || [],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  saveAdminTrips(adminTrips);
};
