/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Layers, Terminal, FileText, Rss, Calendar, Image, Users, Award, Layout, HelpCircle, 
  ShieldCheck, Download, Info, BookOpen, MapPin, Settings, FileCode, Compass, 
  ChevronDown, ChevronRight, Home, LayoutDashboard, Palette, Sliders, Tv, Navigation,
  List, Blocks, Link2, Bell, Globe, Heart, Phone, LogOut, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface SidebarGroup {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: SidebarItem[];
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sessionRole: string;
  setSessionRole: (role: any) => void;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sessionRole,
  setSessionRole,
  onNavigate,
  onLogout
}: AdminSidebarProps) {
  
  // Track open states for collapsible tree groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboards: true,
    builder: true,
    content: false,
    faculty: false,
    academic: false,
    settings: false
  });

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuGroups: SidebarGroup[] = [
    {
      id: "dashboards",
      title: "Dashboards",
      icon: LayoutDashboard,
      items: [
        { id: "ikhtisar", label: "Ikhtisar Sistem", icon: Layers },
        { id: "push_notifications", label: "Push Notifikasi", icon: Bell },
        { id: "audit_logs", label: "Audit Logs Publik", icon: Terminal }
      ]
    },
    {
      id: "builder",
      title: "Website Builder",
      icon: Layout,
      items: [
        { id: "builder_theme", label: "Theme Settings", icon: Palette },
        { id: "builder_homepage", label: "Homepage Builder", icon: Sliders },
        { id: "builder_header", label: "Header Builder", icon: Tv },
        { id: "builder_navigation", label: "Navigation Builder", icon: Navigation },
        { id: "builder_footer", label: "Footer Builder", icon: List },
        { id: "builder_section", label: "Section Builder", icon: Layers },
        { id: "builder_page", label: "Page Builder", icon: FileText },
        { id: "builder_widget", label: "Widget Builder", icon: Blocks },
        { id: "builder_cta", label: "CTA Builder", icon: Link2 },
        { id: "builder_announcement", label: "Announcement Bar", icon: Rss },
        { id: "builder_popup", label: "Popup Manager", icon: Bell },
        { id: "builder_banner", label: "Banner Manager", icon: Image },
        { id: "builder_seo", label: "SEO Manager", icon: Globe },
        { id: "builder_social", label: "Social Media Manager", icon: Heart },
        { id: "builder_contact", label: "Contact Manager", icon: Phone },
        { id: "builder_links", label: "Custom Links", icon: Link2 },
        { id: "builder_redirect", label: "Redirect Manager", icon: Link2 },
        { id: "builder_settings", label: "Website Settings", icon: Settings }
      ]
    },
    {
      id: "content",
      title: "Konten Publik",
      icon: FileText,
      items: [
        { id: "berita", label: "Kelola Berita & Warta", icon: FileText },
        { id: "pengumuman", label: "Pengumuman & Ticker", icon: Rss },
        { id: "events", label: "Agenda & Kegiatan", icon: Calendar },
        { id: "galeri", label: "Galeri Foto & Video", icon: Image },
        { id: "media_library", label: "Media Library / Pustaka", icon: FolderOpen }
      ]
    },
    {
      id: "faculty",
      title: "Kepegawaian & Sarpras",
      icon: Users,
      items: [
        { id: "gtk", label: "Pengurus GTK & Staff", icon: Users },
        { id: "program", label: "Program Unggulan", icon: Award },
        { id: "facilities", label: "Sarana & Prasarana", icon: Layout },
        { id: "testimonials", label: "Testimoni Stakeholder", icon: HelpCircle }
      ]
    },
    {
      id: "academic",
      title: "Akademik & PPDB",
      icon: ShieldCheck,
      items: [
        { id: "ppdb", label: "Pusat PPDB Online", icon: ShieldCheck },
        { id: "downloads", label: "Unduhan Berkas File", icon: Download },
        { id: "akademik_kalender", label: "Kalender Pembelajaran", icon: Calendar },
        { id: "akademik_ekstrakurikuler", label: "Kegiatan Ekstrakurikuler", icon: Compass }
      ]
    },
    {
      id: "settings",
      title: "Pengaturan Master",
      icon: Settings,
      items: [
        { id: "sets_identitas", label: "Identitas & Slogan", icon: Info },
        { id: "sets_topbar", label: "Teks Banner & Ticker", icon: Rss },
        { id: "sets_hero_slider", label: "Gambar Slider Hero", icon: Image },
        { id: "sets_sejarah", label: "Sambutan & Sejarah", icon: BookOpen },
        { id: "sets_visi_misi", label: "Visi, Misi & Tujuan", icon: Award },
        { id: "sets_footer", label: "Footer & Peta Lokasi", icon: MapPin },
        { id: "sets_seo", label: "Global SEO & Sitemap", icon: Settings },
        { id: "sets_db", label: "Struktur PostgreSQL SQL", icon: FileCode }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-zinc-50 text-zinc-700 flex-shrink-0 flex flex-col h-full border-r border-zinc-200 transition-all duration-300 font-sans select-none" id="admin_pwa_sidebar">
      {/* Brand Top Header */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white" id="sidebar_logo_header">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-[#24b47e] flex items-center justify-center text-white font-extrabold shadow-xs">
            MIN
          </div>
          <div>
            <span className="font-extrabold text-sm text-zinc-900 tracking-tight block leading-tight">MIN SKW</span>
            <span className="text-[10px] text-[#24b47e] font-mono tracking-wide font-bold">CMS Console</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#24b47e] animate-pulse" title="Sistem Aktif & Terkoneksi"></div>
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3" id="sidebar_navbar_scroll">
        {/* Quick Back link */}
        <button
          onClick={() => onNavigate('home')}
          className="w-full text-left px-3 py-2 text-[11px] font-bold text-zinc-650 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-2xs"
        >
          <Home className="w-3.5 h-3.5 text-[#24b47e]" />
          <span>Kembali ke Website</span>
        </button>

        <div className="space-y-2 mt-4">
          {menuGroups.map((group) => {
            const isGroupOpen = openGroups[group.id];
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="space-y-1">
                {/* Accordion Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold transition-all tracking-wide ${
                    isGroupOpen 
                      ? "text-zinc-900 bg-zinc-200/50" 
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className={`w-4 h-4 ${isGroupOpen ? "text-[#24b47e]" : "text-zinc-400"}`} />
                    <span>{group.title}</span>
                  </div>
                  {isGroupOpen ? <ChevronDown className="w-3 h-3 text-zinc-400" /> : <ChevronRight className="w-3 h-3 text-zinc-400" />}
                </button>

                {/* Left Tree Branches drawing for submenu lists */}
                <AnimatePresence initial={false}>
                  {isGroupOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="overflow-hidden relative pl-3"
                    >
                      {/* Vertical connector line */}
                      <div className="absolute left-[20px] top-0 bottom-2.5 w-0.5 bg-zinc-200 rounded"></div>

                      <div className="flex flex-col pt-1 space-y-0.5">
                        {group.items.map((item, idx) => {
                          const isActive = activeTab === item.id;
                          const ItemIcon = item.icon;

                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveTab(item.id)}
                              className={`relative w-full text-left pl-7 py-2 rounded-md text-xs transition-all flex items-center gap-2 ${
                                isActive
                                  ? "bg-[#24b47e]/10 text-[#15803d] font-bold border-l-2 border-[#24b47e]"
                                  : "text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                              }`}
                            >
                              {/* Horizontal branch line hook */}
                              <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-zinc-200"></div>
                              {/* Bullet node */}
                              <div className={`absolute left-[11px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border ${
                                isActive 
                                  ? "bg-[#24b47e] border-white scale-125 shadow-xs" 
                                  : "bg-zinc-100 border-zinc-200"
                              }`}></div>

                              <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#24b47e]" : "text-zinc-400"}`} />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Profile section resembling Riho styling info */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex flex-col gap-2.5" id="sidebar_profile_footer">
        <div className="text-left">
          <span className="text-[9.5px] text-zinc-400 block font-bold uppercase tracking-wider">Aktor Simulasi Ruang Kerja</span>
          <select 
            value={sessionRole} 
            onChange={(e) => setSessionRole(e.target.value as any)}
            className="w-full mt-1.5 bg-white border border-zinc-200 text-zinc-700 text-[11px] font-sans font-semibold py-1.5 px-2 rounded-lg focus:outline-hidden cursor-pointer hover:bg-zinc-100 ring-emerald-500/10 focus:ring-2 shadow-xs transition-colors"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Kepala Madrasah">Kepala Madrasah</option>
            <option value="Operator">Operator (Admin)</option>
            <option value="Editor">Editor Redaksional</option>
          </select>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            id="admin_sidebar_logout_btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi CMS</span>
          </button>
        )}

        <div className="text-[9px] text-zinc-400 font-mono text-center">
          MIN SKW CMS Console v1.3 • Supabase Style
        </div>
      </div>
    </aside>
  );
}
