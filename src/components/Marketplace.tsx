import { useState } from "react";
import { ShoppingCart, Search, Tag, Filter, Star, Crown, CheckCircle2, Zap, X, CreditCard, Wallet, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

const PRODUCTS = [
  {
    id: 1,
    name: "Roland TD-17KVX 电子鼓",
    price: "12,800",
    condition: "全新",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=400&h=300",
    tag: "热门"
  },
  {
    id: 2,
    name: "Zildjian K Custom 镲片套装",
    price: "6,500",
    condition: "二手 (95新)",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&q=80&w=400&h=300",
    tag: "高性价比"
  },
  {
    id: 3,
    name: "Vic Firth 5A 鼓棒 (12双)",
    price: "880",
    condition: "全新",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?auto=format&fit=crop&q=80&w=400&h=300",
    tag: "消耗品"
  },
  {
    id: 4,
    name: "Yamaha Stage Custom 爵士鼓",
    price: "5,200",
    condition: "二手 (8成新)",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=400&h=300",
    tag: "经典"
  }
];

const SUBSCRIPTIONS = [
  {
    type: "plus",
    title: "Plus 会员",
    subtitle: "适合初学者",
    price: 29,
    features: ["每月 50 次 AI 导师对话", "基础教案库查看", "高清图解预览", "商城 9.5 折优惠"],
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-700",
    popular: false
  },
  {
    type: "pro",
    title: "Pro 专家版",
    subtitle: "进阶鼓手首选",
    price: 99,
    features: ["每月 150 次 AI 导师对话", "每月 50 次教案生成", "PDF 导出与打印", "高清图解原图下载"],
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
    popular: true
  },
  {
    type: "max",
    title: "Max 旗舰版",
    subtitle: "专业老师/工作室",
    price: 299,
    features: ["无限次 AI 导师对话", "无限次教案生成", "学生预约管理系统", "专属 1对1 技术支持"],
    color: "bg-neutral-900",
    lightColor: "bg-neutral-100",
    textColor: "text-neutral-900",
    popular: false
  }
];

export default function Marketplace() {
  const [selectedPlan, setSelectedPlan] = useState<typeof SUBSCRIPTIONS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"alipay" | "wechat" | "card">("alipay");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedPlan(null);
      alert("支付成功！感谢订阅 DrumMaster AI 会员。");
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-10 relative">
      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">确认订阅订单</h3>
                  <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-500 text-sm">订阅方案</span>
                    <span className="font-bold">{selectedPlan.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-sm">支付金额</span>
                    <span className="text-xl font-black text-orange-600">¥{selectedPlan.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">选择支付方式</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setPaymentMethod("alipay")}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        paymentMethod === "alipay" ? "border-blue-500 bg-blue-50/50" : "border-neutral-100 hover:border-neutral-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Smartphone size={20} />
                        </div>
                        <span className="font-bold text-sm">支付宝支付</span>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentMethod === "alipay" ? "border-blue-500 bg-blue-500" : "border-neutral-200")}>
                        {paymentMethod === "alipay" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("wechat")}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        paymentMethod === "wechat" ? "border-green-500 bg-green-50/50" : "border-neutral-100 hover:border-neutral-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                          <Wallet size={20} />
                        </div>
                        <span className="font-bold text-sm">微信支付</span>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentMethod === "wechat" ? "border-green-500 bg-green-500" : "border-neutral-200")}>
                        {paymentMethod === "wechat" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        paymentMethod === "card" ? "border-neutral-900 bg-neutral-50" : "border-neutral-100 hover:border-neutral-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-neutral-900/20">
                          <CreditCard size={20} />
                        </div>
                        <span className="font-bold text-sm">银行卡支付</span>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentMethod === "card" ? "border-neutral-900 bg-neutral-900" : "border-neutral-200")}>
                        {paymentMethod === "card" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? "正在处理支付..." : "立即支付"}
                </button>
                <p className="text-[10px] text-neutral-400 text-center">支付即代表您同意《DrumMaster 会员服务协议》</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Subscription Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">选择您的进阶方案</h2>
          <p className="text-neutral-500 text-sm">解锁 DrumMaster AI 的全部潜能，开启专业鼓手之路</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTIONS.map((sub) => (
            <motion.div
              key={sub.type}
              whileHover={{ y: -8 }}
              className={cn(
                "bg-white rounded-[2.5rem] border p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                sub.popular ? "border-blue-500 ring-4 ring-blue-500/10 shadow-2xl" : "border-neutral-100 shadow-sm"
              )}
            >
              {sub.popular && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  最受欢迎
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{sub.title}</h3>
                  <p className="text-xs text-neutral-400 font-medium">{sub.subtitle}</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">¥{sub.price}</span>
                    <span className="text-neutral-400 text-sm">/月</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {sub.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-neutral-600 leading-tight">
                      <CheckCircle2 size={16} className={cn("shrink-0", sub.textColor)} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => setSelectedPlan(sub)}
                className={cn(
                  "w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95",
                  sub.color
                )}
              >
                立即开启
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Marketplace Section - Renamed to Member Benefits */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-orange-500" size={20} />
            <h2 className="text-xl font-bold">会员专属权益</h2>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="搜索乐器、配件、二手设备..."
              className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-neutral-200 rounded-2xl text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["全部", "电子鼓", "爵士鼓", "镲片", "鼓棒", "配件", "二手专区"].map((cat, i) => (
            <button
              key={i}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                i === 0 ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white border border-neutral-200 text-neutral-600 hover:border-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-40 bg-neutral-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-orange-600 shadow-sm">
                  {product.tag}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-neutral-500">{product.rating}</span>
                    <span className="text-[10px] text-neutral-300 mx-1">|</span>
                    <span className="text-[10px] text-neutral-400">{product.condition}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-orange-600 font-black text-base">¥{product.price}</span>
                  <button className="p-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
