import { useState, useEffect, useRef } from 'react';
import { Send, Mic, HelpCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useChatHistory } from '../context/ChatHistoryContext';
import { API_ENDPOINTS } from '../config/api';

export default function Chatbot() {
  const { t } = useLanguage();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    currentSession,
    addMessage,
    createNewSession
  } = useChatHistory();
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll only the chat container to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

  // Ensure user has a persistent chat session - ONLY run once on mount
  useEffect(() => {
    if (!currentSession) {
      console.log('🔧 Creating initial chat session');
      createNewSession('My Chat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once!

  // Add welcome message if session exists but has no messages
  useEffect(() => {
    if (currentSession && currentSession.messages.length === 0) {
      console.log('👋 Adding welcome message to session:', currentSession.id);
      addMessage(
        t('chatbot.welcome'),
        false,
        { type: 'text' }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession?.id]); // Only run when session ID changes

  const faqItems = [
    t('chatbot.howToReach'),
    t('chatbot.localFood'),
    t('chatbot.emergency'),
    t('chatbot.bestTime'),
    t('chatbot.tribalCulture'),
    t('chatbot.safari')
  ];

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isLoading && currentSession) {
      const currentMessage = newMessage.trim();
      const currentMessages = currentSession.messages;
      
      console.log('📤 Sending message:', currentMessage);
      console.log('📊 Current messages before send:', currentMessages.length);
      
      // Clear input immediately
      setNewMessage('');
      
      // Add user message to UI
      addMessage(currentMessage, true, { type: 'text' });
      
      setIsLoading(true);
      
      try {
        // Build conversation history including the message we just added
        const conversationHistory = [
          ...currentMessages.slice(-9).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          })),
          {
            role: 'user',
            content: currentMessage
          }
        ];
        
        console.log('🔄 Calling API with history length:', conversationHistory.length);
        
        // Call the backend chatbot API
        const response = await fetch(API_ENDPOINTS.CHATBOT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMessage,
            conversationHistory: conversationHistory
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('✅ API response received:', data.success);
        
        if (data.success) {
          console.log('📥 Adding bot response');
          addMessage(
            data.response,
            false,
            {
              type: 'text',
              suggestions: data.quickActions || []
            }
          );
          console.log('✅ Bot response added');
        } else {
          throw new Error(data.message || 'Failed to get response');
        }
      } catch (error) {
        console.error('❌ Error calling chatbot API:', error);
        addMessage(
          `Sorry, I'm having trouble connecting right now. Please try again later. (Error: ${error instanceof Error ? error.message : 'Unknown error'})`,
          false,
          { type: 'error' }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFAQClick = (question: string) => {
    if (!isLoading && currentSession) {
      const currentMessages = currentSession.messages;
      
      // Add the FAQ question as a user message
      addMessage(question, true, { type: 'text' });
      
      setIsLoading(true);
      
      (async () => {
        try {
          // Build conversation history including the message we just added
          const conversationHistory = [
            ...currentMessages.slice(-9).map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: question
            }
          ];
          
          const response = await fetch(API_ENDPOINTS.CHATBOT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: question,
              conversationHistory: conversationHistory
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.success) {
            addMessage(
              data.response,
              false,
              {
                type: 'text',
                suggestions: data.quickActions || []
              }
            );
          } else {
            throw new Error(data.message || 'Failed to get response');
          }
        } catch (error) {
          console.error('❌ Error calling chatbot API:', error);
          addMessage(
            `Sorry, I'm having trouble connecting right now. Please try again later.`,
            false,
            { type: 'error' }
          );
        } finally {
          setIsLoading(false);
        }
      })();
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center space-x-3">
            <MessageCircle className="w-8 h-8 text-green-600" />
            <span>{t('chatbot.title')}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('chatbot.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Chat Interface */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center ring-2 ring-green-50 dark:ring-green-900">
                  <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('chatbot.guideName')}</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('chatbot.status')}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full font-medium border border-green-100 dark:border-green-900/50">
                  AI Assistant
                </span>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-black/20 scroll-smooth"
            >
              {currentSession?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex max-w-[85%] lg:max-w-[75%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                    
                    {/* Avatar for Bot */}
                    {!message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mb-1">
                        <MessageCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                    )}

                    <div
                      className={`px-5 py-3.5 shadow-sm ${
                        message.isUser
                          ? 'bg-green-600 text-white rounded-2xl rounded-tr-sm'
                          : message.metadata?.type === 'error'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-2xl rounded-tl-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                          <p className="text-xs font-medium opacity-70 mb-1">Suggested actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setNewMessage(suggestion);
                                  handleSendMessage();
                                }}
                                className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <p
                        className={`text-[10px] mt-1.5 text-right ${
                          message.isUser ? 'text-green-100/80' : 'text-gray-400'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </div>
              )) || []}
              
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mb-1">
                      <MessageCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex space-x-3 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 pl-4 pr-12 py-3.5 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 shadow-sm"
                />
                <div className="absolute right-[70px] top-1/2 -translate-y-1/2 flex items-center space-x-1">
                   <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                      <Mic className="w-4 h-4" />
                   </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="p-3.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none active:scale-95"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                AI can make mistakes. Please verify important information.
              </p>
            </div>
          </div>

          {/* FAQ Sidebar */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-green-600" />
                <span>{t('chatbot.quickQuestions')}</span>
              </h3>
              <div className="space-y-2">
                {faqItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleFAQClick(item)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium transition-all duration-200 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <h4 className="font-bold mb-1 relative z-10">Pro Tip</h4>
              <p className="text-xs text-green-50/90 relative z-10 leading-relaxed">
                Ask me in Hindi or your local language! I can help in multiple languages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}