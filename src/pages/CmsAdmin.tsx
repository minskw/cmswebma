/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import CmsOverview from '../components/CmsOverview';
import CmsNewsSection from '../components/CmsNewsSection';
import CmsFacultySection from '../components/CmsFacultySection';
import CmsAcademicSection from '../components/CmsAcademicSection';
import CmsSettingsSection from '../components/CmsSettingsSection';
import CmsWebsiteBuilderSection from '../components/CmsWebsiteBuilderSection';
import CmsMediaLibrarySection from '../components/CmsMediaLibrarySection';
import CmsPushNotificationsSection from '../components/CmsPushNotificationsSection';
import MockDb from '../database/mockDb';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, Lock, Mail, ShieldAlert, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, 
  Home, Server, Users, RefreshCw, Cpu, CheckCircle, AlertTriangle, Info, X
} from 'lucide-react';
import { CmsNotification, generateRandomMockPPDBApplicant } from '../lib/notifications';

import { SchoolSettings, SeoSettings, Post, Event, Announcement, Teacher, Facility, DownloadItem, AuditLog } from '../types';

interface CmsAdminProps {
  settings: SchoolSettings;
  seoSettings: SeoSettings;
  posts: Post[];
  events: Event[];
  announcements: Announcement[];
  teachers: Teacher[];
  facilities: Facility[];
  downloads: DownloadItem[];
  auditLogs: AuditLog[];
  onSaveSettings: (settings: SchoolSettings) => void;
  onSaveSeo: (seo: SeoSettings) => void;
  onSavePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  sqlSchemaCode: string;
  onRefreshData?: () => void;
  onNavigate?: (path: string) => void;
}

