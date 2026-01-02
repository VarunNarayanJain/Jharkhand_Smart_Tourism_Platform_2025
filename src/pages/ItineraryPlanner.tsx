import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Clock, Users, Download, Sparkles, Plus, X, Save, History, Trash2, Edit3 } from 'lucide-react';
import { useItinerary } from '../context/ItineraryContext';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

export default function ItineraryPlanner() {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'planner' | 'history'>('planner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [formData, setFormData] = useState({
    startCity: '',
    dates: '',
    duration: '',
    interests: [] as string[],
    groupType: '',
    desiredPlaces: [] as string[]
  });
  const [newPlace, setNewPlace] = useState('');
  
  // Get all context methods and data
  const { 
    currentItinerary, 
    savedItineraries, 
    addDesiredPlace, 
    removeDesiredPlace, 
    updateItineraryDetails,
    setItineraryTitle,
    saveCurrentItinerary,
    loadItinerary,
    deleteItinerary,
    clearCurrentItinerary
  } = useItinerary();

  // Auto-populate from QuickSearchBar data
  useEffect(() => {
    if (location.state) {
      const { tripType, duration } = location.state;
      setFormData(prev => ({
        ...prev,
        duration: duration || '',
        groupType: tripType || '',
      }));
      
      // Update context with form details
      updateItineraryDetails({
        duration: duration || '',
        preferences: tripType ? [tripType] : []
      });
      
      // If we have data from quick search, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state, updateItineraryDetails]);

  // Debug logging
  console.log('ItineraryPlanner: Component rendered');
  console.log('ItineraryPlanner: Current itinerary from context:', currentItinerary);

  // Sync local form data with global context
  useEffect(() => {
    console.log('ItineraryPlanner: Syncing form data with context');
    setFormData(prev => ({
      ...prev,
      desiredPlaces: currentItinerary.desiredPlaces
    }));
  }, [currentItinerary.desiredPlaces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Log the form data including desired places for debugging
    console.log('Form data submitted:', formData);
    
    try {
      // Call the backend API to generate itinerary
      const response = await fetch(API_ENDPOINTS.ITINERARY_GENERATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startCity: formData.startCity,
          dates: formData.dates,
          duration: formData.duration,
          interests: formData.interests,
          groupType: formData.groupType,
          desiredPlaces: formData.desiredPlaces
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Itinerary generated successfully:', data);
        // Store the AI-generated itinerary
        setGeneratedItinerary(data.itinerary);
        setShowResults(true);
      } else {
        throw new Error(data.message || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('❌ Error generating itinerary:', error);
      alert(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const addPlace = () => {
    if (newPlace.trim() && !currentItinerary.desiredPlaces.includes(newPlace.trim())) {
      addDesiredPlace(newPlace.trim());
      setNewPlace('');
    }
  };

  const removePlace = (placeToRemove: string) => {
    removeDesiredPlace(placeToRemove);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlace();
    }
  };

  const sampleItinerary = [
    {
      day: 1,
      location: 'Ranchi to Netarhat',
      image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      activities: [
        { time: '6:00 AM', activity: 'Departure from Ranchi', icon: MapPin },
        { time: '10:30 AM', activity: 'Reach Netarhat, check-in hotel', icon: MapPin },
        { time: '2:00 PM', activity: 'Lunch at local dhaba', icon: Users },
        { time: '4:00 PM', activity: 'Explore Netarhat Hills', icon: MapPin },
        { time: '6:30 PM', activity: 'Watch sunset at sunset point', icon: Clock }
      ],
      recommendation: 'Netarhat offers the best sunrise views in Jharkhand. The cool climate and pine forests make it perfect for nature lovers.'
    },
    {
      day: 2,
      location: 'Netarhat Exploration',
      image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      activities: [
        { time: '5:00 AM', activity: 'Sunrise viewing at Magnolia Point', icon: Clock },
        { time: '8:00 AM', activity: 'Breakfast at hotel', icon: Users },
        { time: '10:00 AM', activity: 'Visit Netarhat Dam', icon: MapPin },
        { time: '1:00 PM', activity: 'Local tribal village tour', icon: Users },
        { time: '5:00 PM', activity: 'Pine forest walk', icon: MapPin }
      ],
      recommendation: 'Interact with local Oraon tribe members to learn about their sustainable farming practices and traditional crafts.'
    },
    {
      day: 3,
      location: 'Netarhat to Hundru Falls',
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      activities: [
        { time: '8:00 AM', activity: 'Check-out and departure', icon: MapPin },
        { time: '11:00 AM', activity: 'Arrive at Hundru Falls', icon: MapPin },
        { time: '12:00 PM', activity: 'Waterfall photography session', icon: Clock },
        { time: '2:00 PM', activity: 'Picnic lunch by the falls', icon: Users },
        { time: '5:00 PM', activity: 'Return to Ranchi', icon: MapPin }
      ],
      recommendation: 'Visit during monsoon season for the most spectacular water flow, but be cautious near the rocky areas.'
    }
  ];

  const interests = ['Nature', 'Adventure', 'Culture', 'Photography', 'Wildlife', 'Spirituality'];

  return (
    <div className="pt-28 min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-fadeInUp">
            <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeInUp tracking-tight">
            {t('itinerary.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp leading-relaxed">
            {t('itinerary.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-lg border border-gray-100 dark:border-gray-800 backdrop-blur-sm inline-flex">
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2.5 text-sm md:text-base ${
                  activeTab === 'planner'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span>Plan New Trip</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2.5 text-sm md:text-base ${
                  activeTab === 'history'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <History className="w-4 h-4 md:w-5 md:h-5" />
                <span>Previous Trips ({savedItineraries.length})</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'planner' ? (
          <div className="space-y-12">
          {/* Top Panel - Form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 animate-fadeInUp">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('itinerary.planJourney')}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {t('itinerary.startingCity')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type="text"
                      value={formData.startCity}
                      onChange={(e) => setFormData({...formData, startCity: e.target.value})}
                      placeholder={t('itinerary.startingCityPlaceholder')}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {t('itinerary.travelDates')}
                  </label>
                  <input
                    type="date"
                    value={formData.dates}
                    onChange={(e) => setFormData({...formData, dates: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 dark:text-white transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {t('itinerary.duration')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 dark:text-white appearance-none transition-all duration-200"
                    >
                      <option value="">{t('itinerary.selectDuration')}</option>
                      <option value="1">{t('itinerary.1day')}</option>
                      <option value="2-3">{t('itinerary.2to3days')}</option>
                      <option value="4-5">{t('itinerary.4to5days')}</option>
                      <option value="6-7">{t('itinerary.6to7days')}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {t('itinerary.groupType')}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <select
                      value={formData.groupType}
                      onChange={(e) => setFormData({...formData, groupType: e.target.value})}
                      className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 dark:text-white appearance-none transition-all duration-200"
                    >
                      <option value="">{t('itinerary.selectGroupType')}</option>
                      <option value="solo">{t('itinerary.solo')}</option>
                      <option value="couple">{t('itinerary.couple')}</option>
                      <option value="family">{t('itinerary.family')}</option>
                      <option value="friends">{t('itinerary.friends')}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      {t('itinerary.desiredPlaces')}
                    </label>
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full font-medium">
                      {t('itinerary.optional')}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={newPlace}
                          onChange={(e) => setNewPlace(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={t('itinerary.addPlace')}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm text-gray-900 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addPlace}
                        className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {currentItinerary.desiredPlaces.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 px-1 pb-1">
                        {currentItinerary.desiredPlaces.map((place, index) => (
                          <span key={index} className="inline-flex items-center bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm animate-fadeIn">
                            {place}
                            <button
                              type="button"
                              onClick={() => removePlace(place)}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">
                  {t('itinerary.interests')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {interests.map((interest) => (
                    <label 
                      key={interest} 
                      className={`
                        relative flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 border
                        ${formData.interests.includes(interest)
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, interests: [...formData.interests, interest]});
                          } else {
                            setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{interest}</span>
                      {formData.interests.includes(interest) && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 shadow-lg shadow-green-600/20"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('itinerary.generating')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{t('itinerary.generatePlan')}</span>
                    </>
                  )}
                </button>

                {/* Action Buttons */}
                {(currentItinerary.desiredPlaces.length > 0 || formData.startCity || formData.dates) && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const title = prompt('Enter a title for this itinerary:', currentItinerary.title || `Trip to ${formData.startCity || 'Multiple Destinations'} - ${new Date().toLocaleDateString()}`);
                        if (title) {
                          updateItineraryDetails({
                            duration: formData.duration,
                            preferences: formData.interests
                          });
                          setItineraryTitle(title);
                          saveCurrentItinerary();
                          alert('Itinerary saved successfully! You can find it in the "Previous Trips" tab.');
                        }
                      }}
                      className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border border-blue-200 dark:border-blue-800"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all current work? This cannot be undone.')) {
                          clearCurrentItinerary();
                          setFormData({
                            startCity: '',
                            dates: '',
                            duration: '',
                            interests: [],
                            groupType: '',
                            desiredPlaces: []
                          });
                          setShowResults(false);
                          setGeneratedItinerary(null);
                        }
                      }}
                      className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border border-red-200 dark:border-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Bottom Panel - Results */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            {!showResults ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('itinerary.willAppear')}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  {t('itinerary.fillForm')}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('itinerary.yourJourney')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formData.duration} days • {formData.startCity} • {formData.groupType}
                    </p>
                  </div>
                  <button className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                    <Download className="w-4 h-4" />
                    <span>{t('itinerary.downloadPDF')}</span>
                  </button>
                </div>

                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {generatedItinerary ? (
                    <>
                      {/* AI Generated Content */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center space-x-2 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>{t('itinerary.aiGenerated')}</span>
                        </h3>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                            {generatedItinerary.rawContent}
                          </pre>
                        </div>
                      </div>

                      {/* Structured Days */}
                      {generatedItinerary.structuredDays && generatedItinerary.structuredDays.length > 0 && (
                        <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-12">
                          {generatedItinerary.structuredDays.map((day: any) => (
                            <div key={day.day} className="relative pl-8">
                              {/* Timeline Dot */}
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-sm"></div>
                              
                              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="relative h-48">
                                  <img
                                    src={day.image}
                                    alt={day.location}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                  <div className="absolute bottom-4 left-4 text-white">
                                    <div className="text-xs font-bold uppercase tracking-wider bg-green-600 px-2 py-1 rounded-md inline-block mb-2">
                                      {t('itinerary.day')} {day.day}
                                    </div>
                                    <h3 className="text-xl font-bold">{day.location}</h3>
                                  </div>
                                </div>

                                <div className="p-6">
                                  <div className="space-y-4 mb-6">
                                    {day.activities.map((activity: any, index: number) => (
                                      <div key={index} className="flex items-start space-x-4 group">
                                        <div className="w-16 pt-1 text-xs font-bold text-gray-400 dark:text-gray-500 text-right flex-shrink-0 group-hover:text-green-600 transition-colors">
                                          {activity.time}
                                        </div>
                                        <div className="flex-1 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                            {activity.activity}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800/30 flex items-start space-x-3">
                                    <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mb-1">
                                        Why we recommended this
                                      </p>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {day.recommendation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-12">
                      {sampleItinerary.map((day) => (
                        <div key={day.day} className="relative pl-8">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-sm"></div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                            <div className="relative h-48">
                              <img
                                src={day.image}
                                alt={day.location}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 text-white">
                                <div className="text-xs font-bold uppercase tracking-wider bg-green-600 px-2 py-1 rounded-md inline-block mb-2">
                                  {t('itinerary.day')} {day.day}
                                </div>
                                <h3 className="text-xl font-bold">{day.location}</h3>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="space-y-4 mb-6">
                                {day.activities.map((activity, index) => (
                                  <div key={index} className="flex items-start space-x-4 group">
                                    <div className="w-16 pt-1 text-xs font-bold text-gray-400 dark:text-gray-500 text-right flex-shrink-0 group-hover:text-green-600 transition-colors">
                                      {activity.time}
                                    </div>
                                    <div className="flex-1 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <activity.icon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Activity</span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {activity.activity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800/30 flex items-start space-x-3">
                                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wider mb-1">
                                    {t('itinerary.whyRecommended')}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {day.recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* History Tab Content */
          <div className="max-w-5xl mx-auto animate-fadeInUp">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <History className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Previous Itineraries
                  </h2>
                </div>
                {currentItinerary.title && (
                  <button
                    onClick={() => {
                      const title = prompt('Enter itinerary title:', currentItinerary.title || `Trip ${new Date().toLocaleDateString()}`);
                      if (title) {
                        setItineraryTitle(title);
                        saveCurrentItinerary();
                        alert('Current itinerary saved!');
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Current Trip</span>
                  </button>
                )}
              </div>

              {savedItineraries.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                    <History className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved itineraries yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Your travel history is empty. Start planning your first adventure in Jharkhand!
                  </p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Plan Your First Trip
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {savedItineraries.map((itinerary) => (
                    <div key={itinerary.id} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {itinerary.title}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                              {new Date(itinerary.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span className="flex items-center space-x-1.5">
                              <MapPin className="w-4 h-4" />
                              <span>{itinerary.destinations.length} destinations</span>
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{itinerary.details?.duration || 'Flexible'} duration</span>
                            </span>
                          </div>

                          {itinerary.destinations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {itinerary.destinations.slice(0, 4).map((dest, index) => (
                                <span key={index} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg text-xs font-medium border border-green-100 dark:border-green-800/30">
                                  {dest}
                                </span>
                              ))}
                              {itinerary.destinations.length > 4 && (
                                <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
                                  +{itinerary.destinations.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                          <button
                            onClick={() => {
                              loadItinerary(itinerary.id);
                              setActiveTab('planner');
                            }}
                            className="flex-1 md:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this itinerary?')) {
                                deleteItinerary(itinerary.id);
                              }
                            }}
                            className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}