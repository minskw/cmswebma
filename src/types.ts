/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  nip?: string;
  bio?: string;
  phone?: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip?: string;
  role: string; // e.g., 'Guru Kelas', 'Guru PAI'
  photo_url: string;
  status: string; // 'PNS' | 'PPPK' | 'GTT'
  subjects: string[];
  sort_order: number;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string;
  condition: string; // 'Sangat Baik' | 'Baik' | 'Perbaikan'
  capacity: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  icon_name: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: string; // 'Akademik' | 'Non-Akademik'
  level: string; // 'Kota' | 'Provinsi' | 'Nasional' | 'Internasional'
  year: string;
  winner: string;
  image_url: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail_url: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'publish' | 'schedule';
  views: number;
  published_at: string;
  author_id: string;
  author_name: string;
  seo_title?: string;
  seo_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  views: number;
  is_pinned: boolean;
  published_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer: string;
  published_at: string;
}

export interface GalleryItem {
  id: string;
  type: 'foto' | 'video';
  title: string;
  url: string; // Photo image link or YouTube URL
  thumbnail_url?: string;
  album_id?: string;
  views: number;
  created_at: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  filename: string;
  category: 'dokumen' | 'formulir' | 'panduan';
  file_url: string;
  file_size: string;
  downloads_count: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // 'Orang Tua Walid' | 'Alumni'
  content: string;
  avatar_url: string;
  rating: number;
  created_at: string;
}

export interface PPDBApplicant {
  id: string;
  student_name: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  pob: string; // Place of birth
  dob: string;  // Date of birth
  father_name: string;
  phone_number: string;
  address: string;
  previous_school: string;
  status: 'draft' | 'submitted' | 'verified' | 'accepted' | 'rejected';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  robots: string;
  canonical_url: string;
}

export interface SchoolSettings {
  school_name: string;
  npsn: string;
  headmaster: string;
  headmaster_nip?: string;
  headmaster_speech: string;
  headmaster_avatar: string;
  about_brief: string;
  history: string;
  vision: string;
  mission: string[];
  objectives: string[];
  accreditation_score: string;
  accreditation_number: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  google_maps_embed: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
  slogan?: string;
  banner_slides?: BannerSlide[];
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}
