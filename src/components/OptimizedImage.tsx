/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, ShieldAlert } from 'lucide-react';
import { optimizeImageUrl, supabaseNextImageLoader } from '../utils/imageOptimizer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'cover' | 'contain' | 'fill';
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  draggable?: any;
  loader?: (props: { src: string; width: number; quality?: number }) => string;
  [key: string]: any;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  resize = 'cover',
  className = '',
  containerClassName = '',
  style,
  loader,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to lazy-initialize loading of non-visible images
  useEffect(() => {
    if (!src) return;

    // Fast fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px 0px', // Pre-load images slightly before they scroll into the viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  // Reset states on source update
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Next.js style Loader resolution.
  // Falls back to direct supabaseNextImageLoader for Supabase Storage to enforce automated WebP resizing
  const resolvedLoader = loader || (({ src: s, width: w, quality: q }) => {
    return optimizeImageUrl(s, { width: w, height, quality: q, resize });
  });

  const optimizedSrc = src ? resolvedLoader({ src, width: width || 1024, quality }) : '';

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ 
        width: width ? `${width}px` : undefined, 
        height: height ? `${height}px` : undefined,
        ...style
      }}
    >
      {/* 1. Blur Placeholder Backdrop while loading */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center animate-pulse select-none z-10"
          >
            <Image className="w-5 h-5 text-slate-400 dark:text-slate-600 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Error Fallback UI */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900/40 flex flex-col items-center justify-center p-3 text-center border border-slate-200 dark:border-slate-800 select-none">
          <ShieldAlert className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-1" />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans font-semibold">Tautan Gagal Dimuat</span>
        </div>
      )}

      {/* 3. The actual Optimized Lazy Image */}
      {isInView && src && !hasError && (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0 scale-95 blur-xs'} transition-all duration-500 ease-out`}
          style={{ width: '100%', height: '100%', objectFit: resize }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
}
