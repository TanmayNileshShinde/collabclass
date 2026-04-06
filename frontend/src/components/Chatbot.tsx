import { useState, useRef, useEffect } from "react";
import { Send, Bot, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatbotMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI assistant. How can I help you with your meeting today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input.trim(),
            conversationHistory: messages.slice(-5).map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.text,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text:
          data.response || "I apologize, but I couldn't process that request.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-12" : "w-80 h-96"
      }`}
    >
      <div className="glassmorphism-card rounded-xl border border-white/10 shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-green-400" />
            <span className="text-sm font-medium text-white">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-white/60 hover:text-white"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </Button>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      message.isUser
                        ? "bg-blue-500 text-white ml-2"
                        : "bg-gray-700 text-white mr-2"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about the meeting..."
                  disabled={isLoading}
                  className="flex-1 glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="glassmorphism-button-active hover:glassmorphism-button-hover"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Send size={14} />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
