import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { itineraryService } from '../lib/database';
import type { Itinerary as SupabaseItinerary } from '../lib/supabase';

interface Itinerary {
  id: string;
  title: string;
  destinations: string[];
  generatedPlan?: any; // Store the full AI-generated itinerary
  createdAt: string;
  updatedAt: string;
  details?: {
    duration?: string;
    budget?: string;
    preferences?: string[];
    startCity?: string;
    dates?: string;
    groupType?: string;
  };
}

interface ItineraryContextType {
  // Current itinerary being planned
  currentItinerary: {
    desiredPlaces: string[];
    title: string;
    details: Partial<Itinerary['details']>;
  };
  
  // Saved itineraries
  savedItineraries: Itinerary[];
  loading: boolean; // Loading state for Supabase operations
  
  // Current itinerary methods
  addDesiredPlace: (place: string) => void;
  removeDesiredPlace: (place: string) => void;
  clearCurrentItinerary: () => void;
  updateItineraryDetails: (details: Partial<Itinerary['details']>) => void;
  setItineraryTitle: (title: string) => void;
  
  // Saved itineraries methods
  saveCurrentItinerary: (generatedPlan?: any) => Promise<string>; // Updated to async
  loadItinerary: (id: string) => void;
  deleteItinerary: (id: string) => Promise<void>; // Updated to async
  updateSavedItinerary: (id: string, updates: Partial<Itinerary>) => void;
  
  // User-specific cleanup
  clearAllUserData: () => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
};

interface ItineraryProviderProps {
  children: ReactNode;
}

