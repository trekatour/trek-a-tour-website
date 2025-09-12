import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  tripId?: string;
  packageName?: string;
  message?: string;
}

export const useBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = async (data: BookingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('bookings')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          trip_id: data.tripId,
          package_name: data.packageName,
          message: data.message,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (supabaseError) {
        throw supabaseError;
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBooking,
    isSubmitting,
    error
  };
};
