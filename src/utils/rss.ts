/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, Category } from '../types';

/**
 * Escapes special character sequences for XML compatibility.
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
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
 * Strips HTML tags for text-only XML nodes like description/summary
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generates RSS 2.0 XML Feed based on published posts
 */
export function generateRssXml(baseUrl: string, posts: Post[], categories: Category[] = []): string {
  const base = baseUrl.trim().replace(/\/+$/, '') || 'https://minsingkawang.sch.id';
  const todayRss = new Date().toUTCString();
  
  // Sort posts by publication date, dynamic fallback
  const publishedPosts = posts
    .filter(post => post.status === 'publish')
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml('MIN Singkawang - Berita &amp; Kabar Madrasah')}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml('Situs resmi Madrasah Ibtidaiyah Negeri Singkawang - Informasi, Prestasi, dan Berita Kegiatan Pembelajaran Terkini.')}</description>
    <language>id-id</language>
    <copyright>${escapeXml(`Copyright ${new Date().getFullYear()} MIN Singkawang. All rights reserved.`)}</copyright>
    <lastBuildDate>${todayRss}</lastBuildDate>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>MIN Singkawang RSS Engine</generator>
`;

  publishedPosts.forEach((post) => {
    const postLink = `${base}/#berita?id=${post.id}`;
    const pubDate = new Date(post.published_at || Date.now()).toUTCString();
    const cleanExcerpt = stripHtml(post.excerpt || post.content).substring(0, 300) + '...';
    
    // Find category details
    const category = categories.find(c => c.id === post.category_id);
    const categoryName = category ? category.name : 'Berita';

    xml += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postLink)}</link>
      <guid isPermaLink="true">${escapeXml(postLink)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(cleanExcerpt)}</description>
      <category>${escapeXml(categoryName)}</category>
      <author>${escapeXml(`humas@minsingkawang.sch.id (${post.author_name || 'Humas MIN Singkawang'})`)}</author>
`;

    if (post.thumbnail_url) {
      xml += `      <enclosure url="${escapeXml(post.thumbnail_url)}" length="0" type="image/jpeg" />\n`;
    }

    xml += `    </item>\n`;
  });

  xml += `  </channel>
</rss>`;

  return xml;
}

/**
 * Generates Atom 1.0 XML Feed based on published posts
 */
export function generateAtomXml(baseUrl: string, posts: Post[], categories: Category[] = []): string {
  const base = baseUrl.trim().replace(/\/+$/, '') || 'https://minsingkawang.sch.id';
  const todayAtom = new Date().toISOString();

  const publishedPosts = posts
    .filter(post => post.status === 'publish')
    .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime());

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml('MIN Singkawang - Berita &amp; Kabar Madrasah')}</title>
  <subtitle>${escapeXml('Situs resmi Madrasah Ibtidaiyah Negeri Singkawang - Informasi, Prestasi, dan Berita Kegiatan.')}</subtitle>
  <link href="${escapeXml(base)}/atom.xml" rel="self" />
  <link href="${escapeXml(base)}" />
  <updated>${todayAtom}</updated>
  <id>${escapeXml(base)}/</id>
  <author>
    <name>Humas MIN Singkawang</name>
    <email>humas@minsingkawang.sch.id</email>
  </author>
  <generator uri="https://minsingkawang.sch.id">MIN Singkawang Atom Generator</generator>
  <rights>${escapeXml(`© ${new Date().getFullYear()} MIN Singkawang. All rights reserved.`)}</rights>
`;

  publishedPosts.forEach((post) => {
    const postLink = `${base}/#berita?id=${post.id}`;
    const pubDate = new Date(post.published_at || Date.now()).toISOString();
    const cleanExcerpt = stripHtml(post.excerpt || post.content).substring(0, 300) + '...';

    xml += `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(postLink)}" />
    <id>${escapeXml(postLink)}</id>
    <published>${pubDate}</published>
    <updated>${pubDate}</updated>
    <summary type="html">${escapeXml(cleanExcerpt)}</summary>
    <author>
      <name>${escapeXml(post.author_name || 'Humas MIN Singkawang')}</name>
    </author>
`;

    categories.forEach(c => {
      if (c.id === post.category_id) {
        xml += `    <category term="${escapeXml(c.slug)}" label="${escapeXml(c.name)}" />\n`;
      }
    });

    xml += `  </entry>\n`;
  });

  xml += `</feed>`;

  return xml;
}