export const ItineraryProvider: React.FC<ItineraryProviderProps> = ({ children }) => {
  const { user, registerCleanupFunction, unregisterCleanupFunction } = useAuth();
  
  // Generate storage keys based on user ID
  const getUserStorageKey = (key: string) => {
    return user ? `${key}_user_${user.id}` : `${key}_guest`;
  };

  // Current itinerary state
  const [currentItinerary, setCurrentItinerary] = useState<{
    desiredPlaces: string[];
    title: string;
    details: Partial<Itinerary['details']>;
  }>(() => {
    if (!user) return { desiredPlaces: [], title: '', details: {} };
    
    const saved = localStorage.getItem(getUserStorageKey('currentItinerary'));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current itinerary:', e);
      }
    }
    return { desiredPlaces: [], title: '', details: {} };
  });

  // Saved itineraries state
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved itineraries from Supabase when user logs in
  useEffect(() => {
    const loadItineraries = async () => {
      if (!user) {
        setSavedItineraries([]);
        return;
      }

      try {
        setLoading(true);
        console.log('🔄 Loading itineraries from Supabase for user:', user.id);
        const data = await itineraryService.getByUser(user.id);
        
        // Transform Supabase data to local format
        const transformed: Itinerary[] = data.map((item: SupabaseItinerary) => ({
          id: item.id,
          title: item.title,
          destinations: item.destinations || [],
          generatedPlan: item.generated_plan,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
          details: {
            duration: item.duration || undefined,
            budget: item.budget || undefined,
            preferences: item.interests || undefined,
            startCity: item.start_city || undefined,
            dates: item.start_date ? `${item.start_date} to ${item.end_date}` : undefined,
            groupType: item.group_type || undefined
          }
        }));
        
        setSavedItineraries(transformed);
        
        // Also cache in localStorage for offline access
        localStorage.setItem(getUserStorageKey('savedItineraries'), JSON.stringify(transformed));
        console.log('✅ Loaded', transformed.length, 'itineraries from Supabase');
      } catch (error) {
        console.error('❌ Error loading itineraries from Supabase:', error);
        
        // Fallback to localStorage if Supabase fails
        const cached = localStorage.getItem(getUserStorageKey('savedItineraries'));
        if (cached) {
          try {
            setSavedItineraries(JSON.parse(cached));
            console.log('⚠️ Using cached itineraries from localStorage');
          } catch (e) {
            console.error('Error parsing cached itineraries:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadItineraries();
  }, [user]);

  // Save current itinerary to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserStorageKey('currentItinerary'), JSON.stringify(currentItinerary));
      console.log('💾 Saved current itinerary for user:', user.id);
    }
  }, [currentItinerary, user]);

  // Load current itinerary from localStorage when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 Loading current itinerary for user:', user.id);
      
      const currentSaved = localStorage.getItem(getUserStorageKey('currentItinerary'));
      if (currentSaved) {
        try {
          setCurrentItinerary(JSON.parse(currentSaved));
        } catch (e) {
          console.error('Error loading current itinerary:', e);
          setCurrentItinerary({ desiredPlaces: [], title: '', details: {} });
        }
      } else {
        setCurrentItinerary({ desiredPlaces: [], title: '', details: {} });
      }
    }
    // ✅ Don't clear when logged out - just stop displaying
  }, [user]);

  // Current itinerary methods
  const addDesiredPlace = (place: string) => {
    console.log('📍 Adding place:', place);
    setCurrentItinerary(prev => {
      if (!prev.desiredPlaces.includes(place)) {
        return {
          ...prev,
          desiredPlaces: [...prev.desiredPlaces, place]
        };
      }
      return prev;
    });
  };

  const removeDesiredPlace = (place: string) => {
    console.log('🗑️ Removing place:', place);
    setCurrentItinerary(prev => ({
      ...prev,
      desiredPlaces: prev.desiredPlaces.filter(p => p !== place)
    }));
  };

  const clearCurrentItinerary = () => {
    console.log('🧹 Clearing current itinerary');
    setCurrentItinerary({ desiredPlaces: [], title: '', details: {} });
  };

  const updateItineraryDetails = (details: Partial<Itinerary['details']>) => {
    console.log('📝 Updating itinerary details:', details);
    setCurrentItinerary(prev => ({
      ...prev,
      details: { ...prev.details, ...details }
    }));
  };

  const setItineraryTitle = (title: string) => {
    console.log('🏷️ Setting itinerary title:', title);
    setCurrentItinerary(prev => ({
      ...prev,
      title
    }));
  };

  // Saved itineraries methods
  const saveCurrentItinerary = async (generatedPlan?: any): Promise<string> => {
    if (!user) {
      alert('Please log in to save itineraries');
      throw new Error('User not authenticated');
    }

    try {
      // Extract duration days from string like "3 Days / 2 Nights"
      const extractDays = (duration?: string): number => {
        if (!duration) return 1;
        const match = duration.match(/(\d+)\s*[Dd]ay/);
        return match ? parseInt(match[1]) : 1;
      };

      // Prepare data for Supabase
      const supabaseData: Omit<SupabaseItinerary, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        title: currentItinerary.title || `Itinerary ${savedItineraries.length + 1}`,
        days: extractDays(currentItinerary.details?.duration), // Required field
        destinations: currentItinerary.desiredPlaces,
        generated_plan: generatedPlan || null,
        duration: currentItinerary.details?.duration || null,
        start_city: currentItinerary.details?.startCity || null,
        interests: currentItinerary.details?.preferences || null,
        group_type: currentItinerary.details?.groupType || null,
        is_public: false
      };

      // Save to Supabase
      console.log('💾 Saving itinerary to Supabase:', supabaseData);
      const savedToSupabase = await itineraryService.save(supabaseData);

      // Transform back to local format
      const newItinerary: Itinerary = {
        id: savedToSupabase.id,
        title: savedToSupabase.title,
        destinations: savedToSupabase.destinations || [],
        generatedPlan: savedToSupabase.generated_plan,
        createdAt: savedToSupabase.created_at || new Date().toISOString(),
        updatedAt: savedToSupabase.updated_at || new Date().toISOString(),
        details: {
          duration: savedToSupabase.duration || undefined,
          startCity: savedToSupabase.start_city || undefined,
          preferences: savedToSupabase.interests || undefined,
          groupType: savedToSupabase.group_type || undefined
        }
      };

      console.log('✅ Itinerary saved with ID:', newItinerary.id);
      
      // Update local state
      setSavedItineraries(prev => [newItinerary, ...prev]);
      
      // Cache in localStorage
      localStorage.setItem(
        getUserStorageKey('savedItineraries'), 
        JSON.stringify([newItinerary, ...savedItineraries])
      );

      return newItinerary.id;
    } catch (error) {
      console.error('❌ Error saving itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
      throw error;
    }
  };

  const loadItinerary = (id: string) => {
    const itinerary = savedItineraries.find(i => i.id === id);
    if (itinerary) {
      console.log('📂 Loading itinerary:', itinerary);
      setCurrentItinerary({
        desiredPlaces: itinerary.destinations,
        title: itinerary.title,
        details: itinerary.details || {}
      });
    }
  };

  const deleteItinerary = async (id: string) => {
    if (!user) return;

    try {
      console.log('🗑️ Deleting itinerary from Supabase:', id);
      await itineraryService.delete(id);
      
      // Update local state
      setSavedItineraries(prev => prev.filter(i => i.id !== id));
      
      // Update localStorage cache
      const updated = savedItineraries.filter(i => i.id !== id);
      localStorage.setItem(getUserStorageKey('savedItineraries'), JSON.stringify(updated));
      
      console.log('✅ Itinerary deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting itinerary:', error);
      alert('Failed to delete itinerary. Please try again.');
    }
  };

  const updateSavedItinerary = (id: string, updates: Partial<Itinerary>) => {
    console.log('✏️ Updating saved itinerary:', id, updates);
    setSavedItineraries(prev => prev.map(itinerary => 
      itinerary.id === id 
        ? { ...itinerary, ...updates, updatedAt: new Date().toISOString() }
        : itinerary
    ));
  };

  const clearAllUserData = () => {
    console.log('🧹 Clearing all user itinerary data');
    if (user) {
      localStorage.removeItem(getUserStorageKey('currentItinerary'));
      localStorage.removeItem(getUserStorageKey('savedItineraries'));
    }
    setCurrentItinerary({ desiredPlaces: [], title: '', details: {} });
    setSavedItineraries([]);
  };

  // Register cleanup function with AuthContext
  useEffect(() => {
    if (user) {
      registerCleanupFunction(clearAllUserData);
      return () => {
        unregisterCleanupFunction(clearAllUserData);
      };
    }
  }, [user, registerCleanupFunction, unregisterCleanupFunction]);

  const value = {
    currentItinerary,
    savedItineraries,
    loading,
    addDesiredPlace,
    removeDesiredPlace,
    clearCurrentItinerary,
    updateItineraryDetails,
    setItineraryTitle,
    saveCurrentItinerary,
    loadItinerary,
    deleteItinerary,
    updateSavedItinerary,
    clearAllUserData,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};
