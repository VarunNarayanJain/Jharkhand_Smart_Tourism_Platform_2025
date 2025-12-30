import { useEffect, useState } from 'react';
import { destinationsService, reviewsService, restaurantsService, guidesService, marketplaceService } from '../lib/database';

export default function DatabaseTest() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log('🔍 Testing database connection...');
        
        // Test destinations
        const destinations = await destinationsService.getAll();
        console.log('📍 Destinations:', destinations);
        
        // Test destination by ID (Netarhat)
        const netarhat = await destinationsService.getById(1);
        console.log('🏔️ Netarhat:', netarhat);
        
        // Test restaurants for Netarhat
        const restaurants = await restaurantsService.getByDestination(1);
        console.log('🍽️ Restaurants for Netarhat:', restaurants);
        
        // Test reviews for Netarhat
        const reviews = await reviewsService.getByDestination(1);
        console.log('📝 Reviews for Netarhat:', reviews);
        
        // Test guides
        const guides = await guidesService.getAll();
        console.log('👨‍🏫 All guides:', guides);
        
        // Test marketplace
        const marketplace = await marketplaceService.getAll();
        console.log('🛍️ Marketplace items:', marketplace);
        
        setData({
          destinations,
          netarhat,
          restaurants,
          reviews,
          guides,
          marketplace
        });
        
      } catch (err) {
        console.error('❌ Database test error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  if (loading) return <div className="p-8 pt-24">Loading database test...</div>;
  if (error) return <div className="p-8 pt-24 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 pt-24 min-h-screen bg-stone-50 dark:bg-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Database Test Results</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.destinations?.length || 0}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Destinations</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.restaurants?.length || 0}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Restaurants</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.reviews?.length || 0}</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Reviews</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.guides?.length || 0}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Guides</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.marketplace?.length || 0}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Marketplace</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Netarhat Details</h2>
          {data.netarhat ? (
            <div className="text-green-600 dark:text-green-400">✅ Found: {data.netarhat.name}</div>
          ) : (
            <div className="text-red-600 dark:text-red-400">❌ Not found</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Restaurants for Netarhat</h2>
          {data.restaurants?.length > 0 ? (
            <div className="space-y-2">
              {data.restaurants.map((restaurant: any) => (
                <div key={restaurant.id} className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span className="text-gray-900 dark:text-white">{restaurant.name}</span>
                  <span className="text-gray-500">({restaurant.cuisine})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">❌ No restaurants found</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Reviews for Netarhat</h2>
          {data.reviews?.length > 0 ? (
            <div className="space-y-2">
              {data.reviews.map((review: any) => (
                <div key={review.id} className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                  <span className="text-gray-900 dark:text-white truncate">{review.comment}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">❌ No reviews found</div>
          )}
        </div>
      </div>
    </div>
  );
}