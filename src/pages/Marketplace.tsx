import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Heart, MapPin, Shield, Search, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketplaceService } from '../lib/database';
import type { MarketplaceItem } from '../lib/supabase';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Fetch marketplace items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await marketplaceService.getAll();
        setItems(data);
      } catch (err) {
        console.error('Error fetching marketplace items:', err);
        setError('Failed to load marketplace items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const categories = [
    { id: 'all', name: t('marketplace.all'), count: items.length },
    { id: 'handicrafts', name: t('marketplace.handicrafts'), count: items.filter(item => item.category === 'handicrafts').length },
    { id: 'textiles', name: t('marketplace.textiles'), count: items.filter(item => item.category === 'textiles').length },
    { id: 'jewelry', name: t('marketplace.jewelry'), count: items.filter(item => item.category === 'jewelry').length },
    { id: 'pottery', name: t('marketplace.pottery'), count: items.filter(item => item.category === 'pottery').length },
    { id: 'food', name: t('marketplace.food'), count: items.filter(item => item.category === 'food').length }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[500px] overflow-hidden mb-12">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/5709296/pexels-photo-5709296.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Marketplace Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <span className="inline-block px-4 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-green-400 text-sm font-bold mb-6 animate-fadeInUp">
            Direct from Artisans
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            {t('marketplace.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            {t('marketplace.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl relative animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all shadow-2xl"
              placeholder="Search for bamboo crafts, paintings, textiles..."
            />
            <button className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl font-bold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Curating the finest artifacts...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl inline-block">
              <p className="text-red-600 dark:text-red-400 mb-6 text-lg font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Featured Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    group relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 overflow-hidden
                    ${selectedCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                    }
                  `}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {category.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {category.count}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Floating Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-600 hover:text-red-500">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-600 hover:text-blue-500">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.verified && (
                        <span className="px-3 py-1 bg-green-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Shield className="w-3 h-3" />
                          Verified Artisan
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <Award className="w-3 h-3" />
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-300">{item.artisan_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.artisan_location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500">{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {item.story}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Price</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.price}</p>
                      </div>
                      <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-green-600 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}