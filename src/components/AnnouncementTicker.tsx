/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { Megaphone, X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementTickerProps {
  announcements: Announcement[];
  onNavigate: (path: string) => void;
}

export default function AnnouncementTicker({ announcements, onNavigate }: AnnouncementTickerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(25);

  const activeAnnouncements = announcements && announcements.length > 0 
    ? announcements 
    : [
        { id: '1', title: 'Selamat Datang di Portal Terpadu Madrasah Digital MIN Singkawang!', slug: 'welcome', content: '', views: 0, is_pinned: true, published_at: new Date().toISOString() },
        { id: '2', title: 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran Berjalan Telah Dibuka. Hubungi Panitia.', slug: 'ppdb', content: '', views: 0, is_pinned: true, published_at: new Date().toISOString() }
      ];

  // Rotate index or scroll animation
  useEffect(() => {
    if (isPaused || activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, activeAnnouncements.length]);

  if (!isVisible || activeAnnouncements.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  const handleAnnounceClick = (ann: Announcement) => {
    onNavigate('download');
    // We can also trigger specific deep linking if handled
  };

  return (
    <div 
      className="bg-amber-400 dark:bg-amber-500 text-emerald-950 px-3 sm:px-4 py-2 text-[12px] font-semibold flex items-center justify-between shadow-xs border-b border-amber-300 dark:border-amber-600 transition-colors duration-200 z-40 relative"
      id="announcement_ticker_root"
      role="region"
      aria-label="Pengumuman Penting"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Static Prefix Label */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 select-none">
          <span className="bg-emerald-900 text-amber-300 px-1.5 sm:px-2 py-0.5 rounded-sm font-extrabold text-[9px] sm:text-[10px] tracking-wide uppercase flex items-center gap-1 sm:gap-1.5 shadow-xs">
            <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-bounce shrink-0" />
            <span className="hidden sm:inline">Kabar Madrasah</span>
            <span className="sm:hidden">Kabar</span>
          </span>
        </div>

        {/* Dynamic Carousel Slide with Framer Motion */}
        <div 
          ref={containerRef}
          className="flex-grow overflow-hidden relative h-5 sm:h-6 flex items-center cursor-pointer select-none min-w-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => handleAnnounceClick(activeAnnouncements[currentIndex])}
          title="Klik untuk membuka pusat informasi/papan pengumuman"
          aria-live="polite"
        >
          <div className="absolute inset-y-0 left-0 right-1 flex items-center justify-start text-left font-sans font-semibold sm:font-bold tracking-tight w-full min-w-0">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="hover:text-emerald-800 transition-colors truncate w-full text-[11px] sm:text-[12px] pr-2 flex items-center gap-1.5"
            >
              <span className="truncate">{activeAnnouncements[currentIndex].title}</span>
              <span className="text-[8px] bg-emerald-990/10 text-emerald-950 px-1 py-0.2 rounded-xs shrink-0 font-extrabold uppercase tracking-wider scale-90 sm:scale-100">
                Baru
              </span>
            </motion.div>
          </div>
        </div>

        {/* Controls and Actions (Accessibility helpers & manual trigger) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Pause / Play Trigger button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-950 flex items-center justify-center transition-all cursor-pointer border-0"
            title={isPaused ? "Putar Pengumuman" : "Jeda Pengumuman"}
            aria-label={isPaused ? "Putar rotasi pengumuman" : "Jeda rotasi pengumuman"}
          >
            {isPaused ? <Play className="w-2.5 h-2.5 fill-emerald-950" /> : <Pause className="w-2.5 h-2.5 fill-emerald-950" />}
          </button>

          {/* Left Arrow - Hidden on mobile, shown on SM up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hidden sm:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-950 items-center justify-center transition-all cursor-pointer border-0"
            title="Pengumuman Sebelumnya"
            aria-label="Tampilkan pengumuman sebelumnya"
          >
            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Right Arrow - Hidden on mobile, shown on SM up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden sm:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-950 items-center justify-center transition-all cursor-pointer border-0"
            title="Pengumuman Selanjutnya"
            aria-label="Tampilkan pengumuman selanjutnya"
          >
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          <span className="hidden sm:inline text-emerald-950/30 font-light select-none">|</span>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-0.5 sm:p-1 text-emerald-950 hover:text-emerald-800 transition-colors cursor-pointer border-0 bg-transparent"
            title="Tutup Bar Pengumuman"
            aria-label="Tutup bar pengumuman ini"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
