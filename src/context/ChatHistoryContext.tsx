import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  metadata?: {
    type?: 'text' | 'suggestion' | 'error';
    suggestions?: string[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface ChatHistoryContextType {
  // Current chat session
  currentSession: ChatSession | null;
  
  // All chat sessions for the user
  chatSessions: ChatSession[];
  
  // Current session methods
  addMessage: (text: string, isUser: boolean, metadata?: ChatMessage['metadata']) => void;
  clearCurrentSession: () => void;
  
  // Session management
  createNewSession: (title?: string) => string; // Returns session ID
  switchToSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  
  // Auto-save and persistence
  saveCurrentSession: () => void;
  
  // User-specific cleanup
  clearAllChatData: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};

interface ChatHistoryProviderProps {
  children: ReactNode;
}

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({ children }) => {
  const { user, registerCleanupFunction, unregisterCleanupFunction } = useAuth();
  
  // Generate storage keys based on user ID
  const getUserStorageKey = (key: string) => {
    return user ? `${key}_user_${user.id}` : `${key}_guest`;
  };

  // Current session state
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  
  // All sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (!user) return [];
    
    const saved = localStorage.getItem(getUserStorageKey('chatSessions'));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing chat sessions:', e);
      }
    }
    return [];
  });

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (user && chatSessions.length > 0) {
      localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(chatSessions));
      console.log('💬 Saved chat sessions for user:', user.id);
    }
  }, [chatSessions, user]);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      console.log('👤 Loading chat data for user:', user.id);
      
      // Load chat sessions
      const savedSessions = localStorage.getItem(getUserStorageKey('chatSessions'));
      if (savedSessions) {
        try {
          const sessions = JSON.parse(savedSessions);
          setChatSessions(sessions);
          
          // Find and set the active session
          const activeSession = sessions.find((s: ChatSession) => s.isActive);
          if (activeSession) {
            setCurrentSession(activeSession);
          } else if (sessions.length > 0) {
            // If no active session, create a new one or use the most recent
            const mostRecent = sessions[0];
            setCurrentSession(mostRecent);
          }
        } catch (e) {
          console.error('Error loading chat sessions:', e);
          setChatSessions([]);
          setCurrentSession(null);
        }
      } else {
        // Create initial session for new user
        const initialSession = createInitialSession();
        setChatSessions([initialSession]);
        setCurrentSession(initialSession);
      }
    } else {
      // Clear data when user logs out
      setChatSessions([]);
      setCurrentSession(null);
    }
  }, [user]);

  // Helper function to create initial session
  const createInitialSession = (): ChatSession => {
    const now = new Date().toISOString();
    return {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [{
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: 'Hello! I\'m your travel assistant. How can I help you plan your trip to Jharkhand today?',
        isUser: false,
        timestamp: now,
        metadata: { type: 'text' }
      }],
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
  };

  // Add message to current session
  const addMessage = (text: string, isUser: boolean, metadata?: ChatMessage['metadata']) => {
    if (!currentSession) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser,
      timestamp: new Date().toISOString(),
      metadata
    };

    console.log('💬 Adding message to session:', currentSession.id, newMessage);

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      updatedAt: new Date().toISOString(),
      // Auto-generate title from first user message
      title: currentSession.title === 'New Chat' && isUser ? 
        text.substring(0, 30) + (text.length > 30 ? '...' : '') : 
        currentSession.title
    };

    setCurrentSession(updatedSession);

    // Update in sessions list
    setChatSessions(prev => prev.map(session => 
      session.id === currentSession.id ? updatedSession : session
    ));
  };

  // Clear current session messages
  const clearCurrentSession = () => {
    if (!currentSession) return;
    
    console.log('🧹 Clearing current session messages');
    const clearedSession = {
      ...currentSession,
      messages: [],
      updatedAt: new Date().toISOString()
    };

    setCurrentSession(clearedSession);
    setChatSessions(prev => prev.map(session => 
      session.id === currentSession.id ? clearedSession : session
    ));
  };

  // Create new session
  const createNewSession = (title?: string): string => {
    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || 'New Chat',
      messages: [{
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: 'Hello! I\'m your travel assistant. How can I help you plan your trip to Jharkhand today?',
        isUser: false,
        timestamp: now,
        metadata: { type: 'text' }
      }],
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    console.log('✨ Creating new chat session:', newSession);

    // Mark all other sessions as inactive
    setChatSessions(prev => [
      newSession,
      ...prev.map(session => ({ ...session, isActive: false }))
    ]);
    
    setCurrentSession(newSession);
    
    return newSession.id;
  };

  // Switch to existing session
  const switchToSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      console.log('🔄 Switching to session:', sessionId);
      
      // Mark this session as active and others as inactive
      setChatSessions(prev => prev.map(s => ({
        ...s,
        isActive: s.id === sessionId
      })));
      
      setCurrentSession({ ...session, isActive: true });
    }
  };

  // Delete session
  const deleteSession = (sessionId: string) => {
    console.log('🗑️ Deleting session:', sessionId);
    
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      
      // If we deleted the current session, switch to another or create new
      if (currentSession?.id === sessionId) {
        if (filtered.length > 0) {
          const newCurrent = filtered[0];
          setCurrentSession({ ...newCurrent, isActive: true });
          return filtered.map(s => ({ ...s, isActive: s.id === newCurrent.id }));
        } else {
          // No sessions left, create a new one
          const newSession = createInitialSession();
          setCurrentSession(newSession);
          return [newSession];
        }
      }
      
      return filtered;
    });
  };

  // Update session title
  const updateSessionTitle = (sessionId: string, title: string) => {
    console.log('✏️ Updating session title:', sessionId, title);
    
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title, updatedAt: new Date().toISOString() }
        : session
    ));

    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, title } : null);
    }
  };

  // Save current session (useful for manual saves)
  const saveCurrentSession = () => {
    if (currentSession && user) {
      console.log('💾 Manually saving current session');
      localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(chatSessions));
    }
  };

  // Clear all chat data
  const clearAllChatData = () => {
    console.log('🧹 Clearing all user chat data');
    if (user) {
      localStorage.removeItem(getUserStorageKey('chatSessions'));
    }
    setChatSessions([]);
    setCurrentSession(null);
  };

  // Register cleanup function with AuthContext
  useEffect(() => {
    if (user) {
      registerCleanupFunction(clearAllChatData);
      return () => {
        unregisterCleanupFunction(clearAllChatData);
      };
    }
  }, [user, registerCleanupFunction, unregisterCleanupFunction]);

  const value = {
    currentSession,
    chatSessions,
    addMessage,
    clearCurrentSession,
    createNewSession,
    switchToSession,
    deleteSession,
    updateSessionTitle,
    saveCurrentSession,
    clearAllChatData,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};