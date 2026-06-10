/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates estimated reading time in minutes based on average of 200 words per minute.
 */
export function calculateReadingTime(text: string | string[]): number {
  if (!text) return 1;
  
  let combinedText = "";
  if (Array.isArray(text)) {
    combinedText = text.join(" ");
  } else {
    combinedText = text;
  }

  // Remove HTML / shortcodes if any, and filter out empty values
  const words = combinedText
    .replace(/<[^>]*>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;
  // Standard reading speed is 200 words per minute
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}
