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

    const handleEvent = (event: any) => {
      if (event.type === "custom" && event.custom?.type === "chat-message") {
        const msg = event.custom.message;

        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            timestamp: new Date(msg.timestamp),
          },
        ]);
      }
    };

    (call as any).on("custom", handleEvent);

    return () => {
      (call as any).off("custom", handleEvent);
    };
  }, [call]);

  const sendMessage = useCallback(async (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!call) return;

    const message: ChatMessage = {
      ...messageData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    try {
      await call.sendCustomEvent({
        type: "chat-message",
        message: {
          ...message,
          timestamp: message.timestamp.toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to send message", err);
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

