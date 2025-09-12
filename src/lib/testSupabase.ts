import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('Storage test failed:', storageError);
      return { success: false, error: storageError.message };
    }
    
    console.log('Storage test successful:', buckets);
    
    return { success: true, message: 'Supabase connection working!' };
  } catch (error) {
    console.error('Connection test error:', error);
    return { success: false, error: String(error) };
  }
};
