import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Trash2, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface ChatbotPageProps {
  className?: string;
}

const ChatbotPage = ({ className }: ChatbotPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Matsya AI, your marine research assistant. I can help you with species identification, eDNA analysis, oceanographic data interpretation, and marine research methodology. What would you like to explore today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Identify a fish species",
        "Analyze eDNA sequences", 
        "Interpret oceanographic data",
        "Research methodology guidance"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationStats, setConversationStats] = useState({ message_count: 0, topics: [] });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const userId = 'user_' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = useCallback(() => {
    try {
      const wsUrl = `ws://localhost:8001/ws/chat/${userId}`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Connected to chat WebSocket');
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('Disconnected from chat WebSocket');
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [userId]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'connected':
        // Initial connection message
        break;
        
      case 'chunk':
        // Streaming response chunk
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.type === 'assistant' && lastMessage.id === 'streaming') {
            // Update streaming message
            return prev.map(msg => 
              msg.id === 'streaming' 
                ? { ...msg, content: msg.content + data.content }
                : msg
            );
          } else {
            // Start new streaming message
            return [...prev, {
              id: 'streaming',
              type: 'assistant',
              content: data.content,
              timestamp: data.timestamp
            }];
          }
        });
        break;
        
      case 'complete':
        // Streaming complete, add suggestions and finalize message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === 'streaming' 
              ? { ...msg, id: Date.now().toString(), suggestions: data.suggestions }
              : msg
          )
        );
        setIsLoading(false);
        break;
        
      case 'error':
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: `I apologize, but I encountered an error: ${data.error}. Please try again.`,
          timestamp: data.timestamp
        }]);
        setIsLoading(false);
        break;
        
      case 'cleared':
        setMessages([{
          id: Date.now().toString(),
          type: 'assistant',
          content: "Conversation cleared! How can I help you with your marine research today?",
          timestamp: new Date().toISOString()
        }]);
        break;
        
      case 'summary':
        setConversationStats(data.data);
        break;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // If not connected, fall back to HTTP API
    if (!isConnected) {
      await sendMessageHttp();
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Send message via WebSocket
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        message: inputMessage,
        include_context: true
      }));
    }
  };

  const sendMessageHttp = async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', messageToSend);
      formData.append('user_id', userId);
      formData.append('include_context', 'true');
      
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
          suggestions: data.suggestions
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I apologize, but I'm having trouble connecting to the AI service. Please ensure the backend is running on localhost:8001. Error: ${error}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  const clearConversation = () => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({ type: 'clear' }));
    } else {
      setMessages([{
        id: Date.now().toString(),
        type: 'assistant',
        content: "Conversation cleared! How can I help you with your marine research today?",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const getConversationSummary = () => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({ type: 'summary' }));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full max-w-4xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <CardTitle>Matsya AI - Marine Research Assistant</CardTitle>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected (WebSocket)" : "HTTP Fallback"}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={getConversationSummary}
                className="flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Stats</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
          
          {conversationStats.message_count > 0 && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{conversationStats.message_count} messages</span>
              {conversationStats.topics.length > 0 && (
                <div className="flex space-x-1">
                  <span>Topics:</span>
                  {conversationStats.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`flex items-start space-x-2 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about marine species, eDNA analysis, oceanographic data..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="flex items-center space-x-1"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            {isConnected ? 
              "Connected to Matsya AI via WebSocket. Real-time streaming responses enabled." :
              "Using HTTP fallback. Start the backend server for real-time chat."
            }
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;