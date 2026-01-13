import { supabase } from './supabase';
import type { Destination, Itinerary, MarketplaceItem, CulturalEvent, Guide, Restaurant, Review } from './supabase';

// =============================================
// DESTINATIONS SERVICE
// =============================================
export const destinationsService = {
  // Get all destinations
  async getAll(): Promise<Destination[]> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },

  // Get destination by ID
  async getById(id: number): Promise<Destination | null> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Get featured destinations (first 5)
  async getFeatured(): Promise<Destination[]> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .limit(5)
      .order('id');
    
    if (error) throw error;
    return data || [];
  },

  // Search destinations
  async search(query: string): Promise<Destination[]> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.%${query}%, tagline.ilike.%${query}%, story.ilike.%${query}%`);
    
    if (error) throw error;
    return data || [];
  }
};

// =============================================
// MARKETPLACE SERVICE
// =============================================
export const marketplaceService = {
  // Get all items
  async getAll(): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get items by category
  async getByCategory(category: string): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('category', category)
      .eq('in_stock', true)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get verified items only
  async getVerified(): Promise<MarketplaceItem[]> {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('verified', true)
      .eq('in_stock', true)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// =============================================
// GUIDES SERVICE
// =============================================
export const guidesService = {
  // Get all guides
  async getAll(): Promise<Guide[]> {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get verified guides
  async getVerified(): Promise<Guide[]> {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('verified', true)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get guides by location
  async getByLocation(location: string): Promise<Guide[]> {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .ilike('location', `%${location}%`)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// =============================================
// RESTAURANTS SERVICE
// =============================================
export const restaurantsService = {
  // Get restaurants by destination ID
  async getByDestination(destinationId: number): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('destination_id', destinationId)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all restaurants
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get restaurant by ID
  async getById(id: number): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
};

// =============================================
// CULTURAL EVENTS SERVICE
// =============================================
export const eventsService = {
  // Get upcoming events
  async getUpcoming(): Promise<CulturalEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('cultural_events')
      .select('*')
      .gte('date', today)
      .order('date');
    
    if (error) throw error;
    return data || [];
  },

  // Get all events
  async getAll(): Promise<CulturalEvent[]> {
    const { data, error } = await supabase
      .from('cultural_events')
      .select('*')
      .order('date');
    
    if (error) throw error;
    return data || [];
  }
};

// =============================================
// REVIEWS SERVICE
// =============================================
export const reviewsService = {
  // Get reviews for a destination
  async getByDestination(destinationId: number): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('destination_id', destinationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add a new review
  async add(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =============================================
// ITINERARY SERVICE
// =============================================
export const itineraryService = {
  // Get user's itineraries
  async getByUser(userId: string): Promise<Itinerary[]> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching itineraries:', error);
      throw error;
    }
    console.log('✅ Loaded itineraries from Supabase:', data?.length || 0);
    return data || [];
  },

  // Get a single itinerary by ID
  async getById(id: string): Promise<Itinerary | null> {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('❌ Error fetching itinerary:', error);
      throw error;
    }
    return data;
  },

  // Save a new itinerary
  async save(itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>): Promise<Itinerary> {
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        ...itinerary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating itinerary:', error);
      throw error;
    }
    console.log('✅ Itinerary saved to Supabase:', data);
    return data;
  },

  // Update an existing itinerary
  async update(id: string, updates: Partial<Itinerary>): Promise<Itinerary> {
    const { data, error } = await supabase
      .from('itineraries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating itinerary:', error);
      throw error;
    }
    console.log('✅ Itinerary updated in Supabase:', data);
    return data;
  },

  // Delete an itinerary
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Error deleting itinerary:', error);
      throw error;
    }
    console.log('✅ Itinerary deleted from Supabase:', id);
  }
};

// =============================================
// ANALYTICS SERVICE
// =============================================
export const analyticsService = {
  // Get platform analytics
  async getPlatformStats() {
    const [destinationsCount, guidesCount, marketplaceCount, eventsCount] = await Promise.all([
      supabase.from('destinations').select('*', { count: 'exact', head: true }),
      supabase.from('guides').select('*', { count: 'exact', head: true }),
      supabase.from('marketplace_items').select('*', { count: 'exact', head: true }),
      supabase.from('cultural_events').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalDestinations: destinationsCount.count || 0,
      totalGuides: guidesCount.count || 0,
      totalMarketplaceItems: marketplaceCount.count || 0,
      totalEvents: eventsCount.count || 0
    };
  },

  // Get destination analytics
  async getDestinationAnalytics() {
    const { data, error } = await supabase
      .from('analytics')
      .select(`
        *,
        destinations:destination_id (
          name
        )
      `)
      .order('visits_count', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data || [];
  }
};