/**
 * Environment variable validation and configuration
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  supabase: {
    url: string;
    publishableKey: string;
    projectId: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value === 'REGENERATE_THIS_KEY') {
    throw new Error(
      `Missing or invalid environment variable: ${name}. ` +
      `Please check your .env file and ensure all keys are properly configured.`
    );
  }
  return value;
}

export const env: EnvConfig = {
  supabase: {
    url: validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    publishableKey: validateEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
    projectId: validateEnvVar('VITE_SUPABASE_PROJECT_ID', import.meta.env.VITE_SUPABASE_PROJECT_ID),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate environment on module load
if (env.isDevelopment) {
  console.log('✅ Environment variables validated successfully');
}
