/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Search, Bell, Sun, Moon, Calendar, User, LogOut, Check, CheckCircle, 
  AlertTriangle, ShieldAlert, Info, Clock, Trash2, ShieldCheck, Sparkles, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CmsNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  unread: boolean;
  category: 'settings' | 'ppdb' | 'security' | 'database' | 'general';
}

interface AdminHeaderProps {
  activeTab: string;
  sessionRole: string;
  onNavigateHome: () => void;
  notifications: CmsNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSimulatePPDB: () => void;
}

export default function AdminHeader({
  activeTab,
  sessionRole,
  onNavigateHome,
  notifications = [],
  onMarkAllRead,
  onClearAll,
  onSimulatePPDB
}: AdminHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Format Indonesian local date
  const getFormattedDate = () => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date().toLocaleDateString('id-ID', options);
    } catch {
      return "Selasar, 9 Juni 2026";
    }
  };

  // Profile metadata depending on simulated role
  const getUserProfile = () => {
    switch(sessionRole) {
      case "Kepala Madrasah":
        return {
          name: "H. Kamaludin, S.Ag., M.Pd.",
          role: "Kepala Madrasah",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
        };
      case "Operator":
        return {
          name: "Hendika, S.Kom.",
          role: "Operator Madrasah",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        };
      case "Editor":
        return {
          name: "Nurhasanah, S.Pd.I.",
          role: "Editor Redaksional",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        };
      default: // Super Admin
        return {
          name: "Suryadi, S.H.",
          role: "Super Admin Utama",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
        };
    }
  };

  const user = getUserProfile();

  // Convert tab ID to Indonesian readable breadcrumb path
  const getTabBreadcrumb = () => {
    const parts = activeTab.split('_');
    if (parts[0] === 'sets') {
      return ["Pengaturan", parts.slice(1).join(' ').toUpperCase()];
    }
    switch (activeTab) {
      case "ikhtisar": return ["Dashboard", "Ikhtisar Statistik"];
      case "audit_logs": return ["Dashboard", "Audit Logs Aktivitas"];
      case "berita": return ["Konten Publik", "Kelola Berita"];
      case "pengumuman": return ["Konten Publik", "Pengumuman & Ticker"];
      case "events": return ["Konten Publik", "Agenda & Kegiatan"];
      case "galeri": return ["Konten Publik", "Galeri Foto & Video"];
      case "gtk": return ["Kepegawaian", "Data Guru & GTK"];
      case "program": return ["Kepegawaian", "Program Unggulan"];
      case "facilities": return ["Kepegawaian", "Fasilitas & Sarpras"];
      case "testimonials": return ["Kepegawaian", "Testimoni Stakeholder"];
      case "ppdb": return ["Akademik", "Pusat PPDB Online"];
      case "downloads": return ["Akademik", "Unduhan Berkas"];
      case "akademik_kalender": return ["Akademik", "Kalender Pembelajaran"];
      case "akademik_ekstrakurikuler": return ["Akademik", "Ekstrakurikuler"];
      case "media_library": return ["Konten Publik", "Media Library"];
      default: return ["Admin Panel", activeTab.toUpperCase()];
    }
  };

  const breadcrumbs = getTabBreadcrumb();
  const unreadCount = notifications.filter(n => n.unread).length;

  const getRelativeTime = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const secs = Math.floor(diff / 1000);
      if (secs < 15) return 'Baru Saja';
      if (secs < 60) return `${secs} detik lalu`;
      const mins = Math.floor(secs / 60);
      if (mins < 60) return `${mins} menit lalu`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} jam lalu`;
      return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Beberapa saat lalu';
    }
  };

  return (
    <header className="h-[70px] bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 select-none font-sans shadow-xs relative z-40" id="admin_pwa_header">
      {/* Left side Breadcrumbs & Welcome Greet */}
      <div className="text-left">
        <div className="flex items-center gap-1.5 text-slate-400 text-[10.5px] font-bold font-mono tracking-wide uppercase">
          <span>MIN Singkawang</span>
          <span>/</span>
          {breadcrumbs.map((part, i) => (
            <React.Fragment key={part}>
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumbs.length - 1 ? "text-[#24b47e] font-bold" : ""}>{part}</span>
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-1 flex items-center gap-1.5">
          <h2 className="text-slate-800 text-sm font-black tracking-tight leading-3">
            Welcome, {user.name} 👋
          </h2>
          <span className="text-[9.5px] font-mono font-bold bg-slate-100 border text-slate-500 py-0.5 px-1.5 rounded uppercase">
            {user.role}
          </span>
        </div>
      </div>

      {/* Center Simulated Search Input */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200.5 rounded-full px-4.5 py-2 w-72 transition-colors focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-600">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari fitur administrator di sini..." 
          className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
          readOnly
        />
      </div>

      {/* Right side interactions */}
      <div className="flex items-center gap-4">
        {/* Indonesian calendar display */}
        <div className="hidden md:flex items-center gap-2 text-slate-500 font-medium text-xs bg-slate-50 border px-3 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-[#24b47e]" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 relative">
          
          {/* Notifications core trigger button */}
          <button 
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative w-9 h-9 flex items-center justify-center rounded-full border text-slate-600 cursor-pointer transition-all active:scale-95 ${
              showDropdown ? 'bg-emerald-[10%] text-[#24b47e] border-emerald-200 ring-2 ring-emerald-100/50' : 'bg-slate-50 hover:bg-slate-100'
            }`}
            title="Sistem Notifikasi Global"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 rounded-full border border-white text-white font-mono text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Unread Alerts Dropdown Panel */}
          <AnimatePresence>
            {showDropdown && (
              <>
                {/* Visual click blocker overlay */}
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowDropdown(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-11 z-50 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col focus:outline-none"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                      <strong className="text-xs font-black text-slate-800 tracking-tight uppercase block">INBOX NOTIFIKASI</strong>
                      <span className="text-[10px] text-slate-400 font-medium font-mono">Ada {unreadCount} belum dibaca</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          onMarkAllRead();
                        }}
                        className="text-[10px] text-[#24b47e] hover:text-[#1c8c61] hover:underline font-bold bg-white px-2 py-1 rounded border border-zinc-200 cursor-pointer"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>

                  {/* Dropdown Content */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 custom-scrollbar flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center space-y-2">
                        <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                        <span className="text-[11px] font-bold text-slate-500 block uppercase">Semuanya Bersih</span>
                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                          Tidak ada pesan atau alarm masuk saat ini. Settings dan PPDB aman.
                        </p>
                      </div>
                    ) : (
                      notifications.map(item => {
                        let colorClasses = 'bg-blue-50 text-blue-700 border-blue-100';
                        let Icon = Info;
                        
                        if (item.type === 'success') {
                          colorClasses = 'bg-emerald-50 text-[#24b47e] border-emerald-100';
                          Icon = CheckCircle;
                        } else if (item.type === 'warning') {
                          colorClasses = 'bg-amber-50 text-[#854d0e] border-amber-200';
                          Icon = AlertTriangle;
                        } else if (item.type === 'error') {
                          colorClasses = 'bg-rose-50 text-rose-800 border-rose-100';
                          Icon = ShieldAlert;
                        }

                        return (
                          <div 
                            key={item.id} 
                            className={`p-3.5 flex gap-2.5 transition-colors text-xs text-left relative ${
                              item.unread ? 'bg-zinc-50 border-l-2 border-[#24b47e]' : 'bg-white'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${colorClasses}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="space-y-1 pr-1">
                              <p className={`leading-relaxed text-[11px] ${item.unread ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                                {item.message}
                              </p>
                              <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
                                <Clock className="w-3 h-3 text-slate-350" />
                                <span>{getRelativeTime(item.timestamp)}</span>
                                <span className="text-slate-250">•</span>
                                <span className="uppercase text-[8px] font-black tracking-wider text-slate-400">{item.category}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer Actions */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="p-1 px-2 border rounded text-slate-450 hover:text-rose-600 hover:bg-rose-50 border-slate-200 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Bersihkan</span>
                      </button>
                    )}

                    {/* Simulation trigger button */}
                    <button
                      onClick={() => {
                        onSimulatePPDB();
                        setShowDropdown(false);
                      }}
                      className="ml-auto flex items-center gap-1 bg-zinc-900 hover:bg-zinc-850 active:scale-95 text-white font-bold text-[10px] px-2.5 py-1.5 rounded uppercase cursor-pointer shadow-xs tracking-tight transition-all"
                      title="Uji sistem notifikasi PPDB masuk secara instan"
                    >
                      <Send className="w-3 h-3 animate-bounce text-[#24b47e]" />
                      <span>Uji Alert PPDB</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Quick exit to home */}
          <button 
            onClick={onNavigateHome}
            title="Keluar ke Portal Beranda"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 cursor-pointer transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* User profile with dropdown visualization info */}
        <div className="flex items-center gap-2.5 pl-3 border-l text-left border-slate-200">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-zinc-200 hover:border-[#24b47e] transition-all shadow-xs" 
          />
          <div className="hidden xl:block">
            <p className="text-slate-800 text-xs font-bold leading-none">{user.name}</p>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mt-0.5 leading-none">{sessionRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
