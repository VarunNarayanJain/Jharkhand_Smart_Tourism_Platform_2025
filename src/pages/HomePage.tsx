import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import QuickSearchBar from '../components/QuickSearchBar';
import FeaturedDestinations from '../components/FeaturedDestinations';
import FeatureHighlights from '../components/FeatureHighlights';
import GlobalAuthModal from '../components/GlobalAuthModal';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if redirected from protected route
    if (searchParams.get('login') === 'required') {
      setShowAuthModal(true);
      // Clean up URL parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="pt-20 bg-white dark:bg-black min-h-screen transition-colors duration-300">
      <HeroSection />
      <QuickSearchBar />
      <FeaturedDestinations />
      <FeatureHighlights />
      
      {/* Auth Modal for protected route redirects */}
      <GlobalAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode="login"
      />
    </div>
  );
}