/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolSettings, Post, Event, Program, Achievement, Testimonial, GalleryItem, Announcement } from '../types';
import { Calendar, Award, BookOpen, Clock, Heart, ArrowRight, Video, ChevronRight, Play, Users, Landmark, FileCheck, Star, Sparkles, MessageSquare, PhoneCall, HelpCircle, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OptimizedImage from '../components/OptimizedImage';
import TestimonialCarousel from '../components/TestimonialCarousel';
import EventCalendar from '../components/EventCalendar';
import SubmitTestimonialForm from '../components/SubmitTestimonialForm';

interface HomeProps {
  settings: SchoolSettings;
  posts: Post[];
  events: Event[];
  programs: Program[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  galleryItems: GalleryItem[];
  announcements: Announcement[];
  onNavigate: (path: string) => void;
  onSelectPost: (post: Post) => void;
  onAddTestimonial?: (testimonial: Testimonial) => void;
}

export default function Home({
  settings,
  posts,
  events,
  programs,
  achievements,
  testimonials,
  galleryItems,
  announcements,
  onNavigate,
  onSelectPost,
  onAddTestimonial
}: HomeProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const defaultSlides = [
    {
      id: "slide_1",
      title: "Mencetak Generasi Unggul Berakhlakul Karimah",
      subtitle: settings.slogan || "Madrasah Dasar Swakelola Negeri Terbaik & Berprestasi Nasional",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
      tag: "Akreditasi A Unggul"
    },
    {
      id: "slide_2",
      title: "Sarana Prasarana Belajar Digital Standar Nasional",
      subtitle: "Dilengkapi Ruang Baca Ber-AC, Laboratorium Smartboard, & Lingkungan Asri",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200",
      tag: "Fasilitas Belajar Unggulan"
    },
    {
      id: "slide_3",
      title: "Pendidikan Berbasis Karakter & Cinta Lingkungan",
      subtitle: "Bina Ilmu Pengetahuan Mutakhir & Perkuat Aqidah Akhlak Sejak Dini",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=1200",
      tag: "Madrasah Ramah Anak"
    }
  ];

  const activeSlides = settings.banner_slides && settings.banner_slides.length > 0 
    ? settings.banner_slides 
    : defaultSlides;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  // Auto sliding interval for Hero Image Slider
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Adjust activeSlide if it runs out of index range when banner list decreases in size
  useEffect(() => {
    if (activeSlide >= activeSlides.length) {
      setActiveSlide(0);
    }
  }, [activeSlides.length, activeSlide]);

  // Latest Publish Posts
  const latestPosts = posts.filter(p => p.status === 'publish').slice(0, 3);
  
  // Latest achievements
  const latestAchievements = achievements.slice(0, 3);

  // Pinned or latest announcements
  const latestAnnouncements = announcements.slice(0, 5);

  return (
    <div className="bg-slate-50 min-h-screen pb-12" id="homepage_container">
      


      {/* 1. SECTION 1: HERO MODERN SLIDER */}
      <section className="relative h-[480px] md:h-[600px] w-full overflow-hidden bg-slate-950" id="hero_slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                nextSlide();
              } else if (info.offset.x > swipeThreshold) {
                prevSlide();
              }
            }}
          >
            {/* Slide background */}
            <div className="absolute inset-0 z-0">
              <OptimizedImage 
                src={activeSlides[activeSlide]?.image} 
                alt={activeSlides[activeSlide]?.title || "Slide banner"} 
                className="w-full h-full object-cover select-none object-center"
                style={{ filter: "brightness(0.55)" }}
                draggable="false"
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Hero content details aligned */}
            <div className="absolute inset-x-0 bottom-0 top-0 z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-left select-none pointer-events-none">
              <div className="max-w-3xl flex flex-col items-start gap-4 pointer-events-auto">
                {activeSlides[activeSlide]?.tag && (
                  <motion.span 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white bg-emerald-600 border border-emerald-400 tracking-wider uppercase animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {activeSlides[activeSlide].tag}
                  </motion.span>
                )}
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-3xl md:text-5xl lg:text-[54px] font-extrabold font-sans leading-tight tracking-tight drop-shadow-md"
                >
                  {activeSlides[activeSlide]?.title}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-slate-200 text-sm md:text-lg leading-relaxed font-sans max-w-xl"
                >
                  {activeSlides[activeSlide]?.subtitle}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-3 mt-4"
                >
                  <button 
                    onClick={() => onNavigate('akademik_kurikulum')}
                    className="px-6 py-3.5 rounded-lg text-xs font-extrabold text-[13px] bg-amber-400 hover:bg-amber-500 text-emerald-950 tracking-wider shadow-md transition-all cursor-pointer border border-amber-300 transform hover:-translate-y-0.5"
                  >
                    PELAJARI KURIKULUM
                  </button>
                  <button 
                    onClick={() => onNavigate('profil_singkat')}
                    className="px-6 py-3.5 rounded-lg text-xs font-extrabold text-[13px] bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs tracking-wider border border-white/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    PELAJARI PROFIL MADRASAH
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide triggers */}
        <div className="absolute bottom-6 right-4 md:right-8 z-20 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Slide Sebelumnya"
          >
            ❮
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Slide Selanjutnya"
          >
            ❯
          </button>
        </div>

        {/* Bullet indices indicator */}
        <div className="absolute bottom-6 left-4 md:left-8 z-20 flex gap-1.5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveSlide(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeSlide === i ? "bg-amber-400 w-8" : "bg-white/40 hover:bg-white/75"
              }`}
              aria-label={`Ke slide ${i+1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. SECTION 2: STATISTIK MADRASAH (BENTO STYLE) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-30" id="statistics_section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Siswa</p>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none mt-1">640+</h3>
              <p className="text-[9px] text-slate-500 mt-1">Siswa Aktif Semester ini</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenaga GTK</p>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none mt-1">35 Orang</h3>
              <p className="text-[9px] text-slate-500 mt-1">Guru & Staff Bersertifikat</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Akreditasi</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 leading-none mt-1">A (96)</h3>
              <p className="text-[9px] text-slate-500 mt-1">Sangat Baik (BAN-SM)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medali Prestasi</p>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none mt-1">126+</h3>
              <p className="text-[9px] text-slate-500 mt-1">Tingkat Kota s.d. Nasional</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 3: SAMBUTAN KEPALA MADRASAH */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20" id="speech_section">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12 items-center">
          {/* Headmaster Image */}
          <div className="w-full lg:w-1/3 flex flex-col items-center shrink-0">
            <div className="relative">
              {/* Green backdrop decor layout */}
              <div className="absolute -inset-3 bg-emerald-700/10 rounded-2xl rotate-3"></div>
              <OptimizedImage 
                src={settings.headmaster_avatar} 
                alt={settings.headmaster}
                className="w-64 h-80 object-cover object-top relative z-10 rounded-2xl shadow-md border-4 border-white"
              />
            </div>
            {/* Metadata overlay */}
            <div className="text-center mt-6">
              <h4 className="text-slate-900 font-extrabold text-base tracking-tight leading-tight uppercase">
                {settings.headmaster}
              </h4>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">Kepala Sekolah MIN Singkawang</p>
              <p className="text-[10px] text-slate-400 mt-0.5">NIP. {settings.headmaster_nip}</p>
            </div>
          </div>

          {/* Speech Text Content */}
          <div className="w-full lg:w-2/3 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> Sambutan Resmi
            </div>
            
            <h2 className="text-slate-900 text-2xl md:text-3.5xl font-extrabold tracking-tight leading-tight mb-6">
              Mentransformasi Layanan Pendidikan Madrasah Hebat Bermutu & Modern
            </h2>

            <div className="text-xs text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pre-line border-l-4 border-emerald-500 pl-5 mb-6">
              {settings.headmaster_speech.slice(0, 500)}...
            </div>

            <button 
              onClick={() => onNavigate('profil_sambutan')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline bg-transparent border-0 cursor-pointer"
            >
              Baca Sambutan Selengkapnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION 4: PROGRAM UNGGULAN (GRADIENT GRIDS) */}
      <section className="bg-emerald-900 text-white py-20" id="unggulan_section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-300 font-bold text-[11px] tracking-widest uppercase block mb-3">Eksplorasi Kurikulum</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">Empat Pilar Program Unggulan MIN</h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Mendidik kecakapan keagamaan dan intelektual anak melalui pembiasaan bernilai tinggi, digitalisasi inovatif, dan wawasan lingkungan berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog) => (
              <div 
                key={prog.id} 
                className="bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/60 rounded-2xl p-6 flex flex-col items-start text-left transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center mb-5 shrink-0 font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-white text-base font-extrabold tracking-tight mb-2.5">{prog.title}</h3>
                <p className="text-xs text-emerald-100 leading-relaxed font-light mb-4 flex-grow">{prog.description}</p>
                <button 
                  onClick={() => onNavigate('profil_unggulan')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Detail Program <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 5: PRESTASI TERBARU (MEDAL BOARD) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20" id="prestasi_section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="text-left">
            <span className="text-emerald-700 font-extrabold text-[11px] tracking-widest uppercase block mb-2">Kebanggaan Kita</span>
            <h2 className="text-slate-900 text-2.5xl md:text-3.5xl font-extrabold tracking-tight leading-none">
              Prestasi Kejuaraan Terbaru
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('kesiswaan_prestasi')}
            className="px-4.5 py-2.5 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-100 flex items-center gap-1 hover:border-emerald-200 transition-colors"
          >
            Saksikan Semua Prestasi <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {latestAchievements.map((ach) => (
            <div key={ach.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="relative h-48 bg-slate-100 shrink-0">
                <OptimizedImage 
                  src={ach.image_url} 
                  alt={ach.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-emerald-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {ach.level}
                </span>
                <span className="absolute top-4 right-4 bg-amber-400 text-emerald-950 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {ach.year}
                </span>
              </div>
              <div className="p-6 text-left flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-900 font-extrabold text-sm tracking-tight leading-tight line-clamp-2 mb-2">
                    {ach.title}
                  </h3>
                  <p className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-widest mb-3">
                    Juara: {ach.winner}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                    {ach.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION 6: BERITA TERBARU */}
      <section className="bg-slate-100 py-20 border-y border-slate-200/50" id="berita_section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="text-left">
              <span className="text-emerald-700 font-extrabold text-[11px] tracking-widest uppercase block mb-2">Pemberitaan Publik</span>
              <h2 className="text-slate-900 text-2.5xl md:text-3.5xl font-extrabold tracking-tight leading-none">
                Berita & Kabar Madrasah
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('berita')}
              className="px-4.5 py-2.5 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200/50 flex items-center gap-1 transition-colors"
            >
              Akses Portal Berita <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col h-full cursor-pointer group"
                onClick={() => onSelectPost(post)}
              >
                <div className="relative h-48 bg-slate-200 shrink-0 overflow-hidden">
                  <OptimizedImage 
                    src={post.thumbnail_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-4 left-4 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {post.views} Dilihat
                  </span>
                </div>
                <div className="p-6 text-left flex-grow flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>{new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>Oleh {post.author_name}</span>
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-[15px] tracking-tight leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Mulai Baca</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 7: AGENDA KEGIATAN & CALENDAR */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20" id="agenda_section">
        <div className="flex flex-col gap-8">
          
          {/* Full-width premium Monthly Event Calendar Layout */}
          <EventCalendar initialEvents={events} />

          {/* Quick Info Guides & Office Hours Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Office Hours Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 md:p-8 text-left border border-emerald-700 flex flex-col md:flex-row justify-between gap-6" id="office_hours_highlight_card">
              <div className="max-w-md">
                <div className="w-10 h-10 rounded-lg bg-emerald-700/50 flex justify-center items-center text-amber-300 font-bold mb-5 shadow-xs shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold tracking-tight text-white mb-2">Panduan Waktu Layanan Kantor</h3>
                <p className="text-xs text-emerald-100 leading-relaxed font-light text-slate-200">
                  Kantor pendaftaran, pelayanan PPDB, komisioner komite, surat mutasi siswa, maupun legalisir ijazah berjalan terpusat di Gedung Pelayanan Satu Atap MIN Singkawang.
                </p>
                <div className="bg-emerald-900/40 rounded-lg p-3 text-[10px] text-emerald-200 mt-6 leading-relaxed border border-emerald-800/60 font-mono w-full md:w-fit">
                  Sistem Call-Center Terintegrasi WA: 0853-4811-2345
                </div>
              </div>
              
              <ul className="text-xs space-y-3 font-sans shrink-0 min-w-[200px] flex flex-col justify-center">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Senin - Kamis</span>
                  <span className="font-bold">07:00 - 14:00 WIB</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Jumat</span>
                  <span className="font-bold">07:00 - 11:00 WIB</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-350">Sabtu</span>
                  <span className="font-bold">07:00 - 12:00 WIB</span>
                </li>
              </ul>
            </div>

            {/* Quick Digital Service Portal info card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/80 rounded-2xl p-6.5 text-left flex flex-col justify-between" id="digital_notice_highlight_card">
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">AKSES ADMINISTRASI</span>
                <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 mb-2">Akses Unduhan Berkas & Formulir</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  Lakukan pengunduhan berkas kurikulum, kalender pendidikan fisik pdf, formulir pendaftaran ulang, brosur cetak PPDB, serta regulasi standar madrasah langsung secara instan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('unduh')}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-705 dark:text-slate-200 hover:text-emerald-800 border border-slate-200 dark:border-slate-800 text-xs font-black tracking-tight flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Kunjungi Portal Unduhan
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SECTION 8: GALERI KEGIATAN */}
      <section className="bg-white py-20 border-t border-slate-100" id="galeri_preview_section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <span className="text-emerald-700 font-extrabold text-[11px] tracking-widest uppercase block mb-2">Dokumentasi Sekolah</span>
              <h2 className="text-slate-900 text-2.5xl font-extrabold tracking-tight text-slate-900 leading-none">Galeri Unggulan Multi-Media</h2>
            </div>
            <button 
              onClick={() => onNavigate('galeri')}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors border-0 cursor-pointer rounded-lg"
            >
              Lihat Album Galeri
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="relative h-44 rounded-xl overflow-hidden group cursor-pointer border border-slate-100"
                onClick={() => onNavigate('galeri')}
              >
                <OptimizedImage 
                  src={item.type === 'foto' ? item.url : (item.thumbnail_url || "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400")} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
                  <span className="text-amber-400 uppercase text-[8px] font-extrabold tracking-wider">{item.type}</span>
                  <h4 className="text-white font-bold text-xs leading-tight tracking-tight mt-1 line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SECTION 9: VIDEO PROFIL (MODAL COMPOSER) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20" id="videoporfil_section">
        <div className="relative rounded-3xl overflow-hidden h-96 md:h-[420px]">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200" 
            alt="MIN Singkawang Profile backdrop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
            <button 
              onClick={() => setSelectedVideo("https://www.youtube.com/embed/dQw4w9WgXcQ")}
              className="w-20 h-20 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 border border-amber-300 shadow-xl flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 active:scale-95 text-lg"
              title="Putar Video Profil"
            >
              <Play className="w-8 h-8 fill-emerald-950 text-emerald-950 shrink-0 ml-1" />
            </button>
            <h3 className="text-white text-xl md:text-2.5xl font-extrabold tracking-tight mt-6 max-w-xl">
              Tonton Video Profil Resmi Perjalanan MIN Singkawang
            </h3>
            <p className="text-emerald-300/80 text-xs mt-3 max-w-md leading-relaxed font-sans">
              Menyusuri komitmen, ruang kelas, pembiasaan keagamaan, serta kisah inspirasi murid madrasah kami.
            </p>
          </div>
        </div>

        {/* Selected video overlay iframe modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-100 p-4 bg-black/85 backdrop-blur-md flex justify-center items-center">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 text-xs font-bold leading-none cursor-pointer border border-white/20"
              >
                Tutup (✕)
              </button>
              <div className="aspect-video w-full">
                <iframe 
                  src={selectedVideo} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 10. SECTION 10: TESTIMONI ORANG TUA */}
      <section className="bg-slate-100/60 py-20 border-y border-slate-200/50" id="testimoni_section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-emerald-700 font-extrabold text-[11px] uppercase tracking-widest block mb-1">Aspirasi Wali Siswa</span>
            <h2 className="text-slate-900 text-2.5xl font-extrabold tracking-tight text-slate-900">Apa Kata Orang Tua Murid?</h2>
          </div>

          <TestimonialCarousel testimonials={testimonials} />

          {/* Form Action Trigger Button */}
          {onAddTestimonial && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {!showTestimonialForm ? (
                  <motion.button
                    key="form_trigger_btn"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    type="button"
                    onClick={() => setShowTestimonialForm(true)}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-[11px] tracking-widest uppercase rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center gap-2 border border-emerald-600/10"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-100" />
                    <span>Kirim Testimoni / Aspirasi Lulusan & Wali</span>
                  </motion.button>
                ) : (
                  <motion.div 
                    key="form_content_drawer"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="w-full max-w-2xl mt-4"
                    id="testimonial_form_drawer_container"
                  >
                    <SubmitTestimonialForm 
                      onAddTestimonial={onAddTestimonial}
                      onClose={() => setShowTestimonialForm(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* 11. SECTION 11: PROGRAM HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16" id="ppdb_callout_banner">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-3xl p-8 md:p-12 text-left relative overflow-hidden shadow-emerald-800/20 shadow-xl border border-emerald-600">
          {/* Wave decor shapes */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-emerald-600/20 skew-x-12 origin-bottom-right rounded-l-full hidden lg:block"></div>
          
          <div className="relative z-10 max-w-2xl flex flex-col items-start gap-4">
            <span className="bg-amber-400 text-emerald-950 rounded-full px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold">UNGGULAN & INTEGRATIF</span>
            <h2 className="text-white text-2.5xl md:text-4.5xl font-sans font-extrabold tracking-tight leading-tight">
              Kembangkan Potensi Karakter & Akademik Anak Sejak Dini
            </h2>
            <p className="text-emerald-100 text-xs leading-relaxed font-sans text-slate-200">
              Dengan kurikulum Merdeka yang disinergikan dengan nilai-nilai luhur moral agama, kami membentuk siswa-siswi yang cerdas religius secara berimbang dan mandiri.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <button 
                onClick={() => onNavigate('akademik_kurikulum')}
                className="px-6 py-3 rounded-lg text-xs font-bold text-[13px] bg-amber-400 hover:bg-amber-500 text-emerald-950 tracking-wider shadow-sm transition-all cursor-pointer border border-amber-300"
              >
                Pelajari Kurikulum Merdeka
              </button>
              <button 
                onClick={() => onNavigate('download')}
                className="px-6 py-3 rounded-lg text-xs font-bold text-[13px] bg-transparent hover:bg-emerald-900 border border-emerald-500 text-white tracking-wider transition-all cursor-pointer"
              >
                Unduh Dokumen Madrasah
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. SECTION 12: CTA HUBUNGI KAMI */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-slate-100" id="cta_section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <span className="text-emerald-700 font-extrabold text-[11px] uppercase tracking-widest block mb-2">LAYANAN INFORMASI</span>
            <h2 className="text-slate-900 text-2.5xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Butuh Informasi Tambahan Mengenai MIN?
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans mt-4">
              Hubungi layanan humas atau pusat bantuan pelayanan satu atap MIN Singkawang. Kami siap melayani konsultasi pendaftaran kependidikan, mutasi masuk, studi kunjungan, kerjasama riset, dan penyambungan program komite lainnya.
            </p>
            
            <div className="flex flex-col gap-4 mt-8 font-sans">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Kontak Telepon Kantor</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{settings.contact_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Alamat Kantor Pelayanan</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{settings.contact_address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-sm">
            <h3 className="text-slate-900 text-base font-extrabold tracking-tight mb-2.5 text-left">
              Kirim Pesan Cepat ke Humas
            </h3>
            <p className="text-xs text-slate-400 mb-6 text-left">Pesan Anda akan diarsipkan dan diteruskan ke Sekretariat Humas Madrasah.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Pesan Anda telah berhasil terkirim ke Sekretariat Humas MIN Singkawang. Terima kasih!"); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  required 
                  placeholder="Nama Lengkap Anda" 
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:border-emerald-500"
                />
                <input 
                  type="email" 
                  required 
                  placeholder="Alamat Email aktif" 
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <input 
                type="text" 
                required 
                placeholder="Nomor WhatsApp (Contoh: 0812xxxx)" 
                className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:border-emerald-500"
              />
              <textarea 
                required 
                rows={4} 
                placeholder="Tuliskan isi pesan atau permintaan informasi Anda secara lengkap disini..." 
                className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200/80 rounded-lg focus:outline-hidden focus:border-emerald-500"
              ></textarea>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                KIRIM SEKARANG
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
