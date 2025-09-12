// Copy and paste this in your browser console (F12) while on your website

function removeSpecificTrips() {
  console.log('🔍 Removing specific trips: trip_2, trip_3, trip_24');
  
  // Remove from adminTrips
  const adminTrips = localStorage.getItem('adminTrips');
  if (adminTrips) {
    const trips = JSON.parse(adminTrips);
    console.log('Found', trips.length, 'trips in adminTrips');
    
    const filtered = trips.filter(trip => 
      trip.id !== 'trip_2' && 
      trip.id !== 'trip_3' && 
      trip.id !== 'trip_24' &&
      trip.id !== '2' &&
      trip.id !== '3' &&
      trip.id !== '24'
    );
    
    localStorage.setItem('adminTrips', JSON.stringify(filtered));
    console.log('✅ Filtered to', filtered.length, 'trips in adminTrips');
  }
  
  // Remove from trips (if exists)
  const trips = localStorage.getItem('trips');
  if (trips) {
    const tripData = JSON.parse(trips);
    console.log('Found', tripData.length, 'trips in trips storage');
    
    const filtered = tripData.filter(trip => 
      trip.id !== 'trip_2' && 
      trip.id !== 'trip_3' && 
      trip.id !== 'trip_24' &&
      trip.id !== '2' &&
      trip.id !== '3' &&
      trip.id !== '24'
    );
    
    localStorage.setItem('trips', JSON.stringify(filtered));
    console.log('✅ Filtered to', filtered.length, 'trips in trips storage');
  }
  
  // Also clear any cached data
  localStorage.removeItem('trip_2');
  localStorage.removeItem('trip_3');
  localStorage.removeItem('trip_24');
  
  console.log('✅ Specific trips removed! Refresh the page to see changes.');
}

// Run the function
removeSpecificTrips();
