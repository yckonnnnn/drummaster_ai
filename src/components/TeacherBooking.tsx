import { useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Navigation,
  UserCheck,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: {
    name: string;
    address: string;
    coords: string; // e.g. "31.15, 121.12"
  };
  slots: TimeSlot[];
  price: number;
}

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "1",
    name: "张晓峰",
    avatar: "https://picsum.photos/seed/teacher1/200/200",
    specialty: "爵士鼓 / 基础功",
    rating: 4.9,
    reviewCount: 128,
    location: {
      name: "布鲁斯架子鼓教室",
      address: "上海市青浦区盈港东路158号",
      coords: "31.15, 121.12"
    },
    price: 350,
    slots: [
      { id: "1-1", time: "10:00 - 11:00", isAvailable: true },
      { id: "1-2", time: "14:00 - 15:00", isAvailable: false },
      { id: "1-3", time: "16:00 - 17:00", isAvailable: true },
    ]
  },
  {
    id: "2",
    name: "李美玲",
    avatar: "https://picsum.photos/seed/teacher2/200/200",
    specialty: "流行鼓 / 舞台表演",
    rating: 4.8,
    reviewCount: 95,
    location: {
      name: "节奏工坊",
      address: "上海市徐汇区虹桥路3号",
      coords: "31.18, 121.43"
    },
    price: 400,
    slots: [
      { id: "2-1", time: "09:00 - 10:00", isAvailable: true },
      { id: "2-2", time: "11:00 - 12:00", isAvailable: true },
      { id: "2-3", time: "15:00 - 16:00", isAvailable: false },
    ]
  },
  {
    id: "3",
    name: "王大伟",
    avatar: "https://picsum.photos/seed/teacher3/200/200",
    specialty: "摇滚鼓 / 双踩技术",
    rating: 4.7,
    reviewCount: 210,
    location: {
      name: "鼓动人生工作室",
      address: "上海市静安区南京西路1266号",
      coords: "31.23, 121.45"
    },
    price: 300,
    slots: [
      { id: "3-1", time: "13:00 - 14:00", isAvailable: true },
      { id: "3-2", time: "15:00 - 16:00", isAvailable: true },
      { id: "3-3", time: "19:00 - 20:00", isAvailable: true },
    ]
  }
];

export default function TeacherBooking() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedTeacher(null);
        setSelectedSlot(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">预约导师</h2>
        <div className="flex items-center gap-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">
          <Navigation size={12} /> 上海市
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTeacher ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4"
          >
            {MOCK_TEACHERS.map((teacher) => (
              <motion.button
                key={teacher.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm flex items-center gap-4 text-left group transition-all hover:border-orange-200"
              >
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  className="w-16 h-16 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-neutral-900">{teacher.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                      <Star size={14} fill="currentColor" /> {teacher.rating}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">{teacher.specialty}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                    <MapPin size={12} className="text-neutral-300" />
                    <span className="truncate">{teacher.location.name}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-neutral-300 group-hover:text-orange-500 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setSelectedTeacher(null)}
              className="text-sm font-bold text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
            >
              ← 返回列表
            </button>

            {/* Teacher Profile Header */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4">
              <img 
                src={selectedTeacher.avatar} 
                alt={selectedTeacher.name} 
                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                  <div className="text-orange-600 font-bold">
                    <span className="text-sm">¥</span>{selectedTeacher.price}<span className="text-xs text-neutral-400 font-normal">/课时</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mb-3">{selectedTeacher.specialty}</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-sm font-bold">{selectedTeacher.rating}</div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">评分</div>
                  </div>
                  <div className="text-center border-l border-neutral-100 pl-4">
                    <div className="text-sm font-bold">{selectedTeacher.reviewCount}+</div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">评价</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                <h4 className="font-bold">选择预约时段</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedTeacher.slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`
                      w-full p-4 rounded-2xl border transition-all flex items-center justify-between
                      ${!slot.isAvailable 
                        ? 'bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed' 
                        : selectedSlot === slot.id
                          ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500/10'
                          : 'bg-white border-neutral-100 hover:border-orange-200 text-neutral-600'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={16} className={slot.isAvailable ? "text-orange-400" : "text-neutral-200"} />
                      <span className="font-bold text-sm">{slot.time}</span>
                    </div>
                    {slot.isAvailable ? (
                      selectedSlot === slot.id ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-neutral-200" />
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-widest">已约满</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" />
                  <h4 className="font-bold">常驻教学点</h4>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
                  坐标: {selectedTeacher.location.coords}
                </span>
              </div>
              
              <div className="relative h-40 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-100 group">
                {/* Mock Map Visual */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-12 -left-1/2 w-32 bg-white p-2 rounded-lg shadow-xl border border-neutral-100 text-[10px] font-bold text-center animate-bounce">
                      {selectedTeacher.location.name}
                    </div>
                    <MapPin size={32} className="text-orange-600 fill-orange-100" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-sm">
                  <p className="text-xs font-bold text-neutral-800">{selectedTeacher.location.name}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{selectedTeacher.location.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-700">
                <Info size={14} />
                <p className="text-[10px] font-bold leading-tight">
                  温馨提示：请根据您的实际位置选择合适的教学点。预约成功后，老师将通过站内信与您确认详细路线。
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleBook}
              disabled={!selectedSlot || isBooking || bookingSuccess}
              className={`
                w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                ${bookingSuccess 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-neutral-200 shadow-orange-600/20'
                }
              `}
            >
              {isBooking ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Clock size={20} />
                  </motion.div>
                  正在提交预约...
                </>
              ) : bookingSuccess ? (
                <>
                  <UserCheck size={20} />
                  预约成功！
                </>
              ) : (
                <>
                  确认预约 (¥{selectedTeacher.price})
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
