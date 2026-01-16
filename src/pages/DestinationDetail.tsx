import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Star, 
  Camera,
  Heart,
  Share2,
  Navigation,
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  ArrowLeft,
  Plus,
  Check,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { destinationsService, reviewsService, guidesService, restaurantsService, marketplaceService } from '../lib/database';
import type { Destination, Review, Guide, Restaurant, MarketplaceItem } from '../lib/supabase';
import { useItinerary } from '../context/ItineraryContext';
import { useLanguage } from '../context/LanguageContext';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const { addDesiredPlace, currentItinerary } = useItinerary();
  const [showNotification, setShowNotification] = useState(false);
  const { t } = useLanguage();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch destination data based on ID
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const destinationId = parseInt(id);
        
        // Fetch destination details
        const destinationData = await destinationsService.getById(destinationId);
        setDestination(destinationData);
        
        if (destinationData) {
          // Fetch related data
          const [reviewsData, guidesData, restaurantsData, marketplaceData] = await Promise.all([
            reviewsService.getByDestination(destinationId),
            guidesService.getAll(), // Get all guides for now, could filter by location
            restaurantsService.getByDestination(destinationId),
            marketplaceService.getAll() // Get all marketplace items
          ]);
          
          setReviews(reviewsData);
          setGuides(guidesData);
          setRestaurants(restaurantsData);
          setMarketplaceItems(marketplaceData);
        }
      } catch (err) {
        console.error('❌ Error fetching destination data:', err);
        setError('Failed to load destination details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Check if this destination is already in the itinerary
  const isInItinerary = destination ? currentItinerary.desiredPlaces.includes(destination.name) : false;

  const handleAddToItinerary = () => {
    if (destination) {
      addDesiredPlace(destination.name);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Handle case when destination is not found or loading
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('destDetail.notFound')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || t('destDetail.notFoundDesc')}</p>
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            {t('destDetail.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('destDetail.about') },
    { id: 'photos', label: t('destDetail.videos') },
    // { id: 'reviews', label: t('destDetail.reviews') }, // Removed as per requirements
    { id: 'guides', label: t('destDetail.guides') },
    { id: 'eateries', label: t('destDetail.eateries') },
    { id: 'transport', label: t('destDetail.transport') },
    { id: 'products', label: t('destDetail.products') }
  ];

  return (
    <div className="pt-20 min-h-screen bg-stone-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-in-out">
          <Check className="w-5 h-5" />
          <span className="font-medium">{destination?.name} {t('destDetail.addedToItinerary')}!</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
                 {/* Back Button */}
         <Link
           to="/destinations"
           className="absolute top-6 left-6 bg-black/30 dark:bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-110 hover:shadow-lg animate-fadeInUp"
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         >
           <ArrowLeft className="w-6 h-6" />
         </Link>

                 {/* Action Buttons */}
         <div className="absolute top-6 right-6 flex space-x-3 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
           <button
             onClick={() => setIsLiked(!isLiked)}
             className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${
               isLiked ? 'bg-red-500/90 text-white' : 'bg-black/30 dark:bg-gray-900/80 text-white hover:bg-black/50 dark:hover:bg-gray-800/90'
             }`}
           >
             <Heart className={`w-6 h-6 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
           </button>
           <button className="bg-black/30 dark:bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-110 hover:shadow-lg">
             <Share2 className="w-6 h-6" />
           </button>
         </div>

         {/* Add to Itinerary Button */}
         <div className="absolute bottom-8 right-8 z-50 animate-fadeInUp" style={{ pointerEvents: 'auto', animationDelay: '400ms' }}>
           <button
             onClick={handleAddToItinerary}
             className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl ${
               isInItinerary 
                 ? 'bg-green-600 text-white hover:bg-green-700' 
                 : 'bg-black/40 dark:bg-gray-900/90 backdrop-blur-sm text-white hover:bg-black/60 dark:hover:bg-gray-800/95'
             }`}
             style={{ cursor: 'pointer', pointerEvents: 'auto' }}
           >
             {isInItinerary ? (
               <>
                 <Check className="w-5 h-5" />
                 <span>{t('destDetail.addedToItinerary')}</span>
               </>
             ) : (
               <>
                 <Plus className="w-5 h-5" />
                 <span>{t('destDetail.addToItinerary')}</span>
               </>
             )}
           </button>
           
           {isInItinerary && (
             <Link
               to="/itinerary"
               className="block mt-2 text-center text-sm text-white hover:text-green-300 transition-all duration-300 hover:scale-105"
             >
               {t('destDetail.viewItinerary')}
             </Link>
           )}
         </div>

                 {/* Hero Content */}
         <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
           <h1 className="text-5xl font-bold mb-2">{destination.name}</h1>
           <p className="text-xl text-green-300 mb-4">{destination.tagline}</p>
           <div className="flex items-center space-x-6 text-sm">
             <div className="flex items-center space-x-2">
               <MapPin className="w-4 h-4" />
               <span>{destination.location}</span>
             </div>
             <div className="flex items-center space-x-2">
               <Clock className="w-4 h-4" />
               <span>{t('destDetail.bestTime')}: {destination.best_season}</span>
             </div>
           </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg dark:shadow-black/50 mb-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-500 animate-fadeInUp">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <span>{t('destDetail.currentWeather')}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{destination.weather?.temperature || 25}°C</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Pleasant</div>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('destDetail.humidity')}</div>
              <div className="font-semibold text-gray-900 dark:text-white">{destination.weather?.humidity || 60}%</div>
            </div>
            <div className="text-center">
              <Wind className="w-6 h-6 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('destDetail.windSpeed')}</div>
              <div className="font-semibold text-gray-900 dark:text-white">{destination.weather?.windSpeed || 10} km/h</div>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('destDetail.bestTime')}</div>
              <div className="font-semibold text-gray-900 dark:text-white">Oct-Mar</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-black/50 mb-8 border border-gray-100 dark:border-gray-800 animate-fadeInUp">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="animate-fadeInUp">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('destDetail.about')} {destination.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{destination.story}</p>
                </div>

                {/* Map Section */}
                <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-green-600" />
                    <span>{t('marketplace.location')}</span>
                  </h4>
                  <div
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 relative group"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(destination.name + ' ' + destination.location)}`, '_blank')}
                  >
                    {/* Embedded Google Maps */}
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.name + ' ' + destination.location)}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${destination.name} Location`}
                    />
                    
                    {/* Overlay for click indication */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t('destDetail.openInMaps')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location details */}
                  <div className="mt-4 flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Coordinates</p>
                      <p className="font-mono text-sm text-gray-800 dark:text-white">{destination.location}</p>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(destination.name + ' ' + destination.location)}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Photos & Videos Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[destination.image].map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={image}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Videos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.videos.map((_, index) => (
                      <div key={index} className="relative bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                        <p className="absolute bottom-4 text-sm text-gray-600 dark:text-gray-400">Video {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('destDetail.reviews')}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{averageRating}</span>
                    <span className="text-gray-600 dark:text-gray-400">({reviews.length} {reviews.length === 1 ? t('destDetail.review') : t('destDetail.reviews_plural')})</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                            {review.id}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">Anonymous User</h4>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-white mb-2">{review.comment}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{new Date(review.created_at || '').toLocaleDateString()}</span>
                              <span>{review.helpful_count} people found this helpful</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No reviews available yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

                         {/* Local Guides Tab */}
             {activeTab === 'guides' && (
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('destDetail.guides')}</h3>
                   <p className="text-gray-600 dark:text-gray-400">{t('destDetail.guidesDesc')}</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {guides.map((guide: any) => (
                     <div key={guide.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 hover:scale-105">
                       <div className="p-6">
                         <div className="flex items-start space-x-4 mb-4">
                           <img
                             src={guide.avatar}
                             alt={guide.name}
                             className="w-16 h-16 rounded-full object-cover"
                           />
                           <div className="flex-1">
                             <h4 className="font-bold text-gray-900 dark:text-white text-lg">{guide.name}</h4>
                             <p className="text-sm text-gray-600 dark:text-gray-400">{guide.experience} {t('destDetail.experience')}</p>
                            <div className="mt-1">
                              {guide.verificationStatus === 'verified' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" /> {t('destDetail.verified')}
                                </span>
                              )}
                              {guide.verificationStatus === 'unverified' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  <XCircle className="w-3 h-3 mr-1" /> {t('destDetail.unverified')}
                                </span>
                              )}
                              {guide.verificationStatus === 'pending' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  <ClockIcon className="w-3 h-3 mr-1" /> {t('destDetail.pending')}
                                </span>
                              )}
                            </div>
                             <div className="flex items-center space-x-1 mt-1">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star
                                   key={star}
                                   className={`w-4 h-4 ${
                                     star <= guide.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                   }`}
                                 />
                               ))}
                               <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{guide.rating}</span>
                             </div>
                           </div>
                         </div>
                         
                         <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{guide.description}</p>
                         
                         <div className="space-y-3">
                           <div>
                             <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('destDetail.languages')}</p>
                             <div className="flex flex-wrap gap-1">
                               {guide.languages?.map((language: any, idx: number) => (
                                 <span
                                   key={idx}
                                   className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full"
                                 >
                                   {language}
                                 </span>
                               ))}
                             </div>
                           </div>
                           
                           <div>
                             <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('destDetail.specialties')}</p>
                             <div className="flex flex-wrap gap-1">
                               {guide.specialties?.map((specialty: any, idx: number) => (
                                 <span
                                   key={idx}
                                   className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full"
                                 >
                                   {specialty}
                                 </span>
                               ))}
                             </div>
                           </div>
                           
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                             <div className="flex-1">
                               <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('destDetail.contact')}</p>
                               <a 
                                 href={`tel:${guide.phone || '+91-XXXXXXXXXX'}`}
                                 className="text-lg font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 transition-colors"
                               >
                                 {guide.phone || '+91-XXXXXXXXXX'}
                               </a>
                               <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                 {guide.hourlyRate} / {t('destDetail.perHour')}
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Local Eateries Tab */}
            {activeTab === 'eateries' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('destDetail.eateries')}</h3>
                <div className="mb-4 text-sm text-gray-600">
                  Debug: Found {restaurants.length} restaurants for destination {id}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.length > 0 ? (
                    restaurants.map((eatery: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 hover:scale-105">
                        <img
                          src={eatery.image}
                          alt={eatery.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">{eatery.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{eatery.cuisine}</p>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= eatery.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{eatery.rating}</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{eatery.price_range}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('destDetail.specialties')}</p>
                            <div className="flex flex-wrap gap-1">
                              {eatery.specialties?.map((specialty: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No local eateries available yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transportation Tab */}
            {activeTab === 'transport' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('destDetail.transport')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample transportation options */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3 mb-4">
                      <Navigation className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">By Road</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">Well-connected by state highways and national roads</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.duration')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{destination.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.cost')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹500-800</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">By Train</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">Nearest railway station with regular connections</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.duration')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">3-4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.cost')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹200-600</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3 mb-4">
                      <Navigation className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">By Air</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">Nearest airport with connecting flights</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.duration')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">1-2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('destDetail.cost')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹3000-8000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Local Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('destDetail.products')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceItems.slice(0, 6).map((product, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{product.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{product.story}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                              {product.category}
                            </span>
                          </div>
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {marketplaceItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No local products available yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
