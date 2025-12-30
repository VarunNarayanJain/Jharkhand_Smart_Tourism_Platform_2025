import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [shouldShowLogin, setShouldShowLogin] = useState(false);

  useEffect(() => {
    // If not loading and no user, trigger login modal
    if (!loading && !user) {
      setShouldShowLogin(true);
      console.log('🔒 Protected route: User not authenticated, redirecting...');
    }
  }, [loading, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to homepage
  // The homepage will need to handle opening the login modal
  if (shouldShowLogin) {
    console.log('🔒 Redirecting to homepage - user needs to login');
    return <Navigate to="/?login=required" replace />;
  }

  return null;
}