export default function CmsAdmin({
  settings,
  seoSettings,
  posts,
  events,
  announcements,
  teachers,
  facilities,
  downloads,
  auditLogs,
  onSaveSettings,
  onSaveSeo,
  onSavePost,
  onDeletePost,
  onSaveTeacher,
  onDeleteTeacher,
  sqlSchemaCode,
  onRefreshData = () => {},
  onNavigate = () => {}
}: CmsAdminProps) {
  
  // Helper to extract initial active tab from hash, e.g. #/admin/berita -> 'berita'
  const getTabFromHash = (): string => {
    const hash = window.location.hash;
    // Format is #/admin/tabName or #admin/tabName
    if (hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
      const parts = hash.split('/');
      return parts[parts.length - 1] || 'ikhtisar';
    }
    return 'ikhtisar';
  };

  // Tab Routing state
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return getTabFromHash();
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `/admin/${tab}`;
  };

  // Keep state in sync if hash changes externally
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromHash();
      if (newTab !== activeTab) {
        setActiveTabState(newTab);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Sync hash on component mount if hash doesn't have a tab
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#/admin/') && !hash.startsWith('#admin/')) {
      window.location.hash = `/admin/${activeTab}`;
    }
  }, []);

  // Global Notification history lists
  const [notifications, setNotifications] = useState<CmsNotification[]>([
    {
      id: 'notif-init-1',
      message: '👋 Selamat datang di CMS Admin Portal. Jaringan enkripsi SSL Kemenag RI aktif.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      unread: false,
      category: 'security'
    },
    {
      id: 'notif-init-2',
      message: '📊 Basis data pendaftaran PPDB online dan arsip rilis media berhasil dimuat.',
      type: 'info',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      unread: true,
      category: 'database'
    }
  ]);

  // Translucent dynamic toast overlay popups
  const [activeToasts, setActiveToasts] = useState<CmsNotification[]>([]);

  // Catch custom dispatched notification messages globally
  useEffect(() => {
    const handleGlobalNotification = (e: any) => {
      if (!e || !e.detail) return;
      const { message, type, category = 'general' } = e.detail;

      const newNotif: CmsNotification = {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        message,
        type,
        timestamp: new Date().toISOString(),
        unread: true,
        category
      };

      // Put at top of notifications log
      setNotifications(prev => [newNotif, ...prev]);

      // Filter and append to visible toast arrays
      setActiveToasts(prev => [...prev, newNotif]);

      // Remove the specific overlay toast after 6 seconds gracefully
      setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== newNotif.id));
      }, 6000);

      // Force refreshing the dataset views in real-time
      onRefreshData();
    };

    window.addEventListener('cms-global-notification', handleGlobalNotification as EventListener);
    return () => {
      window.removeEventListener('cms-global-notification', handleGlobalNotification as EventListener);
    };
  }, [onRefreshData]);

  // Simulated live admissions scheduler (simulation candidate arrives in the background)
  useEffect(() => {
    // Generate one mock PPDB candidate after 20 seconds, and then every 75 seconds
    const ppdbInitialTimer = setTimeout(() => {
      generateRandomMockPPDBApplicant();
    }, 20000);

    const ppdbIntervalTimer = setInterval(() => {
      generateRandomMockPPDBApplicant();
    }, 75000);

    return () => {
      clearTimeout(ppdbInitialTimer);
      clearInterval(ppdbIntervalTimer);
    };
  }, []);

  // Handlers for managing notifications list
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleTriggerManualPPDBAdmissions = () => {
    generateRandomMockPPDBApplicant();
  };
  
  // Simulated Authentication & Session state
  const [currentUser, setCurrentUser] = useState<any>(() => MockDb.getLoggedInUser());
  const [sessionRole, setSessionRole] = useState<string>(() => {
    const user = MockDb.getLoggedInUser();
    return user ? user.role : 'Super Admin';
  });

  // Login Form input fields
  const [email, setEmail] = useState<string>('admin@minsingkawang.sch.id');
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Authenticating animation state
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authTokenMsg, setAuthTokenMsg] = useState<string>('');

  // Callback to return safely
  const handleNavigateHome = () => {
    onNavigate('home');
  };

  // Direct login submit handler
  const handleLoginSubmit = async (e?: React.FormEvent, customMail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const checkMail = customMail !== undefined ? customMail : email;
    const checkPass = customPass !== undefined ? customPass : password;

    if (!checkMail || !checkPass) {
      setLoginError("Harap masukkan email dan kata sandi log masuk Anda.");
      return;
    }

    setIsAuthenticating(true);
    setAuthTokenMsg("Menghubungi konsol Kemenag RI terpadu...");
    await new Promise(r => setTimeout(r, 600));

    setAuthTokenMsg("Memverifikasi token tanda tangan digital...");
    await new Promise(r => setTimeout(r, 600));

    setAuthTokenMsg("Mengunduh wewenang hak akses level madrasah...");
    await new Promise(r => setTimeout(r, 600));

    const authenticatedUser = await MockDb.authenticate(checkMail, checkPass);
    if (authenticatedUser) {
      setAuthTokenMsg("Otentikasi Berhasil! Mempersiapkan modul...");
      await new Promise(r => setTimeout(r, 450));
      
      setCurrentUser(authenticatedUser);
      setSessionRole(authenticatedUser.role);
      setIsAuthenticating(false);
      onRefreshData();
    } else {
      setIsAuthenticating(false);
      setLoginError("Email login atau Kata Sandi salah. Harap periksa kembali kredensial Anda.");
    }
  };

  // Instant prefill login cards action
  const handleQuickLogin = (quickMail: string, quickPass: string) => {
    setEmail(quickMail);
    setPassword(quickPass);
    handleLoginSubmit(undefined, quickMail, quickPass);
  };

  // Handle manual role changing dropdown on sidebar
  const handleRoleChangeFromSidebar = async (role: string) => {
    setSessionRole(role);
    let mailAddress = "admin@minsingkawang.sch.id";
    if (role === 'Operator') mailAddress = "operator@minsingkawang.sch.id";
    if (role === 'Kepala Madrasah') mailAddress = "kepala@minsingkawang.sch.id";
    if (role === 'Editor') mailAddress = "editor@minsingkawang.sch.id";

    const user = await MockDb.login(mailAddress, role);
    setCurrentUser(user);
    onRefreshData();
  };

  // Clear Session and logout completely back to credentials screen
  const handleCmsLogout = async () => {
    await MockDb.logout();
    setCurrentUser(null);
    setSessionRole('Super Admin');
    setEmail('');
    setPassword('');
    setLoginError(null);
    onRefreshData();
  };

  // Render Login Gate overlay in case of no authentic profile
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex font-sans antialiased text-slate-100 select-none overflow-y-auto" id="cms_login_gateway_view">
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
          
          {/* Ambient matrix style mesh nodes */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Side: Traditional Brand Greet & Connection status */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 text-left pr-4">
              <div className="inline-flex items-center gap-2 bg-[#004236] border border-emerald-800 text-emerald-400 py-1.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase font-mono w-fit">
                <Server className="w-3.5 h-3.5 animate-pulse" />
                <span>SERVER UTAMA - ONLINE</span>
              </div>

              <div>
                <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
                  MIN Singkawang <br />
                  <span className="text-emerald-400 text-2xl font-extrabold tracking-normal">CMS Control Desk</span>
                </h1>
                <p className="text-slate-400 mt-2.5 text-xs font-medium leading-relaxed">
                  Sistem manajemen konten terpadu berbasis cloud madrasah ibtidaiyah negeri singkawang. Gunakan kredensial Anda untuk memperoleh otorisasi rilis data ke web publik secara aman.
                </p>
              </div>

              {/* Server Stats Indicators */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                  <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Status Database</div>
                    <div className="text-xs text-slate-300 font-bold mt-0.5">Drizzle ORM & Supabase Postgres</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                  <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Keamanan Hak Akses</div>
                    <div className="text-xs text-slate-300 font-bold mt-0.5">Role Based Access Control (RBAC)</div>
                  </div>
                </div>
              </div>

              {/* Back to main web */}
              <button 
                onClick={handleNavigateHome}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all pt-2.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Batal & Kembali ke Beranda</span>
              </button>
            </div>

            {/* Right Side: Secure Interactive Login Desk & Presets */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-left" id="cms_login_form_card">
                
                {/* Mobile view branding */}
                <div className="block lg:hidden text-center pb-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-900 rounded-full px-3 py-1 font-mono">CMS CONTROL DESK & PPDB</span>
                  <h1 className="text-xl font-bold text-white tracking-tight text-center mt-2.5">MIN SINGKAWANG</h1>
                </div>

                <div className="border-b border-slate-800/80 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-emerald-500" />
                    <span>Masuk ke Panel Administrasi</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Kredensial Anda dienkripsi berlapis menggunakan modul pertukaran sertifikat Kemenag RI.
                  </p>
                </div>

                {/* Simulated Console loading block */}
                {isAuthenticating ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4" id="simulated_auth_loader_console">
                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-slate-200 text-xs font-mono tracking-wide text-center bg-black/50 border border-slate-800 px-4 py-2.5 rounded-md min-w-[280px]">
                      <div className="text-[#00ffd0] font-bold animate-pulse">SYSTEM ROOT RUNNING...</div>
                      <div className="mt-1 text-slate-300 font-medium text-[11px] font-sans shrink-0">{authTokenMsg}</div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="bg-rose-950/45 border border-rose-800/50 p-3 rounded-lg text-rose-350 text-xs flex items-start gap-2.5 mt-2 animate-shake" id="login_error_alert">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{loginError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                        Surat Elektronik (Email)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operator@minsingkawang.sch.id"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-150 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                        Kata Sandi Kepegawaian (Password)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-150 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Sertifikat SSL Kemenag Aktif</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:scale-[1.01] active:opacity-90 transition-all font-sans font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer"
                        id="login_submit_btn"
                      >
                        <span>Otentikasi Akun</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Grid of Default Accounts Requested by User */}
              <div className="space-y-2 text-left bg-slate-900/40 border border-slate-850 p-4 sm:p-5 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-800/65 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#00ffbb] flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Akun Default Admin / Operator</span>
                  </span>
                  <span className="text-[9.5px] bg-[#004838] px-2 py-0.5 rounded font-bold font-mono text-emerald-300">RBAC AKTIF</span>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Pilih salah satu aktor default madrasah berikut untuk melakukan pengujian <strong>simulasi log masuk</strong> secara instan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  
                  {/* Default Account 1: Super Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@minsingkawang.sch.id", "admin123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-emerald-950/25 hover:border-emerald-700/60 transition-all cursor-pointer select-none group focus:outline-hidden disabled:opacity-40"
                    id="quick_login_admin"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white group-hover:text-emerald-350 transition-colors leading-none">Super Admin (Urang)</span>
                      <span className="text-[8px] font-bold bg-[#143d35] px-1.5 py-0.5 rounded text-emerald-400 leading-none">ROOT</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono font-medium truncate w-full">admin@minsingkawang.sch.id</div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5 font-mono leading-none">Kata Sandi: <strong className="font-bold text-slate-300">admin123</strong></div>
                    <div className="text-[9.5px] text-emerald-500 mt-1.5 font-medium flex items-center gap-1 uppercase tracking-wider">
                      <span>Akses Penuh CMS</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 2: Operator (Admin) */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("operator@minsingkawang.sch.id", "operator123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-emerald-950/25 hover:border-emerald-700/60 transition-all cursor-pointer select-none group focus:outline-hidden disabled:opacity-40"
                    id="quick_login_operator"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white group-hover:text-emerald-350 transition-colors leading-none">Operator Madrasah</span>
                      <span className="text-[8px] font-bold bg-[#1d3148] px-1.5 py-0.5 rounded text-sky-400 leading-none">STAF</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono font-medium truncate w-full">operator@minsingkawang.sch.id</div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5 font-mono leading-none">Kata Sandi: <strong className="font-bold text-slate-300">operator123</strong></div>
                    <div className="text-[9.5px] text-[#00dda6] mt-1.5 font-medium flex items-center gap-1 uppercase tracking-wider">
                      <span>Kelola PPDB & Berita</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 3: Kepala Madrasah */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("kepala@minsingkawang.sch.id", "kepala123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-emerald-950/25 hover:border-emerald-700/60 transition-all cursor-pointer select-none group focus:outline-hidden disabled:opacity-40"
                    id="quick_login_kepala"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white group-hover:text-emerald-350 transition-colors leading-none">Kepala Madrasah</span>
                      <span className="text-[8px] font-bold bg-[#4c3915] px-1.5 py-0.5 rounded text-amber-500 leading-none">PIMPINAN</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono font-medium truncate w-full">kepala@minsingkawang.sch.id</div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5 font-mono leading-none">Kata Sandi: <strong className="font-bold text-slate-300">kepala123</strong></div>
                    <div className="text-[9.5px] text-amber-500 mt-1.5 font-medium flex items-center gap-1 uppercase tracking-wider">
                      <span>Persetujuan Rilis Publik</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 4: Editor Redaksional */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("editor@minsingkawang.sch.id", "editor123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-emerald-950/25 hover:border-emerald-700/60 transition-all cursor-pointer select-none group focus:outline-hidden disabled:opacity-40"
                    id="quick_login_editor"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white group-hover:text-emerald-350 transition-colors leading-none">Editor Redaksional</span>
                      <span className="text-[8px] font-bold bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 leading-none">RED</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono font-medium truncate w-full">editor@minsingkawang.sch.id</div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5 font-mono leading-none">Kata Sandi: <strong className="font-bold text-slate-300">editor123</strong></div>
                    <div className="text-[9.5px] text-slate-400 mt-1.5 font-medium flex items-center gap-1 uppercase tracking-wider">
                      <span>Penulis Jurnal Berita</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans tracking-tight overflow-hidden" id="admin_pwa_system_layout">
      {/* 1. Left Drawer Collapsible Sidebar with branch line connectors */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sessionRole={sessionRole} 
        setSessionRole={handleRoleChangeFromSidebar} 
        onNavigate={onNavigate} 
        onLogout={handleCmsLogout}
      />

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" id="admin_main_content_canvas">
        
        {/* Top welcome status bar */}
        <AdminHeader 
          activeTab={activeTab} 
          sessionRole={sessionRole} 
          onNavigateHome={handleNavigateHome} 
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onClearAll={handleClearAllNotifications}
          onSimulatePPDB={handleTriggerManualPPDBAdmissions}
        />

        {/* Dynamic Global Toast Overlay Component Stack */}
        <div 
          className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-81 max-w-[calc(100vw-3rem)] pointer-events-none" 
          id="cms_global_portal_toast_con"
        >
          <AnimatePresence>
            {activeToasts.map((toast) => {
              let bgBorder = 'bg-blue-600 border-blue-400 text-white';
              let Icon = Info;
              if (toast.type === 'success') {
                bgBorder = 'bg-[#01352e] border-[#00e3a5] text-white';
                Icon = CheckCircle;
              } else if (toast.type === 'warning') {
                bgBorder = 'bg-amber-600 border-amber-400 text-white';
                Icon = AlertTriangle;
              } else if (toast.type === 'error') {
                bgBorder = 'bg-rose-700 border-rose-500 text-white';
                Icon = ShieldAlert;
              }

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 55, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden shrink-0 ${bgBorder}`}
                >
                  <div className="p-1.5 flex items-center justify-center rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 text-xs pr-4 space-y-1">
                    <span className="font-mono text-[8px] font-black uppercase tracking-wider text-white/70 block">
                      📢 BULETIN {toast.category}
                    </span>
                    <p className="font-semibold leading-relaxed">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                    className="absolute top-2 right-2 text-white/60 hover:text-white cursor-pointer active:scale-90 p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Inner canvas content with custom tab renderer */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50" id="admin_content_viewport">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Sec 1: DASHBOARD STATS */}
            {activeTab === 'ikhtisar' && (
              <CmsOverview 
                posts={posts} 
                facilities={facilities} 
                downloads={downloads} 
                teachers={teachers} 
                auditLogs={auditLogs} 
                setActiveTab={setActiveTab} 
                userRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 2: DATABASE AUDIT PROGRESS LOGS */}
            {activeTab === 'audit_logs' && (
              <CmsOverview 
                posts={posts} 
                facilities={facilities} 
                downloads={downloads} 
                teachers={teachers} 
                auditLogs={auditLogs} 
                setActiveTab={setActiveTab} 
                userRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 2B: REAL-TIME PUSH NOTIFICATIONS CENTER */}
            {activeTab === 'push_notifications' && (
              <CmsPushNotificationsSection />
            )}

            {/* Sec 3: NEWS PUBLISHING CONTROLLER */}
            {activeTab === 'berita' && (
              <CmsNewsSection 
                posts={posts} 
                onSavePost={onSavePost} 
                onDeletePost={onDeletePost} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 4: MISC CAROUSEL ANNOUNCEMENTS */}
            {activeTab === 'pengumuman' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 5: EVENTS & ACTIVITIES CALENDAR */}
            {activeTab === 'events' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 6: GALLERY PHOTOS / VIDEOS */}
            {activeTab === 'galeri' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 6b: MEDIA LIBRARY MODULE */}
            {activeTab === 'media_library' && (
              <CmsMediaLibrarySection 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 7: HUMAN RESOURCES & FACILITIES SECTION (GTK, Program, Facility, Testimonials) */}
            {['gtk', 'program', 'facilities', 'testimonials'].includes(activeTab) && (
              <CmsFacultySection 
                activeTab={activeTab} 
                teachers={teachers} 
                facilities={facilities} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 8: STUDENT REGISTRATION, PPDB & FILE CENTER DOWNLOADS */}
            {['ppdb', 'downloads', 'akademik_kalender', 'akademik_ekstrakurikuler'].includes(activeTab) && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 9: WEBSITE BUILDER FOR FULLY CMS DRIVEN CONFIGURATION */}
            {activeTab.startsWith('builder_') && (
              <CmsWebsiteBuilderSection 
                sessionRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 10: MASTER CONFIGURATION FIELDS FOR BRAND AND IDENTITY */}
            {activeTab.startsWith('sets_') && (
              <CmsSettingsSection 
                activeTab={activeTab} 
                settings={settings} 
                seoSettings={seoSettings} 
                sqlSchemaCode={sqlSchemaCode} 
                onRefreshData={onRefreshData} 
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
