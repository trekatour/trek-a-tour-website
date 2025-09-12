import { supabase } from '@/integrations/supabase/client';
import { getAdminTrips } from '@/lib/adminStorage';

export const simpleMigration = {
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Connection test failed:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Supabase connection successful');
      return { success: true, data };
    } catch (err) {
      console.error('Connection error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },

  async migrateOneTrip() {
    try {
      const localTrips = getAdminTrips();
      if (localTrips.length === 0) {
        return { success: false, error: 'No local trips found' };
      }

      const firstTrip = localTrips[0];
      console.log('Migrating first trip:', firstTrip.title);

      // Create slug from title
      const slug = firstTrip.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Simple insert with required fields
      const { data, error } = await supabase
        .from('trips')
        .insert({
          title: firstTrip.title,
          category: firstTrip.category,
          slug: slug || 'default-trip',
          base_price: firstTrip.basePrice || 1000,
          duration: firstTrip.duration || '1 Day',
          short_desc: firstTrip.description || `Experience ${firstTrip.title} - an amazing ${firstTrip.category.toLowerCase()} adventure.`
        })
        .select();

      if (error) {
        console.error('Migration failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Migration successful:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Migration error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }
};
