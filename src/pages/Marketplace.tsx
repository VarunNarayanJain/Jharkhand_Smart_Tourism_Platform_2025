import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Heart, MapPin, Shield } from 'lucide-react';
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
    <div className="pt-20 min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeInUp">{t('marketplace.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp">
            {t('marketplace.subtitle')}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading marketplace items...</p>
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

        {!loading && !error && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-black/50 hover:shadow-xl dark:hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-4 hover:scale-105 overflow-hidden group border border-gray-100 dark:border-gray-800 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <button className="w-10 h-10 bg-white/90 dark:bg-gray-900/90 hover:bg-white/95 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.verified 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">by {item.artisan_name}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {item.story}
                </p>

                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>{item.artisan_location}</span>
                  {item.verified && (
                    <>
                      <Shield className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">{t('marketplace.verified')}</span>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.price}
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 group-hover:animate-pulse">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('marketplace.buyNow')}</span>
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