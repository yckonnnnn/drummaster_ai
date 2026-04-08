import { useState, useEffect } from "react";
import { FileText, Download, Plus, Trash2, Loader2, CheckCircle, FileDown, History, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getDrumAIResponse, generateDrumImage } from "../lib/gemini";
// @ts-ignore - html2pdf.js might not have types installed
import html2pdf from "html2pdf.js";
import { cn } from "../lib/utils";

interface LessonHistory {
  id: string;
  topic: string;
  level: string;
  content: string;
  image: string | null;
  timestamp: number;
}

export default function LessonPlanner() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("初级");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [lessonImage, setLessonImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<LessonHistory[]>(() => {
    const saved = localStorage.getItem("drum_lesson_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("drum_lesson_history", JSON.stringify(history));
  }, [history]);

  const generatePlan = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setLessonImage(null);
    try {
      const prompt = `请为我生成一份关于“${topic}”的${level}架子鼓教案。包含教学目标、重难点、详细教学步骤和课后作业。请使用Markdown格式。`;
      
      // Generate text and image in parallel for efficiency
      const [response, image] = await Promise.all([
        getDrumAIResponse(prompt),
        generateDrumImage(`Technical diagram for a drum lesson about ${topic} (${level} level)`)
      ]);

      setLessonPlan(response || "");
      setLessonImage(image);

      // Add to history
      const newLesson: LessonHistory = {
        id: Date.now().toString(),
        topic,
        level,
        content: response || "",
        image: image,
        timestamp: Date.now()
      };
      setHistory(prev => [newLesson, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadFromHistory = (item: LessonHistory) => {
    setTopic(item.topic);
    setLevel(item.level);
    setLessonPlan(item.content);
    setLessonImage(item.image);
    setShowHistory(false);
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const exportToPDF = async () => {
    const element = document.getElementById("lesson-content");
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      const opt = {
        margin: [15, 15] as [number, number],
        filename: `DrumMaster_教案_${topic || "未命名"}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
          logging: false
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as any }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
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
                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors flex items-center gap-2 font-bold"
              >
                关闭预览 ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60]"
            />
            <motion.div 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] bg-white z-[70] border-l border-neutral-100 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">备课历史</h3>
                <button onClick={() => setShowHistory(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 text-sm">暂无备课记录</div>
                ) : (
                  history.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="group p-4 bg-neutral-50 rounded-2xl border border-transparent hover:border-blue-200 cursor-pointer transition-all relative"
                    >
                      <h4 className="font-bold text-sm text-neutral-800 truncate pr-6">{item.topic}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">{item.level}</span>
                        <span className="text-[10px] text-neutral-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="absolute top-4 right-4 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
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

      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h2 className="font-bold text-lg">智能教案生成器</h2>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-blue-600 transition-colors"
          >
            <History size={14} /> 备课历史
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">课程主题</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：基本功练习、爵士乐节奏..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">学生程度</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option>入门</option>
              <option>初级</option>
              <option>中级</option>
              <option>高级</option>
            </select>
          </div>
        </div>

        <button
          onClick={generatePlan}
          disabled={!topic || isGenerating}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              正在生成专业教案...
            </>
          ) : (
            <>
              <Plus size={18} />
              生成教案
            </>
          )}
        </button>
      </div>

      {lessonPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden"
        >
          <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-600 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> 教案预览
            </span>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="text-xs bg-white border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5 font-bold text-neutral-700 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  正在导出...
                </>
              ) : (
                <>
                  <FileDown size={14} />
                  导出 PDF
                </>
              )}
            </button>
          </div>
          <div id="lesson-content" style={{ backgroundColor: '#ffffff', color: '#262626', padding: '2rem' }} className="prose max-w-none">
            {lessonImage && (
              <div 
                className="lesson-image-container group relative cursor-zoom-in" 
                style={{ marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e5e5', backgroundColor: '#ffffff' }}
                onClick={() => setSelectedImage(lessonImage)}
              >
                <img 
                  src={lessonImage} 
                  alt="Lesson Technical Diagram" 
                  style={{ width: '100%', height: 'auto', margin: 0 }}
                  className="transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-blue-500" /> 点击查看大图
                  </div>
                </div>
                <div style={{ backgroundColor: '#f9f9f9', padding: '0.5rem 1rem', fontSize: '10px', fontWeight: 'bold', color: '#737373', borderTop: '1px solid #f5f5f5' }}>
                  专业教学图解：{topic}
                </div>
              </div>
            )}
            <div style={{ color: '#262626' }}>
              <ReactMarkdown>{lessonPlan}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
