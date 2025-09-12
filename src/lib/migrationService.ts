import { supabase } from '@/integrations/supabase/client';
import { getAdminTrips } from '@/lib/adminStorage';

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
  details: string[];
}

export const migrationService = {
  async migrateLocalStorageToSupabase(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migrated: 0,
      errors: [],
      details: []
    };

    try {
      // Get all trips from local storage
      const localTrips = getAdminTrips();
      result.details.push(`Found ${localTrips.length} trips in local storage`);

      if (localTrips.length === 0) {
        result.details.push('No trips to migrate');
        result.success = true;
        return result;
      }

      // Clear existing Supabase data first
      const { error: clearError } = await supabase
        .from('trips')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (clearError) {
        result.errors.push(`Failed to clear existing data: ${clearError.message}`);
      } else {
        result.details.push('Cleared existing Supabase data');
      }

      // Transform and insert each trip
      for (let i = 0; i < localTrips.length; i++) {
        const localTrip = localTrips[i];
        try {
          // Create unique slug from title with index to avoid duplicates
          const baseSlug = localTrip.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          const slug = `${baseSlug}-${i + 1}` || `trip-${Date.now()}-${i}`;

          const supabaseTrip = {
            title: localTrip.title,
            slug: slug,
            category: localTrip.category,
            base_price: localTrip.basePrice || 1000,
            duration: localTrip.duration || '1 Day',
            short_desc: localTrip.description || `Experience ${localTrip.title} - an amazing ${localTrip.category.toLowerCase()} adventure.`,
          };

          const { data, error } = await supabase
            .from('trips')
            .insert(supabaseTrip)
            .select();

          if (error) {
            console.error(`Migration error for "${localTrip.title}":`, error);
            result.errors.push(`Failed to migrate "${localTrip.title}": ${error.message}`);
          } else {
            result.migrated++;
            result.details.push(`✅ Migrated: ${localTrip.title}`);
            console.log(`✅ Migrated: ${localTrip.title}`);
          }
        } catch (err) {
          console.error(`Processing error for "${localTrip.title}":`, err);
          result.errors.push(`Error processing "${localTrip.title}": ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      result.success = result.migrated > 0;
      result.details.push(`Migration completed: ${result.migrated}/${localTrips.length} trips migrated`);

    } catch (error) {
      result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  },

  async clearSupabaseTrips(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'All trips cleared from Supabase' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async verifyMigration(): Promise<{ localCount: number; supabaseCount: number; matches: boolean }> {
    try {
      const localTrips = getAdminTrips();
      const { data: supabaseTrips, error } = await supabase
        .from('trips')
        .select('*');

      if (error) throw error;

      return {
        localCount: localTrips.length,
        supabaseCount: supabaseTrips?.length || 0,
        matches: localTrips.length === (supabaseTrips?.length || 0)
      };
    } catch (error) {
      console.error('Verification failed:', error);
      return {
        localCount: 0,
        supabaseCount: 0,
        matches: false
      };
    }
  }
};
