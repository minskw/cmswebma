/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Post, Category } from '../types';
import { Search, Calendar, User, Eye, ArrowLeft, Share2, Award, Clock, MessageSquare, Send, ShieldCheck, HelpCircle, Facebook, Twitter, MessageCircle, Check, Link2, Printer, Rss, Pin } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { calculateReadingTime } from '../utils/readingTime';
import AuthorBio from '../components/AuthorBio';
import MockDb from '../database/mockDb';
import { DriveFileEmbed } from '../components/DriveFileEmbed';

// Helper to extract Google Drive sharing links from post text or HTML
function extractGoogleDriveLinks(content: string): string[] {
  if (!content) return [];
  const regex = /https?:\/\/(?:drive|docs)\.google\.com\/[^\s"′′<>'\\]+/g;
  const matches = content.match(regex);
  if (!matches) return [];
  return Array.from(new Set(matches.map(url => {
    let clean = url;
    // Strip trailing HTML/JSON encoding or markdown punctuation
    if (clean.endsWith('.') || clean.endsWith(',') || clean.endsWith(')') || clean.endsWith('"') || clean.endsWith("'") || clean.endsWith('&quot;')) {
      clean = clean.replace(/[.,)"'&]+$/, '');
    }
    return clean;
  })));
}

interface BeritaListProps {
  posts: Post[];
  categories: Category[];
  selectedPost: Post | null;
  onSelectPost: (post: Post | null) => void;
  onIncrementViews: (id: string) => void;
}

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export default function BeritaList({ posts, categories, selectedPost, onSelectPost, onIncrementViews }: BeritaListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');

  // Comment System States
  const [comments, setComments] = useState<Comment[]>(() => {
    return MockDb.getComments();
  });

  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(3);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback copy
      const tempInput = document.createElement("input");
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Initialize raw math captcha
  const regenerateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 2);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    regenerateCaptcha();
  }, [selectedPost?.id]);

  // Persist comments
  useEffect(() => {
    MockDb.saveComments(comments);
  }, [comments]);

  // Filter posts based on publish status and scheduled date-time
  const publishedPosts = posts.filter(p => {
    if (p.status === 'publish') return true;
    if (p.status === 'schedule') {
      const isPast = new Date(p.published_at).getTime() <= Date.now();
      return isPast;
    }
    return false;
  });

  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'SEMUA' || post.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const pinA = a.is_pinned ? 1 : 0;
    const pinB = b.is_pinned ? 1 : 0;
    if (pinA !== pinB) return pinB - pinA; // Pinned first
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime(); // Newest first
  });

  const handleReadPost = (post: Post) => {
    onIncrementViews(post.id);
    onSelectPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get comments including some simulated high-quality comments for demonstration
  const getCommentsForPost = (postId: string): Comment[] => {
    const userComments = comments.filter(c => c.postId === postId);
    
    // Seed default comments based on post ID so it never looks empty
    const seedComments: Comment[] = [
      {
        id: `seed1-${postId}`,
        postId,
        authorName: 'Ustadzah Nurul Hidayah, S.Ag.',
        authorEmail: 'nurul.hidayah@gmail.com',
        content: `Masha Allah, berita kesiswaan dan kegiatan akademis yang sangat inspiratif. Selaku bagian dari keluarga besar madrasah, kami sangat bersyukur melihat perkembangan dan antusiasme belajar anak-anak didik di MIN Singkawang. Semoga terus amanah dan berkontribusi besar melahirkan anak soleh-solehah.`,
        createdAt: '2026-06-03T02:30:00Z'
      },
      {
        id: `seed2-${postId}`,
        postId,
        authorName: 'H. Rahman Thahir (Wali Murid)',
        authorEmail: 'rahman.thahir@outlook.co.id',
        content: `Terima kasih atas transparansi info yang disajikan di web ini. Sangat membantu kami para orang tua murid untuk memantau agenda kesiswaan, jadwal kalender akademik, dan kegiatan ekstrakurikuler terupdate anak-anak. MIN Singkawang memang hebat bermartabat!`,
        createdAt: '2026-06-05T07:12:00Z'
      }
    ];

    return [...seedComments, ...userComments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!commentName.trim() || !commentText.trim()) {
      setFormError('Nama dan isi komentar wajib diisi.');
      return;
    }

    const parsedAnswer = parseInt(captchaAnswer, 10);
    if (isNaN(parsedAnswer) || parsedAnswer !== (captchaNum1 + captchaNum2)) {
      setFormError('Jawaban CAPTCHA verifikasi salah. Harap hitung kembali dengan teliti.');
      return;
    }

    if (!selectedPost) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId: selectedPost.id,
      authorName: commentName.trim(),
      authorEmail: commentEmail.trim() || undefined,
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);
    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setCaptchaAnswer('');
    setFormSuccess(true);
    regenerateCaptcha();

    // Scroll comment list into focus gently
    setTimeout(() => {
      const el = document.getElementById('latest-comments-header');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  };

  // If a post is active, show the Detailed view of that specific post
  if (selectedPost) {
    const matchedCategory = categories.find(c => c.id === selectedPost.category_id);
    
    // Suggest related posts (up to 3, prioritized by matching category first, then sorted newest first by publication date)
    const relatedPosts = publishedPosts
      .filter(p => p.id !== selectedPost.id)
      .sort((a, b) => {
        const sameCategoryA = a.category_id === selectedPost.category_id ? 1 : 0;
        const sameCategoryB = b.category_id === selectedPost.category_id ? 1 : 0;
        
        if (sameCategoryA !== sameCategoryB) {
          return sameCategoryB - sameCategoryA; // prioritized matches first
        }
        
        // Otherwise, prioritize newer publication date
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      })
      .slice(0, 3);

    const postComments = getCommentsForPost(selectedPost.id);

    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 text-left font-sans transition-colors duration-200" id="detailed_post_view">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button 
              type="button"
              onClick={() => onSelectPost(null)}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors no-print"
            >
              ← KEMBALI KE DAFTAR BERITA
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-emerald-750 dark:text-emerald-400 bg-white dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/80 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors no-print"
            >
              <Printer className="w-3.5 h-3.5" /> CETAK BERITA / WARTA
            </button>
          </div>

          <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-xs p-6 md:p-10 transition-colors duration-200">
            {/* Post meta header */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-mono mb-6">
              <button
                type="button"
                onClick={() => {
                  if (selectedPost.category_id) {
                    setSelectedCategory(selectedPost.category_id);
                    setSearchTerm('');
                    onSelectPost(null);
                  }
                }}
                className="bg-emerald-55 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-820 dark:text-emerald-350 px-2.5 py-1 rounded font-extrabold uppercase text-[9px] cursor-pointer transition-colors border border-transparent hover:border-emerald-200/30"
                title={`Saring warta kategori: ${matchedCategory ? matchedCategory.name : "Warta"}`}
              >
                {matchedCategory ? matchedCategory.name : "Warta"}
              </button>
              <span>{new Date(selectedPost.published_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {calculateReadingTime(selectedPost.content)} Menit Membaca</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {selectedPost.views} Kali Dilihat</span>
            </div>

            <h1 className="text-slate-900 dark:text-white text-2xl md:text-3.5xl font-extrabold tracking-tight leading-tight mb-6">
              {selectedPost.title}
            </h1>

            {/* Author meta card */}
            <div className="flex items-center gap-3 border-y border-slate-100 dark:border-slate-800/60 py-3.5 mb-8">
              <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-bold text-xs border border-emerald-100 dark:border-emerald-900/40">
                {selectedPost.author_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{selectedPost.author_name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Staf Hubungan Masyarakat MIN Singkawang</p>
              </div>
            </div>

            {/* Backdrop thumbnail picture */}
            <div className="h-96 md:h-[400px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-8 border border-slate-50 dark:border-slate-800">
              <OptimizedImage src={selectedPost.thumbnail_url} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            {/* Article Content typography */}
            <div 
              className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans space-y-4 border-b border-slate-100 dark:border-slate-800/60 pb-10 html-content prose prose-emerald dark:prose-invert max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* Embedded Google Drive files section */}
            {(() => {
              const driveLinks = extractGoogleDriveLinks(selectedPost.content);
              if (driveLinks.length > 0) {
                return (
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60 space-y-5 no-print text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-700 dark:text-emerald-400">📎</span>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                        Pratinjau Berkas & Media Terkait (Google Drive)
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {driveLinks.map((link, idx) => (
                        <DriveFileEmbed 
                          key={link} 
                          url={link} 
                          title={`Lampiran Berkas #${idx + 1}`} 
                          height="450px"
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      * Tautan di atas terdeteksi secara otomatis dari teks berita untuk kenyamanan akses Anda.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Tags footer */}
            {selectedPost.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 items-center no-print">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mr-2">Kata Kunci:</span>
                {selectedPost.tags.map((tg) => (
                  <button
                    key={tg}
                    type="button"
                    onClick={() => {
                      setSelectedCategory('SEMUA');
                      setSearchTerm(tg);
                      onSelectPost(null);
                    }}
                    className="bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-600 hover:text-emerald-800 dark:text-slate-450 dark:hover:text-emerald-300 text-[10px] font-semibold px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/55 transition-all cursor-pointer shadow-3xs"
                    title={`Saring berita dengan kata kunci: #${tg}`}
                  >
                    #{tg}
                  </button>
                ))}
              </div>
            )}

            {/* Author Bio Card Section */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60">
              <AuthorBio authorName={selectedPost.author_name} />
            </div>
          </article>

          {/* PERSISTENT ACCESSIBLE COMMENT SECTION */}
          <section className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 md:p-10 transition-colors duration-200" aria-label="Kolom komentar pembaca">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <h3 className="text-slate-950 dark:text-white font-extrabold text-sm md:text-base flex items-center gap-2" id="latest-comments-header">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                KOMENTAR PEMBACA ({postComments.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded border border-slate-100/60 dark:border-slate-850">
                Moderasi Aktif
              </span>
            </div>

            {/* Bagikan Berita Widget */}
            <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans transition-colors duration-200">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">BAGIKAN PRESTASI MADRASAH</span>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-snug">Bagikan warta/berita ini kepada keluarga & rekan Anda:</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedPost.title + ' - ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer no-underline uppercase tracking-wide shadow-xs"
                  title="Bagikan ke WhatsApp"
                  id="share_whatsapp_btn"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                  <span>WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 active:scale-95 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer no-underline uppercase tracking-wide shadow-xs border border-transparent dark:border-slate-700"
                  title="Bagikan ke Twitter / X"
                  id="share_twitter_btn"
                >
                  <Twitter className="w-3.5 h-3.5 text-white" />
                  <span>Twitter / X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer no-underline uppercase tracking-wide shadow-xs"
                  title="Bagikan ke Facebook"
                  id="share_facebook_btn"
                >
                  <Facebook className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Facebook</span>
                </a>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-[10px] transition-all cursor-pointer uppercase tracking-wide border md:min-w-[100px] justify-center ${
                    copied 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Salin Tautan Berita"
                  id="share_copy_link_btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Existing Comments List */}
            <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 mb-8" aria-live="polite">
              {postComments.map((comm) => {
                const isSeed = comm.id.startsWith('seed');
                const firstLetter = comm.authorName.charAt(0).toUpperCase();

                return (
                  <div key={comm.id} className="flex gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850">
                    {/* User initials bubble */}
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs border border-emerald-200/40 dark:border-emerald-850">
                      {firstLetter}
                    </div>

                    {/* Comment textual layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-150 truncate">
                            {comm.authorName}
                          </span>
                          {isSeed && (
                            <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                              Verifikasi Madrasah
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {new Date(comm.createdAt).toLocaleString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words font-sans">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Post comment response form */}
            <form onSubmit={handleAddComment} className="border-t border-slate-100 dark:border-slate-800 pt-8" aria-label="Form komentar baru">
              <h4 className="text-slate-900 dark:text-slate-200 font-extrabold text-xs uppercase mb-1.5 tracking-wider">
                Kirim Tanggapan / Pendapat Anda
              </h4>
              <p className="text-[11px] text-slate-450 dark:text-slate-550 mb-6 leading-relaxed">
                Alamat email Anda tidak akan dipublikasikan. Kolom isian wajib ditandai dengan tanda bintang (<span className="text-rose-500 font-bold">*</span>)
              </p>

              {formSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-850 dark:text-emerald-350 text-xs flex items-center gap-2.5 shadow-xs font-sans">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span>Komentar Anda berhasil dipublikasikan dan disimpan secara lokal! Terima kasih telah berpartisipasi menjaga harmoni.</span>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-rose-850 dark:text-rose-350 text-xs flex items-center gap-2.5 shadow-xs font-sans">
                  <span className="text-rose-500 font-black">⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Full name input */}
                <div>
                  <label htmlFor="fullname_input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Lengkap <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullname_input"
                    required
                    aria-required="true"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Contoh: Drs. Wahyu Hidayat"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email_input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between items-center">
                    <span>Surel / Email</span>
                    <span className="text-[10px] text-slate-400 font-normal italic">(Opsional)</span>
                  </label>
                  <input
                    type="email"
                    id="email_input"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    placeholder="Contoh: wahyu@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Textarea comment */}
              <div className="mb-4">
                <label htmlFor="content_textarea" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Isi Komentar / Tanggapan Anda <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  id="content_textarea"
                  rows={4}
                  required
                  aria-required="true"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ketik aspirasi, doa, atau pertanyaan mendidik Anda di sini..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Captcha validation control block */}
              <div className="mb-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label htmlFor="captcha_input" className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Kombinasi Verifikasi Manusia (<span className="text-rose-500 font-bold">*</span>)
                  </label>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-tight">
                    Membantu mencegah spam otomatis. Selesaikan operasi matematika sederhana di bawah ini.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-black bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-800 tracking-wider text-slate-850 dark:text-white select-none">
                    {captchaNum1} + {captchaNum2} =
                  </span>
                  <input
                    type="text"
                    id="captcha_input"
                    required
                    aria-required="true"
                    aria-label={`Berapakah hasil dari ${captchaNum1} ditambah ${captchaNum2}?`}
                    placeholder="Hitung..."
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-24 text-center text-xs px-2.5 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-extrabold"
                  />
                  <button 
                    type="button"
                    onClick={regenerateCaptcha}
                    className="p-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded bg-transparent"
                    title="Ganti soal verifikasi matematika"
                  >
                    🔄 Ganti Soal
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors hover:shadow-md active:scale-95 duration-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  KIRIM KOMENTAR SEKARANG
                </button>
              </div>
            </form>
          </section>

          {/* Related articles row */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 text-left">
              <h3 className="text-slate-900 dark:text-white text-sm md:text-base font-extrabold tracking-tight mb-6 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase">REKOMENDASI BACAAN TERKAIT</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => {
                  const cat = categories.find(c => c.id === related.category_id);
                  return (
                    <div 
                      key={related.id} 
                      onClick={() => handleReadPost(related)}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-750 p-4 flex gap-4 cursor-pointer transition-all rounded-xl hover:shadow-xs group"
                    >
                      <OptimizedImage src={related.thumbnail_url} alt={related.title} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-100 dark:border-slate-800" />
                      <div className="flex flex-col justify-between py-0.5">
                        <h4 className="text-slate-950 dark:text-white font-bold text-xs tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{related.title}</h4>
                        <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px]">
                          {cat && (
                            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">
                              {cat.name}
                            </span>
                          )}
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-slate-400 dark:text-slate-500">{new Date(related.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 font-sans tracking-tight text-left transition-colors duration-200" id="berita_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb / Title */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">MEDIA PUBLIKASI</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">Berita & Informasi Madrasah</h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Menyajikan transparansi informasi dwi-mingguan terpercaya seputar kegiatan madrasah, capaian siswa kejuaraan, and surat keputusan penting.
          </p>

          {/* RSS/Atom Subscription Links */}
          <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Sindikasi Berita:</span>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/rss.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-600 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer select-none no-underline"
                  title="Langganan melalui RSS Feed XML"
                >
                  <Rss className="w-3 h-3 text-orange-400" />
                  <span>RSS FEED</span>
                </a>
                <a 
                  href="/atom.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-600 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer select-none no-underline"
                  title="Langganan melalui Atom Feed XML"
                >
                  <Rss className="w-3 h-3 text-amber-400" />
                  <span>ATOM FEED</span>
                </a>
              </div>
            </div>
            <p className="text-[10px] text-emerald-200/70 font-medium italic">
              Salin tautan di atas untuk aplikasi pembaca feed (Feedly, Inoreader, NetNewsWire, dll)
            </p>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-10 bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
          {/* Categories select row */}
          <div className="flex flex-wrap gap-1.5 shrink-0 w-full lg:w-auto">
            <button 
              type="button"
              onClick={() => setSelectedCategory('SEMUA')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-colors ${
                selectedCategory === 'SEMUA' ? "bg-emerald-800 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-405 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              SEMUA WARTA
            </button>
            {categories.map((cat) => (
              <button 
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-colors ${
                  selectedCategory === cat.id ? "bg-emerald-800 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-405 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berita atau pengumuman..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 rounded-lg focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Berita card grids list */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const matchedCategory = categories.find(c => c.id === post.category_id);
              return (
                <article 
                  key={post.id} 
                  onClick={() => handleReadPost(post)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col h-full cursor-pointer group relative ${
                    post.is_pinned 
                      ? 'border-amber-400/80 dark:border-amber-500/50 ring-2 ring-amber-400/10 dark:ring-amber-450/5' 
                      : 'border-slate-100 dark:border-slate-850'
                  }`}
                >
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <OptimizedImage src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    {/* Category overlay */}
                    <span className="absolute top-4 left-4 bg-emerald-800 text-white text-[9px] font-extrabold px-2.5 py-1 rounded select-none z-10">
                      {matchedCategory ? matchedCategory.name : "Warta"}
                    </span>

                    {/* Pinned overlay badge */}
                    {post.is_pinned && (
                      <span className="absolute top-4 right-4 bg-amber-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md z-10 animate-pulse">
                        <Pin className="w-3 h-3 fill-white" /> PINNED
                      </span>
                    )}

                    <span className="absolute bottom-4 left-4 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide font-mono z-10">
                      {post.views} Dilihat
                    </span>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="flex flex-col gap-3">
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center justify-between">
                        <span>{new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-450 dark:text-slate-500" /> {calculateReadingTime(post.content)} min</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-[14px] leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-50 dark:border-slate-800/80 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                      <span>Mulai Membaca</span>
                      <span>→</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 max-w-xl mx-auto rounded-2xl text-slate-800 dark:text-white">
            <span className="text-4xl">🔍</span>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold text-sm mt-4">Berita Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Harap sesuaikan kata pencarian kata kunci Anda atau ganti kategori penyaring.</p>
          </div>
        )}

      </div>
    </div>
  );
}

