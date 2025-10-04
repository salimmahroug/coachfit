import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour! 👋 Je suis votre assistant Coach Fit IA. Comment puis-je vous aider aujourd'hui?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(import.meta.env.VITE_AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_AI_MODEL,
          messages: [
            {
              role: "system",
              content: `Tu es un assistant virtuel expert en fitness et coaching sportif pour l'application Coach Fit. 
              Tu aides les coachs et leurs clients avec des conseils sur:
              - La création de programmes d'entraînement personnalisés
              - Les conseils nutritionnels
              - La motivation et le suivi des progrès
              - Les techniques d'exercices
              - La prévention des blessures
              - La gestion des clients
              Sois amical, encourageant et professionnel. Réponds en français de manière concise et claire.
              Utilise des emojis quand c'est approprié pour rendre la conversation plus vivante.`,
            },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            {
              role: "user",
              content: currentInput,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.choices[0].message.content,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur s'est produite. Veuillez réessayer. 😔",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:scale-110 z-50 flex items-center justify-center text-white group"
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {isOpen && (
        <Card className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[420px] sm:h-[650px] sm:max-h-[90vh] shadow-2xl z-50 flex flex-col border-0 sm:border-2 sm:rounded-lg animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-primary text-white sm:rounded-t-lg p-3 sm:p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                  <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold">Assistant Coach IA</CardTitle>
                  <p className="text-xs opacity-90 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="hidden sm:inline">En ligne • </span>Propulsé par Groq
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 sm:h-9 sm:w-9 text-white hover:bg-white/20 rounded-md flex items-center justify-center transition-all hover:rotate-90 duration-300"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col bg-gradient-to-b from-muted/5 to-muted/20 overflow-hidden min-h-0">
            <ScrollArea className="flex-1 p-3 sm:p-4 h-full">
              <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">{/* Espacement responsive pour la scrollbar */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-in slide-in-from-bottom-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="h-5 w-5 text-gray-700" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                      <span className={`text-xs mt-1.5 block ${message.sender === "user" ? "opacity-80" : "opacity-60"}`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {message.sender === "user" && (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Élément invisible pour le scroll automatique */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t bg-white p-3 sm:p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  disabled={isTyping}
                  className="flex-1 rounded-full border-2 focus:border-primary transition-colors px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || !input.trim()}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center text-white shadow-md"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
