import { useState, useEffect } from 'react';
import { 
  BarChart3, MapPin, TrendingUp, CheckCircle, XCircle, User, Calendar, 
  PhoneCall, AlertTriangle, Heart, Edit3, Navigation, Star, BadgeCheck,
  Layout, Shield, MessageSquare, LogOut, Settings, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import GlobalAuthModal from '../components/GlobalAuthModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Jharkhand Landscapes for Slideshow
  const backgroundImages = [
    '/n1.jpg', // Netarhat
    '/h1.jpg', // Hundru
    '/b1.jpg', // Betla
    '/deo1.jpeg', // Deoghar
    '/haz1.jpg' // Hazaribagh
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show auth modal if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, show the auth modal
  if (!user) {
    return (
      <>
        <div className="pt-20 min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
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
      </>
    );
  }

  const userProfile = {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    image: user.user_metadata?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    verified: true,
    email: user.email || '',
    phone: user.phone || '+91 XXXXX XXXXX',
    preferences: ['Nature', 'Culture', 'Local Food'],
    memberSince: 'Jan 2024',
    tripsPlanned: 12,
    reviewsGiven: 8
  };

  const analyticsData = {
    totalItineraries: 1247,
    activeGuides: 68,
    verifiedArtisans: 145,
    satisfactionRate: 94
  };

  const topDestinations = [
    { name: 'Netarhat', visits: 89, growth: 12, image: 'https://images.pexels.com/photos/13650368/pexels-photo-13650368.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Hundru Falls', visits: 76, growth: 8, image: 'https://images.pexels.com/photos/11022645/pexels-photo-11022645.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Betla National Park', visits: 67, growth: 15, image: 'https://images.pexels.com/photos/15784625/pexels-photo-15784625.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  type Rateable = {
    id: number;
    name: string;
    category: 'Guide' | 'Homestay' | 'Artisan';
    location: string;
    image: string;
  };

  const rateables: Rateable[] = [
    { id: 11, name: 'Priya Kumari', category: 'Guide', location: 'Gumla', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
    { id: 12, name: 'Forest Nest Homestay', category: 'Homestay', location: 'Netarhat', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
    { id: 13, name: 'Santosh Mahato', category: 'Artisan', location: 'Saraikela', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
  ];

  type RatingState = {
    [key: number]: { stars: number; honest: boolean; badge: boolean; comment: string };
  };
  const [ratings, setRatings] = useState<RatingState>({});

  const updateRating = (id: number, partial: Partial<RatingState[number]>) => {
    setRatings((prev) => {
      const base = prev[id] || { stars: 0, honest: false, badge: false, comment: '' };
      return {
        ...prev,
        [id]: { ...base, ...partial },
      };
    });
  };

  const handleStartPlanning = () => {
    try { navigate('/itinerary'); } catch (e) { /* no-op */ }
  };

  const savedItineraries = [
    { id: 101, title: 'Weekend at Netarhat', days: 2, date: '2024-03-15', status: 'Upcoming' },
    { id: 102, title: 'Wildlife at Betla', days: 3, date: '2023-12-10', status: 'Completed' },
    { id: 103, title: 'Deoghar Pilgrimage', days: 1, date: '2023-11-05', status: 'Completed' },
  ];

  const culturalEvents = [
    { id: 1, name: 'Sarhul Festival', date: 'Apr 14', location: 'Ranchi', type: 'Festival' },
    { id: 2, name: 'Karma Puja', date: 'Aug 28', location: 'Hazaribagh', type: 'Ritual' },
    { id: 3, name: 'Dokra Craft Fair', date: 'Dec 10', location: 'Saraikela', type: 'Exhibition' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'reviews', label: 'Reviews & Community', icon: MessageSquare },
    { id: 'safety', label: 'Safety Center', icon: Shield },
  ];

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
                <img src={userProfile.image} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>
              {userProfile.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-gray-900">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="mt-14 md:mt-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome, {userProfile.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-300 flex items-center space-x-4 text-sm md:text-base">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Ranchi, Jharkhand</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Member since {userProfile.memberSince}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Trips Planned', value: userProfile.tripsPlanned, icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'Reviews Given', value: userProfile.reviewsGiven, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                  { label: 'Saved Places', value: '24', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
                  { label: 'Community Rank', value: 'Explorer', icon: BadgeCheck, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
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
                  {/* Active Trip Card */}
                  <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">Upcoming Trip</span>
                          <h3 className="text-3xl font-bold mt-3">Weekend at Netarhat</h3>
                          <p className="text-green-100 mt-1">Starts in 2 days • 2 Travelers</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                          <Calendar className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-8">
                        <button className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">
                          View Itinerary
                        </button>
                        <button className="bg-green-700/50 hover:bg-green-700/70 text-white px-6 py-3 rounded-xl font-medium backdrop-blur-md transition-colors border border-white/10">
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Destinations */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Trending Destinations
                      </h3>
                      <button className="text-green-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {topDestinations.map((dest, idx) => (
                        <div key={idx} className="group flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
                          <div className="w-20 h-20 rounded-xl overflow-hidden">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{dest.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {dest.visits}k visits</span>
                              <span className="text-green-600 font-medium">+{dest.growth}% this week</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 transition-colors">
                            <Navigation className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - 1 Col */}
                <div className="space-y-8">
                  {/* Community Pulse */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Community Pulse</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Active Guides</p>
                            <p className="font-bold text-gray-900 dark:text-white">{analyticsData.activeGuides}</p>
                          </div>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <BadgeCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Artisans</p>
                            <p className="font-bold text-gray-900 dark:text-white">{analyticsData.verifiedArtisans}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Platform Satisfaction</span>
                          <span className="text-green-600 font-bold">{analyticsData.satisfactionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analyticsData.satisfactionRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cultural Calendar</h3>
                    <div className="space-y-4">
                      {culturalEvents.map((ev) => (
                        <div key={ev.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-center min-w-[60px]">
                            <span className="block text-xs font-bold uppercase">{ev.date.split(' ')[0]}</span>
                            <span className="block text-lg font-bold">{ev.date.split(' ')[1]}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{ev.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{ev.location} • {ev.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      View Full Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {savedItineraries.map((it) => (
                <div key={it.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      it.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {it.status}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{it.title}</h3>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {it.date}</div>
                    <div className="flex items-center"><Navigation className="w-4 h-4 mr-2" /> {it.days} Days Trip</div>
                  </div>
                  <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
              
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
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {rateables.map((item) => {
                const r = ratings[item.id] || { stars: 0, honest: false, badge: false, comment: '' };
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">
                          {item.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <MapPin className="w-3 h-3 mr-1" /> {item.location}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-center space-x-2">
                        {[1,2,3,4,5].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateRating(item.id, { stars: s })}
                            className={`p-2 transition-transform hover:scale-110 ${s <= r.stars ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
                          >
                            <Star className="w-8 h-8 fill-current" />
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${r.honest ? 'bg-green-100 text-green-700' : 'bg-gray-50 dark:bg-gray-800 text-gray-600'}`}
                          onClick={() => updateRating(item.id, { honest: !r.honest })}
                        >
                          {r.honest ? 'Marked Honest' : 'Mark Honest'}
                        </button>
                        <button
                          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${r.badge ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 dark:bg-gray-800 text-gray-600'}`}
                          onClick={() => updateRating(item.id, { badge: !r.badge })}
                        >
                          {r.badge ? 'Badge Given' : 'Give Badge'}
                        </button>
                      </div>

                      <textarea
                        value={r.comment}
                        onChange={(e) => updateRating(item.id, { comment: e.target.value })}
                        placeholder="Share your experience..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-500 transition-all"
                        rows={3}
                      />

                      <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                        Submit Review
                      </button>
                    </div>
                  </div>
                );
              })}
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