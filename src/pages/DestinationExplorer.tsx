import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Plus, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { destinationsService } from '../lib/database';
import type { Destination } from '../lib/supabase';
import { getTranslatedDestinationName, getTranslatedDestinationTagline, getTranslatedDestinationDescription } from '../data/destinationTranslations';

export default function DestinationExplorer() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Manual positioning for destinations on Jharkhand map
  // Based on actual geographic locations relative to the state map
  const pinPositions: { [key: number]: { top: string; left: string } } = {
    1: { top: '62%', left: '38%' },  // Netarhat - Western Jharkhand (Latehar)
    2: { top: '45%', left: '55%' },  // Hundru Falls - Near Ranchi (Central)
    3: { top: '75%', left: '35%' },  // Betla National Park - Southwest (Palamau)
    4: { top: '20%', left: '78%' },  // Deoghar - Northeast corner
    5: { top: '40%', left: '48%' },  // Hazaribagh - North-Central
  };

  // Fetch destinations from Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationsService.getAll();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeInUp">{t('explorer.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp">
            {t('explorer.subtitle')}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading destinations...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && destinations.length > 0 && (
          <div className="space-y-20">
            {/* Section 1: Interactive Map (Horizontal) */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 hover:shadow-3xl transition-all duration-500 animate-fadeInUp relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-end justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('explorer.interactiveMap')}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mb-4">{t('explorer.clickPins')}</p>
                  
                  <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-2 rounded-xl w-fit animate-pulse">
                    <MousePointerClick className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      Interactive: Click on the pulsing dots on the map to reveal details
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 mt-6 md:mt-0 bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tourist Spots</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nature Hubs</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[600px] bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl relative overflow-hidden border border-gray-200 dark:border-gray-700 group shadow-inner">
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  <img 
                    src="./Maps.png"
                    alt="Jharkhand Map"
                    className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-[2s] ease-in-out drop-shadow-2xl"
                  />
                </div>
                
                {/* Map Pins */}
                {destinations.map((dest) => (
                  <Link
                    key={dest.id}
                    to={`/destination/${dest.id}`}
                    className="absolute group/pin"
                    style={{
                      top: pinPositions[dest.id]?.top || '50%',
                      left: pinPositions[dest.id]?.left || '50%'
                    }}
                    onClick={() => {
                      setSelectedDestination(dest);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-red-500 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                      <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full relative border-2 border-white dark:border-gray-900 shadow-xl cursor-pointer hover:scale-125 transition-transform duration-300 z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-40 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none z-20 text-center border border-gray-100 dark:border-gray-700 translate-y-2 group-hover/pin:translate-y-0">
                        <div className="w-full h-20 rounded-lg overflow-hidden mb-2">
                          <img src={dest.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{getTranslatedDestinationName(dest.id, language)}</p>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-gray-900 border-r border-b border-gray-100 dark:border-gray-700"></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Section 2: How it Works */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-stone-50 dark:bg-black text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                  Start Your Journey
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Explore the Map', desc: 'Click on the interactive pins to discover hidden gems across Jharkhand.', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { title: 'Select Your Vibe', desc: 'Filter destinations by nature, culture, adventure, or spirituality.', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                { title: 'Plan Your Trip', desc: 'Get detailed itineraries and local guides for a perfect experience.', icon: Clock, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' }
              ].map((item, idx) => (
                <div key={idx} className="group bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                  <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Section 3: Destinations Grid */}
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Popular Destinations</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Curated locations for your next adventure</p>
                </div>
                <button className="group flex items-center space-x-2 text-green-600 font-bold hover:text-green-700 transition-colors px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30">
                  <span>View All Locations</span>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((destination) => (
                  <Link
                    key={destination.id}
                    to={`/destination/${destination.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>4.8</span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors drop-shadow-md">
                          {getTranslatedDestinationName(destination.id, language)}
                        </h3>
                        <div className="flex items-center text-gray-200 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {destination.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-green-600 dark:text-green-400 font-bold text-sm mb-3 uppercase tracking-wide">
                        {getTranslatedDestinationTagline(destination.id, language)}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                        {getTranslatedDestinationDescription(destination.id, language)}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {destination.highlights.slice(0, 3).map((activity, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
                            {activity}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{destination.best_season}</span>
                        </div>
                        <span className="flex items-center space-x-2 text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-green-600 group-hover:text-white dark:group-hover:bg-green-500 transition-all shadow-lg">
                          <span>Explore</span>
                          <Plus className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}