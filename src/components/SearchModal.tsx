/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Calendar, User, Award, BookOpen, Building, ArrowRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResult {
  id: string;
  title: string;
  type: 'news' | 'announcement' | 'download' | 'event' | 'teacher' | 'facility' | 'achievement' | 'program';
  excerpt: string;
  path: string;
  extra?: string;
  rawItem?: any;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSelectPost: (post: any) => void;
  posts: any[];
  announcements: any[];
  downloads: any[];
  teachers: any[];
  facilities: any[];
  achievements: any[];
  events: any[];
  programs: any[];
}

export default function SearchModal({
  isOpen,
  onClose,
  onNavigate,
  onSelectPost,
  posts,
  announcements,
  downloads,
  teachers,
  facilities,
  achievements,
  events,
  programs
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'announcement' | 'download' | 'academic' | 'profile'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Esc key closes the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle dynamic queries with server proxy and client fallback combined
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // 1. Fetch from the full-stack server-side Express search API
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const apiResults = await response.json();
          if (apiResults && apiResults.length > 0) {
            // Unify paths and format raw items for proper client navigation
            const enrichedApiResults = apiResults.map((item: any) => {
              // Locate raw item in client props if available for seamless clicking
              let rawItem = null;
              if (item.type === 'news') {
                rawItem = posts.find(p => p.id === item.id || p.slug === item.id);
              } else if (item.type === 'announcement') {
                rawItem = announcements.find(a => a.id === item.id || a.slug === item.id);
              } else if (item.type === 'download') {
                rawItem = downloads.find(d => d.id === item.id);
              }
              return { ...item, rawItem };
            });
            setResults(enrichedApiResults);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[Search] Server API connection refused, falling back to instant client-side query matching.', err);
      }

      // 2. Performance Fallback: Immediate client-side matching searches all arrays
      const normalizedQuery = query.toLowerCase();
      const matched: SearchResult[] = [];

      // A. Search Posts
      posts.forEach(p => {
        if (p.title.toLowerCase().includes(normalizedQuery) || p.content.toLowerCase().includes(normalizedQuery) || (p.excerpt && p.excerpt.toLowerCase().includes(normalizedQuery))) {
          matched.push({
            id: p.id,
            title: p.title,
            type: 'news',
            excerpt: p.excerpt || p.content.slice(0, 100) + '...',
            path: 'berita',
            extra: p.author_name || 'Redaksi',
            rawItem: p
          });
        }
      });

      // B. Search Announcements
      announcements.forEach(a => {
        if (a.title.toLowerCase().includes(normalizedQuery) || a.content.toLowerCase().includes(normalizedQuery)) {
          matched.push({
            id: a.id,
            title: a.title,
            type: 'announcement',
            excerpt: a.content ? a.content.slice(0, 110) + '...' : 'Pengumuman Resmi Madrasah',
            path: 'home',
            extra: new Date(a.published_at).toLocaleDateString('id-ID'),
            rawItem: a
          });
        }
      });

      // C. Search Downloads
      downloads.forEach(d => {
        if (d.title.toLowerCase().includes(normalizedQuery) || d.filename.toLowerCase().includes(normalizedQuery) || d.category.toLowerCase().includes(normalizedQuery)) {
          matched.push({
            id: d.id,
            title: d.title,
            type: 'download',
            excerpt: `Berkas Kategori: ${d.category} - File: ${d.filename}`,
            path: 'download',
            extra: `${d.file_size} • ${d.downloads_count} Unduhan`,
            rawItem: d
          });
        }
      });

      // D. Search Teachers
      teachers.forEach(t => {
        if (t.name.toLowerCase().includes(normalizedQuery) || t.role.toLowerCase().includes(normalizedQuery) || (t.status && t.status.toLowerCase().includes(normalizedQuery))) {
          matched.push({
            id: t.id,
            title: t.name,
            type: 'teacher',
            excerpt: `GTK / Guru Pendidik: ${t.role} (${t.status || 'PNS'})`,
            path: 'profil_gtk',
            extra: t.nip ? `NIP: ${t.nip}` : 'GTK Madrasah'
          });
        }
      });

      // E. Search Facilities
      facilities.forEach(f => {
        if (f.name.toLowerCase().includes(normalizedQuery) || f.description.toLowerCase().includes(normalizedQuery)) {
          matched.push({
            id: f.id,
            title: f.name,
            type: 'facility',
            excerpt: f.description.slice(0, 100) + '...',
            path: 'profil_sarana',
            extra: `Kondisi: ${f.condition}`
          });
        }
      });

      // F. Search Achievements
      achievements.forEach(ach => {
        if (ach.title.toLowerCase().includes(normalizedQuery) || ach.winner.toLowerCase().includes(normalizedQuery) || ach.description.toLowerCase().includes(normalizedQuery)) {
          matched.push({
            id: ach.id,
            title: ach.title,
            type: 'achievement',
            excerpt: `Pemenang: ${ach.winner} (${ach.level} • ${ach.year}) - ${ach.description?.slice(0, 80) || ''}`,
            path: 'profil_prestasi'
          });
        }
      });

      // G. Search Programs
      programs.forEach(prog => {
        if (prog.title.toLowerCase().includes(normalizedQuery) || prog.description.toLowerCase().includes(normalizedQuery)) {
          matched.push({
            id: prog.id,
            title: prog.title,
            type: 'program',
            excerpt: prog.description.slice(0, 110) + '...',
            path: 'profil_unggulan'
          });
        }
      });

      setResults(matched);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, posts, announcements, downloads, teachers, facilities, achievements, programs]);

  // Click handler linking results to correct dynamic router actions
  const handleResultClick = (result: SearchResult) => {
    onClose();
    if (result.type === 'news' && result.rawItem) {
      onSelectPost(result.rawItem);
    } else {
      onNavigate(result.path);
    }
  };

  // List of matching filter options
  const filteredResults = results.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'news') return item.type === 'news';
    if (activeTab === 'announcement') return item.type === 'announcement';
    if (activeTab === 'download') return item.type === 'download';
    if (activeTab === 'academic') return item.type === 'event' || item.type === 'achievement';
    if (activeTab === 'profile') return item.type === 'teacher' || item.type === 'facility' || item.type === 'program';
    return true;
  });

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'news':
        return <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-450" />;
      case 'announcement':
        return <FileText className="w-4 h-4 text-amber-500 dark:text-amber-450" />;
      case 'download':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'teacher':
        return <User className="w-4 h-4 text-indigo-500" />;
      case 'facility':
        return <Building className="w-4 h-4 text-slate-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Search className="w-4 h-4 text-emerald-700" />;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'news': return 'Berita';
      case 'announcement': return 'Pengumuman';
      case 'download': return 'Unduhan';
      case 'event': return 'Agenda';
      case 'teacher': return 'Guru & Staff';
      case 'facility': return 'Sarana Prasarana';
      case 'achievement': return 'Prestasi';
      case 'program': return 'Program Unggulan';
      default: return 'Portal';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4" id="global_search_modal">
          {/* Backdrop Blur layer with close trigger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-zoom-out"
          />

          {/* Search Card Dialog */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Header / Input Field */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 select-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Tulis kata kunci untuk mencari (contoh: ujian, PPDB, guru, visi)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-0 font-sans font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:ring-0"
              />
              {isLoading ? (
                <Loader className="w-4.5 h-4.5 animate-spin text-emerald-600 shrink-0" />
              ) : query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  title="Bersihkan Pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800/80 px-2 py-0.5 rounded-sm text-slate-500 dark:text-slate-400 select-none font-semibold font-mono">
                  ESC
                </span>
              )}
            </div>

            {/* Quick Filter tabs navigation */}
            {query.trim() && (
              <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none select-none shrink-0">
                {[
                  { id: 'all', name: 'Semua Hasil' },
                  { id: 'news', name: 'Berita' },
                  { id: 'announcement', name: 'Pengumuman' },
                  { id: 'download', name: 'Unduhan' },
                  { id: 'academic', name: 'Akademik/Prestasi' },
                  { id: 'profile', name: 'GTK/Sarana/Lainnya' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-emerald-800 dark:bg-emerald-900 text-white font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}

            {/* Results Output panel box */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {!query.trim() ? (
                /* Empty state / search prompts recommendations */
                <div className="py-8 text-center text-slate-400 dark:text-slate-500 space-y-3">
                  <span className="text-3xl select-none">🔍</span>
                  <div className="max-w-xs mx-auto text-left space-y-2 bg-slate-50 dark:bg-slate-950/20 rounded-xl p-4 border border-slate-100/50 dark:border-slate-850">
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-350 uppercase select-none tracking-wider mb-2">Saran Topik Pencarian:</p>
                    <ul className="space-y-1.5 text-[11px] font-medium">
                      <li>• Ketik <strong className="text-emerald-700 dark:text-emerald-400 cursor-pointer" onClick={() => setQuery('PPDB')}>&quot;PPDB&quot;</strong> untuk panduan pendaftaran siswa</li>
                      <li>• Ketik <strong className="text-emerald-700 dark:text-emerald-400 cursor-pointer" onClick={() => setQuery('Kalender')}>&quot;Kalender&quot;</strong> untuk agenda libur akademik</li>
                      <li>• Ketik <strong className="text-emerald-700 dark:text-emerald-400 cursor-pointer" onClick={() => setQuery('Suryadi')}>&quot;Suryadi&quot;</strong> atau guru untuk daftar kepegawaian</li>
                      <li>• Ketik <strong className="text-emerald-700 dark:text-emerald-400 cursor-pointer" onClick={() => setQuery('Visi')}>&quot;Visi&quot;</strong> untuk membaca visi-misi madrasah</li>
                    </ul>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Found matching items mapping list */
                <div className="space-y-2 animate-fade-in">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id + '-' + result.type}
                      onClick={() => handleResultClick(result)}
                      className="group p-3.5 bg-white dark:bg-slate-850 hover:bg-emerald-50/40 dark:hover:bg-emerald-990/10 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 rounded-xl cursor-pointer transition-all flex items-start gap-3 justify-between"
                    >
                      <div className="flex items-start gap-2.5 text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/40 dark:border-slate-700/65 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:scale-105 transition-all shrink-0">
                          {getResultIcon(result.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded tracking-wide uppercase select-none">
                              {getResultTypeLabel(result.type)}
                            </span>
                            {result.extra && (
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                                • {result.extra}
                              </span>
                            )}
                          </div>
                          <h4 className="text-slate-900 dark:text-white font-extrabold text-xs md:text-sm leading-snug uppercase mt-1 group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
                            {result.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-405 mt-1 leading-relaxed line-clamp-2">
                            {result.excerpt}
                          </p>
                        </div>
                      </div>
                      <button className="text-transparent group-hover:text-emerald-700 dark:group-hover:text-amber-400 self-center transition-colors">
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* No matching results State */
                <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <span className="text-3xl">🫙</span>
                  <p className="text-xs font-semibold mt-2 text-slate-500 dark:text-slate-400">Tidak ada hasil yang sesuai dengan pencarian Anda.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Coba gunakan istilah yang lebih umum atau hubungi admin.</p>
                </div>
              )}
            </div>

            {/* Footer information */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-950/45 text-center flex justify-between items-center px-5 font-medium select-none text-slate-500">
              <span>Menampung seluruh data berita resmi, pengumuman darurat, & daftar GTK Madrasah</span>
              <span>Tekan <strong className="font-semibold text-slate-550 dark:text-slate-400">Esc</strong> untuk tutup</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
