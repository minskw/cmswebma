/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down more than 400px (typically past the hero section)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl hover:shadow-emerald-900/30 transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-600/30 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 animate-fade-in group cursor-pointer"
      title="Kembali ke Atas"
      aria-label="Kembali ke bagian atas halaman"
      id="back_to_top_floating_btn"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
