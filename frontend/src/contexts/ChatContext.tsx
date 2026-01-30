import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const call = useCall();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Listen for call custom data changes for chat messages
  useEffect(() => {
    if (!call) return;

    let lastMessageCount = 0;

    const handleCustomDataUpdate = () => {
      const customMessages = call.state.custom?.chatMessages;
      if (Array.isArray(customMessages)) {
        const currentCount = customMessages.length;
        
        // Only update if we have new messages
        if (currentCount > lastMessageCount) {
          setMessages(customMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })));
          lastMessageCount = currentCount;
        }
      }
    };

    // Initial load
    handleCustomDataUpdate();

    // Set up polling for updates
    const interval = setInterval(handleCustomDataUpdate, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [call]);

  const sendMessage = useCallback(async (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!call) {
      console.error('No call available for sending message');
      return;
    }

    const message: ChatMessage = {
      ...messageData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    try {
      console.log('Attempting to send message:', message);
      
      // Try to update call custom data
      const currentMessages = call.state.custom?.chatMessages || [];
      const updatedMessages = [
        ...currentMessages,
        {
          ...message,
          timestamp: message.timestamp.toISOString(),
        },
      ];

      await call.update({
        custom: {
          ...call.state.custom,
          chatMessages: updatedMessages.slice(-100),
        },
      });

      console.log('Message sent successfully');
      
      // Update local state immediately
      setMessages(updatedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })));
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add to local state as fallback
      setMessages((prev) => [...prev, message]);
      
      // Show user-friendly error
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('not allowed')) {
          alert('You do not have permission to send messages in this meeting.');
        } else {
          alert('Message sent locally. Other participants may not see it.');
        }
      }
    }
  }, [call]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (call) {
      call.update({
        custom: {
          ...call.state.custom,
          chatMessages: [],
        },
      }).catch(console.error);
    }
  }, [call]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

