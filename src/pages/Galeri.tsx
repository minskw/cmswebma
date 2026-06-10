/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem } from '../types';
import { Image, Video, Eye, Play, X, ChevronLeft, ChevronRight, SlidersHorizontal, Hash, LayoutGrid, Layers } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { motion, AnimatePresence } from 'motion/react';

interface GaleriProps {
  items: GalleryItem[];
  onIncrementViews: (id: string) => void;
}

const ALBUM_CATEGORIES = [
  { id: 'all', name: 'Semua Album' },
  { id: 'alb1', name: 'Sarana & Lingkungan' },
  { id: 'alb2', name: 'Sains & Praktikum' },
  { id: 'alb3', name: 'Kurikulum & Kepramukaan' }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 350 : -350,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

export default function Galeri({ items, onIncrementViews }: GaleriProps) {
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [visibleLimit, setVisibleLimit] = useState<number>(6); // Default page size
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [direction, setDirection] = useState<number>(0);

  // Reset page limit when category filter changes
  useEffect(() => {
    setVisibleLimit(6);
  }, [activeTab, selectedAlbum]);

  // Filter items by type (foto / video) and further by album if it is a photo tab
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.type !== activeTab) return false;
      if (activeTab === 'foto' && selectedAlbum !== 'all') {
        return item.album_id === selectedAlbum;
      }
      return true;
    });
  }, [items, activeTab, selectedAlbum]);

  // Current subset of items to list on this page
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleLimit);
  }, [filteredItems, visibleLimit]);

  const hasMore = filteredItems.length > visibleLimit;

  const handleLoadMore = () => {
    setVisibleLimit(prev => prev + 6);
  };

  const handleNextPhoto = () => {
    setDirection(1);
    setSelectedPhotoIndex(prev => {
      if (prev === null) return null;
      const nextIdx = (prev + 1) % filteredItems.length;
      onIncrementViews(filteredItems[nextIdx].id);
      return nextIdx;
    });
  };

  const handlePrevPhoto = () => {
    setDirection(-1);
    setSelectedPhotoIndex(prev => {
      if (prev === null) return null;
      const prevIdx = (prev - 1 + filteredItems.length) % filteredItems.length;
      onIncrementViews(filteredItems[prevIdx].id);
      return prevIdx;
    });
  };

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoIndex, filteredItems]);

  const handlePhotoClick = (item: GalleryItem) => {
    onIncrementViews(item.id);
    const index = filteredItems.findIndex(p => p.id === item.id);
    setSelectedPhotoIndex(index !== -1 ? index : null);
  };

  const handleVideoClick = (item: GalleryItem) => {
    onIncrementViews(item.id);
    setSelectedVideo(item.url);
  };

  // Helper tags for cards
  const getAlbumLabel = (id?: string) => {
    const found = ALBUM_CATEGORIES.find(c => c.id === id);
    return found ? found.name : 'Madrasah';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans tracking-tight text-left" id="galeri_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Banner Section */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700/60 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">GALERI MULTIMEDIA</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">Dokumentasi & Video Profil</h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Buku kenangan kearsipan visual, mendokumentasikan kebahagiaan belajar murid, panggung kreasi kesenian, dan dinamika sarana fisik madrasah.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-col items-center justify-center mb-8 gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-xs gap-1">
            <button
              onClick={() => {
                setActiveTab('foto');
                setSelectedAlbum('all');
              }}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'foto' ? "bg-emerald-800 text-white shadow-xs" : "text-slate-600 hover:text-emerald-800"
              }`}
            >
              <Image className="w-4 h-4" /> GALERI FOTO KEGIATAN
            </button>
            <button
              onClick={() => {
                setActiveTab('video');
                setSelectedAlbum('all');
              }}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'video' ? "bg-emerald-800 text-white shadow-xs" : "text-slate-600 hover:text-emerald-800"
              }`}
            >
              <Video className="w-4 h-4" /> DOKUMENTASI EMBED VIDEO
            </button>
          </div>

          {/* Sub-filtering: Album Category Selector (only for photos) */}
          {activeTab === 'foto' && (
            <div className="flex flex-wrap justify-center items-center gap-1.5 pt-2" id="album_category_filter_bar">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Album:
              </span>
              {ALBUM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedAlbum(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                    selectedAlbum === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-150 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info header containing results size */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200/50 pb-3" id="gallery_results_meta_row">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <LayoutGrid className="w-4 h-4 text-emerald-700" />
            <span>
              Menampilkan <strong className="text-slate-900">{displayedItems.length}</strong> dari <strong className="text-slate-900">{filteredItems.length}</strong> {activeTab === 'foto' ? 'foto' : 'video'}
            </span>
          </div>
          {activeTab === 'foto' && selectedAlbum !== 'all' && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase">
              Filter aktif: {getAlbumLabel(selectedAlbum)}
            </span>
          )}
        </div>

        {/* Gallery stream grids */}
        {displayedItems.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="gallery_items_grid">
              {displayedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl border border-slate-150/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer relative group flex flex-col justify-between"
                  onClick={() => item.type === 'foto' ? handlePhotoClick(item) : handleVideoClick(item)}
                >
                  <div className="relative h-48 bg-slate-50 overflow-hidden shrink-0">
                    <img 
                      src={item.type === 'foto' ? item.url : (item.thumbnail_url || "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400")} 
                      alt={item.title} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    {/* Dark gradient mask on hover */}
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300" />

                    {/* Album absolute badge (only photo) */}
                    {item.type === 'foto' && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[9px] font-black tracking-wider text-slate-900 px-2 py-1 rounded-md uppercase shadow-3xs flex items-center gap-1 border border-slate-100">
                        <Layers className="w-3 h-3 text-emerald-700" />
                        {getAlbumLabel(item.album_id)}
                      </span>
                    )}

                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center">
                        <div className="w-12 h-12 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-2 border-white/40">
                          <Play className="w-5 h-5 fill-emerald-950 text-emerald-950 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between text-left bg-white">
                    <div>
                      <h4 className="text-slate-900 font-extrabold text-xs md:text-sm tracking-tight leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-3.5 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> 
                        <span>{item.views} Dilihat</span>
                        <span className="text-slate-200">•</span>
                        <span>{new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button implementation */}
            {hasMore ? (
              <div className="mt-12 text-center" id="load_more_gallery_container">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-emerald-800 hover:text-emerald-900 font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-xs border border-slate-200 hover:border-slate-300 transition-all active:scale-98 cursor-pointer inline-flex items-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4 text-emerald-700" />
                  <span>Tampilkan Lebih Banyak</span>
                </button>
              </div>
            ) : (
              <div className="mt-12 text-center text-slate-400 text-[11px] font-mono select-none" id="all_items_loaded_msg">
                — SEMUA DOKUMENTASI SELESAI DIULAS —
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl max-w-sm mx-auto" id="no_gallery_results_found">
            <span className="text-3xl">🗄️</span>
            <p className="text-xs text-slate-500 font-sans mt-3">Tidak ada dokumentasi di album ini.</p>
          </div>
        )}

        {/* Lightbox photo viewer overlay */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && filteredItems[selectedPhotoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-100 bg-slate-950/95 backdrop-blur-md p-4 md:p-6 flex flex-col justify-between items-center font-sans select-none text-left"
            >
              {/* Top Bar inside overlay */}
              <div className="w-full max-w-7xl flex items-center justify-between text-white gap-4 border-b border-white/10 pb-4 shrink-0">
                <div className="text-left">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest block font-bold mb-1">
                    Album: {getAlbumLabel(filteredItems[selectedPhotoIndex].album_id)}
                  </span>
                  <span className="text-sm font-bold text-slate-100 block truncate max-w-[150px] sm:max-w-md md:max-w-2xl">
                    {filteredItems[selectedPhotoIndex].title}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200 font-mono font-bold">
                    {selectedPhotoIndex + 1} / {filteredItems.length}
                  </span>
                  <button 
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="bg-rose-650 hover:bg-rose-700 hover:scale-103 active:scale-97 text-white rounded-xl px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 cursor-pointer transition-all border border-rose-500/20 leading-none shadow-md"
                    title="Tutup Galeri (Esc)"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tutup</span>
                  </button>
                </div>
              </div>

              {/* Main Center Area: Prev [ Swipe Carousel Image ] Next */}
              <div className="relative flex-grow w-full max-w-7xl flex items-center justify-between gap-2 md:gap-4 my-2 overflow-hidden">
                {/* Prev Button */}
                <button
                  onClick={handlePrevPhoto}
                  className="bg-black/40 hover:bg-emerald-950 border border-white/10 text-white rounded-2xl p-3 md:p-4 hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 shrink-0"
                  title="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Centered Image with swipe listener */}
                <div className="relative flex-grow h-full flex items-center justify-center max-h-[50vh] md:max-h-[58vh] overflow-hidden">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img 
                      key={selectedPhotoIndex}
                      src={filteredItems[selectedPhotoIndex].url} 
                      alt={filteredItems[selectedPhotoIndex].title} 
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.65}
                      onDragEnd={(e, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x < -swipeThreshold) {
                          handleNextPhoto();
                        } else if (info.offset.x > swipeThreshold) {
                          handlePrevPhoto();
                        }
                      }}
                      className="max-w-full max-h-[46vh] md:max-h-[55vh] object-contain rounded-2xl shadow-xl border border-white/10 cursor-grab active:cursor-grabbing touch-none select-none" 
                    />
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPhoto}
                  className="bg-black/40 hover:bg-emerald-950 border border-white/10 text-white rounded-2xl p-3 md:p-4 hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 shrink-0"
                  title="Foto Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Scrollable Thumbnail Strip Navigator */}
              <div className="w-full max-w-2xl bg-black/40 border border-white/5 p-2 rounded-xl shrink-0 mt-1">
                <div className="text-center mb-1.5 bg-gradient-to-r from-emerald-450 to-amber-300 bg-clip-text text-transparent text-[8.5px] font-black uppercase tracking-widest select-none">
                  Geser/Swipe gambar untuk foto berikutnya, atau pilih thumbnail dibawah:
                </div>
                <div className="flex justify-center gap-1.5 overflow-x-auto py-1 px-2 scrollbar-none max-h-16">
                  {filteredItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDirection(idx > (selectedPhotoIndex || 0) ? 1 : -1);
                        setSelectedPhotoIndex(idx);
                      }}
                      className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        idx === selectedPhotoIndex
                          ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.type === 'foto' ? item.url : (item.thumbnail_url || '')}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom details & instructions indicator */}
              <div className="w-full max-w-7xl border-t border-white/5 pt-3.5 text-center text-slate-400 text-[10px] tracking-wide shrink-0 flex flex-col sm:flex-row items-center justify-between gap-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Dokumentasi Dilihat Sebanyak <strong className="text-white">{filteredItems[selectedPhotoIndex].views}</strong> kali</span>
                </div>
                <div className="text-slate-500 hidden sm:block">
                  Navigasi Panah Keyboard <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700 mx-0.5">←</kbd> atau <kbd className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700 mx-0.5">→</kbd> aktif
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* YouTube Video popup overlay */}
        {selectedVideo && (
          <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md p-4 flex justify-center items-center font-sans">
            <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 text-xs font-bold leading-none cursor-pointer border border-white/20 z-10"
              >
                ✕ TUTUP VIDEO
              </button>
              <div className="aspect-video w-full">
                <iframe 
                  src={selectedVideo} 
                  title="YouTube video player player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
