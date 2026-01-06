import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
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
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50/50 via-transparent to-transparent dark:from-green-900/20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-green-500"></span>
              <span className="text-green-600 dark:text-green-400 font-bold tracking-wider uppercase text-sm">{t('home.featuredDestinations')}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Jharkhand</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Explore the most breathtaking and culturally rich destinations the land of forests has to offer.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-14 h-14 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-14 h-14 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainer}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to={`/destination/${destination.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative flex-shrink-0 w-[85vw] md:w-[400px] aspect-[3/4] snap-center rounded-[2.5rem] overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-900"
            >
              <img
                src={destination.image}
                alt={getTranslatedDestinationName(destination.id, language)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="absolute top-6 right-6 z-20">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm font-bold tracking-wide">{destination.best_season}</span>
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-20">
                <div className="flex gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <MapPin className="w-3 h-3 text-green-400" />
                    {destination.distance}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                  {getTranslatedDestinationName(destination.id, language)}
                </h3>
                <p className="text-green-400 font-medium text-lg mb-6 italic">
                  {getTranslatedDestinationTagline(destination.id, language)}
                </p>
                
                <div className="flex items-center gap-2 text-white font-bold group/btn">
                  <span className="border-b-2 border-green-500 pb-1">{t('home.exploreMore')}</span>
                  <ArrowUpRight className="w-5 h-5 text-green-500 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}