import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DatabaseManager = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log(`Deleted: ${title}`);
      loadTrips(); // Refresh list
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const clearAllTrips = async () => {
    if (!confirm('Delete ALL trips from database? This cannot be undone!')) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) throw error;
      
      console.log('All trips deleted');
      loadTrips();
    } catch (error) {
      console.error('Error clearing trips:', error);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Trip Manager</CardTitle>
        <div className="flex gap-2">
          <Button onClick={loadTrips} variant="outline">
            Refresh
          </Button>
          <Button onClick={clearAllTrips} variant="destructive">
            Clear All Trips
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            <p><strong>Found {trips.length} trips in database:</strong></p>
            {trips.map((trip) => (
              <div key={trip.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <strong>{trip.title}</strong>
                  <span className="text-sm text-gray-500 ml-2">({trip.category})</span>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deleteTrip(trip.id, trip.title)}
                >
                  Delete
                </Button>
              </div>
            ))}
            {trips.length === 0 && (
              <p className="text-gray-500">No trips in database</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseManager;
