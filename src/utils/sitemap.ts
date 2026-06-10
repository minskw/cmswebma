/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, Announcement, Event, Category } from '../types';
import { initialCategories } from '../data/initialData';

/**
 * Escapes special character sequences for XML compatibility.
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Dynamically generates a valid sitemap.xml structure based on static settings and active database entries.
 */
export function generateSitemapXml(
  baseUrl: string,
  posts: Post[],
  announcements: Announcement[] = [],
  events: Event[] = [],
  categories: Category[] = [],
  pages?: string[]
): string {
  // Sanitize the Base URL
  const base = baseUrl.trim().replace(/\/+$/, '') || 'https://minsingkawang.sch.id';
  const today = new Date().toISOString().split('T')[0];
  
  const entries: Array<{
    loc: string;
    lastmod: string;
    changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
    priority: string;
  }> = [];

  // Fallback to initialCategories if empty
  const activeCategories = (categories && categories.length > 0) ? categories : initialCategories;

  // Complete list of application-level static structural pages
  const activePages = pages || [
    '/',
    '/#profil_sambutan',
    '/#profil_singkat',
    '/#profil_sejarah',
    '/#profil_visi_misi',
    '/#profil_tujuan',
    '/#profil_organisasi',
    '/#profil_gtk',
    '/#profil_sarana',
    '/#profil_akreditasi',
    '/#profil_prestasi',
    '/#profil_unggulan',
    '/#profil_kontak',
    '/#akademik_kurikulum',
    '/#akademik_kalender',
    '/#kesiswaan_ekstrakurikuler',
    '/#kesiswaan_kreativitas',
    '/#berita',
    '/#galeri',
    '/#download'
  ];

  // 1. Core Static Pages / Routes
  activePages.forEach((pagePath) => {
    // Normalise slash structures
    const normalisedPath = pagePath === '/' ? '' : (pagePath.startsWith('/') ? pagePath : `/${pagePath}`);
    const loc = `${base}${normalisedPath}`;
    let changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
    let priority = '0.8';

    if (normalisedPath === '' || normalisedPath === '/#home') {
      changefreq = 'daily';
      priority = '1.0';
    } else if (normalisedPath.includes('berita') || normalisedPath.includes('galeri')) {
      changefreq = 'weekly';
      priority = '0.9';
    } else if (normalisedPath.includes('download')) {
      changefreq = 'weekly';
      priority = '0.7';
    }

    entries.push({ loc, lastmod: today, changefreq, priority });
  });

  // 2. Categories Groupings
  activeCategories.forEach((cat) => {
    const loc = `${base}/#berita?category=${cat.id}`;
    entries.push({
      loc,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // 3. Dynamic Published Blog Posts/Articles
  posts.forEach((post) => {
    if (post.status === 'publish') {
      const lastModDate = post.published_at ? post.published_at.split('T')[0] : today;
      // Generate clean hash-route for the frontend router deep-linking
      const loc = `${base}/#berita?id=${post.id}`;
      entries.push({
        loc,
        lastmod: lastModDate,
        changefreq: 'weekly',
        priority: '0.7'
      });
    }
  });

  // 4. Dynamic Announcements
  announcements.forEach((ann) => {
    const lastModDate = ann.published_at ? ann.published_at.split('T')[0] : today;
    const loc = `${base}/#download?announcement=${ann.id}`;
    entries.push({
      loc,
      lastmod: lastModDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  // 5. Dynamic Academic & Non-Academic Events
  events.forEach((evt) => {
    const lastModDate = evt.published_at ? evt.published_at.split('T')[0] : today;
    const loc = `${base}/#home?event=${evt.id}`;
    entries.push({
      loc,
      lastmod: lastModDate,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  // XML Compilation
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const uniqueLocs = new Set<string>();

  entries.forEach((entry) => {
    if (!uniqueLocs.has(entry.loc)) {
      uniqueLocs.add(entry.loc);
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>`;
  return xml;
}
