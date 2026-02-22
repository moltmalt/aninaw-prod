import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-safe slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')       // spaces → hyphens
    .replace(/-+/g, '-')        // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}

/**
 * Estimate reading time in minutes based on word count (~200 wpm).
 */
export function calculateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

/**
 * Format a date string into a human-readable format.
 * e.g. "February 22, 2026"
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy');
}

/**
 * Format a date string into a relative time string.
 * e.g. "3 hours ago"
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Truncate text to a maximum length, breaking at word boundaries.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}

/**
 * Extract the YouTube video ID from a YouTube URL.
 * Supports standard, short, and embed URLs.
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract a Facebook embed URL from a Facebook post/video URL.
 * Returns an embeddable URL for use in an iframe.
 */
export function extractFacebookEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('facebook.com') && !parsed.hostname.includes('fb.com')) {
      return null;
    }
    const encodedUrl = encodeURIComponent(url);
    // Determine if it's a video or post
    if (url.includes('/videos/') || url.includes('/watch')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false`;
    }
    return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true`;
  } catch {
    return null;
  }
}
