import { supabase } from '@/integrations/supabase/client';

// Types
export interface Trip {
  id: string;
  title: string;
  slug: string;
  category: string;
  base_price: number;
  duration: string;
  short_desc: string;
  difficulty?: string;
  image_url?: string;
  hero_images?: string[];
  overview_content?: string;
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  things_to_carry?: string[];
  essentials?: string[];
  transportation?: string;
  cancellation_policy?: string;
  faqs?: FAQ[];
  seo_meta?: SEOMeta;
  available_dates?: string[]; // Array of available dates
  is_active?: boolean; // Visibility toggle
  created_at?: string;
  updated_at?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string[];
  accommodation?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface Booking {
  id?: string;
  trip_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date?: string;
  number_of_people?: number;
  special_requirements?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
  status?: string;
}

export interface Review {
  id?: string;
  trip_id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  review_title?: string;
  review_text?: string;
  verified?: boolean;
  status?: string;
}

// Trip Service
export const tripService = {
  async getById(id: string): Promise<Trip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trip by ID:', error);
      return null;
    }
  },

  async getAll(): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
  },

  async getActive(): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter by localStorage visibility until database is updated
      const activeTrips = (data || []).filter(trip => {
        const storedActive = localStorage.getItem(`trip_active_${trip.slug}`);
        const isActive = storedActive ? JSON.parse(storedActive) : true; // Default to active
        return isActive;
      });
      
      // Enhance with localStorage data
      return activeTrips.map(trip => {
        const storedDates = localStorage.getItem(`trip_dates_${trip.slug}`);
        return {
          ...trip,
          available_dates: storedDates ? JSON.parse(storedDates) : [],
          is_active: true // Already filtered above
        };
      });
    } catch (error) {
      console.error('Error fetching active trips:', error);
      return [];
    }
  },

  async getByCategory(category: string): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .ilike('category', `%${category}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trips by category:', error);
      return [];
    }
  },

  async getFeatured(): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured trips:', error);
      return [];
    }
  },

  async create(trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Promise<Trip | null> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([trip])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Trip>): Promise<Trip | null> {
    try {
      console.log('Updating trip with data:', updates);
      
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating trip:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  }
};

// Booking Service
export const bookingService = {
  async create(booking: Booking): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async getAll(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            title,
            category,
            location
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  async getByTripId(tripId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings by trip:', error);
      return [];
    }
  }
};

// Contact Service
export const contactService = {
  async create(contact: Contact): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      return null;
    }
  },

  async getAll(): Promise<Contact[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }
};

// Review Service
export const reviewService = {
  async create(review: Review): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  },

  async getByTripId(tripId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('trip_id', tripId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardStats() {
    try {
      const [tripsResult, bookingsResult, contactsResult] = await Promise.all([
        supabase.from('trips').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('contacts').select('id', { count: 'exact' })
      ]);

      return {
        totalTrips: tripsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalContacts: contactsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalTrips: 0,
        totalBookings: 0,
        totalContacts: 0
      };
    }
  },

  async clearAll() {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      return { error };
    } catch (error) {
      console.error('Error clearing all trips:', error);
      return { error };
    }
  }
};
