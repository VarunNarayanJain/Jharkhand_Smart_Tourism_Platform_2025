
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Logoo.png" 
                alt="Jharkhand Tourism" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="text-lg font-bold">{t('header.jharkhandTourism')}</h2>
                <p className="text-sm text-green-400">{t('header.ecoPortal')}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Connecting Tourists with Jharkhand's Culture & Nature
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors duration-200" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors duration-200" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/destinations" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  {t('header.destinations')}
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  {t('header.itinerary')}
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  {t('header.marketplace')}
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  {t('header.chatbot')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm">
                  {t('header.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-300 hover:text-green-400 transition-colors duration-200">{t('footer.help')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-200">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors duration-200">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors duration-200">{t('footer.privacy')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.contact')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">+91 651 223 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">info@jharkhandtourism.gov.in</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                <span className="text-gray-300">Tourism Department<br />Ranchi, Jharkhand</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}