import { useState, useEffect, useRef } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';
import { Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useChat } from '@/contexts/ChatContext';

interface MeetingChatProps {
  onClose: () => void;
}

const MeetingChat = ({ onClose }: MeetingChatProps) => {
  const { user } = useUser();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const { messages, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user) return;

    console.log('Sending message:', {
      userId: user.id,
      userName: user.username || user.firstName || user.id,
      text: inputMessage.trim(),
    });

    sendMessage({
      userId: user.id,
      userName: user.username || user.firstName || user.id,
      userImage: user.imageUrl,
      text: inputMessage.trim(),
    });

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getUserName = (userId: string, userName?: string) => {
    if (userId === user?.id) return 'You';
    
    // Try to get name from message first
    if (userName) return userName;
    
    // Try to get from participant data
    const participant = participants.find((p) => p.userId === userId);
    if (participant?.name) return participant.name;
    
    // Fallback to userId
    return userId || 'Unknown';
  };

  const getUserImage = (userId: string, userImage?: string) => {
    if (userId === user?.id) return user?.imageUrl;
    
    // Try to get image from message first
    if (userImage) return userImage;
    
    // Try to get from participant data
    const participant = participants.find((p) => p.userId === userId);
    return participant?.image || undefined;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-86px)] w-[350px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4 transition-colors">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
        <h2 className="text-lg font-semibold text-dark-2 dark:text-white">Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-dark-2 dark:text-white hover:bg-light-3 dark:hover:bg-dark-3"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-dark-2/60 dark:text-white/60">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.userId === user?.id;
            const displayName = getUserName(message.userId, message.userName);
            const displayImage = getUserImage(message.userId, message.userImage);

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* User Avatar */}
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-royal-1 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`flex flex-col max-w-[75%] ${
                    isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      isCurrentUser
                        ? 'bg-royal-1 text-white'
                        : 'bg-light-3 dark:bg-dark-3 text-dark-2 dark:text-white'
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {displayName}
                      </p>
                    )}
                    <p className="text-sm break-words">{message.text}</p>
                  </div>
                  <p className="text-xs text-dark-2/60 dark:text-white/60 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-light-4 dark:border-dark-4">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border-light-4 dark:border-dark-4 bg-light-2 dark:bg-dark-3 text-dark-2 dark:text-white placeholder:text-dark-2/50 dark:placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-royal-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-royal-1 hover:bg-royal-2 text-white disabled:opacity-50"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;

