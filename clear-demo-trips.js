// Run this in browser console to clear demo trips from local storage

function clearDemoTrips() {
  try {
    // Get current trips from local storage
    const stored = localStorage.getItem('adminTrips');
    if (stored) {
      const trips = JSON.parse(stored);
      console.log('Found trips:', trips.length);
      
      // Filter out the demo trips
      const filtered = trips.filter(trip => 
        !trip.title.includes('Kayaking program') &&
        !trip.title.includes('3 Days Surf Course') &&
        !trip.title.includes('Jawhar one day trip')
      );
      
      console.log('After filtering:', filtered.length);
      
      // Save back to local storage
      localStorage.setItem('adminTrips', JSON.stringify(filtered));
      
      console.log('✅ Demo trips removed from local storage');
      console.log('Refresh the page to see changes');
    } else {
      console.log('No trips found in local storage');
    }
    
    // Also clear any other trip storage
    localStorage.removeItem('trips');
    
  } catch (error) {
    console.error('Error clearing demo trips:', error);
  }
}

// Run the function
clearDemoTrips();
