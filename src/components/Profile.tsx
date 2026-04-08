import { User, Settings, History, Heart, CreditCard, LogOut, ChevronRight, Award, Music } from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const stats = [
    { label: "练习时长", value: "128h", icon: History, color: "text-blue-500" },
    { label: "掌握技巧", value: "42", icon: Award, color: "text-orange-500" },
    { label: "收藏教案", value: "15", icon: Heart, color: "text-red-500" },
  ];

  const menuItems = [
    { label: "我的订单", icon: CreditCard },
    { label: "学习进度", icon: Music },
    { label: "系统设置", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* User Card */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 border-4 border-white shadow-lg overflow-hidden">
          <img 
            src="https://picsum.photos/seed/avatar/200" 
            alt="Avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-xl">张老师 (Drummer)</h2>
          <p className="text-sm text-neutral-500">专业架子鼓教师 | 10年教龄</p>
          <div className="mt-2 flex gap-2">
            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Pro Teacher</span>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">Verified</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm text-center space-y-1">
            <div className={`w-8 h-8 mx-auto rounded-xl bg-neutral-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="font-black text-lg">{stat.value}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-600 flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <span className="font-bold text-sm text-neutral-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </button>
        ))}
      </div>

      <button className="w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded-3xl transition-colors">
        <LogOut size={18} />
        退出登录
      </button>

      {/* Recommendation Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm px-2 text-neutral-500 uppercase tracking-wider">为你推荐</h3>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl text-white shadow-lg shadow-orange-500/30 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-1">进阶大师课：双踩技巧</h4>
            <p className="text-xs text-orange-100 mb-4">基于你的练习数据，我们推荐你学习这门课程。</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-xl font-bold text-xs shadow-sm">
              立即查看
            </button>
          </div>
          <Music className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </div>
      </div>
    </div>
  );
}
