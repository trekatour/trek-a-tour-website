import { supabase } from './client';

export interface DatabaseTrip {
  id: string;
  slug: string;
  title: string;
  category: string;
  region: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  base_price: number;
  currency: string;
  duration: string;
  short_desc: string;
  long_desc?: string;
  image_url?: string;
  features?: string[];
  highlights?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTripData {
  slug: string;
  title: string;
  category: string;
  region: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  base_price: number;
  currency?: string;
  duration: string;
  short_desc: string;
  long_desc?: string;
  image_url?: string;
  features?: string[];
  highlights?: string[];
  is_active?: boolean;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  id: string;
}

// Get all trips (admin only - includes inactive)
export const getAllTripsAdmin = async (): Promise<DatabaseTrip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get active trips only (public)
export const getActiveTrips = async (): Promise<DatabaseTrip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get trip by slug
export const getTripBySlug = async (slug: string): Promise<DatabaseTrip | null> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
};

// Create new trip (admin only)
export const createTrip = async (tripData: CreateTripData): Promise<DatabaseTrip> => {
  const { data, error } = await supabase
    .from('trips')
    .insert([tripData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update trip (admin only)
export const updateTrip = async ({ id, ...updateData }: UpdateTripData): Promise<DatabaseTrip> => {
  const { data, error } = await supabase
    .from('trips')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Toggle trip active status (admin only)
export const toggleTripStatus = async (id: string, isActive: boolean): Promise<DatabaseTrip> => {
  const { data, error } = await supabase
    .from('trips')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete trip (admin only)
export const deleteTrip = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Upload image to Supabase Storage
export const uploadTripImage = async (file: File, tripSlug: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tripSlug}-${Date.now()}.${fileExt}`;
  const filePath = `trip-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('trip-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('trip-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
