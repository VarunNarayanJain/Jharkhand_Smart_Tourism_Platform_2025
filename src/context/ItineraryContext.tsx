import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Itinerary {
  id: string;
  title: string;
  destinations: string[];
  createdAt: string;
  updatedAt: string;
  details?: {
    duration?: string;
    budget?: string;
    preferences?: string[];
    generatedPlan?: string;
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
  
  // Current itinerary methods
  addDesiredPlace: (place: string) => void;
  removeDesiredPlace: (place: string) => void;
  clearCurrentItinerary: () => void;
  updateItineraryDetails: (details: Partial<Itinerary['details']>) => void;
  setItineraryTitle: (title: string) => void;
  
  // Saved itineraries methods
  saveCurrentItinerary: () => string; // Returns the ID of saved itinerary
  loadItinerary: (id: string) => void;
  deleteItinerary: (id: string) => void;
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
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>(() => {
    if (!user) return [];
    
    const saved = localStorage.getItem(getUserStorageKey('savedItineraries'));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved itineraries:', e);
      }
    }
    return [];
  });

  // Save current itinerary to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserStorageKey('currentItinerary'), JSON.stringify(currentItinerary));
      console.log('💾 Saved current itinerary for user:', user.id);
    }
  }, [currentItinerary, user]);

  // Save saved itineraries to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(getUserStorageKey('savedItineraries'), JSON.stringify(savedItineraries));
      console.log('💾 Saved itineraries list for user:', user.id);
    }
  }, [savedItineraries, user]);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 Loading data for user:', user.id);
      
      // Load current itinerary
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
      
      // Load saved itineraries
      const savedSaved = localStorage.getItem(getUserStorageKey('savedItineraries'));
      if (savedSaved) {
        try {
          setSavedItineraries(JSON.parse(savedSaved));
        } catch (e) {
          console.error('Error loading saved itineraries:', e);
          setSavedItineraries([]);
        }
      } else {
        setSavedItineraries([]);
      }
    } else {
      // Clear data when user logs out
      setCurrentItinerary({ desiredPlaces: [], title: '', details: {} });
      setSavedItineraries([]);
    }
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
  const saveCurrentItinerary = (): string => {
    const id = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newItinerary: Itinerary = {
      id,
      title: currentItinerary.title || `Itinerary ${savedItineraries.length + 1}`,
      destinations: currentItinerary.desiredPlaces,
      createdAt: now,
      updatedAt: now,
      details: currentItinerary.details
    };

    console.log('💾 Saving current itinerary:', newItinerary);
    setSavedItineraries(prev => [newItinerary, ...prev]);
    
    return id;
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

  const deleteItinerary = (id: string) => {
    console.log('🗑️ Deleting itinerary:', id);
    setSavedItineraries(prev => prev.filter(i => i.id !== id));
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
