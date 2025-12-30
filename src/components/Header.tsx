import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import GlobalAuthModal from './GlobalAuthModal';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  const navigation = [
    { name: t('header.home'), path: '/' },
    { name: t('header.destinations'), path: '/destinations' },
    { name: t('header.itinerary'), path: '/itinerary' },
    { name: t('header.marketplace'), path: '/marketplace' },
    { name: t('header.chatbot'), path: '/chatbot' },
    { name: t('header.dashboard'), path: '/dashboard' },
  ];



  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg dark:shadow-black/30 fixed top-0 left-0 right-0 z-50 border-b border-white/20 dark:border-gray-700/30 transition-all duration-500">
      <div className="w-full px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4 gap-2 lg:gap-4">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 group min-w-0 flex-shrink-0">
            <div className="relative">
              <img
                src="/Logoo.png"
                alt="Jharkhand Tourism logo"
                className="w-10 h-8 lg:w-14 lg:h-11 object-contain group-hover:scale-110 transition-all duration-300 drop-shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                {t('header.jharkhandTourism')}
              </h1>
              <p className="text-xs text-green-600/80 dark:text-green-400/80 font-medium tracking-wide">
                {t('header.ecoPortal')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8">
            <div className="flex items-center space-x-1 xl:space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full px-2 xl:px-3 py-2 border border-white/30 dark:border-gray-700/30 shadow-lg max-w-fit">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-2 xl:px-4 py-2 xl:py-2.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 group whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/80 dark:hover:bg-gray-700/80'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Section - Controls & Auth */}
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 lg:p-2.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/30 dark:border-gray-700/30 group"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:rotate-12 group-hover:text-blue-600" />
              ) : (
                <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 transition-all duration-300 group-hover:rotate-12 group-hover:text-yellow-400" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 lg:py-2.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/30 dark:border-gray-700/30 group"
            >
              <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                {language === 'en' ? 'हिंदी' : 'EN'}
              </span>
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              {user ? (
                // Logged in state - Compact design
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30 max-w-[140px]">
                    <User className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center space-x-1 px-3 py-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg border border-red-200/50 dark:border-red-700/30 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium hidden xl:block">Logout</span>
                  </button>
                </>
              ) : (
                // Logged out state - Compact design
                <>
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 rounded-full text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-200/50 dark:border-green-700/30 group"
                  >
                    <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium">Login</span>
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-green-500/25 group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">Sign Up</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 border border-white/30 dark:border-gray-700/30 group"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/20 dark:border-gray-700/30 animate-fadeIn bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-b-2xl mx-4 mt-2">
            <nav className="flex flex-col space-y-2 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative group ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-md'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-75"></div>
                  )}
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20 dark:border-gray-700/30">
                {user ? (
                  // Logged in state (mobile)
                  <>
                    <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
                      <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user.user_metadata?.name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-red-200/50 dark:border-red-700/30 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  // Logged out state (mobile)
                  <>
                    <button 
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-green-200/50 dark:border-green-700/30 group"
                    >
                      <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">Login</span>
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-green-500/25 group"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium">Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Global Auth Modal - rendered via portal to document.body */}
      <GlobalAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </header>
  );
}