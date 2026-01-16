import { useState, useEffect } from 'react';
import { 
  MapPin, CheckCircle, User, Calendar, 
  AlertTriangle, Edit3, Navigation,
  Layout, Shield, MessageSquare, Settings, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalAuthModal from '../components/GlobalAuthModal';
import { itineraryService, eventsService, analyticsService } from '../lib/database';
import type { Itinerary, CulturalEvent } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [activeTab, setActiveTab] = useState('overview');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Real data from database
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [platformStats, setPlatformStats] = useState({ 
    totalDestinations: 0, 
    totalGuides: 0, 
    totalMarketplaceItems: 0, 
    totalEvents: 0 
  });
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('📊 Dashboard - User state:', { user: !!user, loading: authLoading, email: user?.email });
  }, [user, authLoading]);

  // Fetch user's data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user's itineraries
        const userItineraries = await itineraryService.getByUser(user.id);
        setItineraries(userItineraries);

        // Fetch upcoming cultural events
        const upcomingEvents = await eventsService.getUpcoming();
        setCulturalEvents(upcomingEvents.slice(0, 3)); // Get top 3

        // Fetch platform stats
        const stats = await analyticsService.getPlatformStats();
        setPlatformStats(stats);

        console.log('✅ Dashboard data loaded:', {
          itineraries: userItineraries.length,
          events: upcomingEvents.length,
          stats
        });
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Jharkhand Landscapes for Slideshow
  const backgroundImages = [
    '/n1.jpg', // Netarhat
    '/h1.jpg', // Hundru
    '/b1.jpg', // Betla
    '/deo1.jpeg', // Deoghar
    '/haz1.jpg' // Hazaribagh
  ];

  // Background slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]); // Add dependency

  // Show auth modal if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  // Show loading state while checking authentication or fetching data
  if (authLoading || loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, show the auth modal with proper UI
  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black">
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6">
              <Shield className="w-20 h-20 text-green-600 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard Access Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in or create an account to access your personalized dashboard and manage your trips.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
        <GlobalAuthModal 
          isOpen={showAuthModal} 
          onClose={() => {
            setShowAuthModal(false);
            navigate('/');
          }} 
          initialMode="signup"
        />
      </div>
    );
  }

  const handleStartPlanning = () => {
    try { navigate('/itinerary'); } catch (e) { /* no-op */ }
  };

  const getItineraryStatus = (itinerary: Itinerary) => {
    if (!itinerary.start_date) return 'Draft';
    const startDate = new Date(itinerary.start_date);
    const today = new Date();
    return startDate > today ? 'Upcoming' : 'Completed';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate().toString()
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'safety', label: 'Safety Center', icon: Shield },
  ];

  // Safety check for user profile
  const safeUserProfile = {
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
    image: user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    verified: true,
    email: user?.email || '',
    phone: user?.phone || '+91 XXXXX XXXXX',
    preferences: ['Nature', 'Culture', 'Local Food'],
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
    tripsPlanned: itineraries.length,
    reviewsGiven: 0 // Will implement review system later
  };

  console.log('📊 Dashboard rendering with user:', safeUserProfile.name);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative bg-gray-900 h-64 lg:h-80 overflow-hidden group">
        {/* Slideshow Background */}
        <div className="absolute inset-0">
          {backgroundImages.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBgIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Jharkhand Landscape ${index + 1}`}
                onError={(e) => {
                  console.warn(`Failed to load image: ${img}`);
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover opacity-50 transform scale-105 group-hover:scale-110 transition-transform duration-[20s]"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-8 w-full">
            <div className="relative -mb-12 md:mb-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white dark:border-gray-800 overflow-hidden shadow-2xl">
                <img src={safeUserProfile.image} alt={safeUserProfile.name} className="w-full h-full object-cover" />
              </div>
              {safeUserProfile.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-gray-900">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="mt-14 md:mt-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome, {safeUserProfile.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-300 flex items-center space-x-4 text-sm md:text-base">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Ranchi, Jharkhand</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Member since {safeUserProfile.memberSince}</span>
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-medium transition-all flex items-center space-x-2 border border-white/10">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleStartPlanning}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fadeInUp">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Trips Planned', value: safeUserProfile.tripsPlanned, icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'Destinations', value: platformStats.totalDestinations, icon: MapPin, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
                  { label: 'Active Guides', value: platformStats.totalGuides, icon: User, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2 Cols */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Active Trip Card or Empty State */}
                  {itineraries.length > 0 ? (
                    (() => {
                      const upcomingTrip = itineraries.find(it => getItineraryStatus(it) === 'Upcoming') || itineraries[0];
                      const status = getItineraryStatus(upcomingTrip);
                      return (
                        <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                  {status} Trip
                                </span>
                                <h3 className="text-3xl font-bold mt-3">{upcomingTrip.title}</h3>
                                <p className="text-green-100 mt-1">
                                  {formatDate(upcomingTrip.start_date)} • {upcomingTrip.days} Day{upcomingTrip.days !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                <Calendar className="w-8 h-8" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-8">
                              <button 
                                onClick={() => navigate('/itinerary')}
                                className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
                              >
                                View Itinerary
                              </button>
                              <button 
                                onClick={() => navigate('/itinerary')}
                                className="bg-green-700/50 hover:bg-green-700/70 text-white px-6 py-3 rounded-xl font-medium backdrop-blur-md transition-colors border border-white/10"
                              >
                                Edit Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Trips Planned Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Start planning your perfect Jharkhand adventure!</p>
                      <button 
                        onClick={handleStartPlanning}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
                      >
                        Plan Your First Trip
                      </button>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => navigate('/destinations')}
                        className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl hover:shadow-lg transition-all group"
                      >
                        <MapPin className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Explore</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Destinations</p>
                      </button>
                      <button 
                        onClick={() => navigate('/chatbot')}
                        className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl hover:shadow-lg transition-all group"
                      >
                        <MessageSquare className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Ask AI</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Travel Help</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar - 1 Col */}
                <div className="space-y-8">
                  {/* Platform Stats */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Platform Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Destinations</p>
                            <p className="font-bold text-gray-900 dark:text-white">{platformStats.totalDestinations}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Guides</p>
                            <p className="font-bold text-gray-900 dark:text-white">{platformStats.totalGuides}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cultural Events</p>
                            <p className="font-bold text-gray-900 dark:text-white">{platformStats.totalEvents}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Cultural Events</h3>
                    {culturalEvents.length > 0 ? (
                      <>
                        <div className="space-y-4">
                          {culturalEvents.map((ev) => {
                            const eventDate = formatEventDate(ev.date);
                            return (
                              <div key={ev.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-center min-w-[60px]">
                                  <span className="block text-xs font-bold uppercase">{eventDate.month}</span>
                                  <span className="block text-lg font-bold">{eventDate.day}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{ev.name}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{ev.location}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <button 
                          onClick={() => navigate('/destinations')}
                          className="w-full mt-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          View All Events
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events at the moment</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {itineraries.length > 0 ? (
                <>
                  {itineraries.map((it) => {
                    const status = getItineraryStatus(it);
                    return (
                      <div key={it.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === 'Upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            status === 'Completed' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {status}
                          </div>
                          <button 
                            onClick={() => navigate('/itinerary')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{it.title}</h3>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> 
                            {formatDate(it.start_date)}
                          </div>
                          <div className="flex items-center">
                            <Navigation className="w-4 h-4 mr-2" /> 
                            {it.days} Day{it.days !== 1 ? 's' : ''} Trip
                          </div>
                          {it.destinations && it.destinations.length > 0 && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" /> 
                              {it.destinations.slice(0, 2).join(', ')}
                              {it.destinations.length > 2 && ` +${it.destinations.length - 2}`}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => navigate('/itinerary')}
                          className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Add New Trip Card */}
                  <button 
                    onClick={handleStartPlanning}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all min-h-[250px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Plan New Trip</span>
                  </button>
                </>
              ) : (
                <div className="col-span-3">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                    <MapPin className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Trips Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start planning your first Jharkhand adventure! Our AI-powered itinerary planner will help you create the perfect trip.
                    </p>
                    <button 
                      onClick={handleStartPlanning}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First Itinerary
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  Safety Guidelines
                </h3>
                <div className="grid gap-6">
                  {[
                    { title: 'Verified Guides Only', desc: 'Always ensure your guide has a verified badge on our platform before booking.' },
                    { title: 'Emergency Numbers', desc: 'Keep local emergency numbers saved. Use the SOS button in the app for immediate help.' },
                    { title: 'Share Itinerary', desc: 'Share your live location and itinerary with trusted contacts through the app.' },
                    { title: 'Respect Local Culture', desc: 'Dress modestly when visiting religious sites and ask permission before taking photos.' },
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 text-green-600 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6 border border-red-100 dark:border-red-900/30">
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    <a href="tel:112" className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all group">
                      <span className="font-medium text-gray-900 dark:text-white">Police / Ambulance</span>
                      <span className="text-red-600 font-bold group-hover:scale-110 transition-transform">112</span>
                    </a>
                    <a href="tel:1091" className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all group">
                      <span className="font-medium text-gray-900 dark:text-white">Women Helpline</span>
                      <span className="text-red-600 font-bold group-hover:scale-110 transition-transform">1091</span>
                    </a>
                    <a href="tel:1363" className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all group">
                      <span className="font-medium text-gray-900 dark:text-white">Tourist Helpline</span>
                      <span className="text-red-600 font-bold group-hover:scale-110 transition-transform">1363</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}