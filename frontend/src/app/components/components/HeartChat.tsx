import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Heart, Sparkles, MessageCircle, X, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface HeartChatProps {
  onClose?: () => void;
}

export default function HeartChat({ onClose }: HeartChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hi there! 💖 I'm your Heart Health Assistant! You can talk to me about your cardiovascular health, and I'll help answer your questions. Just tap the mic button and start speaking!",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionInitialized, setRecognitionInitialized] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only check if speech recognition is supported, don't initialize yet
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `unsupported-${Date.now()}`,
          text: "Oops! 😢 Your browser doesn't fully support speech features. For the best experience, try using Chrome, Edge, or Safari.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }

    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeRecognition = () => {
    if (recognitionInitialized || !speechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPart + " ";
        } else {
          interimText += transcriptPart;
        }
      }

      setInterimTranscript(interimText);
      // If we have a finalized segment, send it immediately to the chat
      if (finalText) {
        const finalTrimmed = finalText.trim();
        if (finalTrimmed) {
          // Clear any saved transcript state and interim text
          setTranscript("");
          setInterimTranscript("");
          // Send finalized speech to backend
          handleUserMessage(finalTrimmed);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setMessages((prev) => [
          ...prev,
          {
            id: `permission-denied-${Date.now()}`,
            text: "🎤 Microphone access was denied. Please allow microphone permissions in your browser settings to use voice chat!",
            sender: "assistant",
            timestamp: new Date(),
          },
        ]);
      }
    };

    recognition.onend = () => {
      // Stop state; final segments are handled in onresult to avoid duplicates
      setIsListening(false);
      setTranscript("");
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    setRecognitionInitialized(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    }
  };

  const handleUserMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading indicator
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      text: "thinking...",
      sender: "assistant",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Call backend API
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantResponse = data.response || "Sorry, I couldn't process that. Please try again.";

      // Remove loading message and add actual response
      setMessages((prev) => 
        prev.filter((msg) => msg.id !== `loading-${Date.now() - 1}`).filter((msg) => !msg.id.startsWith("loading-"))
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: assistantResponse,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response
      speakText(assistantResponse);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Remove loading message and add error message
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("loading-")));

      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running on port 5001.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  const speakText = (text: string) => {
    if (!synthesisRef.current) return;

    try {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    synthesisRef.current?.cancel();
    setIsSpeaking(false);
  };

  if (!speechSupported) {
    return (
      <Card className="p-6 border-2 border-pink-200 bg-white shadow-xl max-w-md">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" fill="currentColor" />
          <h3 className="font-bold text-gray-900 mb-2">Speech Not Supported</h3>
          <p className="text-sm text-gray-600">
            Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] flex flex-col"
    >
      <Card className="border-3 border-pink-300 bg-white shadow-2xl flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-6 h-6 text-white" fill="white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-1">
                Heart Chat
                <Sparkles className="w-4 h-4" fill="white" />
              </h3>
              <p className="text-xs text-pink-100">Your AI Health Assistant</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-pink-50 to-red-50">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                      : "bg-white border-2 border-pink-200 text-gray-800 shadow-md"
                  }`}
                >
                  {message.sender === "assistant" && (
                    <div className="flex items-center gap-1 mb-1">
                      <Heart className="w-3 h-3 text-pink-500" fill="currentColor" />
                      <span className="text-xs font-bold text-pink-600">Heart Helper</span>
                    </div>
                  )}
                  {message.text === "thinking..." ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 text-pink-500 animate-spin" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-pink-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Interim transcript indicator */}
          {interimTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-pink-100 border-2 border-pink-300 border-dashed">
                <p className="text-sm text-gray-600 italic">{interimTranscript}...</p>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t-2 border-pink-200">
          <div className="flex items-center justify-center gap-4">
            {/* Microphone Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onMouseDown={() => {
                  initializeRecognition();
                  // start recognition while pressed
                  try { recognitionRef.current?.start(); } catch {}
                }}
                onMouseUp={() => {
                  try { recognitionRef.current?.stop(); } catch {}
                }}
                onMouseLeave={() => {
                  // If user drags out while holding, stop listening
                  try { recognitionRef.current?.stop(); } catch {}
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  initializeRecognition();
                  try { recognitionRef.current?.start(); } catch {}
                }}
                onTouchEnd={() => {
                  try { recognitionRef.current?.stop(); } catch {}
                }}
                onClick={() => {
                  // Fallback for keyboard/click users - toggle
                  initializeRecognition();
                  toggleListening();
                }}
                size="lg"
                className={`rounded-full h-16 w-16 shadow-lg transition-all ${
                  isListening
                    ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 animate-pulse"
                    : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </Button>
            </motion.div>

            {/* Speaker Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                size="lg"
                variant="outline"
                className={`rounded-full h-12 w-12 border-2 border-pink-300 ${
                  isSpeaking ? "bg-pink-100" : ""
                }`}
              >
                {isSpeaking ? (
                  <Volume2 className="w-6 h-6 text-pink-600 animate-pulse" />
                ) : (
                  <VolumeX className="w-6 h-6 text-gray-400" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Status text */}
          <div className="text-center mt-3">
            {isListening ? (
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm font-bold text-pink-600 flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening...
              </motion.p>
            ) : isSpeaking ? (
              <p className="text-sm font-bold text-purple-600 flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" />
                Speaking...
              </p>
            ) : (
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                Tap the mic to speak
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Decorative floating hearts */}
      <div className="absolute -top-2 -right-2 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
        </motion.div>
      </div>
    </motion.div>
  );
}