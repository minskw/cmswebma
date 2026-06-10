/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const totalScrollable = documentHeight - windowHeight;
      if (totalScrollable > 80) { // Only calculate and show when there is significant scrollable space
        const scrolled = (scrollTop / totalScrollable) * 100;
        setProgress(Math.min(100, Math.max(0, scrolled)));
        // Make progress bar container visible once the user starts scrolling
        setIsVisible(scrollTop > 10);
      } else {
        setProgress(0);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[3.5px] z-[120] bg-slate-200/20 dark:bg-slate-800/20 pointer-events-none"
      id="reading_progress_container"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading Progress Indicator"
    >
      <div 
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-[width] duration-150 ease-out shadow-[0_1px_6px_rgba(16,185,129,0.5)]"
        style={{ width: `${progress}%` }}
        id="reading_progress_bar"
      />
    </div>
  );
}
