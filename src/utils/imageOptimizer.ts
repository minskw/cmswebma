/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { isGoogleDriveUrl, convertGoogleDriveToImageUrl } from './googleDriveHelper';

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpeg' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Checks if a given URL points to Supabase Storage.
 */
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('/storage/v1/object/public/');
}

/**
 * Next.js-compatible Image Loader utility for Supabase Storage.
 * Matches the signature required by Next.js's `loader` prop on the `<Image />` component
 * or for global integration in `next.config.js`.
 * 
 * It automatically resizes the image to the specified width and guarantees delivery 
 * in Next.js's preferred high-performance 'webp' format.
 */
export interface NextImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export function supabaseNextImageLoader({ src, width, quality = 80 }: NextImageLoaderProps): string {
  if (!src) return '';

  // If it's not a Supabase Storage URL, fall back to general optimization or return as-is
  if (!isSupabaseStorageUrl(src)) {
    if (src.includes('images.unsplash.com')) {
      try {
        const parsedUrl = new URL(src);
        parsedUrl.searchParams.set('fm', 'webp');
        parsedUrl.searchParams.set('w', width.toString());
        parsedUrl.searchParams.set('q', quality.toString());
        return parsedUrl.toString();
      } catch {
        return src;
      }
    }
    return src;
  }

  // Transform Supabase Storage URL into dynamic image transformation endpoint (like Next.js Optimizer)
  try {
    const optimizedUrl = src.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    const parsedUrl = new URL(optimizedUrl);
    
    parsedUrl.searchParams.set('format', 'webp'); // Enforce high-efficiency WebP
    parsedUrl.searchParams.set('quality', quality.toString());
    parsedUrl.searchParams.set('width', width.toString());
    parsedUrl.searchParams.set('resize', 'cover');
    
    return parsedUrl.toString();
  } catch (e) {
    // Failback string concatenation if URL parsing fails
    let fallbackUrl = src.replace('/storage/v1/object/', '/storage/v1/render/image/');
    const delimiter = fallbackUrl.includes('?') ? '&' : '?';
    fallbackUrl += `${delimiter}format=webp&quality=${quality}&width=${width}&resize=cover`;
    return fallbackUrl;
  }
}

/**
 * Optimizes image URLs from Supabase Storage or Unsplash for WebP and modern responsive specs.
 * 
 * - Supabase Storage URLs are transformed to use the dynamic transformation service endpoint.
 * - Unsplash URLs are transformed to leverage their image processing engine.
 * - Local or unrelated URLs are returned unaltered.
 */
export function optimizeImageUrl(url: string | null | undefined, options: OptimizeOptions = {}): string {
  if (!url) return '';

  if (isGoogleDriveUrl(url)) {
    return convertGoogleDriveToImageUrl(url);
  }

  const format = options.format || 'webp';
  const quality = options.quality || 80;
  const resize = options.resize || 'cover';

  // 1. Supabase Storage URLs Transformation
  // Expected: https://[id].supabase.co/storage/v1/object/public/[bucket]/[path]
  // Target:   https://[id].supabase.co/storage/v1/render/image/public/[bucket]/[path]?format=webp&quality=80
  if (isSupabaseStorageUrl(url)) {
    // If a width is explicitly provided, we can delegate directly to the Next.js styled loader
    if (options.width) {
      return supabaseNextImageLoader({ src: url, width: options.width, quality });
    }

    try {
      const optimizedUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const parsedUrl = new URL(optimizedUrl);
      
      parsedUrl.searchParams.set('format', format);
      parsedUrl.searchParams.set('quality', quality.toString());
      parsedUrl.searchParams.set('resize', resize);
      
      if (options.width) {
        parsedUrl.searchParams.set('width', options.width.toString());
      }
      if (options.height) {
        parsedUrl.searchParams.set('height', options.height.toString());
      }
      
      return parsedUrl.toString();
    } catch (e) {
      // If parsing fails for any reason (e.g., relative URL), do a simple string replacement fallback
      let fallbackUrl = url.replace('/storage/v1/object/', '/storage/v1/render/image/');
      const delimiter = fallbackUrl.includes('?') ? '&' : '?';
      fallbackUrl += `${delimiter}format=${format}&quality=${quality}&resize=${resize}`;
      if (options.width) fallbackUrl += `&width=${options.width}`;
      if (options.height) fallbackUrl += `&height=${options.height}`;
      return fallbackUrl;
    }
  }

  // 2. Unsplash Optimization (Optional/Added value for placeholder / mockup images)
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('fm', format);
      parsedUrl.searchParams.set('q', quality.toString());
      if (options.width) {
        parsedUrl.searchParams.set('w', options.width.toString());
        parsedUrl.searchParams.set('fit', options.resize === 'contain' ? 'clip' : 'crop');
      }
      if (options.height) {
        parsedUrl.searchParams.set('h', options.height.toString());
      }
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}
