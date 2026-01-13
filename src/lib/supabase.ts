import { createClient } from '@supabase/supabase-js'

// Vite-specific environment variable access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcwdmwswtzomibvenhvd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2Rtd3N3dHpvbWlidmVuaHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTI3NzMsImV4cCI6MjA3NTI2ODc3M30.4vLVbq-w4ay9GrbS3KKanNylrqTPzyLb9vHFQLSPLiA'

console.log('🔍 Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey
});

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types for TypeScript
export interface Destination {
  id: number;
  name: string;
  tagline: string;
  story: string;
  image: string;
  best_season: string;
  distance: string;
  location: string;
  activities: string[];
  highlights: string[];
  video_url?: string;
  weather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences: string[];
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  days: number; // Required field - number of days in the trip
  start_city?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration?: string | null;
  budget?: string | null;
  budget_range?: string | null;
  group_type?: string | null;
  destinations?: string[] | null; // Text array of destination names
  destination_ids?: number[] | null; // Integer array of destination IDs
  interests?: string[] | null;
  activities?: string[] | null;
  generated_plan?: any | null; // JSONB field for full AI-generated plan
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceItem {
  id: number;
  title: string;
  artisan_name: string;
  artisan_location: string;
  price: string;
  image: string;
  story: string;
  rating: number;
  category: string;
  verified: boolean;
  badge?: string;
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CulturalEvent {
  id: number;
  name: string;
  date: string;
  location: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Guide {
  id: number;
  name: string;
  image?: string;
  location: string;
  rating: number;
  specialties: string[];
  verified: boolean;
  price_per_day?: string;
  description?: string;
  contact_info?: string;
  languages: string[];
  experience_years: number;
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  destination_id: number;
  cuisine?: string;
  rating: number;
  price_range?: string;
  specialties: string[];
  image?: string;
  address?: string;
  phone?: string;
  hours?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  destination_id: number;
  user_id?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at?: string;
  updated_at?: string;
}