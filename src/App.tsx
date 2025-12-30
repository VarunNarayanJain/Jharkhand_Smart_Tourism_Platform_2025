
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ItineraryPlanner from './pages/ItineraryPlanner';
import DestinationExplorer from './pages/DestinationExplorer';
import DestinationDetail from './pages/DestinationDetail';
import Chatbot from './pages/Chatbot';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import DatabaseTest from './pages/DatabaseTest';
import { ItineraryProvider } from './context/ItineraryContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ChatHistoryProvider } from './context/ChatHistoryContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ItineraryProvider>
          <ChatHistoryProvider>
            <Router>
            <div className="min-h-screen bg-neutral-900 text-neutral-100">
              <Header />
              <main>
                <Routes>
                  {/* Public routes - accessible without authentication */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/destinations" element={<DestinationExplorer />} />
                  <Route path="/destination/:id" element={<DestinationDetail />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/db-test" element={<DatabaseTest />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route 
                    path="/itinerary" 
                    element={
                      <ProtectedRoute>
                        <ItineraryPlanner />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/marketplace" 
                    element={
                      <ProtectedRoute>
                        <Marketplace />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          </ChatHistoryProvider>
        </ItineraryProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;