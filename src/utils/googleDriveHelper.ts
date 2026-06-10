/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Parses and extracts the File ID from various Google Drive sharing link formats.
 */
export function extractGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const trimmed = url.trim();
  
  // Format 1: https://drive.google.com/file/d/FILE_ID/view...
  const dFormatMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (dFormatMatch && dFormatMatch[1]) {
    return dFormatMatch[1];
  }
  
  // Format 2: https://drive.google.com/open?id=FILE_ID or https://drive.google.com/uc?id=FILE_ID
  const idFormatMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idFormatMatch && idFormatMatch[1]) {
    return idFormatMatch[1];
  }

  // Format 3: docs.google.com/file/d/FILE_ID/...
  const docsFormatMatch = trimmed.match(/docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (docsFormatMatch && docsFormatMatch[1]) {
    return docsFormatMatch[1];
  }

  // Format 4: drive.google.com/thumbnail?id=FILE_ID
  const thumbFormatMatch = trimmed.match(/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (thumbFormatMatch && thumbFormatMatch[1]) {
    return thumbFormatMatch[1];
  }

  return null;
}

/**
 * Checks if a given string is a Google Drive link.
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com');
}

/**
 * Converts any Google Drive share link into a high-performance direct web image stream link.
 * Utilizing the official high-speed `lh3.googleusercontent.com/d/FILE_ID` or fallback thumbnail endpoint.
 */
export function convertGoogleDriveToImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    // Return high-efficiency and super-fast direct delivery endpoint.
    // Specifying sz=w1200 or direct lh3 links works beautifully across all viewport sizes.
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
}

/**
 * Converts any Google Drive link to a Google Docs/Drive Iframe Embed Preview link.
 */
export function convertGoogleDriveToEmbedUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return url;
}

/**
 * Converts any Google Drive link to a direct forced download attachment link.
 */
export function convertGoogleDriveToDownloadUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url;
}
