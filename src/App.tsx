import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BackgroundBeams } from './components/ui/background-beams';

// --- Type Definitions ---
interface Source {
  id: string;
  url: string;
  title: string;
  snippet: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOn,setIsChatOn] = useState<boolean>(false);
  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      const parsedConvos = JSON.parse(savedConversations) as Conversation[];
      setConversations(parsedConvos);
      if (parsedConvos.length > 0) {
        setActiveConversationId(parsedConvos[0].id);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Create new chat
  const handleNewChat = () => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! How can I help you search our knowledge base today?',
        },
      ],
    };
    setIsChatOn(true);
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
  };

  // Switch active conversation
  const handleSwitchConversation = (id: string) => {
    setActiveConversationId(id);
  };

  // Send message handler
  const handleSendMessage = async (messageContent: string) => {
    if (!activeConversationId) return;
    
    const userMessage: Message = { role: 'user', content: messageContent };

    const conversation = conversations.find((c) => c.id === activeConversationId);
    const isFirstUserMessage =
      conversation && conversation.messages.filter((m) => m.role === 'user').length === 0;
    const newTitle = isFirstUserMessage
      ? messageContent.substring(0, 30) + '...'
      : conversation?.title;

    setConversations((prev) =>
      prev.map((convo) =>
        convo.id === activeConversationId
          ? {
              ...convo,
              title: newTitle || convo.title,
              messages: [...convo.messages, userMessage],
            }
          : convo
      )
    );
    setIsLoading(true);

    try {
      const response = await mockApiCall({ message: messageContent });
      const botMessage: Message = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
      };

      setConversations((prev) =>
        prev.map((convo) =>
          convo.id === activeConversationId
            ? { ...convo, messages: [...convo.messages, botMessage] }
            : convo
        )
      );
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Mock API call (replace with real API later) ---
  const mockApiCall = (data: {
    message: string;
  }): Promise<{ data: { answer: string; sources: Source[] } }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            answer: `Here's a response to your message: "${data.message}"`,
            sources: [
              {
                id: uuidv4(),
                url: 'https://example.com',
                title: 'Example Knowledge Source',
                snippet: 'This is a snippet from the example knowledge base.',
              },
            ],
          },
        });
      }, 1200);
    });
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
// bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800
  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950  antialiased">
    <div className="flex h-screen  font-inter antialiased">
      {/* Sidebar Container */}
     {isChatOn && <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-shrink-0 h-full"
      >
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSwitchConversation={handleSwitchConversation}
        />
      </motion.div>}

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 h-full relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-50/30 to-indigo-100/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">
          <AnimatePresence mode="wait">
            {activeConversation ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ChatArea
                  messages={activeConversation.messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.1 }}
                className="h-full"
              >
                <WelcomeScreen onNewChat={handleNewChat}/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Elements */}
        {/* <div className="absolute top-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              AI Ready
            </span>
          </motion.div>
        </div> */}
      </motion.main>

      
      
    </div>
    <BackgroundBeams />
    </div>
  );
}

export default App;
