import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AuthModal from './AuthModal';

interface GlobalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function GlobalAuthModal({ isOpen, onClose, initialMode = 'login' }: GlobalAuthModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render the modal using a portal to append it directly to document.body
  // This ensures it's not constrained by any parent z-index contexts
  return createPortal(
    <AuthModal 
      isOpen={isOpen} 
      onClose={onClose} 
      initialMode={initialMode}
    />,
    document.body
  );
}