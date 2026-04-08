import { useState, useRef, useEffect } from "react";
import { Send, User, Drum, Image as ImageIcon, RefreshCw, Sparkles, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getDrumAIResponse, generateDrumImage } from "../lib/gemini";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  image?: string;
  suggestions?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

const TypingIndicator = () => (
  <div className="flex gap-1.5 items-center px-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.3, 1, 0.3],
          y: [0, -4, 0]
        }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          delay: i * 0.2,
          ease: "easeInOut"
        }}
        className="w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.4)]"
      />
    ))}
  </div>
);

export default function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("drum_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      content: "你好！我是你的专业架子鼓导师。无论是基础练习、进阶技巧还是乐理问题，我都能为你提供专业的指导。你想聊聊什么？",
      suggestions: ["如何练习单击(Single Stroke)?", "给我推荐一个热身练习", "怎么提高底鼓速度？"]
    }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("drum_chat_history", JSON.stringify(sessions));
  }, [sessions]);

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      {
        id: "1",
        role: "model",
        content: "你好！我是你的专业架子鼓导师。无论是基础练习、进阶技巧还是乐理问题，我都能为你提供专业的指导。你想聊聊什么？",
        suggestions: ["如何练习单击(Single Stroke)?", "给我推荐一个热身练习", "怎么提高底鼓速度？"]
      }
    ]);
    setShowHistory(false);
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      startNewChat();
    }
  };

  const handleGenerateImage = async (msgId: string, content: string) => {
    setIsGeneratingImg(msgId);
    try {
      const image = await generateDrumImage(content.slice(0, 100));
      if (image) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, image } : m));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingImg(null);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.content }));
      const response = await getDrumAIResponse(text, history);
      
      const needsImage = 
        text.includes("怎么") || text.includes("技巧") || text.includes("演示") || text.includes("图解") ||
        response.includes("图示") || response.includes("演示") || response.includes("图解") || response.includes("图谱");

      let image;
      if (needsImage) {
        image = await generateDrumImage(response.slice(0, 200));
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: response || "抱歉，我刚才走神了，请再说一遍。",
        image: image || undefined,
        suggestions: ["不太满意，换个说法", "详细解释一下第一个点", "还有其他建议吗？"]
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);

      // Update or create session
      if (currentSessionId) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId ? { ...s, messages: finalMessages, timestamp: Date.now() } : s
        ));
      } else {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
          id: newId,
          title: text.slice(0, 20) + (text.length > 20 ? "..." : ""),
          timestamp: Date.now(),
          messages: finalMessages
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden relative">
      {/* History Sidebar/Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-white z-50 border-r border-neutral-100 shadow-xl flex flex-col"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-neutral-800">历史对话</h3>
                <button 
                  onClick={startNewChat}
                  className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-xs">暂无历史记录</div>
                ) : (
                  sessions.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => loadSession(s)}
                      className={cn(
                        "group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between",
                        currentSessionId === s.id ? "bg-orange-50 text-orange-700" : "hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate">{s.title}</span>
                        <span className="text-[10px] opacity-50">{new Date(s.timestamp).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={(e) => deleteSession(e, s.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header with History Toggle */}
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-white/50 backdrop-blur-sm z-30">
        <button 
          onClick={() => setShowHistory(true)}
          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors relative"
        >
          <RefreshCw size={18} className="text-neutral-500" />
          {sessions.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
          )}
        </button>
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">AI 导师对话</div>
        <button onClick={startNewChat} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
          <Plus size={18} className="text-neutral-500" />
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Full size illustration" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors flex items-center gap-2 font-bold"
              >
                关闭预览 ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "user" ? "bg-neutral-800 text-white" : "bg-orange-100 text-orange-600"
            )}>
              {msg.role === "user" ? <User size={16} /> : <Drum size={16} />}
            </div>
            
            <div className={cn(
              "max-w-[85%] space-y-2",
              msg.role === "user" ? "items-end text-right" : "items-start"
            )}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-neutral-800 text-white rounded-tr-none" 
                  : "bg-white text-neutral-800 rounded-tl-none border border-neutral-100"
              )}>
                <div className={cn(
                  "prose prose-sm max-w-none",
                  msg.role === "user" ? "prose-invert" : ""
                )}>
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                
                {msg.image && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedImage(msg.image!)}
                    className="mt-3 rounded-xl overflow-hidden border border-neutral-200 shadow-sm cursor-zoom-in group relative"
                  >
                    <img src={msg.image} alt="Technique illustration" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5">
                        <ImageIcon size={12} className="text-orange-500" /> 点击查看大图
                      </div>
                    </div>
                    <div className="bg-neutral-50 px-3 py-1.5 text-[10px] text-neutral-500 flex items-center justify-between border-t border-neutral-100">
                      <div className="flex items-center gap-1.5">
                        <ImageIcon size={10} className="text-orange-500" /> 专业教学图示
                      </div>
                    </div>
                  </motion.div>
                )}

                {msg.role === "model" && !msg.image && (msg.content.includes("图示") || msg.content.includes("演示") || msg.content.includes("图解")) && (
                  <button 
                    onClick={() => handleGenerateImage(msg.id, msg.content)}
                    disabled={isGeneratingImg === msg.id}
                    className="mt-3 flex items-center gap-2 text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingImg === msg.id ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> 正在生成图解...
                      </>
                    ) : (
                      <>
                        <ImageIcon size={12} /> 生成专业教学图解
                      </>
                    )}
                  </button>
                )}
              </div>

              {msg.suggestions && msg.role === "model" && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-full hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
              <Drum size={16} className="animate-pulse" />
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl rounded-tl-none border border-neutral-100 flex items-center">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="询问架子鼓知识或练习方法..."
            className="w-full bg-white border border-neutral-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-neutral-300 transition-colors shadow-md shadow-orange-500/20"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-neutral-400 mt-2 text-center flex items-center justify-center gap-1">
          <Sparkles size={10} /> 由 DrumMaster AI 专业知识库驱动
        </p>
      </div>
    </div>
  );
}
