import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedDestinationName, getTranslatedDestinationTagline, getTranslatedDestinationDescription } from '../data/destinationTranslations';
import { destinationsService } from '../lib/database';
import type { Destination } from '../lib/supabase';

export default function FeaturedDestinations() {
  const { t, language } = useLanguage();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch destinations from Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationsService.getFeatured();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
        // Fallback to hardcoded data if Supabase fails
        setDestinations([
          {
            id: 1,
            name: 'Netarhat',
            tagline: 'Queen of Chotanagpur Plateau',
            story: 'Famous for sunrise views and pine forests that create a magical morning mist',
            image: '/n1.jpg',
            best_season: 'Oct-Mar',
            distance: '156 km from Ranchi',
            location: 'Netarhat, Jharkhand',
            activities: ['Sunrise Viewing', 'Pine Forest Walks'],
            highlights: ['Stunning sunrise views', 'Pine forests'],
            weather: {
              temperature: 25,
              humidity: 60,
              windSpeed: 10
            },
            created_at: '',
            updated_at: ''
          },
          {
            id: 2,
            name: 'Hundru Falls',
            tagline: 'Thundering Beauty',
            story: 'Where Subarnarekha river creates a spectacular 98-meter waterfall',
            image: '/h1.jpg',
            best_season: 'Jul-Jan',
            distance: '45 km from Ranchi',
            location: 'Ranchi, Jharkhand',
            activities: ['Waterfall Photography', 'Trekking'],
            highlights: ['98-meter high waterfall', 'Subarnarekha river'],
            weather: {
              temperature: 28,
              humidity: 70,
              windSpeed: 12
            },
            created_at: '',
            updated_at: ''
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state with fallback data
  if (error || destinations.length === 0) {
    console.log('Using fallback data due to:', error);
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Destinations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the most breathtaking destinations Jharkhand has to offer
            </p>
            {error && <p className="text-red-500 mt-2">Note: Using offline data - {error}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Netarhat</h3>
              <p className="text-gray-600 dark:text-gray-300">Queen of Chotanagpur Plateau</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hundru Falls</h3>
              <p className="text-gray-600 dark:text-gray-300">Thundering Beauty</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeInUp">{t('home.featuredDestinations')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp">
            Explore the most breathtaking and culturally rich destinations Jharkhand has to offer
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-x-1"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:translate-x-1"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>

          {/* Destinations Carousel */}
          <div 
            ref={scrollContainer}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destination/${destination.id}`}
                className="flex-none w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{getTranslatedDestinationName(destination.id, language)}</h3>
                    <p className="text-sm text-green-300">{getTranslatedDestinationTagline(destination.id, language)}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {getTranslatedDestinationDescription(destination.id, language)}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{destination.best_season}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{destination.distance}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 text-center hover:shadow-lg hover:scale-105 group-hover:animate-pulse">
                    {t('home.exploreMore')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}