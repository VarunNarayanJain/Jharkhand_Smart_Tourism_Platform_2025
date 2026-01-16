import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function QuickSearchBar() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    {
      title: t('header.destinations'),
      desc: "Discover heritage sites & waterfalls.",
      icon: MapPin,
      path: '/destinations',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      border: 'hover:border-emerald-500 dark:hover:border-emerald-500',
      shadow: 'hover:shadow-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: t('header.itinerary'),
      desc: "AI-powered travel plans.",
      icon: Calendar,
      path: '/itinerary',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'hover:border-blue-500 dark:hover:border-blue-500',
      shadow: 'hover:shadow-blue-500/20',
      gradient: 'from-blue-500 to-indigo-500'
    },
    // Marketplace temporarily hidden
    // {
    //   title: t('header.marketplace'),
    //   desc: "Shop authentic tribal handicrafts.",
    //   icon: ShoppingBag,
    //   path: '/marketplace',
    //   color: 'text-orange-600 dark:text-orange-400',
    //   bg: 'bg-orange-100 dark:bg-orange-900/30',
    //   border: 'hover:border-orange-500 dark:hover:border-orange-500',
    //   shadow: 'hover:shadow-orange-500/20',
    //   gradient: 'from-orange-500 to-red-500'
    // },
    {
      title: t('header.chatbot'),
      desc: "Chat with our AI guide 24/7.",
      icon: MessageCircle,
      path: '/chatbot',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'hover:border-purple-500 dark:hover:border-purple-500',
      shadow: 'hover:shadow-purple-500/20',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: t('header.dashboard'),
      desc: "Manage trips & bookings.",
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      border: 'hover:border-cyan-500 dark:hover:border-cyan-500',
      shadow: 'hover:shadow-cyan-500/20',
      gradient: 'from-cyan-500 to-sky-500'
    }
  ];

  return (
    <section className="relative z-10 py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need for the perfect Jharkhand experience, right at your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(action.path)}
              className={`
                group relative bg-white dark:bg-gray-900 rounded-[2rem] p-6
                border border-gray-200 dark:border-gray-800 ${action.border}
                shadow-lg dark:shadow-none ${action.shadow}
                cursor-pointer transition-all duration-500 ease-out
                hover:-translate-y-2 hover:shadow-2xl
                overflow-hidden animate-fadeInUp
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-2xl ${action.bg} ${action.color}
                flex items-center justify-center mb-6
                group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500
              `}>
                <action.icon className="w-8 h-8" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                  {action.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {action.desc}
                </p>
                
                <div className={`flex items-center text-sm font-bold ${action.color} opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative Circle */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${action.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}