/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ChevronDown, Award, GraduationCap, Phone, Info, Calendar, BookOpen, Download, UserCheck, Shield, BookMarked, Layers, Accessibility, Type, Contrast, Search, Bell } from 'lucide-react';
import { SchoolSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: SchoolSettings;
  userRole: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  textSize: 'small' | 'normal' | 'large' | 'xlarge' | 'huge';
  onTextSizeChange: (size: 'small' | 'normal' | 'large' | 'xlarge' | 'huge') => void;
  contrastMode: 'normal' | 'high-contrast' | 'grayscale' | 'invert';
  onContrastModeChange: (mode: 'normal' | 'high-contrast' | 'grayscale' | 'invert') => void;
  onOpenSearch: () => void;
}

export default function Navigation({ 
  currentPath, 
  onNavigate, 
  settings, 
  userRole, 
  onLogout, 
  theme, 
  onToggleTheme,
  textSize,
  onTextSizeChange,
  contrastMode,
  onContrastModeChange,
  onOpenSearch
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Pusher / Subscription State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  React.useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const dbData = await res.json();
          const subs = dbData.min_singkawang_push_subscriptions || [];
          const currentEndpoint = window.location.origin + '_local_session';
          setIsSubscribed(subs.some((s: any) => s.endpoint === currentEndpoint));
        }
      } catch (err) {
        // quiet
      }
    };
    checkSubscription();
  }, [showNotifPopover]);

  const handleToggleSubscription = async () => {
    if (typeof Notification === 'undefined') {
      alert("Browser Anda tidak mendukung Web Notifications.");
      return;
    }

    if (Notification.permission === 'denied') {
      alert("Izin notifikasi diblokir. Silakan aktifkan manual melalui ikon gembok pada URL bar.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentEndpoint = window.location.origin + '_local_session';
      if (!isSubscribed) {
        const subData = {
          endpoint: currentEndpoint,
          user_name: 'Pengunjung Web (Header)',
          role: 'Pengunjung Berlangganan',
          user_agent: navigator.userAgent.slice(0, 80)
        };
        const r = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subData })
        });
        if (r.ok) {
          setIsSubscribed(true);
          new Notification("Notifikasi Aktif!", {
            body: "Terima kasih! Anda akan menerima update siaran penting dari MIN Singkawang.",
            icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png'
          });
        }
      } else {
        const r = await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: currentEndpoint })
        });
        if (r.ok) {
          setIsSubscribed(false);
        }
      }
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigatTo = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileActiveDropdown(null);
  };

  const handleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const toggleMobileDropdown = (name: string) => {
    if (mobileActiveDropdown === name) {
      setMobileActiveDropdown(null);
    } else {
      setMobileActiveDropdown(name);
    }
  };

  const profilItems = [
    { label: "Sambutan Kepala Madrasah", path: "profil_sambutan" },
    { label: "Profil Singkat", path: "profil_singkat" },
    { label: "Sejarah Madrasah", path: "profil_sejarah" },
    { label: "Visi dan Misi", path: "profil_visi_misi" },
    { label: "Tujuan Madrasah", path: "profil_tujuan" },
    { label: "Struktur Organisasi", path: "profil_organisasi" },
    { label: "Data GTK (Guru & Staff)", path: "profil_gtk" },
    { label: "Sarana & Prasarana", path: "profil_sarana" },
    { label: "Akreditasi Resmi", path: "profil_akreditasi" },
    { label: "Prestasi Madrasah", path: "profil_prestasi" },
    { label: "Program Unggulan", path: "profil_unggulan" },
    { label: "Hubungi Kontak", path: "profil_kontak" },
  ];

  const akademikItems = [
    { label: "Kurikulum Merdeka", path: "akademik_kurikulum" },
    { label: "Kalender Akademik", path: "akademik_kalender" },
    { label: "Projek P5RA Islami", path: "akademik_p5ra" },
    { label: "Ekstrakurikuler Siswa", path: "akademik_ekstra" },
    { label: "Perpustakaan Digital", path: "akademik_perpus" },
  ];

  const kesiswaanItems = [
    { label: "Kegiatan Harian Siswa", path: "kesiswaan_kegiatan" },
    { label: "Prestasi Unggul Siswa", path: "kesiswaan_prestasi" },
    { label: "Organisasi Siswa (OSIM)", path: "kesiswaan_organisasi" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" id="navigation_header">
      {/* School Branding Top-Bar with Contact & Theme / Admin controls */}
      <div className="bg-emerald-900 text-white text-[11px] font-sans py-2.5 px-4 md:px-8 flex justify-between items-center tracking-normal border-b border-emerald-850/40">
        {/* Left Side: School Contacts */}
        <div className="flex flex-wrap items-center gap-4 text-emerald-100 font-medium">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{settings.contact_phone}</span>
          </span>
          <span className="hidden sm:inline text-emerald-700/60">|</span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-amber-400 shrink-0 select-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>{settings.contact_email}</span>
          </span>
        </div>

        {/* Right Side: Toggle Dark/Light icon & Accessibility */}
        <div className="flex items-center gap-4">
          {/* Accessibility Widget Popover */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="text-amber-400 hover:text-white transition-colors cursor-pointer select-none font-sans font-extrabold text-[13px] tracking-wide leading-none p-1 bg-transparent border-0"
              title="Pengaturan Aksesibilitas (Ukuran Huruf & Kontras)"
              aria-expanded={showAccessibility}
              aria-haspopup="true"
            >
              A⁺⁺
            </button>
            
            {showAccessibility && (
              <div className="absolute right-0 mt-2.5 w-76 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4.5 z-[100] text-slate-800 dark:text-slate-100 text-left animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3.5">
                  <span className="font-bold flex items-center gap-1.5 text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    <Accessibility className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    RAMAH NETRA & LANSIA
                  </span>
                  <button 
                    onClick={() => setShowAccessibility(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-150 dark:hover:bg-slate-800"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Size Scale Selector */}
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Type className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Skala Ukuran Huruf
                  </label>
                  <div className="grid grid-cols-5 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-100 dark:border-slate-850">
                    {(['small', 'normal', 'large', 'xlarge', 'huge'] as const).map((size) => {
                      const labels = {
                        small: 'A-',
                        normal: 'A',
                        large: 'A+',
                        xlarge: 'A++',
                        huge: 'A+++'
                      };
                      const desc = {
                        small: 'Sangat Kecil (85%)',
                        normal: 'Ukuran Normal (100%)',
                        large: 'Besar (115%)',
                        xlarge: 'Sangat Besar (130%)',
                        huge: 'Maksimum (150%)'
                      };
                      return (
                        <button
                          key={size}
                          onClick={() => onTextSizeChange(size)}
                          className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                            textSize === size 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                          title={desc[size]}
                          type="button"
                        >
                          {labels[size]}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 leading-tight">
                    Membantu keterbacaan artikel, pembiasaan kesiswaan, and agenda akademik untuk lansia/anak-anak.
                  </div>
                </div>

                {/* Contrast Selector */}
                <div className="mb-1">
                  <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Contrast className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Skema Kontras & Penyaringan
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {(['normal', 'high-contrast', 'grayscale', 'invert'] as const).map((mode) => {
                      const labels = {
                        normal: 'Warna Standar (Asli)',
                        'high-contrast': 'Kontras Tinggi (Kuning / Hitam)',
                        grayscale: 'Monokrom (Skala Abu-abu)',
                        invert: 'Inversi Warna (Negatif Film)'
                      };
                      const iconColor = {
                        normal: 'bg-indigo-500',
                        'high-contrast': 'bg-yellow-400 border border-black',
                        grayscale: 'bg-slate-500',
                        invert: 'bg-black border border-white'
                      };
                      return (
                        <button
                          key={mode}
                          onClick={() => onContrastModeChange(mode)}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between ${
                            contrastMode === mode 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-350 font-extrabold' 
                              : 'border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                          type="button"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${iconColor[mode]}`}></span>
                            <span>{labels[mode]}</span>
                          </div>
                          {contrastMode === mode ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={() => {
                    onTextSizeChange('normal');
                    onContrastModeChange('normal');
                  }}
                  className="w-full text-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-350 bg-transparent border-0 cursor-pointer uppercase tracking-wider"
                >
                  Reset ke Setelan Default
                </button>
              </div>
            )}
          </div>

          <span className="text-emerald-700/60 font-light">|</span>

          {/* Theme Switch Button */}
          <motion.button 
            type="button"
            onClick={onToggleTheme}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.88, rotate: 15 }}
            className="flex items-center justify-center text-emerald-100 hover:text-amber-300 p-1.5 rounded-lg hover:bg-emerald-800/45 cursor-pointer select-none bg-transparent border-0 outline-hidden overflow-hidden"
            title={theme === 'dark' ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="dark"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.161 5.1a.75.75 0 011.06 0l1.591 1.59a.75.75 0 11-1.06 1.061L6.161 6.16a.75.75 0 010-1.06zm13.07 0a.75.75 0 010 1.06l-1.59 1.591a.75.75 0 11-1.061-1.06l1.591-1.59a.75.75 0 011.06 0zM12 17.25a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm-5.839 0a.75.75 0 010 1.06l-1.59 1.591a.75.75 0 11-1.061-1.06l1.591-1.59a.75.75 0 011.06 0zm13.07 0a.75.75 0 011.061 0l1.59 1.59a.75.75 0 11-1.06 1.061l-1.59-1.59a.75.75 0 010-1.061zM21.75 12a.75.75 0 01-.75.75H18.75a.75.75 0 110-1.5H21a.75.75 0 01.75.75zM5.25 12a.75.75 0 01-.75.75H2.25a.75.75 0 010-1.5H4.5a.75.75 0 01.75.75z" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="light"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 11-16.94-11.622.75.75 0 01.832.05z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Main Elegant Glass Header */}
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-xs px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Brand Logo & Name */}
          <button 
            onClick={() => navigatTo("home")} 
            className="flex items-center gap-3 bg-transparent border-0 cursor-pointer text-left focus:outline-hidden"
            id="nav_brand_logo"
          >
            {/* Logo rendered as-is without any frame or background */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png" 
              alt="Logo Resmi" 
              className="w-11 h-11 object-contain shrink-0"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div>
              <h1 className="text-emerald-800 dark:text-emerald-450 font-sans font-extrabold text-base md:text-[17px] leading-tight tracking-tight uppercase">
                MIN Singkawang
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none font-semibold mt-1">
                {settings.slogan || "Unggul, Berakhlakul Karimah, Ramah Anak, dan Berwawasan Lingkungan"}
              </p>
            </div>
          </button>

          {/* Large Screen Desktop Links */}
          <div className="hidden xl:flex items-center gap-1">
            {/* Beranda */}
            <button
              onClick={() => navigatTo("home")}
              className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors duration-150 ${
                currentPath === "home" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              BERANDA
            </button>

            {/* Profil Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdown("profil")}
                className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1 transition-colors duration-150 ${
                  currentPath.startsWith("profil_") ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                PROFIL <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {profilItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigatTo(item.path)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-amber-350 ${
                      currentPath === item.path ? "text-emerald-700 dark:text-amber-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Akademik Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdown("akademik")}
                className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1 transition-colors duration-150 ${
                  currentPath.startsWith("akademik_") ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                AKADEMIK <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {akademikItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigatTo(item.path)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-amber-350 ${
                      currentPath === item.path ? "text-emerald-700 dark:text-amber-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kesiswaan Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdown("kesiswaan")}
                className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1 transition-colors duration-150 ${
                  currentPath.startsWith("kesiswaan_") ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                KESISWAAN <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {kesiswaanItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigatTo(item.path)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-amber-350 ${
                      currentPath === item.path ? "text-emerald-700 dark:text-amber-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Berita */}
            <button
              onClick={() => navigatTo("berita")}
              className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors duration-150 ${
                currentPath === "berita" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              BERITA
            </button>

            {/* Galeri */}
            <button
              onClick={() => navigatTo("galeri")}
              className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors duration-150 ${
                currentPath === "galeri" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              GALERI
            </button>

            {/* Download */}
            <button
              onClick={() => navigatTo("download")}
              className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors duration-150 ${
                currentPath === "download" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              UNDUHAN
            </button>

            {/* Separator Divider */}
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></span>

            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors duration-150 flex items-center justify-center cursor-pointer select-none"
              title="Cari Materi & Berita Portal"
              type="button"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className={`p-2 rounded-lg transition-colors duration-150 flex items-center justify-center cursor-pointer select-none relative ${
                  isSubscribed 
                    ? "text-[#15803d] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100" 
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
                title="Sistem Siaran Push Notifikasi"
                type="button"
              >
                <Bell className="w-4 h-4" />
                {isSubscribed && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#24b47e] rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-3 w-76 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-2xl p-4.5 z-100 text-slate-805 dark:text-slate-100 text-left animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      Push Notifikasi Web
                    </span>
                    <button 
                      onClick={() => setShowNotifPopover(false)}
                      className="text-slate-450 hover:text-slate-600 dark:hover:text-slate-250 p-0.5 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3.5">
                    Dapatkan siaran pengumuman penting, rilis berita kelulusan, dan agenda kegiatan dari MIN Singkawang secara instan langsung di layar Anda.
                  </p>

                  <button
                    onClick={handleToggleSubscription}
                    type="button"
                    className={`w-full py-2 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer text-center ${
                      isSubscribed
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-emerald-800 hover:bg-emerald-950 text-white"
                    }`}
                  >
                    {isSubscribed ? "Matikan Notifikasi" : "Aktifkan Notifikasi"}
                  </button>

                  <div className="text-[9px] text-slate-400 text-center mt-2.5">
                    {isSubscribed 
                      ? "✓ Sesi Browser Terdaftar Menerima Siaran" 
                      : "Izin browser diperlukan untuk mengaktifkan"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Action Toggle Button */}
          <div className="xl:hidden flex items-center gap-2">
            {/* Mobile Search button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSearch();
              }}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md focus:outline-hidden"
              aria-label="Cari Berita & Dokumen"
              type="button"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay Drawer */}
        {isOpen && (
          <div className="xl:hidden block mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn bg-white dark:bg-slate-900 rounded-lg p-3 shadow-lg max-h-[75vh] overflow-y-auto" id="mobile_navigation_drawer">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => navigatTo("home")}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold transition-colors ${
                  currentPath === "home" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                BERANDA
              </button>

              {/* Mobile Profil Sub-Menu (Collapsible Accordion) */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("profil")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>PROFIL MADRASAH</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileActiveDropdown === 'profil' ? 'rotate-180' : ''}`} />
                </button>
                {mobileActiveDropdown === 'profil' && (
                  <div className="pl-6 pr-2 py-1 flex flex-col gap-1 bg-slate-50/50 dark:bg-slate-950/40 rounded-md my-1 animate-fade-in">
                    {profilItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigatTo(item.path)}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${
                          currentPath === item.path ? "text-emerald-800 dark:text-amber-400 bg-emerald-50/70 dark:bg-emerald-950/60 font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-amber-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Akademik Sub-Menu (Collapsible Accordion) */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("akademik")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>AKADEMIK</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileActiveDropdown === 'akademik' ? 'rotate-180' : ''}`} />
                </button>
                {mobileActiveDropdown === 'akademik' && (
                  <div className="pl-6 pr-2 py-1 flex flex-col gap-1 bg-slate-50/50 dark:bg-slate-950/40 rounded-md my-1 animate-fade-in">
                    {akademikItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigatTo(item.path)}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${
                          currentPath === item.path ? "text-emerald-800 dark:text-amber-400 bg-emerald-50/70 dark:bg-emerald-950/60 font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-amber-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Kesiswaan Sub-Menu (Collapsible Accordion) */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("kesiswaan")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>KESISWAAN</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileActiveDropdown === 'kesiswaan' ? 'rotate-180' : ''}`} />
                </button>
                {mobileActiveDropdown === 'kesiswaan' && (
                  <div className="pl-6 pr-2 py-1 flex flex-col gap-1 bg-slate-50/50 dark:bg-slate-950/40 rounded-md my-1 animate-fade-in">
                    {kesiswaanItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigatTo(item.path)}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] font-medium transition-colors ${
                          currentPath === item.path ? "text-emerald-800 dark:text-amber-400 bg-emerald-50/70 dark:bg-emerald-950/60 font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-amber-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <button
                  onClick={() => navigatTo("berita")}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold transition-colors ${
                    currentPath === "berita" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  BERITA
                </button>
                <button
                  onClick={() => navigatTo("galeri")}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold transition-colors ${
                    currentPath === "galeri" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  GALERI MULTIMEDIA
                </button>
                <button
                  onClick={() => navigatTo("download")}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold transition-colors ${
                    currentPath === "download" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  PUSAT DOWNLOAD DOKUMEN
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
