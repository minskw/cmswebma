/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  Layers, Terminal, FileText, Users, Layout, Download, ShieldCheck, 
  Award, Clock, CheckCircle2, AlertCircle, Sparkles, ClipboardCheck, 
  HelpCircle, Eye, ChevronRight, Check, X, FileEdit, Plus, BookOpen, 
  ArrowUpRight, HeartHandshake, FileCheck, Send, ListCollapse, BookCheck,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, Teacher, Facility, DownloadItem, AuditLog, PPDBApplicant, Category } from '../types';
import MockDb from '../database/mockDb';

interface CmsOverviewProps {
  posts: Post[];
  facilities: Facility[];
  downloads: DownloadItem[];
  teachers: Teacher[];
  auditLogs: AuditLog[];
  setActiveTab: (tab: string) => void;
  userRole?: string;
  onRefreshData?: () => void;
}

export default function CmsOverview({
  posts,
  facilities,
  downloads,
  teachers,
  auditLogs,
  setActiveTab,
  userRole,
  onRefreshData
}: CmsOverviewProps) {
  
  // Resolve active role
  const activeRole = userRole || MockDb.getLoggedInUser()?.role || 'Super Admin';

  // Load PPDB Applicants
  const [applicants, setApplicants] = useState<PPDBApplicant[]>(() => MockDb.getApplicants());
  const [categories, setCategories] = useState<Category[]>(() => MockDb.getCategories());

  // Form states for Quick Draft Writer (for Editor Desk)
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState(categories[0]?.id || '1');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [draftSuccess, setDraftSuccess] = useState<string | null>(null);

  // States for interactive notices
  const [activeQueueFilter, setActiveQueueFilter] = useState<'pending' | 'verified' | 'all'>('pending');

  // Load latest database lists
  useEffect(() => {
    setApplicants(MockDb.getApplicants());
    setCategories(MockDb.getCategories());
  }, [posts]);

  // Handle PPDB approvals (for Kepala Madrasah)
  const handleUpdateApplicantStatus = (id: string, newStatus: PPDBApplicant['status']) => {
    const list = MockDb.getApplicants();
    const target = list.find(a => a.id === id);
    if (!target) return;

    const updated: PPDBApplicant = {
      ...target,
      status: newStatus
    };

    MockDb.saveApplicant(updated);
    setApplicants(MockDb.getApplicants());
    
    // Add custom Audit log
    const actionText = newStatus === 'accepted' ? 'Persetujuan Admisi' : newStatus === 'rejected' ? 'Penolakan Admisi' : 'Verifikasi Admisi';
    const statusLabel = newStatus === 'accepted' ? 'Diterima' : newStatus === 'rejected' ? 'Ditolak' : 'Diverifikasi';
    MockDb.addLog(actionText, `Kepala Madrasah mengubah status berkas PPDB ${target.student_name} menjadi ${statusLabel}`);
    
    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Handle instant content publication approval (for Kepala Madrasah)
  const handleApprovePublishPost = (post: Post) => {
    const updated: Post = {
      ...post,
      status: 'publish',
      published_at: new Date().toISOString()
    };
    MockDb.savePost(updated);
    MockDb.addLog('Publikasi Berita', `Kepala Madrasah menyetujui & merilis publikasi berita '${post.title}'`);
    
    setDraftSuccess(`Berita "${post.title}" berhasil disetujui & dipublikasikan secara langsung!`);
    setTimeout(() => setDraftSuccess(null), 4000);

    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Handle Quick Draft submission (for Editor)
  const handleSaveQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftContent.trim()) {
      alert("Judul dan Konten berita wajib diisi.");
      return;
    }

    const cleanTitle = draftTitle.trim();
    const activeUser = MockDb.getLoggedInUser();
    const cleanExcerpt = draftExcerpt.trim() || (draftContent.substring(0, 120) + '...');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: cleanTitle,
      slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      content: draftContent,
      excerpt: cleanExcerpt,
      thumbnail_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
      category_id: draftCategory,
      tags: ['KontenCepat'],
      status: 'draft',
      views: 0,
      published_at: new Date().toISOString(),
      author_id: activeUser?.id || 'editor-quick',
      author_name: activeUser?.name || 'Kontributor Editor'
    };

    MockDb.savePost(newPost);
    MockDb.addLog('Tulis Draft Cepat', `Editor membuat draf tulisan baru: '${cleanTitle}'`);
    
    setDraftTitle('');
    setDraftContent('');
    setDraftExcerpt('');
    setDraftSuccess(`Draft berita "${cleanTitle}" berhasil disimpan ketat di antrean database!`);
    setTimeout(() => setDraftSuccess(null), 4000);

    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Derived calculations
  const totalStats = [
    { label: "Warta Berita", count: posts.length, icon: FileText, tab: "berita", color: "text-[#24b47e] bg-emerald-50 border-emerald-100", desc: "Berita & Pengumuman" },
    { label: "Pendidik & GTK", count: teachers.length, icon: Users, tab: "gtk", color: "text-zinc-700 bg-zinc-100 border-zinc-200", desc: "Data Guru & Staff" },
    { label: "PPDB Online", count: applicants.length, icon: BookCheck, tab: "akademik", color: "text-blue-600 bg-blue-50 border-blue-105", desc: "Pendaftaran Siswa Baru" },
    { label: "Dokumen Unduhan", count: downloads.length, icon: Download, tab: "downloads", color: "text-amber-600 bg-amber-50 border-amber-100", desc: "Formulir & Dokumen Madrasah" }
  ];

  // Specific lists filtering
  const pendingApplicants = applicants.filter(a => a.status === 'submitted' || a.status === 'draft');
  const verifiedApplicants = applicants.filter(a => a.status === 'verified');
  const activeQueueApplicants = activeQueueFilter === 'pending' 
    ? pendingApplicants 
    : activeQueueFilter === 'verified' ? verifiedApplicants : applicants;

  const draftPosts = posts.filter(p => p.status === 'draft');
  const livePosts = posts.filter(p => p.status === 'publish').slice(0, 5);

  return (
    <div className="space-y-6 font-sans text-left animate-fade-in" id="cms_overview_dashboard_component">
      
      {/* Dynamic Role Greeting & Alert Header */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#24b47e]/10 border border-[#24b47e]/20 text-[#15803d] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {activeRole} Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#24b47e] animate-pulse"></span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            {activeRole === 'Kepala Madrasah' && "Selamat Datang, Bapak Kepala Madrasah 👋"}
            {activeRole === 'Editor' && "Ruang Kerja Redaksi & Jurnalisme 👋"}
            {activeRole === 'Super Admin' && "Pusat Kendali Pengembang Sistem 👋"}
            {activeRole === 'Operator' && "Dashboard Manajemen Data Madrasah 👋"}
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
            {activeRole === 'Kepala Madrasah' && "Gunakan halaman khusus persetujuan ini untuk memantau, memeriksa keaslian berkas pendaftaran calon siswa (PPDB), serta menyepakati perilisan publikasi berita madrasah."}
            {activeRole === 'Editor' && "Tulis berita, sunting struktur warta, dan pastikan draf Anda diperiksa ulang sebelum dikirimkan ke Kepala Madrasah untuk proses persetujuan publish."}
            {activeRole === 'Super Admin' && "Sistem terintegrasi penuh. Hak akses administratif mencakup otorisasi log audit, modifikasi data sensitif, verifikasi database, dan perbaikan SEO."}
            {activeRole === 'Operator' && "Kelola kalender agenda, sarana prasarana, GTK pendidik, serta koordinasikan semua warta kegiatan harian MIN Singkawang."}
          </p>
        </div>

        {/* Action shortcut depending on role */}
        <div className="shrink-0 flex gap-2">
          {activeRole === 'Kepala Madrasah' && (
            <button 
              onClick={() => setActiveTab('akademik')} 
              className="px-4 py-2 bg-[#24b47e] hover:bg-[#1f9a6c] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Buka Menu PPDB</span>
            </button>
          )}
          {activeRole === 'Editor' && (
            <button 
              onClick={() => setActiveTab('berita')} 
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#24b47e]" />
              <span>Grup Tulis Berita Full</span>
            </button>
          )}
          {(activeRole === 'Super Admin' || activeRole === 'Operator') && (
            <button 
              onClick={() => setActiveTab('sets_db')} 
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-[#24b47e]" />
              <span>Console SQL</span>
            </button>
          )}
        </div>
      </div>

      {/* Draft Success Alerts */}
      <AnimatePresence>
        {draftSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-100 text-[#15803d] rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#24b47e] shrink-0" />
            <span>{draftSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Stats Grid - Sleek Supabase Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {totalStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={() => setActiveTab(stat.tab)}
              className="bg-white border border-zinc-200/80 rounded-2xl p-4.5 flex items-center justify-between shadow-3xs hover:border-[#24b47e]/60 transition-all cursor-pointer group active:scale-98"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">{stat.label}</span>
                <h4 className="text-2xl font-extrabold mt-1 text-zinc-800 tracking-tight">{stat.count}</h4>
                <p className="text-[9.5px] text-zinc-400 mt-1 font-medium group-hover:text-[#24b47e] transition-colors">{stat.desc}</p>
              </div>
              <div className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center border ${stat.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* =======================================================
          1. KEPALA MADRASAH ROLE ADAPTIVE VIEWS (Persetujuan & Antrean)
          ======================================================= */}
      {activeRole === 'Kepala Madrasah' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PPDB Admission Approvals - Center Stage Container */}
          <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wide">
                  Antrean Persetujuan PPDB Online ({pendingApplicants.length + verifiedApplicants.length})
                </h3>
              </div>
              
              {/* Internal local tabs for filter admissions */}
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveQueueFilter('pending')}
                  className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${activeQueueFilter === 'pending' ? 'bg-white text-zinc-900 shadow-3xs' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Draft/Masuk ({pendingApplicants.length})
                </button>
                <button 
                  onClick={() => setActiveQueueFilter('verified')}
                  className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${activeQueueFilter === 'verified' ? 'bg-white text-zinc-900 shadow-3xs' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Lolos Verifikasi ({verifiedApplicants.length})
                </button>
                <button 
                  onClick={() => setActiveQueueFilter('all')}
                  className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${activeQueueFilter === 'all' ? 'bg-white text-zinc-900 shadow-3xs' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Semua ({applicants.length})
                </button>
              </div>
            </div>

            {/* List PPDB Applicants requiring attention */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {activeQueueApplicants.length > 0 ? (
                  activeQueueApplicants.map((app) => (
                    <motion.div 
                      key={app.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="border border-zinc-100 bg-zinc-50/50 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-zinc-50"
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-[#111827] text-sm">{app.student_name}</h4>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            app.status === 'accepted' 
                              ? 'bg-emerald-50 text-[#24b47e] border border-emerald-100'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-600 border border-rose-150'
                              : app.status === 'verified'
                              ? 'bg-amber-50 text-[#b45309] border border-amber-100'
                              : 'bg-zinc-100 text-zinc-650'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-500 text-[11px] font-medium font-mono">
                          <p>
                            <span className="text-zinc-400 font-sans font-normal">NIK:</span> {app.nik}
                          </p>
                          <p>
                            <span className="text-zinc-400 font-sans font-normal">Sore / Wali:</span> {app.father_name}
                          </p>
                          <p className="col-span-2">
                            <span className="text-zinc-400 font-sans font-normal">Asal Sekolah:</span> {app.previous_school || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Header Approval Actions */}
                      <div className="flex gap-1.5 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3.5 md:pt-0 border-zinc-200/60">
                        {app.status !== 'verified' && app.status !== 'accepted' && (
                          <button 
                            onClick={() => handleUpdateApplicantStatus(app.id, 'verified')}
                            className="bg-white hover:bg-amber-50 border border-zinc-200 hover:border-amber-200 text-zinc-700 hover:text-amber-700 px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                            <span>Verifikasi Berkas</span>
                          </button>
                        )}
                        {app.status !== 'accepted' && (
                          <button 
                            onClick={() => handleUpdateApplicantStatus(app.id, 'accepted')}
                            className="bg-[#24b47e]/10 border border-[#24b47e]/25 hover:bg-[#24b47e] text-[#15803d] hover:text-white px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Terima Siswa</span>
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateApplicantStatus(app.id, 'rejected')}
                            className="bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-100 text-zinc-400 hover:text-rose-600 px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-2 border border-dashed rounded-xl border-zinc-200">
                    <CheckCircle2 className="w-10 h-10 text-[#24b47e] mx-auto opacity-70" />
                    <h5 className="font-extrabold text-xs text-zinc-700 uppercase tracking-wide">Semua Bersih & Terarsip</h5>
                    <p className="text-zinc-400 text-xs max-w-sm mx-auto">Tidak ada berkas PPDB tertunda dengan status filter ini. Semua pengajuan telah diverifikasi Kepala Madrasah.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Content Approval Panel */}
          <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#24b47e]"></div>
              <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wide">Antrean Rilis Publikasi</h3>
            </div>
            
            <p className="text-zinc-500 text-[11.5px] leading-relaxed">
              Daftar draf berita yang disusun oleh para Editor desk dan memerlukan persetujuan tanda tangan digital Kepala Madrasah sebelum dipasang di halaman berita utama.
            </p>

            <div className="space-y-3.5">
              {draftPosts.length > 0 ? (
                draftPosts.map((post) => (
                  <div key={post.id} className="border border-zinc-100 rounded-xl p-3.5 bg-zinc-50/20 text-left space-y-2.5">
                    <div>
                      <h4 className="font-bold text-xs text-zinc-800 leading-tight line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-zinc-400 italic mt-0.5 font-mono">Dibuat oleh: {post.author_name}</p>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1.5">{post.excerpt}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleApprovePublishPost(post)}
                      className="w-full justify-center bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-900 rounded-lg py-1.5 text-[10.5px] font-bold tracking-wide flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#24b47e]" />
                      <span>Setujui & Publikasikan</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border border-dashed rounded-xl border-zinc-200 space-y-2">
                  <BookCheck className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-zinc-400 text-xs">Semua berita telah terpublikasi. Tidak ada draf tertunda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          2. EDITOR ROLE ADAPTIVE VIEWS (Drafting Desk & Live Logs)
          ======================================================= */}
      {activeRole === 'Editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Quick Draft Scribber Widget - Elegant Content Form */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-[#24b47e]" />
                <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wide">Tulis Draft Berita Cepat</h3>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full">Editorial Auto-Link</span>
            </div>

            <form onSubmit={handleSaveQuickDraft} className="space-y-4 text-xs font-medium text-zinc-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Judul Berita</label>
                  <input 
                    type="text" 
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Masukkan judul kabar, misal: MIN Singkawang Juara Adiwiyata..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#24b47e] bg-zinc-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Kategori Kabar</label>
                  <select 
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#24b47e] bg-zinc-50/50 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Kutipan Pendek (Excerpt)</label>
                <input 
                  type="text" 
                  value={draftExcerpt}
                  onChange={(e) => setDraftExcerpt(e.target.value)}
                  placeholder="Ringkasan 1 kalimat rincian berita utama (opsional)..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#24b47e] bg-zinc-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Isi Lengkap Berita</label>
                <textarea 
                  rows={4}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Deskripsikan warta berita secara detail di sini..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#24b47e] bg-zinc-50/50 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#111827] hover:bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs uppercase tracking-wide"
                >
                  <FolderPlus className="w-4 h-4 text-[#24b47e]" />
                  <span>Simpan Ke Antrean Draft</span>
                </button>
              </div>
            </form>
          </div>

          {/* Editor Drafts Overview & Live Publications tracker */}
          <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wide">Daftar Kerja Berita Draft ({draftPosts.length})</h3>
              <button onClick={() => setActiveTab('berita')} className="text-xs text-[#24b47e] hover:underline font-bold">Semua Kabar &rarr;</button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {draftPosts.length > 0 ? (
                draftPosts.map((post) => (
                  <div key={post.id} className="p-3 border border-zinc-100 bg-zinc-50/40 rounded-xl flex items-center justify-between gap-3 text-left">
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-zinc-800 truncate leading-tight">{post.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-300" />
                        <span>Tertahan sebagai Draft</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('berita')}
                      className="p-1 px-2.5 bg-white border hover:bg-zinc-50 border-zinc-200 rounded-md text-[10px] font-bold text-zinc-700 cursor-pointer shrink-0 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center border border-dashed rounded-xl border-zinc-200 space-y-1">
                  <CheckCircle2 className="w-7 h-7 text-[#24b47e] mx-auto" />
                  <p className="text-zinc-500 text-xs font-medium">Draft kosong!</p>
                  <p className="text-zinc-400 text-[10.5px]">Seluruh tulisan buatan Editor telah berhasil dipublikasikan.</p>
                </div>
              )}
            </div>

            {/* Live Metrics Monitoring widget */}
            <div className="border-t border-zinc-100 pt-4 space-y-3 text-left">
              <h4 className="font-bold text-xs text-zinc-650 uppercase tracking-wider">Pantauan Sebaran Kabar Terkini</h4>
              <div className="space-y-2.5 text-xs text-zinc-700">
                {livePosts.map((post) => (
                  <div key={post.id} className="flex justify-between items-center text-[11px] border-b border-zinc-50 pb-2">
                    <span className="truncate font-semibold text-zinc-800 max-w-[70%]">{post.title}</span>
                    <span className="font-mono text-zinc-400 text-[10px]">{post.views || 0} hits</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =======================================================
          3. GENERAL / SUPER ADMIN / OPERATOR VIEWS (Central Grid)
          ======================================================= */}
      {(activeRole === 'Super Admin' || activeRole === 'Operator') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Information Notice & Settings Shortcuts */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-zinc-800 font-extrabold text-xs uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-1.5 text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-[#24b47e]"></span>
              <span>Pemberitahuan Sistem & Akses Cepat</span>
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Selamat datang di Konsol Pusat Kontrol Administrasi Madrasah Ibtidaiyah Negeri (MIN) Singkawang. Seluruh modul konfigurasi terintegrasi secara instan. Perubahan pada parameter halaman seperti <strong>Teks Topbar, Gambar Carousel, Visi-Misi, maupun Berkas Dokumen Unduhan</strong> langsung disimpan dalam memori virtual dan tercermin di portal publik secara seketika.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button 
                onClick={() => setActiveTab('sets_topbar')}
                className="px-3.5 py-2 text-[10.5px] font-bold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 transition-all text-left cursor-pointer"
              >
                📢 Edit Running Ticker
              </button>
              <button 
                onClick={() => setActiveTab('sets_hero_slider')}
                className="px-3.5 py-2 text-[10.5px] font-bold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 transition-all text-left cursor-pointer"
              >
                🖼️ Kelola Carousel Slideshow
              </button>
              <button 
                onClick={() => setActiveTab('sets_seo')}
                className="px-3.5 py-2 text-[10.5px] font-bold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 transition-all text-left cursor-pointer"
              >
                🔍 Generator Sitemap & SEO
              </button>
            </div>
          </div>

          {/* Database Setup & Integrasi status resembling Supabase layout */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-zinc-800 font-extrabold text-xs uppercase tracking-wider border-b border-zinc-100 pb-2 text-left">
                Integritas Sinkronisasi
              </h4>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status Database:</span>
                  <span className="font-mono text-[10.5px] font-extrabold text-[#15803d] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                    ONLINE & ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Backup Storage:</span>
                  <span className="font-mono text-[10.5px] font-bold text-zinc-500">PWA LocalStorage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">SSL Encryption:</span>
                  <span className="font-mono text-[10.5px] font-bold text-zinc-500">AES-256 Valid</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTab('sets_db')}
              className="w-full text-center mt-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-2 rounded-lg transition-all cursor-pointer shadow-3xs uppercase tracking-wider"
            >
              Lihat Skema SQL Supabase
            </button>
          </div>
        </div>
      )}

      {/* Audit Activity Logger - Shared by default at the footer panel */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="text-zinc-800 font-extrabold text-xs uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-1.5 text-left">
          <Terminal className="w-4 h-4 text-[#24b47e]" />
          <span>Aktivitas & Log Audit Database Sistem Terkini</span>
        </h4>
        <div className="rounded-xl overflow-hidden border border-zinc-100 divide-y divide-zinc-100 text-xs bg-zinc-50/50">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[#15803d] font-extrabold uppercase text-[9px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                  {log.action}
                </span>
                <p className="text-zinc-650 mt-1.5 font-medium leading-relaxed">{log.details}</p>
              </div>
              <div className="text-left md:text-right shrink-0">
                <span className="text-[11px] text-zinc-700 font-bold block">{log.user_name}</span>
                <span className="text-[9.5px] text-zinc-400 block font-mono mt-1 font-semibold">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID') || "Live Time"}
                </span>
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <p className="p-6 text-center text-zinc-450 text-xs">Belum ada catatan audit database yang terdeteksi.</p>
          )}
        </div>
      </div>

    </div>
  );
}
