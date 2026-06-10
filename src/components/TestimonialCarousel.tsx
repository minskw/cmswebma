/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';
import OptimizedImage from './OptimizedImage';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  const handleNext = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  const startTimer = () => {
    stopTimer();
    if (total <= 1) return;
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 6500);
  };

  const stopTimer = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [startIndex, isPaused, total]);

  if (!testimonials || total === 0) {
    return null;
  }

  // Generate 3 visible cards from index
  const card1 = testimonials[startIndex % total];
  const card2 = testimonials[(startIndex + 1) % total];
  const card3 = testimonials[(startIndex + 2) % total];

  const cardsData = [
    { item: card1, displayClass: "flex" },
    { item: card2, displayClass: "hidden md:flex" },
    { item: card3, displayClass: "hidden lg:flex" },
  ];

  return (
    <div 
      className="relative w-full mx-auto"
      id="testimonial_carousel_root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Absolute Quote Design Accents */}
      <div className="absolute -top-12 -left-4 md:-left-8 opacity-5 dark:opacity-10 text-slate-800 dark:text-white pointer-events-none z-0">
        <Quote className="w-20 h-20 stroke-[1.5]" />
      </div>

      {/* Grid wrapper for the sliding cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 min-h-[220px]">
        <AnimatePresence initial={false} mode="popLayout">
          {cardsData.map(({ item, displayClass }, index) => (
            <motion.div
              key={`${item.id}_${index}`}
              layout
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.95 }}
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 }
              }}
              className={`${displayClass} bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 text-left shadow-xs hover:shadow-md transition-shadow duration-300 flex-row gap-4 items-start select-none h-full justify-between cursor-grab active:cursor-grabbing`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
            >
              {/* Profile Image - beautifully wrapped to prevent massive image scaling bug */}
              <div 
                className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-emerald-500/15 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-3xs flex items-center justify-center"
                style={{ width: '44px', height: '44px' }}
              >
                <img 
                  src={item.avatar_url} 
                  alt={item.name} 
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
              
              {/* Text Content - to the right of the profile image! */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                <div>
                  {/* Star Rating Info */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  
                  {/* Testimonial Quote */}
                  <p className="text-[12px] md:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans italic mb-4">
                    "{item.content}"
                  </p>
                </div>
                
                {/* Author Info Bar */}
                <div className="pt-3 border-t border-slate-100/60 dark:border-slate-800/60">
                  <h4 className="text-slate-950 dark:text-white font-extrabold text-[11px] md:text-xs tracking-tight uppercase leading-none truncate">
                    {item.name}
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1.5 leading-none">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive Controls & Navigation */}
      {total > 1 && (
        <div className="flex items-center justify-between mt-8 relative z-10">
          {/* Progress Indicator dots */}
          <div className="flex gap-1.5" id="carousel_dot_indicators">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > (startIndex % total) ? 1 : -1);
                  setStartIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-350 cursor-pointer border-0 outline-hidden ${
                  idx === (startIndex % total)
                    ? 'w-6 bg-emerald-600 dark:bg-emerald-500' 
                    : 'w-2 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700'
                }`}
                title={`Lihat testimoni ke-${idx + 1}`}
                aria-label={`Lihat testimoni ke-${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick step Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer shadow-xs transition-all outline-hidden active:scale-95"
              title="Testimoni Sebelumnya"
              aria-label="Testimoni Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer shadow-xs transition-all outline-hidden active:scale-95"
              title="Testimoni Selanjutnya"
              aria-label="Testimoni Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
