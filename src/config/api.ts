// API Configuration
// This uses Vite's environment variable system
// In development: uses localhost
// In production: uses deployed backend URL

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  CHATBOT: `${API_URL}/api/chatbot/chat`,
  ITINERARY_GENERATE: `${API_URL}/api/itinerary/generate`,
  HEALTH: `${API_URL}/health`,
};

// Supabase configuration (already using env vars in supabase.ts)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 API Configuration:', {
  apiUrl: API_URL,
  supabaseUrl: SUPABASE_URL,
  environment: import.meta.env.MODE
});
