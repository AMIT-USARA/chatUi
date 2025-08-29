import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
  id: string;
  title: string;
} 

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSwitchConversation: (id: string) => void;
}

const NewChatIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
  </svg>
);

const ChatHistoryIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
  </svg>
);

const BrandIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/>
  </svg>
);

const CollapseIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-8 h-4"
    animate={{ rotate: isCollapsed ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"/>
  </motion.svg>
);

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSwitchConversation,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 shadow-2xl border-r border-slate-700 relative overflow-hidden"
      animate={{ 
        width: isCollapsed ? '80px' : '288px' 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50 relative">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
          <BrandIcon />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
            >
              AURA
            </motion.h1>
          )}
        </AnimatePresence>
        
        {/* Collapse Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors duration-200 border border-slate-600 shadow-lg z-10"
        >
          <CollapseIcon isCollapsed={isCollapsed} />
        </motion.button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className={`flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white font-medium shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 hover:shadow-xl ${
            isCollapsed ? 'justify-center' : 'justify-center'
          }`}
        >
          <NewChatIcon />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                New Conversation
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3"
            >
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Recent Chats
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-1">
          {conversations.length > 0 ? (
            conversations.map((convo, index) => (
              <motion.div
                key={convo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSwitchConversation(convo.id)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-sm transition-all duration-200 relative ${
                  activeConversationId === convo.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`flex-shrink-0 transition-colors duration-200 ${
                  activeConversationId === convo.id 
                    ? 'text-blue-400' 
                    : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  <ChatHistoryIcon />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <>
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate font-medium leading-relaxed"
                      >
                        {convo.title}
                      </motion.span>
                      {activeConversationId === convo.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 ml-auto"
                        />
                      )}
                    </>
                  )}
                </AnimatePresence>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                    {convo.title}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            !isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-12 px-4"
              >
                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                  <ChatHistoryIcon />
                </div>
                <p className="text-slate-400 text-center text-sm leading-relaxed">
                  No conversations yet.<br />
                  <span className="text-slate-500">Start a new chat to begin!</span>
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50"
          >
            <div className="flex items-center justify-center">
              <p className="text-xs text-slate-400 font-medium">
                Powered by <span className="text-slate-300">AURA</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};