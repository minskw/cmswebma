/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  Palette, Type, Layout, Navigation, List, BookOpen, Sliders, FileText, Blocks, 
  Tv, Bell, Image, Globe, Heart, Phone, Link2, Key, Info, HelpCircle, Save, 
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Check, Edit3, ShieldAlert,
  ArrowRight, ToggleLeft, ToggleRight, CheckSquare, PlusCircle, Sparkles, MapPin, Share2,
  Layers, GripVertical, Laptop, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MockDb from '../database/mockDb';

// helper functions for contrast and WCAG compliance calculation
const getLuminance = (hexColor: string): number => {
  const c = hexColor.replace('#', '');
  if (c.length !== 6) return 0.5; // fallback
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  
  const rL = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gL = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bL = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
};

const getContrastRatio = (color1: string, color2: string): number => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
};

interface CmsWebsiteBuilderSectionProps {
  sessionRole: string;
  onRefreshData?: () => void;
}

export default function CmsWebsiteBuilderSection({
  sessionRole,
  onRefreshData = () => {}
}: CmsWebsiteBuilderSectionProps) {
  // Sub-tabs inside Website Builder
  const [activeSubTab, setActiveSubTab] = useState<string>('theme');
  const [notification, setNotification] = useState<string | null>(null);

  // Loaded DB configs
  const [theme, setTheme] = useState<any>(null);
  const [header, setHeader] = useState<any>(null);
  const [footer, setFooter] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [hpSections, setHpSections] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const [redirects, setRedirects] = useState<any[]>([]);
  const [customPages, setCustomPages] = useState<any[]>([]);

  // Edit forms
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [editingMenu, setEditingMenu] = useState<any | null>(null);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);
  const [editingRedirect, setEditingRedirect] = useState<any | null>(null);

  // Drag and Drop States for Homepage Builder
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // New items helpers
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuUrl, setNewMenuUrl] = useState('');
  const [newMenuIcon, setNewMenuIcon] = useState('Link');
  const [newSubnavLabel, setNewSubnavLabel] = useState('');
  const [newSubnavUrl, setNewSubnavUrl] = useState('');

  // Live Preview & Palette States
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Initial Load from database
  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = () => {
    setTheme(MockDb.getThemeSettings());
    setHeader(MockDb.getHeaderSettings());
    setFooter(MockDb.getFooterSettings());
    setMenus(MockDb.getMenus());
    setHpSections(MockDb.getHomepageSections());
    setPopups(MockDb.getPopups());
    setRedirects(MockDb.getRedirects());
    setCustomPages(MockDb.getCustomPages());
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // CHECK PERMISSIONS: Kepala Madrasah / Editor / Admin controls
  const isReadOnly = ['Editor'].includes(sessionRole);
  const needsApproval = ['Operator', 'Editor'].includes(sessionRole);

  const handleActionPreCheck = (onConfirm: () => void) => {
    if (isReadOnly) {
      triggerNotification("⚠️ Akses ditolak! Peran Editor hanya dapat membaca pengaturan website.");
      return;
    }
    if (needsApproval && sessionRole !== 'Super Admin') {
      triggerNotification("⏳ Perubahan disimpan sebagai DRAFT. Menunggu persetujuan Kepala Madrasah.");
    }
    onConfirm();
  };

  const saveTheme = (updated: any) => {
    handleActionPreCheck(() => {
      MockDb.saveThemeSettings(updated);
      setTheme({ ...updated });
      triggerNotification("🎨 Palet Warna Branding & Font berhasil diarsip!");
      onRefreshData();
    });
  };

  const saveHeader = (updated: any) => {
    handleActionPreCheck(() => {
      MockDb.saveHeaderSettings(updated);
      setHeader({ ...updated });
      triggerNotification("🧱 Header Navigation site-config berhasil diperbarui!");
      onRefreshData();
    });
  };

  const saveFooterState = (updated: any) => {
    handleActionPreCheck(() => {
      MockDb.saveFooterSettings(updated);
      setFooter({ ...updated });
      triggerNotification("👣 Kaki website & Copyright berhasil dimutakhirkan!");
      onRefreshData();
    });
  };

  const saveMenusState = (updated: any[]) => {
    handleActionPreCheck(() => {
      MockDb.saveMenus(updated);
      setMenus([...updated]);
      triggerNotification("🗺️ Silsilah struktur menu navigasi berjenjang disimpan!");
      onRefreshData();
    });
  };

  const saveHpSectionsState = (updated: any[]) => {
    handleActionPreCheck(() => {
      MockDb.saveHomepageSections(updated);
      setHpSections([...updated]);
      triggerNotification("🔄 Urutan & Visibilitas tata letak Beranda berhasil diubah!");
      onRefreshData();
    });
  };

  const savePopupsState = (updated: any[]) => {
    handleActionPreCheck(() => {
      MockDb.savePopups(updated);
      setPopups([...updated]);
      triggerNotification("🔔 Pop-up dialog interaktif berhasil diperbarui!");
      onRefreshData();
    });
  };

  const saveRedirectsState = (updated: any[]) => {
    handleActionPreCheck(() => {
      MockDb.saveRedirects(updated);
      setRedirects([...updated]);
      triggerNotification("🔗 Rules penautan tautan pengalihan URL legacy disimpan!");
      onRefreshData();
    });
  };

  const saveCustomPagesState = (updated: any[]) => {
    handleActionPreCheck(() => {
      MockDb.saveCustomPages(updated);
      setCustomPages([...updated]);
      triggerNotification("📄 Halaman kustom dinamis berhasil diunggah!");
      onRefreshData();
    });
  };

  // Sub builders definitions list
  const docMenus = [
    { id: 'theme', label: 'Theme Settings', icon: Palette, desc: 'Warna utama, Font heading/body, radius' },
    { id: 'navigation', label: 'Navigation Builder', icon: Navigation, desc: 'Struktur menu multi-level & sub-link' },
    { id: 'homepage_order', label: 'Homepage Builder', icon: Sliders, desc: 'Drag order section, show/hide' },
    { id: 'header_spec', label: 'Header Builder', icon: Tv, desc: 'Tinggi header, sticky, logo, CTA buttons' },
    { id: 'footer_spec', label: 'Footer Builder', icon: List, desc: 'Teks deskripsi, kolom link, copyright' },
    { id: 'section_vars', label: 'Section Builder', icon: Layers, desc: 'Isi subjudul, gambar cover seksi terpisah' },
    { id: 'page_builder', label: 'Page Builder', icon: FileText, desc: 'Halaman Sejarah, Visi Misi, FAQ dinamis' },
    { id: 'widget_engine', label: 'Widget Builder', icon: Blocks, desc: 'Slogan banner, Ticker text, FAQ blocks' },
    { id: 'popups_spec', label: 'Popup Manager', icon: Bell, desc: 'Jadwal tayang pop-up darurat, PPDB info' },
    { id: 'redirect_spec', label: 'Redirect Manager', icon: Link2, desc: 'Alihkan URL legacy / link lama' }
  ];

  if (!theme || !header || !footer) return <div className="p-10 text-center font-mono">Inisiasi layout Website Builder database...</div>;

  return (
    <div className="bg-white border rounded-2xl shadow-xs overflow-hidden text-left" id="cms_web_builder_root">
      
      {/* Toast alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-150 bg-slate-900 text-emerald-400 border border-emerald-500/30 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold font-sans animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Notice */}
      <div className="bg-[#eefcf7] border-b border-[#ddf5eb] px-6 py-3.5 flex items-center justify-between text-xs" id="builder_info_strip">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
            Mode Builder Aktif
          </span>
          <p className="text-[#024e41] font-medium font-sans">
            Bertindak sebagai: <strong className="font-extrabold text-emerald-800">{sessionRole}</strong>. 
            {sessionRole === 'Kepala Madrasah' && " Anda memegang kendali persetujuan rilis publik."}
            {sessionRole === 'Editor' && " Mode baca-saja aktif. Anda tidak dapat menulis log."}
            {sessionRole === 'Super Admin' && " Hak akses penuh tanpa limitasi rule persetujuan."}
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-400">
          <span>Target:</span>
          <span className="bg-emerald-100 text-[#024e41] px-2 py-0.5 rounded font-bold">100% Fully Database Driven</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]" id="builder_grid_layout">
        
        {/* LEFT COLUMN: Sidebar menu list (4 cols) */}
        <div className="lg:col-span-3 border-r border-slate-100 bg-slate-50/50 p-4 space-y-2" id="builder_sidebar">
          <div className="px-3 py-2">
            <h4 className="font-black text-[10px] tracking-widest text-slate-400 uppercase font-mono">Modul Konfigurator</h4>
            <p className="text-[10px] text-slate-400">Ubah tampilan web instan bebas koding.</p>
          </div>
          <div className="space-y-1">
            {docMenus.map((m) => {
              const IconComp = m.icon;
              const isSelected = activeSubTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => { setActiveSubTab(m.id); setEditingPage(null); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isSelected 
                      ? 'bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20' 
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs block leading-tight font-extrabold">{m.label}</span>
                    <span className={`text-[9px] block leading-none mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>{m.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Builder (9 cols) */}
        <div className="lg:col-span-9 p-6 md:p-8 space-y-6" id="builder_canvas">
          
          {/* ======================= SUB TAB: THEME SETTINGS ======================= */}
          {activeSubTab === 'theme' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-600" />
                    THEME CUSTOMIZER MASTER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Konfigurasi palet warna identitas madrasah, lekukan tombol, and font tipografi publik secara dinamis.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowLivePreview(true)}
                    className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    type="button"
                  >
                    <Eye className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                    <span>Pratinjau Situs Real-Time</span>
                  </button>
                  <button 
                    onClick={() => saveTheme(theme)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    type="button"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Tema</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: PREBUILT THEMES GALLERY */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Galeri Template Preset Islami (Prebuilt Themes)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pilih salah satu dari 3 konfigurasi gaya visual bawaan madrasah untuk mengubah seluruh karakter warna situs secara instan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'modern_emerald',
                      name: 'Modern Emerald',
                      desc: 'Warna hijau zamrud khas Kementerian Agama RI, dipadu aksen emas murni berwibawa tinggi.',
                      primary: '#005a4c',
                      hover: '#004231',
                      secondary: '#ca8a04',
                      accent: '#10b981',
                      headingFont: 'Plus Jakarta Sans',
                      bodyFont: 'Plus Jakarta Sans',
                      borderRadius: '12px',
                      shadowSize: 'md',
                      badges: ['#005a4c', '#ca8a04', '#10b981'],
                    },
                    {
                      id: 'royal_gold',
                      name: 'Royal Gold',
                      desc: 'Gaya klasik yang megah, didominasi cokelat tanah liat premium dan emas menyala glamor.',
                      primary: '#78350f',
                      hover: '#451a03',
                      secondary: '#eab308',
                      accent: '#facc15',
                      headingFont: 'Playfair Display',
                      bodyFont: 'Plus Jakarta Sans',
                      borderRadius: '8px',
                      shadowSize: 'lg',
                      badges: ['#78350f', '#eab308', '#facc15'],
                    },
                    {
                      id: 'classic_blue',
                      name: 'Classic MIN Blue',
                      desc: 'Warna biru akademis modern terpadu, melambangkan kemajuan teknologi informasi madrasah.',
                      primary: '#1e3a8a',
                      hover: '#1e40af',
                      secondary: '#3b82f6',
                      accent: '#60a5fa',
                      headingFont: 'Inter',
                      bodyFont: 'Inter',
                      borderRadius: '16px',
                      shadowSize: 'md',
                      badges: ['#1e3a8a', '#3b82f6', '#60a5fa'],
                    }
                  ].map((preset) => (
                    <div 
                      key={preset.id}
                      onClick={() => {
                        setTheme({
                          ...theme,
                          primaryColor: preset.primary,
                          primaryHoverColor: preset.hover,
                          secondaryColor: preset.secondary,
                          accentColor: preset.accent,
                          headingFont: preset.headingFont,
                          bodyFont: preset.bodyFont,
                          borderRadius: preset.borderRadius,
                          shadowSize: preset.shadowSize
                        });
                        triggerNotification(`🎨 Preset "${preset.name}" diterapkan! Tekan tombol "Simpan Tema" jika sudah cocok.`);
                      }}
                      className="bg-white hover:bg-slate-50 border p-4.5 rounded-xl cursor-pointer transition-all hover:shadow-md flex flex-col justify-between text-left relative group border-slate-200"
                    >
                      {theme.primaryColor === preset.primary && (
                        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full z-1">
                          Aktif
                        </span>
                      )}
                      
                      <div className="space-y-2">
                        <span className="text-xs font-black text-slate-800 tracking-wide block group-hover:text-emerald-800">{preset.name}</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed min-h-[50px]">{preset.desc}</p>
                        
                        <div className="flex gap-2 py-1.5">
                          {preset.badges.map((bColor, bIdx) => (
                            <span key={bIdx} className="w-5.5 h-5.5 rounded-full border border-slate-200 block shadow-2xs" style={{ backgroundColor: bColor }} title={bColor} />
                          ))}
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-3 text-[10px]">
                        <span className="font-mono text-slate-400">Radius: {preset.borderRadius}</span>
                        <span className="font-extrabold text-[#005a4c] font-sans group-hover:underline">Pilih Preset &gt;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: CUSTOM PALETTE BUILDER & SPEC */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Pickers */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-805 uppercase tracking-wider">
                    Konfigurasi Custom Palette Builder
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Warna Utama (Primary Band Color)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={theme.primaryColor} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setTheme({ ...theme, primaryColor: val });
                          }}
                          className="w-10 h-9 p-0 border rounded-lg cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={theme.primaryColor} 
                          onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs uppercase" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Warna Hover Utama (Focus State)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={theme.primaryHoverColor || '#004231'} 
                          onChange={(e) => setTheme({ ...theme, primaryHoverColor: e.target.value })}
                          className="w-10 h-9 p-0 border rounded-lg cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={theme.primaryHoverColor || '#004231'} 
                          onChange={(e) => setTheme({ ...theme, primaryHoverColor: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs uppercase" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Warna Sekunder (Aksen Link / Emas)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={theme.secondaryColor} 
                          onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                          className="w-10 h-9 p-0 border rounded-lg cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={theme.secondaryColor} 
                          onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs uppercase" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Warna Sorotan Accent (Branding Badge)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={theme.accentColor || '#10b981'} 
                          onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                          className="w-10 h-9 p-0 border rounded-lg cursor-pointer shrink-0" 
                        />
                        <input 
                          type="text" 
                          value={theme.accentColor || '#10b981'} 
                          onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs uppercase" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accessibility checker segment inside custom palette builder */}
                  {(() => {
                    const ratio = getContrastRatio(theme.primaryColor || '#005a4c', '#ffffff');
                    const rounded = Math.round(ratio * 100) / 100;
                    const isPassAA = ratio >= 4.5;
                    const isPassAAA = ratio >= 7.0;

                    return (
                      <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-3.5 md:items-center justify-between text-xs leading-relaxed ${
                        isPassAAA 
                          ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                          : isPassAA 
                            ? 'bg-blue-50 border-blue-250 text-blue-800' 
                            : 'bg-rose-50 border-rose-250 text-rose-800'
                      }`}>
                        <div className="space-y-0.5">
                          <p className="font-extrabold uppercase text-[10px] tracking-wide">Analitik Aksesibilitas WCAG 2.1 Compliance</p>
                          <p className="text-slate-505">
                            Kontras warna utama pilihan Anda terhadap teks putih dilayar bernilai <span className="font-mono font-bold text-sm bg-white/60 px-1 py-0.5 rounded shadow-2xs">{rounded}:1</span>
                          </p>
                        </div>
                        <div className="flex flex-col md:items-end justify-center">
                          <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white rounded-full ${
                            isPassAAA ? 'bg-emerald-600' : isPassAA ? 'bg-blue-600' : 'bg-rose-600'
                          }`}>
                            {isPassAAA ? '✓ WCAG AAA (Sangat Unggul)' : isPassAA ? '✓ WCAG AA Compliant' : '⚠️ Gagal Standar Kontras (Buruk!)'}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1">
                            {isPassAA ? 'Aman untuk dibaca siswa & orangtua.' : 'Disarankan memilih warna yang lebih pekat.'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Typography Config */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider">Aesthetic Details</h4>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Jenis Font Heading (Judul Utama)</label>
                      <select 
                        value={theme.headingFont} 
                        onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans (Interaktif Modern)</option>
                        <option value="Inter">Inter (Swiss Modernis)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech Geometric)</option>
                        <option value="Playfair Display">Playfair Display (Serif Elegance)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Border Radius (Kelengkungan Sisi)</label>
                      <select 
                        value={theme.borderRadius} 
                        onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                      >
                        <option value="4px">4px (Tajam Klasik)</option>
                        <option value="8px">8px (Modern Menengah)</option>
                        <option value="12px">12px (Rounded Elegan - Default)</option>
                        <option value="16px">16px (Rounded Lebih Lembut)</option>
                        <option value="20px">20px (Kapsul Lucu / Ramah)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Bayangan Elemen (Shadow Depth)</label>
                      <select 
                        value={theme.shadowSize} 
                        onChange={(e) => setTheme({ ...theme, shadowSize: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                      >
                        <option value="none">Tanpa Bayangan (Flat Desain)</option>
                        <option value="sm">Lunak / Tipis (sm)</option>
                        <option value="md">Elegansi Berdimensi (md)</option>
                        <option value="lg">Mengapung Maksimal (lg)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Theme Demo Block */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest block font-bold" style={{ color: theme.secondaryColor }}>Demo Tampilan Elemen</span>
                  <h4 className="text-sm font-bold mt-1 text-slate-800" style={{ fontFamily: theme.headingFont }}>Tombol Button & Card Visual</h4>
                </div>
                <div className="flex gap-3">
                  <button 
                    className="px-4 py-2 font-bold text-xs text-white cursor-pointer" 
                    style={{ 
                      backgroundColor: theme.primaryColor, 
                      borderRadius: theme.borderRadius,
                      boxShadow: theme.shadowSize === 'none' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}
                    type="button"
                  >
                    Button Primary
                  </button>
                  <button 
                    className="px-4 py-2 font-bold text-xs hover:opacity-90 cursor-pointer" 
                    style={{ 
                      color: theme.primaryColor,
                      borderColor: theme.primaryColor,
                      borderWidth: '1.5px',
                      borderRadius: theme.borderRadius 
                    }}
                    type="button"
                  >
                    Outline Button
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: NAVIGATION BUILDER ======================= */}
          {activeSubTab === 'navigation' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    NAVIGATION BUILDER (MENUS)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">Kelola menu header utama tanpa koding. Drag, order, tambah link kustom baru, atau kelola submenu dropdown.</p>
                </div>
                <button 
                  onClick={() => saveMenusState(menus)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Susunan Navigasi</span>
                </button>
              </div>

              {/* Add New Parent Menu Form */}
              <div className="bg-slate-50 border p-4 rounded-xl text-left space-y-3">
                <span className="text-[10px] text-emerald-850 font-black uppercase font-mono tracking-wider block">Tambah Menu Utama Induk (Navbar)</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input 
                    type="text" 
                    placeholder="Nama Label Menu (e.g. PPDB)" 
                    value={newMenuLabel} 
                    onChange={(e) => setNewMenuLabel(e.target.value)}
                    className="bg-white border rounded-lg px-3 py-1.5 text-xs col-span-1" 
                  />
                  <input 
                    type="text" 
                    placeholder="URL Penautan (e.g. ppdb atau kontak)" 
                    value={newMenuUrl} 
                    onChange={(e) => setNewMenuUrl(e.target.value)}
                    className="bg-white border rounded-lg px-3 py-1.5 text-xs col-span-1 font-mono" 
                  />
                  <select
                    value={newMenuIcon}
                    onChange={(e) => setNewMenuIcon(e.target.value)}
                    className="bg-white border rounded-lg px-2 py-1.5 text-xs col-span-1"
                  >
                    <option value="Link">Ikon default (Link)</option>
                    <option value="Home">Home (Rumah)</option>
                    <option value="Info">Info (Lingkaran i)</option>
                    <option value="GraduationCap">GraduationCap (Toga)</option>
                    <option value="FileText">FileText (Kertas)</option>
                    <option value="Download">Download (Instalasi)</option>
                    <option value="Phone">Phone (Telepon)</option>
                  </select>
                  <button 
                    onClick={() => {
                      if (!newMenuLabel) return;
                      const added = {
                        id: 'item_' + Date.now(),
                        label: newMenuLabel.toUpperCase(),
                        url: newMenuUrl || '#',
                        target: '_self',
                        icon: newMenuIcon,
                        items: []
                      };
                      saveMenusState([...menus, added]);
                      setNewMenuLabel('');
                      setNewMenuUrl('');
                    }}
                    className="py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Parent Link
                  </button>
                </div>
              </div>

              {/* Loop Parents */}
              <div className="space-y-4">
                {menus.map((m, idx) => (
                  <div key={m.id} className="border rounded-xl p-4 bg-white shadow-xs space-y-3 text-left">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-500 font-mono text-xs px-2 py-0.5 rounded">Order {idx+1}</span>
                        <strong className="text-slate-800 text-xs tracking-wider uppercase font-extrabold">{m.label}</strong>
                        <span className="text-slate-400 text-[10px] font-mono">({m.url})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => {
                            if (idx === 0) return;
                            const copy = [...menus];
                            const temp = copy[idx];
                            copy[idx] = copy[idx-1];
                            copy[idx-1] = temp;
                            saveMenusState(copy);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-900 border rounded cursor-pointer hover:bg-slate-50"
                          title="Pindahkan Keatas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (idx === menus.length - 1) return;
                            const copy = [...menus];
                            const temp = copy[idx];
                            copy[idx] = copy[idx+1];
                            copy[idx+1] = temp;
                            saveMenusState(copy);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-900 border rounded cursor-pointer hover:bg-slate-50"
                          title="Pindahkan Kebawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Hapus menu '${m.label}' secara permanen? Semua submenu di dalamnya juga akan luruh.`)) {
                              saveMenusState(menus.filter(item => item.id !== m.id));
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-100 hover:bg-rose-600 rounded cursor-pointer"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-menu rendering & editor */}
                    <div className="pl-6 space-y-2">
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 uppercase tracking-wide">
                        <span>Drop-down Submenu List</span>
                        <span className="font-extrabold text-emerald-700 font-sans">({m.items?.length || 0} link)</span>
                      </div>

                      {m.items && m.items.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {m.items.map((sub: any, sIdx: number) => (
                            <div key={sub.id} className="flex items-center justify-between border bg-slate-50/50 p-2 rounded-lg text-xs">
                              <div className="truncate pr-1">
                                <span className="font-bold text-slate-600 block">{sub.label}</span>
                                <span className="text-[9px] text-slate-400 font-mono italic block">{sub.url}</span>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => {
                                    const c = [...menus];
                                    const subCopy = [...c[idx].items];
                                    if (sIdx > 0) {
                                      const temp = subCopy[sIdx];
                                      subCopy[sIdx] = subCopy[sIdx-1];
                                      subCopy[sIdx-1] = temp;
                                      c[idx].items = subCopy;
                                      saveMenusState(c);
                                    }
                                  }}
                                  className="p-0.5 text-slate-400 hover:text-slate-900 border"
                                >
                                  ▲
                                </button>
                                <button 
                                  onClick={() => {
                                    const c = [...menus];
                                    const subLinks = c[idx].items.filter((item: any) => item.id !== sub.id);
                                    c[idx].items = subLinks;
                                    saveMenusState(c);
                                  }}
                                  className="p-0.5 text-rose-600 hover:bg-rose-100 rounded"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add submenu items inline */}
                      <div className="flex gap-2 items-center pt-1 bg-[#f9fcfb] border border-[#ddedd8]/50 p-2.5 rounded-lg max-w-xl">
                        <input 
                          type="text" 
                          placeholder="Label Sub-Menu" 
                          id={`t_sub_${m.id}`}
                          className="bg-white border rounded px-2.5 py-1 text-[11px] w-1/3" 
                        />
                        <input 
                          type="text" 
                          placeholder="Slug Target (e.g. profil_sejarah)" 
                          id={`u_sub_${m.id}`}
                          className="bg-white border rounded px-2.5 py-1 text-[11px] w-1/3 font-mono" 
                        />
                        <button 
                          onClick={() => {
                            const lblEl = document.getElementById(`t_sub_${m.id}`) as HTMLInputElement;
                            const urlEl = document.getElementById(`u_sub_${m.id}`) as HTMLInputElement;
                            if (!lblEl?.value) return;

                            const parentIndex = menus.findIndex(item => item.id === m.id);
                            if (parentIndex > -1) {
                              const updatedMenus = [...menus];
                              if (!updatedMenus[parentIndex].items) {
                                updatedMenus[parentIndex].items = [];
                              }
                              updatedMenus[parentIndex].items.push({
                                id: 'sub_' + Date.now() + Math.random().toString(36).substring(5),
                                label: lblEl.value,
                                url: urlEl.value || '#'
                              });
                              saveMenusState(updatedMenus);
                              lblEl.value = '';
                              urlEl.value = '';
                            }
                          }}
                          className="px-3 py-1 bg-emerald-850 text-white font-bold text-[10px] rounded cursor-pointer shrink-0 uppercase"
                        >
                          + Tambah Sub
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: HOMEPAGE BUILDER ======================= */}
          {activeSubTab === 'homepage_order' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-600" />
                    HOMEPAGE SECTION BUILDER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Sifat website adalah modular. Susun ulang urutan seksi beranda utama di bawah, sembunyikan seksi untuk draf liburan, atau aktifkan per seksi dalam satu klik secara interaktif.</p>
                </div>
                <button 
                  onClick={() => saveHpSectionsState(hpSections)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Urutan Modul</span>
                </button>
              </div>

              {/* Drag and Drop Instruction Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 max-w-3xl">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-extrabold uppercase font-mono text-[9px] tracking-wider text-amber-800 block">Metode Penyusunan Interaktif: Drag-and-Drop</span>
                  <p className="leading-relaxed">
                    Seret dan letakkan (Drag and Drop) bagian halaman beranda dengan menarik ikon pegangan <strong className="font-mono text-emerald-800 font-extrabold">⠿</strong> di bagian kiri baris, atau gunakan kontrol tombol panah presisi (<strong className="text-emerald-850 font-bold">▲ ▼</strong>) di sebelah kanan untuk mengubah urutan seksi publik secara instan.
                  </p>
                </div>
              </div>

              {/* Loop Sections list drag-and-drop enabled */}
              <div className="space-y-2.5 max-w-3xl" id="homepage_builder_sections_container">
                {hpSections.map((sect, idx) => {
                  const isDragged = draggedIndex === idx;
                  const isDragOver = dragOverIndex === idx && draggedIndex !== null;

                  return (
                    <div 
                      key={sect.id} 
                      draggable={!isReadOnly}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', idx.toString());
                        setDraggedIndex(idx);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverIndex !== idx) {
                          setDragOverIndex(idx);
                        }
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const sourceIdxStr = e.dataTransfer.getData('text/plain');
                        if (sourceIdxStr === '') return;
                        const srcIdx = parseInt(sourceIdxStr, 10);
                        if (srcIdx === idx) return;

                        const updated = [...hpSections];
                        const temp = updated[srcIdx];
                        updated.splice(srcIdx, 1);
                        updated.splice(idx, 0, temp);

                        setHpSections(updated);
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                        triggerNotification(`📝 Urutan ditukar: '${temp.title}' dipindahkan ke baris ke-${idx + 1}`);
                      }}
                      className={`border-2 rounded-xl p-3.5 flex items-center justify-between transition-all select-none ${
                        isDragged 
                          ? 'bg-amber-50/75 border-amber-400 border-dashed opacity-50 shadow-inner scale-99 cursor-grabbing' 
                          : isDragOver 
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-350/50 scale-101 border-dashed'
                            : sect.visible 
                              ? 'bg-white border-slate-100 shadow-2xs hover:border-slate-300' 
                              : 'bg-slate-50 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Interactive Drag Grab Handle */}
                        <div 
                          className={`p-1.5 rounded-lg border transition-colors flex items-center justify-center ${
                            isReadOnly
                              ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                              : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-350 text-slate-400 hover:text-emerald-700 cursor-grab active:cursor-grabbing'
                          }`}
                          title={isReadOnly ? "Baca Saja" : "Seret untuk menyusun ulang"}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center font-mono font-black text-xs text-slate-500">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-800 text-xs font-bold block">{sect.title}</strong>
                            <span className="text-[9px] bg-slate-100 text-slate-400 uppercase font-mono px-2 py-0.5 rounded-full font-bold">
                              #{sect.id}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">{sect.subtitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Toggle status */}
                        <button
                          onClick={() => {
                            const copy = [...hpSections];
                            copy[idx] = { ...copy[idx], visible: !sect.visible };
                            setHpSections(copy);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase cursor-pointer flex items-center gap-1 transition-all ${
                            sect.visible 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-500 border border-slate-300'
                          }`}
                        >
                          {sect.visible ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Tampil</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Arsip</span>
                            </>
                          )}
                        </button>

                        {/* Direction arrow controls as an inclusive backup fallback */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (idx === 0) return;
                              const copy = [...hpSections];
                              const temp = copy[idx];
                              copy[idx] = copy[idx-1];
                              copy[idx-1] = temp;
                              setHpSections(copy);
                              triggerNotification(`▲ Menggeser '${temp.title}' ke baris-${idx}`);
                            }}
                            className="p-1 px-2 border rounded hover:bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => {
                              if (idx === hpSections.length - 1) return;
                              const copy = [...hpSections];
                              const temp = copy[idx];
                              copy[idx] = copy[idx+1];
                              copy[idx+1] = temp;
                              setHpSections(copy);
                              triggerNotification(`▼ Menggeser '${temp.title}' ke baris-${idx+2}`);
                            }}
                            className="p-1 px-2 border rounded hover:bg-slate-50 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: HEADER BUILDER ======================= */}
          {activeSubTab === 'header_spec' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Tv className="w-5 h-5 text-emerald-600" />
                    HEADER BUILDER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Konfigurasi elemen bar atas (header) mulai dari logo instansi kementerian agama resmi, sticky mode, and penamaan slogan.</p>
                </div>
                <button 
                  onClick={() => saveHeader(header)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Konfig Header</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Logo Utama (Desktop Link)</label>
                    <input 
                      type="text" 
                      value={header.logo_url} 
                      onChange={(e) => setHeader({ ...header, logo_url: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs" 
                    />
                    <div className="flex items-center gap-3 mt-2 bg-slate-50 p-2.5 rounded-lg border">
                      <img src={header.logo_url} alt="Logo" className="h-10 object-contain bg-slate-800 p-1 rounded" />
                      <span className="text-[10px] text-slate-400">Preview Logo Utama</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Logo Seluler (Mobile Link)</label>
                    <input 
                      type="text" 
                      value={header.mobile_logo_url || header.logo_url} 
                      onChange={(e) => setHeader({ ...header, mobile_logo_url: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Judul Utama Website</label>
                    <input 
                      type="text" 
                      value={header.site_name} 
                      onChange={(e) => setHeader({ ...header, site_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Slogan Sub-Judul (Tagline)</label>
                    <input 
                      type="text" 
                      value={header.site_tagline} 
                      onChange={(e) => setHeader({ ...header, site_tagline: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Sticky Mode</label>
                      <select 
                        value={header.sticky ? 'true' : 'false'} 
                        onChange={(e) => setHeader({ ...header, sticky: e.target.value === 'true' })}
                        className="w-full px-2.5 py-1.5 border rounded-lg bg-white bg-no-repeat"
                      >
                        <option value="true">Sticky (Kunci Diatas)</option>
                        <option value="false">Normal Scroll (Lolos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Header Height Class</label>
                      <select 
                        value={header.height || 'h-16'} 
                        onChange={(e) => setHeader({ ...header, height: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-mono text-xs"
                      >
                        <option value="h-14">Pendek (h-14)</option>
                        <option value="h-16">Standard (h-16 - Default)</option>
                        <option value="h-20">Lebar (h-20)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Label Tombol CTA Utama</label>
                      <input 
                        type="text" 
                        value={header.cta_label || 'PPDB ONLINE'} 
                        onChange={(e) => setHeader({ ...header, cta_label: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Link Target CTA</label>
                      <input 
                        type="text" 
                        value={header.cta_url || 'ppdb'} 
                        onChange={(e) => setHeader({ ...header, cta_url: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: FOOTER BUILDER ======================= */}
          {activeSubTab === 'footer_spec' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <List className="w-5 h-5 text-emerald-600" />
                    FOOTER BUILDER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Sesuaikan isi deskripsi profil cepat di kaki bawah situs, link navigasi cepat, dan copyright notice pemerintah daerah.</p>
                </div>
                <button 
                  onClick={() => saveFooterState(footer)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Footer</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Teks Profil Ringkas Kaki Website</label>
                  <textarea 
                    rows={3}
                    value={footer.description}
                    onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-extrabold text-[10px] uppercase mb-1">Teks Hak Cipta (Copyright Banner)</label>
                  <input 
                    type="text" 
                    value={footer.copyright}
                    onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>

                {/* Footer Columns Links */}
                <div className="space-y-3">
                  <span className="block text-slate-650 font-black text-xs uppercase font-sans tracking-wide">Pengelompokan tautan Footer (3 Kolom utama)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {footer.columns?.map((col: any, colIdx: number) => (
                      <div key={col.id || colIdx} className="border rounded-xl p-3 bg-slate-50 text-left space-y-2">
                        <input 
                          type="text" 
                          value={col.title} 
                          onChange={(e) => {
                            const copy = { ...footer };
                            copy.columns[colIdx].title = e.target.value;
                            setFooter(copy);
                          }}
                          className="w-full bg-white border rounded px-2 py-1 font-bold text-xs uppercase text-slate-700"
                        />
                        
                        <div className="space-y-1 pl-1">
                          {col.links?.map((link: any, linkIdx: number) => (
                            <div key={linkIdx} className="flex gap-1.5 items-center">
                              <input 
                                type="text"
                                value={link.label}
                                onChange={(e) => {
                                  const copy = { ...footer };
                                  copy.columns[colIdx].links[linkIdx].label = e.target.value;
                                  setFooter(copy);
                                }}
                                className="bg-white border text-[11px] rounded px-1.5 py-0.5 w-1/2"
                              />
                              <input 
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  const copy = { ...footer };
                                  copy.columns[colIdx].links[linkIdx].url = e.target.value;
                                  setFooter(copy);
                                }}
                                className="bg-white border text-[10px] rounded px-1.5 py-0.5 w-1/2 font-mono text-slate-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: SECTION BUILDER ======================= */}
          {activeSubTab === 'section_vars' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    SECTION CONTENT BUILDER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Ubah isi konten seksi parsial pada Landing page depan (Judul, Subjudul, and tagline) tanpa harus mengobok-obok file kode mentah.</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { id: 'statistics', title: '⚙️ Blok Seksi Statistik', help: 'Kelola angka metrik capaian di bagian depan.' },
                  { id: 'speeches', title: '⚙️ Blok Sambutan Kepala', help: 'Ubah teks pidato sambutan pimpinan puncak madrasah.' },
                  { id: 'ppdb_banner', title: '⚙️ PPDB Quick Invitation Banner', help: 'Ubah judul ajakan pendaftaran ppdb.' },
                  { id: 'achievements', title: '⚙️ Prestasi Section', help: 'Set judul & deskripsi seksi prestasi siswa.' }
                ].map((secVar) => (
                  <div key={secVar.id} className="border rounded-2xl p-5 bg-white shadow-3xs space-y-4">
                    <div className="border-b pb-2 flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{secVar.title}</h4>
                      <span className="text-[9px] text-slate-400 font-mono">{secVar.help}</span>
                    </div>

                    {secVar.id === 'statistics' && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="border p-3.5 rounded-xl text-left bg-slate-50/50">
                          <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold mb-1">METER 1</span>
                          <strong className="text-sm block">12+ Standar</strong>
                          <p className="text-[9px] text-slate-400 mt-1">Ekstrakurikuler Pilihan</p>
                        </div>
                        <div className="border p-3.5 rounded-xl text-left bg-slate-50/50">
                          <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold mb-1">METER 2</span>
                          <strong className="text-sm block">480+ Anggota</strong>
                          <p className="text-[9px] text-slate-400 mt-1">Siswa Terdaftar Aktif</p>
                        </div>
                        <div className="border p-3.5 rounded-xl text-left bg-slate-50/50">
                          <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold mb-1">METER 3</span>
                          <strong className="text-sm block">A (Sangat Unggul)</strong>
                          <p className="text-[9px] text-slate-400 mt-1">Sertifikat Akreditasi BAN-S/M</p>
                        </div>
                        <div className="border p-3.5 rounded-xl text-left bg-slate-50/50">
                          <span className="text-[9px] text-slate-400 font-mono tracking-widest block font-bold mb-1">METER 4</span>
                          <strong className="text-sm block">100% Digital</strong>
                          <p className="text-[9px] text-slate-400 mt-1">SMART LCD & Ruang Lab AC</p>
                        </div>
                      </div>
                    )}

                    {secVar.id === 'speeches' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-extrabold text-[10px] mb-1">NAMA KEPALA MADRASAH</label>
                            <input 
                              type="text" 
                              defaultValue="H. Kamaludin, S.Ag., M.Pd." 
                              onChange={(e) => {
                                const settingsCopy = MockDb.getSettings();
                                settingsCopy.headmaster = e.target.value;
                                MockDb.saveSettings(settingsCopy);
                              }}
                              className="w-full px-3 py-1.5 border rounded-lg text-xs font-bold" 
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-extrabold text-[10px] mb-1">NIP RESMI KEMENTERIAN AGAMA</label>
                            <input 
                              type="text" 
                              defaultValue="197412052002121003" 
                              onChange={(e) => {
                                const settingsCopy = MockDb.getSettings();
                                settingsCopy.headmaster_nip = e.target.value;
                                MockDb.saveSettings(settingsCopy);
                              }}
                              className="w-full px-3 py-1.5 border rounded-lg text-xs font-mono" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-extrabold text-[10px] mb-1">TEKS SAMBUTAN PPDB & MADRASAH INTEGRAL</label>
                          <textarea 
                            rows={3}
                            defaultValue="Selamat datang di portal informasi digital MIN Singkawang. Kami siap mendidik segenap putra-putri madrasah berakhlak mulia..."
                            onChange={(e) => {
                              const settingsCopy = MockDb.getSettings();
                              settingsCopy.headmaster_speech = e.target.value;
                              MockDb.saveSettings(settingsCopy);
                            }}
                            className="w-full px-3 py-1.5 border rounded-lg text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {secVar.id === 'ppdb_banner' && (
                      <div className="space-y-3 col-span-1 text-left text-xs bg-[#fffbeb] p-4 rounded-xl border border-amber-200">
                        <span className="font-extrabold block text-amber-800">Seksi Callout PPDB Fast Response</span>
                        <p className="text-[10px] text-slate-400">Section ini otomatis memuat popup PPDB dan formulir isian siswa baru.</p>
                      </div>
                    )}

                    {secVar.id === 'achievements' && (
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-400">Sistem seksi ini otomatis me-render 3 metadata dari data <strong className="text-emerald-700">Prestasi gt-kependidikan</strong> di database utama.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: PAGE BUILDER ======================= */}
          {activeSubTab === 'page_builder' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    PAGE BUILDER (HALAMAN KUSTOM)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Buat halaman informatif tak terbatas baru (e.g. sejarah, kegiatan, struktur panitia). Halaman otomatis terdaftar di web routing publik!</p>
                </div>
                {!editingPage && (
                  <button 
                    onClick={() => {
                      setEditingPage({
                        id: 'page_' + Date.now(),
                        title: 'Halaman Baru',
                        slug: 'halaman-baru-' + Math.floor(Math.random()*100),
                        content: '# Judul Halaman Baru\n\nTulis konten Rich Text / Markdown Anda di sini...',
                        seo_title: 'Halaman Baru - MIN Singkawang',
                        seo_description: 'Deskripsi singkat halaman dinamis.',
                        is_published: true
                      });
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Halaman Baru</span>
                  </button>
                )}
              </div>

              {!editingPage ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customPages.map((page) => (
                      <div key={page.id} className="border rounded-xl p-4 bg-white shadow-3xs space-y-3 relative text-left">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-slate-800 text-sm font-black block">{page.title}</strong>
                            <span className="text-[10px] text-emerald-600 font-mono italic block">/{page.slug}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            page.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{page.content}</p>
                        
                        <div className="flex items-center gap-2 pt-2 border-t justify-end">
                          <button 
                            onClick={() => {
                              const previewUri = `/${page.slug}`;
                              alert(`Pratinjau alamat publik: ${previewUri}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-800 border rounded text-[10px]"
                            title="Preview Link"
                          >
                            Demo Link
                          </button>
                          <button 
                            onClick={() => setEditingPage({ ...page })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            Edit Konten & SEO
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Hapus halaman '${page.title}' secara permanen dari server database?`)) {
                                const list = customPages.filter(p => p.id !== page.id);
                                saveCustomPagesState(list);
                              }
                            }}
                            className="p-1 px-1.5 text-rose-600 hover:bg-rose-100 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Interactive rich text metadata editing workspace */
                <div className="bg-slate-50 border rounded-2xl p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b pb-3.5">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">Format Input Halaman Kustom</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingPage(null)}
                        className="px-3.5 py-1.5 bg-white border text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={() => {
                          const idx = customPages.findIndex(p => p.id === editingPage.id);
                          const copy = [...customPages];
                          if (idx > -1) {
                            copy[idx] = editingPage;
                          } else {
                            copy.push(editingPage);
                          }
                          saveCustomPagesState(copy);
                          setEditingPage(null);
                        }}
                        className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Simpan Perubahan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">JUDUL UTAMA HALAMAN</label>
                      <input 
                        type="text" 
                        value={editingPage.title} 
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">URL SLUG ALAMAT (Tanpa Spasi / Huruf Kecil)</label>
                      <input 
                        type="text" 
                        value={editingPage.slug} 
                        onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                        className="w-full px-3 py-2 bg-white border rounded-lg font-mono text-xs font-bold" 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-500 font-extrabold text-[10px]">TULIS KONTEN MARKDOWN / RICH TEXT (HTML VALID)</label>
                      <span className="text-[9px] text-slate-400 font-mono">Gunakan # untuk heading, ** untuk bold</span>
                    </div>
                    <textarea 
                      rows={10}
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-lg font-mono text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black font-mono tracking-wider block border-b pb-1 mb-2">Metadata SEO Halaman</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-extrabold text-[9px] mb-1">META TITLE (Judul Google)</label>
                        <input 
                          type="text" 
                          value={editingPage.seo_title || ''} 
                          onChange={(e) => setEditingPage({ ...editingPage, seo_title: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-extrabold text-[9px] mb-1">META DESCRIPTION (Deskripsi Google)</label>
                        <input 
                          type="text" 
                          value={editingPage.seo_description || ''} 
                          onChange={(e) => setEditingPage({ ...editingPage, seo_description: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================= SUB TAB: WIDGET BUILDER ======================= */}
          {activeSubTab === 'widget_engine' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <Blocks className="w-5 h-5 text-emerald-600" />
                  REUSABLE WIDGET BUILDER
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Konfigurasi widget serbaguna di sidebar halaman atau letakkan widget khusus ini di seksi pengumuman utama.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-2xl p-5 bg-[#fafcfb] space-y-4">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <span className="font-extrabold text-xs text-slate-800 uppercase tracking-widest block">Running Text Marquee Ticker</span>
                    <span className="bg-emerald-600 text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">TEKS BERJALAN INFORMASI URGEN / PENGUMUMAN</label>
                      <input 
                        type="text"
                        defaultValue="Informasi Seleksi Berkas Administrasi PPDB Mandiri Gelombang I Tahun Ajaran 2026/2027 Resmi Dibuka, Segera Lengkapi Berkas Putri-Putri Terbaik Anda!"
                        onChange={(e) => {
                          const seo = MockDb.getSeoSettings() as any;
                          if (!seo.ticker_text) seo.ticker_text = '';
                          seo.ticker_text = e.target.value;
                          MockDb.saveSeoSettings(seo);
                        }}
                        className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-700 italic">Running text ini akan otomatis berjalan di bilah ban merah (marquee) paling atas di seluruh halaman utama dan profil.</p>
                  </div>
                </div>

                <div className="border rounded-2xl p-5 bg-[#fafcfb] space-y-4">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <span className="font-extrabold text-xs text-slate-800 uppercase tracking-widest block">Widget Slider Interval Spec</span>
                    <span className="bg-slate-100 text-slate-500 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full">System Engine</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Setiap banner sekunder menyerap slide timings secara dinamis setiap <strong className="text-emerald-800">5.5 Detik</strong>. Kecepatan interval ini dimandatkan ramah perangkat seluler rendah memori.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================= SUB TAB: POPUP MANAGER ======================= */}
          {activeSubTab === 'popups_spec' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-600" />
                    POPUP OVERLAY MANAGER
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Kelola modal dialog darurat/iklan sambutan yang muncul begitu wali murid membuka halaman depan.</p>
                </div>
                {!editingPopup && (
                  <button 
                    onClick={() => {
                      setEditingPopup({
                        id: 'pop_' + Date.now(),
                        title: 'Pengumuman Baru',
                        content: 'Isi pengumuman popup Anda di sini...',
                        image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
                        cta_label: 'Lihat Detail',
                        cta_url: 'ppdb',
                        is_active: true
                      });
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Built Popup
                  </button>
                )}
              </div>

              {!editingPopup ? (
                <div className="space-y-4">
                  {popups.map((pop, idx) => (
                    <div key={pop.id || idx} className="border rounded-2xl p-5 bg-white shadow-2xs text-left relative space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <strong className="text-slate-800 text-sm font-black block">{pop.title}</strong>
                        <button
                          onClick={() => {
                            const copy = [...popups];
                            copy[idx].is_active = !pop.is_active;
                            savePopupsState(copy);
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider cursor-pointer ${
                            pop.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {pop.is_active ? 'Aktif' : 'Arsip'}
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        {pop.image_url && (
                          <img src={pop.image_url} alt="Popup Image" className="w-24 h-16 object-cover border rounded-lg shrink-0 bg-slate-100" />
                        )}
                        <div className="space-y-1 text-xs">
                          <p className="text-slate-500 leading-relaxed">{pop.content}</p>
                          <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1 font-mono">
                            <span>CTA Button: <strong className="text-slate-650">{pop.cta_label}</strong> ({pop.cta_url})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 text-xs pt-2 border-t">
                        <button 
                          onClick={() => setEditingPopup({ ...pop })} 
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10px]"
                        >
                          Sunting
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm("Hapus popup pengumuman banner ini?")) {
                              savePopupsState(popups.filter(p => p.id !== pop.id));
                            }
                          }}
                          className="p-1 px-1.5 text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Edit Popup Layout Form */
                <div className="bg-slate-50 border p-5 rounded-2xl text-left space-y-4">
                  <span className="text-xs font-black uppercase text-slate-600 tracking-wider block">Konfigurasi Tampilan Popup</span>
                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] mb-1">JUDUL UTAMA OVERLAY</label>
                    <input 
                      type="text" 
                      value={editingPopup.title} 
                      onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg font-bold text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-extrabold text-[10px] mb-1">TEKS PARAGRAF PENDEK</label>
                    <input 
                      type="text" 
                      value={editingPopup.content} 
                      onChange={(e) => setEditingPopup({ ...editingPopup, content: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">GAMBAR ILUSTRASI BANNER (Tautan URL unspash/lainnya)</label>
                      <input 
                        type="text" 
                        value={editingPopup.image_url} 
                        onChange={(e) => setEditingPopup({ ...editingPopup, image_url: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border rounded-lg font-mono text-xs" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 font-extrabold text-[10px] mb-1">LABEL CTA</label>
                        <input 
                          type="text" 
                          value={editingPopup.cta_label} 
                          onChange={(e) => setEditingPopup({ ...editingPopup, cta_label: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-extrabold text-[10px] mb-1">TARGET URL</label>
                        <input 
                          type="text" 
                          value={editingPopup.cta_url} 
                          onChange={(e) => setEditingPopup({ ...editingPopup, cta_url: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs font-mono" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button onClick={() => setEditingPopup(null)} className="px-3.5 py-1.5 bg-white border text-xs font-bold rounded-lg cursor-pointer">Batal</button>
                    <button 
                      onClick={() => {
                        const copy = [...popups];
                        const idx = copy.findIndex(p => p.id === editingPopup.id);
                        if (idx > -1) {
                          copy[idx] = editingPopup;
                        } else {
                          copy.push(editingPopup);
                        }
                        savePopupsState(copy);
                        setEditingPopup(null);
                      }} 
                      className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Konfirmasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================= SUB TAB: REDIRECTS ======================= */}
          {activeSubTab === 'redirect_spec' && (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-emerald-600" />
                    REDIRECT MANAGER (SHORTCUTS)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Daftarkan aturan pengalihan otomatis tautan url jika bermigrasi dari sistem web lama (e.g. mendaftar-lama dialihkan ke ppdb).</p>
                </div>
                {!editingRedirect && (
                  <button 
                    onClick={() => {
                      setEditingRedirect({
                        id: 'red_' + Date.now(),
                        source_url: '/input-lama',
                        target_url: 'ppdb',
                        is_permanent: true
                      });
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Direct Baru
                  </button>
                )}
              </div>

              {!editingRedirect ? (
                <div className="space-y-3">
                  <div className="border rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 uppercase font-bold text-slate-600 border-b">
                        <tr>
                          <th className="px-4 py-3">Source URL (Lama)</th>
                          <th className="px-4 py-3">Destination (Baru)</th>
                          <th className="px-4 py-3">Format Code</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {redirects.map((red, rIdx) => (
                          <tr key={red.id || rIdx} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-mono text-slate-700">{red.source_url}</td>
                            <td className="px-4 py-2.5 font-mono text-emerald-700">{red.target_url}</td>
                            <td className="px-4 py-2.5">
                              <span className="bg-slate-100/80 text-slate-600 font-mono text-[9px] font-black px-2 py-0.5 rounded">
                                {red.is_permanent ? '301 Permanent' : '302 Temporary'}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button 
                                onClick={() => {
                                  if (confirm("Hapus aturan pengalihan URL ini?")) {
                                    saveRedirectsState(redirects.filter(r => r.id !== red.id));
                                  }
                                }}
                                className="text-rose-600 hover:bg-rose-100 p-1 rounded transition-all cursor-pointer"
                              >
                                ✕ Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Edit Redirect Form */
                <div className="bg-slate-50 border p-5 rounded-2xl space-y-4 text-left">
                  <span className="text-xs font-black uppercase text-slate-600 block">Daftar Link Pengalihan</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">SOURCE URL LAMA (e.g. /visimisi-lama)</label>
                      <input 
                        type="text" 
                        value={editingRedirect.source_url} 
                        onChange={(e) => setEditingRedirect({ ...editingRedirect, source_url: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border rounded-lg font-mono text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-extrabold text-[10px] mb-1">TARGET HALAMAN BARU</label>
                      <input 
                        type="text" 
                        value={editingRedirect.target_url} 
                        onChange={(e) => setEditingRedirect({ ...editingRedirect, target_url: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border rounded-lg font-mono text-xs" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button onClick={() => setEditingRedirect(null)} className="px-3.5 py-1.5 bg-white border text-xs font-bold rounded-lg cursor-pointer">Batal</button>
                    <button 
                      onClick={() => {
                        const copy = [...redirects];
                        const idx = copy.findIndex(r => r.id === editingRedirect.id);
                        if (idx > -1) {
                          copy[idx] = editingRedirect;
                        } else {
                          copy.push(editingRedirect);
                        }
                        saveRedirectsState(copy);
                        setEditingRedirect(null);
                      }} 
                      className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Konfirmasi Aturan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Real-time Website Homepage Preview Overlay */}
      {showLivePreview && (
        <div className="fixed inset-0 z-50 bg-[#02251e]/90 backdrop-blur-md flex flex-col animate-fade-in text-slate-800">
          
          {/* Top Panel Control Bar */}
          <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600/20 p-1.5 rounded-lg border border-emerald-500/30">
                <Palette className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left font-sans">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-450">Live Simulator Pratinjau Beranda</h4>
                <p className="text-[10px] text-slate-400">Sesuaikan dan tinjau performa estetika warna dan tipografi secara instan sebelum disimpan.</p>
              </div>
            </div>

            {/* Viewport & Actions Toggles */}
            <div className="flex items-center gap-4">
              {/* Responsive Toggles */}
              <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1 text-[10px] font-bold">
                <button 
                  onClick={() => setPreviewViewport('desktop')}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 ${
                    previewViewport === 'desktop' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                  }`}
                  type="button"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Desktop View</span>
                </button>
                <button 
                  onClick={() => setPreviewViewport('mobile')}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 ${
                    previewViewport === 'mobile' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                  }`}
                  type="button"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile View</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 text-xs font-bold font-sans">
                <button 
                  onClick={() => setShowLivePreview(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg cursor-pointer"
                  type="button"
                >
                  Kembali Edit
                </button>
                <button 
                  onClick={() => {
                    saveTheme(theme);
                    setShowLivePreview(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
                  type="button"
                >
                  <Save className="w-3.5 h-3.5 animate-bounce" />
                  <span>Terapkan & Simpan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area: Left/Right simulator */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Live Control Sidebar inside Simulator! */}
            <div className="w-full lg:w-76 bg-slate-950 border-r border-slate-850 p-5 overflow-y-auto text-slate-200 text-left space-y-4.5 shrink-0">
              <div className="border-b border-slate-850 pb-3">
                <span className="text-[9px] uppercase font-bold text-emerald-450 tracking-widest block">Simulator Real-time</span>
                <span className="text-xs font-black text-white block mt-0.5">Penyesuaian Parameter</span>
              </div>

              {/* Theme customizers inside the simulation */}
              <div className="space-y-4 text-[11px] font-sans">
                <div>
                  <label className="block text-slate-400 font-extrabold mb-1 uppercase text-[9.5px]">Warna Utama (Primary)</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={theme.primaryColor} 
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-7 h-7 p-0 border rounded cursor-pointer shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={theme.primaryColor} 
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded font-mono uppercase text-[10px] text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1 uppercase text-[9.5px]">Warna Sekunder (Secondary/Gold)</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={theme.secondaryColor} 
                      onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                      className="w-7 h-7 p-0 border rounded cursor-pointer shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={theme.secondaryColor} 
                      onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded font-mono uppercase text-[10px] text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1 uppercase text-[9.5px]">Warna Sorotan (Accent)</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={theme.accentColor || '#10b981'} 
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="w-7 h-7 p-0 border rounded cursor-pointer shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={theme.accentColor || '#10b981'} 
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded font-mono uppercase text-[10px] text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1 uppercase text-[9.5px]">Tipografi Judul (Heading)</label>
                  <select 
                    value={theme.headingFont} 
                    onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-extrabold mb-1 uppercase text-[9.5px]">Lekukan Tombol (Radius)</label>
                  <select 
                    value={theme.borderRadius} 
                    onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                  >
                    <option value="4px">4px (Tajam)</option>
                    <option value="8px">8px (Menengah)</option>
                    <option value="12px">12px (Rounded)</option>
                    <option value="16px">16px (Bulat)</option>
                    <option value="20px">20px (Kapsul)</option>
                  </select>
                </div>

                <div className="border-t border-slate-850 pt-3">
                  <label className="block text-slate-400 font-extrabold mb-1.5 uppercase text-[9.5px]">Koleksi Template Preset Cepat</label>
                  <div className="grid grid-cols-1 gap-1.5 font-sans">
                    <button 
                      onClick={() => setTheme({ ...theme, primaryColor: '#005a4c', primaryHoverColor: '#004231', secondaryColor: '#ca8a04', accentColor: '#10b981', headingFont: 'Plus Jakarta Sans', borderRadius: '12px', shadowSize: 'md' })}
                      className="px-2 py-1.5 text-[10px] text-slate-300 hover:text-white border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 text-left cursor-pointer transition-colors"
                      type="button"
                    >
                      🟢 Modern Emerald
                    </button>
                    <button 
                      onClick={() => setTheme({ ...theme, primaryColor: '#78350f', primaryHoverColor: '#451a03', secondaryColor: '#eab308', accentColor: '#facc15', headingFont: 'Playfair Display', borderRadius: '8px', shadowSize: 'lg' })}
                      className="px-2 py-1.5 text-[10px] text-slate-300 hover:text-white border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 text-left cursor-pointer transition-colors"
                      type="button"
                    >
                      🟡 Royal Gold
                    </button>
                    <button 
                      onClick={() => setTheme({ ...theme, primaryColor: '#1e3a8a', primaryHoverColor: '#1e40af', secondaryColor: '#3b82f6', accentColor: '#60a5fa', headingFont: 'Inter', borderRadius: '16px', shadowSize: 'md' })}
                      className="px-2 py-1.5 text-[10px] text-slate-300 hover:text-white border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 text-left cursor-pointer transition-colors"
                      type="button"
                    >
                      🔵 Classic MIN Blue
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic contrast rating inside simulation sidebar */}
              {(() => {
                const ratio = getContrastRatio(theme.primaryColor || '#005a4c', '#ffffff');
                const rounded = Math.round(ratio * 100) / 100;
                const isPass = ratio >= 4.5;
                return (
                  <div className={`p-3 rounded-xl text-[10px] border leading-tight space-y-1 text-left ${
                    isPass 
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                      : 'bg-red-950/20 border-red-900/40 text-red-300'
                  }`}>
                    <span className="font-extrabold uppercase block tracking-wider">Keamanan Keterbacaan</span>
                    <p className="opacity-90">Rasio Kontras: {rounded}:1</p>
                    <span className="font-extrabold inline-block mt-0.5 uppercase tracking-widest text-[8px] px-1.5 py-0.5 rounded-full bg-white/10">
                      {isPass ? '✓ Lulus Standar WCAG' : '⚠️ Kurang Kontras!'}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Simulating Viewport Frame Wrapper */}
            <div className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center overflow-auto">
              <div 
                className={`bg-white text-slate-800 bg-gradient-to-b from-white to-slate-50 transition-all duration-300 mx-auto overflow-y-auto ${
                  previewViewport === 'mobile' 
                    ? 'w-[375px] h-[640px] rounded-[36px] border-[12px] border-slate-950 relative shadow-2xl shrink-0' 
                    : 'w-full max-w-5xl h-full rounded-2xl border border-slate-800'
                }`}
                style={{
                  '--preview-primary': theme.primaryColor,
                  '--preview-secondary': theme.secondaryColor,
                  '--preview-accent': theme.accentColor || '#10b981',
                  '--preview-heading-font': theme.headingFont,
                  '--preview-body-font': theme.bodyFont || 'Plus Jakarta Sans',
                  '--preview-radius': theme.borderRadius,
                  '--preview-shadow': theme.shadowSize === 'none' ? 'none' : theme.shadowSize === 'sm' ? '0 1px 3px rgba(0,0,0,0.1)' : theme.shadowSize === 'lg' ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
                } as any}
              >
                
                {/* 1. TOPBAR NOTICE (Simulated) */}
                <div 
                  className="py-1.5 px-4 text-[9px] font-extrabold tracking-wider text-white uppercase flex items-center justify-between text-left select-none shrink-0"
                  style={{ backgroundColor: 'var(--preview-primary)', filter: 'brightness(90%)' }}
                >
                  <span className="truncate">NPSN: 60721234 | AKREDITASI A (SANGAT UNGGUL)</span>
                  <span className="hidden sm:inline-block font-mono">TELP: (0562) 631234</span>
                </div>

                {/* 2. LOGO HEADER BANNER */}
                <div className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3 shrink-0 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--preview-accent)' }}>
                      <span className="text-[10px] font-black text-emerald-800">MIN</span>
                    </div>
                    <div>
                      <h4 className="text-[11.0px] font-black tracking-wider leading-none text-slate-800" style={{ fontFamily: 'var(--preview-heading-font)' }}>MIN SINGKAWANG</h4>
                      <p className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-widest font-bold">Unggul, Islami, Ramah Anak</p>
                    </div>
                  </div>
                  <button 
                    style={{ backgroundColor: 'var(--preview-primary)', borderRadius: 'var(--preview-radius)', boxShadow: 'var(--preview-shadow)' }}
                    className="text-[9px] font-black uppercase text-white px-3.5 py-1.5 tracking-wider hover:opacity-90 cursor-pointer"
                    type="button"
                  >
                    PPDB ONLINE
                  </button>
                </div>

                {/* 3. SIMULATED TICKER */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-1.5 flex items-center select-none text-[9px] text-left shrink-0">
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase text-white shrink-0 mr-2" style={{ backgroundColor: 'var(--preview-accent)' }}>INFO</span>
                  <p className="truncate font-medium text-slate-600">Pendaftaran Peserta Didik Baru (PPDB) Tahun Pelajaran 2026/2027 telah dibuka secara online!</p>
                </div>

                {/* Simulated Homepage Body Scaffold */}
                <div className="p-0 overflow-y-auto">
                  
                  {/* 4. HERO BANNER REPRESENTATION */}
                  <div className="relative h-44 sm:h-64 bg-slate-850 overflow-hidden flex items-center justify-center text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-transparent" />
                    
                    <div className="relative z-10 max-w-xl mx-auto px-4 text-white space-y-2">
                      <span 
                        className="inline-block text-[8px] sm:text-[9.5px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: 'var(--preview-accent)' }}
                      >
                        Madrasah Dasar Negeri Rujukan
                      </span>
                      <h1 
                        className="text-xs sm:text-2xl font-extrabold leading-tight text-white drop-shadow-sm"
                        style={{ fontFamily: 'var(--preview-heading-font)' }}
                      >
                        Mencetak Generasi Unggul Berakhlakul Karimah
                      </h1>
                      <p 
                        className="text-[9px] sm:text-xs text-slate-200 line-clamp-2 max-w-sm mx-auto opacity-95"
                        style={{ fontFamily: 'var(--preview-body-font)' }}
                      >
                        Kombinasi kurikulum nasional dengan pembinaan akhlak mulia dan teknologi dasar unggul.
                      </p>
                      
                      <div className="flex gap-2 justify-center pt-1.5">
                        <button 
                          className="text-[9px] font-bold text-white px-3.5 py-1.5 uppercase tracking-widest hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: 'var(--preview-primary)', borderRadius: 'var(--preview-radius)', boxShadow: 'var(--preview-shadow)' }}
                          type="button"
                        >
                          Selengkapnya
                        </button>
                        <button 
                          style={{ borderColor: 'white', borderWidth: '1px', borderRadius: 'var(--preview-radius)' }}
                          className="text-[9px] font-bold text-white px-3.5 py-1.5 bg-white/10 backdrop-blur-xs uppercase tracking-widest hover:bg-white/20 cursor-pointer"
                          type="button"
                        >
                          Profil GTK
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5. WELCOME CHIEF SPEECH SECTION */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 bg-white border-b text-left">
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-800 mt-2 block">H. Kamarudin, S.Ag</span>
                      <span className="text-[8px] text-slate-400 font-mono">NIP: 197410222005011002</span>
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-0.5" style={{ backgroundColor: 'var(--preview-primary)' }} />
                        <h3 
                          className="text-xs sm:text-xs font-black uppercase"
                          style={{ fontFamily: 'var(--preview-heading-font)', color: 'var(--preview-primary)' }}
                        >
                          Sambutan Kepala Madrasah
                        </h3>
                      </div>
                      <p 
                        className="text-[10px] sm:text-xs text-slate-505 leading-relaxed"
                        style={{ fontFamily: 'var(--preview-body-font)' }}
                      >
                        Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji syukur ke hadirat Allah SWT, website resmi MIN Singkawang hadir sebagai pusat dinamika dan prestasi madrasah kami. Kami siap mengasuh siswa cendekia mandiri berakhlakul karimah tingkat dasar secara profesional...
                      </p>
                      
                      <button 
                        className="text-[9px] font-extrabold uppercase cursor-pointer"
                        style={{ color: 'var(--preview-primary)' }}
                        type="button"
                      >
                        Baca Pidato Lengkap &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 6. BENTO EXCELLENCE PROMO */}
                  <div className="p-4 bg-slate-50 text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Potret Prestasi</span>
                    <h3 className="text-xs font-black text-slate-800 mt-0.5 uppercase" style={{ fontFamily: 'var(--preview-heading-font)' }}>Keunggulan Madrasah</h3>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3 font-sans">
                      <div className="p-3 bg-white border border-slate-100 rounded-lg shadow-2xs space-y-1">
                        <span className="text-sm">🏆</span>
                        <h4 className="text-[10px] font-extrabold text-slate-800 leading-none">Juara Sains</h4>
                        <p className="text-[9px] text-slate-400">15+ Medali Kancah Nasional.</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-100 rounded-lg shadow-2xs space-y-1">
                        <span className="text-sm">🕌</span>
                        <h4 className="text-[10px] font-extrabold text-slate-800 leading-none">Akhlak Karimah</h4>
                        <p className="text-[9px] text-slate-400">Tahfidz Quran & Sholat Duha harian.</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 7. FOOTER CHASSIS */}
                <div className="bg-slate-900 text-slate-300 p-5/6 text-left text-[9px] shrink-0 border-t border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-[10px]" style={{ fontFamily: 'var(--preview-heading-font)' }}>MIN SINGKAWANG</h4>
                      <p className="text-slate-400 leading-relaxed text-[8.5px]">Jl. Jenderal Sudirman No. 45, Condong, Kota Singkawang, Kalimantan Barat 79111</p>
                    </div>
                    <div className="sm:text-right space-y-1">
                      <p className="font-bold text-slate-400">&copy; 2026 MIN Singkawang. Hak Cipta Dilindungi.</p>
                      <p className="text-[8px] text-slate-500 font-mono">Simulated Web Builder Module Interface.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
