/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  MessageSquare, 
  BookOpen, 
  ShoppingBag, 
  User, 
  Drum,
  Settings,
  ChevronRight,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChatInterface from "./components/ChatInterface";
import LessonPlanner from "./components/LessonPlanner";
import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import TeacherBooking from "./components/TeacherBooking";
import { cn } from "./lib/utils";

type Tab = "chat" | "lessons" | "booking" | "market" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const tabs = [
    { id: "chat", label: "AI 导师", icon: MessageSquare },
    { id: "lessons", label: "教案备课", icon: BookOpen },
    { id: "booking", label: "预约老师", icon: User },
    { id: "market", label: "会员订阅", icon: Crown },
    { id: "profile", label: "个人中心", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <Drum size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">DrumMaster AI</h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Professional Drumming</p>
          </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <Settings size={20} className="text-neutral-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="pb-24 max-w-4xl mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "chat" && <ChatInterface />}
            {activeTab === "lessons" && <LessonPlanner />}
            {activeTab === "booking" && <TeacherBooking />}
            {activeTab === "market" && <Marketplace />}
            {activeTab === "profile" && <Profile />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200 relative",
                isActive ? "text-orange-600" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-3 w-1 h-1 bg-orange-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

