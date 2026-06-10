/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  initialSchoolSettings,
  initialSeoSettings,
  initialTeachers,
  initialFacilities,
  initialPrograms,
  initialAchievements,
  initialPosts,
  initialCategories,
  initialTags,
  initialAnnouncements,
  initialEvents,
  initialGalleryItems,
  initialDownloadItems,
  initialTestimonials,
  initialApplicants
} from '../data/initialData';
import { SchoolSettings, SeoSettings, Teacher, Facility, Program, Achievement, Post, Category, Tag, Announcement, Event, GalleryItem, DownloadItem, Testimonial, PPDBApplicant, AuditLog } from '../types';
import { verifyUserRoleAgainstSupabase, logToSupabaseAudit } from '../lib/supabase';

// Storage keys
const KEYS = {
  SETTINGS: 'min_singkawang_settings',
  SEO: 'min_singkawang_seo',
  TEACHERS: 'min_singkawang_teachers',
  FACILITIES: 'min_singkawang_facilities',
  PROGRAMS: 'min_singkawang_programs',
  ACHIEVEMENTS: 'min_singkawang_achievements',
  POSTS: 'min_singkawang_posts',
  CATEGORIES: 'min_singkawang_categories',
  TAGS: 'min_singkawang_tags',
  ANNOUNCEMENTS: 'min_singkawang_announcements',
  EVENTS: 'min_singkawang_events',
  GALLERY: 'min_singkawang_gallery',
  DOWNLOADS: 'min_singkawang_downloads',
  TESTIMONIALS: 'min_singkawang_testimonials',
  APPLICANTS: 'min_singkawang_applicants',
  AUDIT_LOGS: 'min_singkawang_audit_logs',
  THEME_SETTINGS: 'min_singkawang_theme',
  HEADER_SETTINGS: 'min_singkawang_header_settings',
  FOOTER_SETTINGS: 'min_singkawang_footer_settings',
  MENUS: 'min_singkawang_menus',
  HOMEPAGE_SECTIONS: 'min_singkawang_homepage_sections',
  POPUPS: 'min_singkawang_popups',
  REDIRECTS: 'min_singkawang_redirects',
  CUSTOM_PAGES: 'min_singkawang_custom_pages',
  NEWS_COMMENTS: 'min_singkawang_news_comments'
};

// Default seed values for Website Builder
const defaultThemeSettings = {
  themeMode: 'light',
  primaryColor: '#005a4c',
  primaryHoverColor: '#004231',
  secondaryColor: '#ca8a04',
  accentColor: '#10b981',
  headingFont: 'Plus Jakarta Sans',
  bodyFont: 'Plus Jakarta Sans',
  borderRadius: '12px',
  shadowSize: 'md',
  enableDarkMode: false
};

const defaultHeaderSettings = {
  logo_url: 'https://images.unsplash.com/photo-1546213290-e1b7610339e0?auto=format&fit=crop&q=80&w=200',
  mobile_logo_url: 'https://images.unsplash.com/photo-1546213290-e1b7610339e0?auto=format&fit=crop&q=80&w=200',
  site_name: 'MIN SINGKAWANG',
  site_tagline: 'Unggul, Islami, Ramah Anak, Berwawasan Lingkungan',
  sticky: true,
  height: 'h-16',
  bg_color: '#ffffff',
  is_transparent: false,
  cta_label: 'PPDB ONLINE',
  cta_url: 'ppdb',
  show_socials: true
};

const defaultFooterSettings = {
  logo_url: 'https://images.unsplash.com/photo-1546213290-e1b7610339e0?auto=format&fit=crop&q=80&w=200',
  description: 'Madrasah Ibtidaiyah Negeri Singkawang berkompeten mencetak insan yang bertaqwa, cerdas, kreatif, dan komunikatif.',
  copyright: '© 2026 MIN Singkawang. Hak Cipta Dilindungi Undang-Undang.',
  columns: [
    {
      id: 'col_1',
      title: 'Profil Madrasah',
      links: [
        { label: 'Sejarah & Sambutan', url: 'profil_sejarah' },
        { label: 'Visi, Misi & Tujuan', url: 'profil_visi_misi' },
        { label: 'Guru & Staff GTK', url: 'profil_gtk' },
        { label: 'Sarana Prasarana', url: 'profil_sarana' }
      ]
    },
    {
      id: 'col_2',
      title: 'Akademik & PPDB',
      links: [
        { label: 'Alur PPDB Online', url: 'ppdb' },
        { label: 'Program Unggulan', url: 'profil_unggulan' },
        { label: 'Ekstrakurikuler', url: 'akademik_ekstrakurikuler' },
        { label: 'Kalender Pendidikan', url: 'akademik_kalender' }
      ]
    },
    {
      id: 'col_3',
      title: 'Hubungi Kami',
      links: [
        { label: 'Informasi Kontak', url: 'kontak' },
        { label: 'Peta Lokasi Google', url: 'kontak' },
        { label: 'Layanan Pengaduan', url: 'kontak' }
      ]
    }
  ]
};

const defaultMenus = [
  {
    id: 'item_1',
    label: 'HOME',
    url: 'home',
    target: '_self',
    icon: 'Home'
  },
  {
    id: 'item_2',
    label: 'PROFIL',
    url: '#',
    target: '_self',
    icon: 'Info',
    items: [
      { id: 'sub_2_1', label: 'Sejarah & Sambutan', url: 'profil_sejarah' },
      { id: 'sub_2_2', label: 'Visi, Misi & Tujuan', url: 'profil_visi_misi' },
      { id: 'sub_2_3', label: 'Guru & Staf Kependidikan', url: 'profil_gtk' },
      { id: 'sub_2_4', label: 'Sarana & Prasarana', url: 'profil_sarana' },
      { id: 'sub_2_5', label: 'Program Unggulan', url: 'profil_unggulan' },
      { id: 'sub_2_6', label: 'Prestasi Siswa', url: 'profil_prestasi' }
    ]
  },
  {
    id: 'item_3',
    label: 'AKADEMIK & PPDB',
    url: '#',
    target: '_self',
    icon: 'GraduationCap',
    items: [
      { id: 'sub_3_1', label: 'Pendaftaran PPDB ONLINE', url: 'ppdb' },
      { id: 'sub_3_2', label: 'Kalender Akademik', url: 'akademik_kalender' },
      { id: 'sub_3_3', label: 'Kegiatan Ekstrakurikuler', url: 'akademik_ekstrakurikuler' }
    ]
  },
  {
    id: 'item_4',
    label: 'INFORMASI',
    url: '#',
    target: '_self',
    icon: 'FileText',
    items: [
      { id: 'sub_4_1', label: 'Berita & Warta', url: 'berita' },
      { id: 'sub_4_2', label: 'Galeri Foto & Video', url: 'galeri' }
    ]
  },
  {
    id: 'item_5',
    label: 'UNDUHAN',
    url: 'download',
    target: '_self',
    icon: 'Download'
  },
  {
    id: 'item_6',
    label: 'KONTAK',
    url: 'kontak',
    target: '_self',
    icon: 'Phone'
  }
];

const defaultHomepageSections = [
  { id: 'hero_slider', title: 'Hero Carousel Sliders', subtitle: 'Banner utama visual di bagian teratas', visible: true, order: 1 },
  { id: 'statistics_section', title: 'Metrik Statistik Utama', subtitle: 'Data numerik pencapaian madrasah', visible: true, order: 2 },
  { id: 'speech_section', title: 'Sambutan Kepala Madrasah', subtitle: 'Pidato tertulis pimpinan utama', visible: true, order: 3 },
  { id: 'unggulan_section', title: 'Program Unggulan', subtitle: 'Bidang pembinaan prioritas sains & teknologi', visible: true, order: 4 },
  { id: 'prestasi_section', title: 'Prestasi & Kejuaraan Siswa', subtitle: 'Prestasi gemilang santri skala nasional', visible: true, order: 5 },
  { id: 'berita_section', title: 'Berita & Majalah Dinding', subtitle: 'Tiga informasi dinamis terakhir', visible: true, order: 6 },
  { id: 'agenda_section', title: 'Agenda & Rencana KBM', subtitle: 'Rincian jadwal agenda madrasah', visible: true, order: 7 },
  { id: 'galeri_preview_section', title: 'Galeri Foto Kegiatan', subtitle: 'Snapshot dokumentasi kebersamaan siswa', visible: true, order: 8 },
  { id: 'videoporfil_section', title: 'Video Profil Terintegrasi', subtitle: 'Video profil madrasah yang disorot', visible: true, order: 9 },
  { id: 'testimoni_section', title: 'Testimoni Wali & Santri', subtitle: 'Review and feedback masyarakat', visible: true, order: 10 },
  { id: 'ppdb_callout_banner', title: 'Callout Pendaftaran PPDB', subtitle: 'Kanal cepat pendaftaran murid baru', visible: true, order: 11 },
  { id: 'cta_section', title: 'Peta Lokasi & Hubungi Hub', subtitle: 'Kontak and map pencarian teratas', visible: true, order: 12 }
];

const defaultPopups = [
  {
    id: 'pop_ppdb',
    title: 'Informasi Penerimaan Peserta Didik Baru (PPDB) G-1',
    content: 'Penerimaan online resmi dibuka. Segera lengkapi berkas dan formulir pendaftaran ananda Anda secara mandiri di menu utama PPDB online tanpa dipungut biaya apapun! Hubungi kami untuk rincian kuota.',
    image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
    cta_label: 'Isi Formulir Berkas',
    cta_url: 'ppdb',
    is_active: true,
    start_date: '2026-06-01',
    end_date: '2026-07-31',
    frequency: 'always'
  }
];

const defaultRedirects = [
  { id: 'red_1', source_url: '/pendaftaran-lama', target_url: 'ppdb', is_permanent: true },
  { id: 'red_2', source_url: '/hubungi-kami', target_url: 'kontak', is_permanent: true }
];

const defaultCustomPages = [
  {
    id: 'page_faq',
    title: 'Faq Pertanyaan Sering Diajukan',
    slug: 'faq',
    content: '# Panduan Bantuan & FAQ Madrasah\n\nSelamat datang di pusat bantuan MIN Singkawang. Berikut adalah rangkuman tanya jawab yang sering diajukan oleh wali murid:\n\n### 1. Bagaimana proses pendaftaran PPDB?\nPendaftaran dilakukan 100% secara digital gratis melalui menu **PPDB Online** di website ini. Siapkan berkas NIK, Akta Lahir, and Kartu Keluarga.\n\n### 2. Apakah ada biaya pendaftaran PPDB?\nTidak, seluruh rangkaian seleksi berkas PPDB di madrasah kami bebas dari pungutan biaya apapun (Gratis).\n\n### 3. Apa kurikulum yang digunakan di madrasah?\nKami menerapkan **Kurikulum Merdeka mandiri** yang diperkaya nilai-nilai keagamaan kementerian agama RI.\n\n### 4. Jam berapa pembelajaran dimulai?\nKBM dimulai pukul 07.00 WIB didahului pembiasaan karakter utama (Sholat dhuha, tadarus Al-Quran) and berakhir pukul 13.00 WIB.',
    seo_title: 'Pertanyaan Umum (FAQ) - MIN Singkawang',
    seo_description: 'Jawaban lengkap atas segala pertanyaan Anda mengenai pendaftaran murid baru, kegiatan KBM, & seragam madrasah.',
    social_share_img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    is_published: true
  }
];

// CLIENT-SIDE MEMORY CACHE
// On first import, initialized with seed values, then immediately hot-replaced dynamically on startup
const CACHE: Record<string, any> = {
  min_singkawang_settings: initialSchoolSettings,
  min_singkawang_seo: initialSeoSettings,
  min_singkawang_teachers: initialTeachers,
  min_singkawang_facilities: initialFacilities,
  min_singkawang_programs: initialPrograms,
  min_singkawang_achievements: initialAchievements,
  min_singkawang_posts: initialPosts,
  min_singkawang_categories: initialCategories,
  min_singkawang_tags: initialTags,
  min_singkawang_announcements: initialAnnouncements,
  min_singkawang_events: initialEvents,
  min_singkawang_gallery: initialGalleryItems,
  min_singkawang_downloads: initialDownloadItems,
  min_singkawang_testimonials: initialTestimonials,
  min_singkawang_applicants: initialApplicants,
  min_singkawang_audit_logs: [
    { id: "log1", user_name: "Operator Utama", action: "Inisiasi Platform", details: "Penyambungan portal sistem database CMS MIN Singkawang", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "log2", user_name: "Super Admin", action: "Seeding Data", details: "Injeksi data master konfigurasi awal, GTK, program, and agenda madrasah", timestamp: new Date(Date.now() - 7200000).toISOString() }
  ],
  min_singkawang_theme: defaultThemeSettings,
  min_singkawang_header_settings: defaultHeaderSettings,
  min_singkawang_footer_settings: defaultFooterSettings,
  min_singkawang_menus: defaultMenus,
  min_singkawang_homepage_sections: defaultHomepageSections,
  min_singkawang_popups: defaultPopups,
  min_singkawang_redirects: defaultRedirects,
  min_singkawang_custom_pages: defaultCustomPages,
  min_singkawang_news_comments: [],
  min_singkawang_media: [
    {
      id: "media-1",
      filename: "kemenag_logo.png",
      file_path: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png",
      bucket_name: "general",
      mime_type: "image/png",
      file_size: 124500,
      uploaded_by_name: "Operator Utama",
      created_at: "2026-06-01T08:30:00.000Z"
    },
    {
      id: "media-2",
      filename: "brosur_penerimaan_siswa_baru_2026.pdf",
      file_path: "https://minsingkawang.sch.id/documents/brosur_ppdb_2026.pdf",
      bucket_name: "documents",
      mime_type: "application/pdf",
      file_size: 2380450,
      uploaded_by_name: "Kepala Madrasah",
      created_at: "2026-06-03T10:15:00.000Z"
    },
    {
      id: "media-3",
      filename: "gedung_min_singkawang.jpg",
      file_path: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
      bucket_name: "general",
      mime_type: "image/jpeg",
      file_size: 985320,
      uploaded_by_name: "Operator Utama",
      created_at: "2026-06-04T09:00:00.000Z"
    }
  ],
  min_singkawang_client_theme: 'light',
  min_singkawang_client_text_size: 'normal',
  min_singkawang_client_contrast_mode: 'normal'
};

// Logged-in administrator profile session cache (client-side)
let activeUserSession: any = null;

// Helper: fire async background save key value update to Express DB
async function persistToServer(key: string, value: any) {
  // List public-writable keys representing data submitted by visitors or personal theme settings
  const publicKeys = [
    'min_singkawang_news_comments',
    'min_singkawang_applicants',
    'min_singkawang_client_theme',
    'min_singkawang_client_text_size',
    'min_singkawang_client_contrast_mode'
  ];

  if (!publicKeys.includes(key)) {
    const activeRole = activeUserSession ? activeUserSession.role : 'Publik';
    
    // Define fine-grained role mappings directly matched with key updates
    const allowedRolesForKeys: Record<string, string[]> = {
      min_singkawang_theme: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_header_settings: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_footer_settings: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_menus: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_homepage_sections: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_popups: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_redirects: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_custom_pages: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_settings: ['Super Admin', 'Kepala Madrasah'],
      min_singkawang_seo: ['Super Admin', 'Kepala Madrasah'],
      
      min_singkawang_teachers: ['Super Admin', 'Kepala Madrasah', 'Operator'],
      min_singkawang_facilities: ['Super Admin', 'Kepala Madrasah', 'Operator'],
      min_singkawang_programs: ['Super Admin', 'Kepala Madrasah', 'Operator'],
      min_singkawang_achievements: ['Super Admin', 'Kepala Madrasah', 'Operator'],
      min_singkawang_testimonials: ['Super Admin', 'Kepala Madrasah', 'Operator'],
      
      min_singkawang_posts: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_categories: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_announcements: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_events: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_gallery: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_downloads: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_media: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'],
      min_singkawang_audit_logs: ['Super Admin', 'Kepala Madrasah', 'Operator', 'Editor']
    };

    const allowed = allowedRolesForKeys[key] || ['Super Admin', 'Kepala Madrasah', 'Operator'];

    if (!allowed.includes(activeRole)) {
      console.warn(`[MockDb persistence check] Blocked client state update on key: "${key}" by role: "${activeRole}"`);
      return;
    }
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (activeUserSession) {
      const sessionStr = JSON.stringify(activeUserSession);
      const base64Session = btoa(encodeURIComponent(sessionStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      headers['X-User-Session'] = base64Session;
    }

    const response = await fetch('/api/db/save-item', {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, value })
    });
    if (!response.ok) {
      console.warn(`[MockDb persistence handler] Server save failed with status ${response.status} for key: ${key}`);
    }
  } catch (err) {
    console.error(`[MockDb persistence handler] Network error during backend persist of key: ${key}`, err);
  }
}

export class MockDb {
  // Sync the client storage cache with the real database on node server startup
  static async syncFromServer() {
    try {
      const response = await fetch('/api/db');
      if (response.ok) {
        const remoteState = await response.json();
        Object.keys(remoteState).forEach((key) => {
          CACHE[key] = remoteState[key];
        });
      }
      
      const headers: Record<string, string> = {};
      const activeUser = MockDb.getLoggedInUser();
      if (activeUser) {
        const sessionStr = JSON.stringify(activeUser);
        const base64Session = btoa(encodeURIComponent(sessionStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        headers['X-User-Session'] = base64Session;
      }

      const authRes = await fetch('/api/auth/me', { headers });
      if (authRes.ok) {
        const authData = await authRes.json();
        activeUserSession = authData.user || null;

        // Map Supabase profiles table role-based permissions immediately back to application session
        if (activeUserSession) {
          try {
            const identifier = activeUserSession.id || activeUserSession.email;
            const verifiedRole = await verifyUserRoleAgainstSupabase(identifier);
            if (verifiedRole) {
              console.log(`[MockDb Supabase Sync] Exposing verified profile role: ${verifiedRole}`);
              activeUserSession.role = verifiedRole;
            }
          } catch (profileErr) {
            console.warn('[MockDb Supabase Sync] Cannot query profile schema checks:', profileErr);
          }
        }
      }
    } catch (e) {
      console.error('[MockDb sync] Error synchronizing client memory with backend database:', e);
    }
  }

  // Client contrast modes loaded from DB/Server settings
  static getClientTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.localStorage) {
      const local = window.localStorage.getItem('min_singkawang_client_theme') as 'light' | 'dark';
      if (local) {
        CACHE.min_singkawang_client_theme = local;
        return local;
      }
    }
    return CACHE.min_singkawang_client_theme || 'light';
  }
  static saveClientTheme(theme: 'light' | 'dark') {
    CACHE.min_singkawang_client_theme = theme;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('min_singkawang_client_theme', theme);
    }
    persistToServer('min_singkawang_client_theme', theme);
  }

  static getClientTextSize(): 'small' | 'normal' | 'large' | 'xlarge' | 'huge' {
    if (typeof window !== 'undefined' && window.localStorage) {
      const local = window.localStorage.getItem('min_singkawang_client_text_size') as any;
      if (local) {
        CACHE.min_singkawang_client_text_size = local;
        return local;
      }
    }
    return CACHE.min_singkawang_client_text_size || 'normal';
  }
  static saveClientTextSize(size: string) {
    CACHE.min_singkawang_client_text_size = size;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('min_singkawang_client_text_size', size);
    }
    persistToServer('min_singkawang_client_text_size', size);
  }

  static getClientContrastMode(): 'normal' | 'high-contrast' | 'grayscale' | 'invert' {
    if (typeof window !== 'undefined' && window.localStorage) {
      const local = window.localStorage.getItem('min_singkawang_client_contrast_mode') as any;
      if (local) {
        CACHE.min_singkawang_client_contrast_mode = local;
        return local;
      }
    }
    return CACHE.min_singkawang_client_contrast_mode || 'normal';
  }
  static saveClientContrastMode(mode: string) {
    CACHE.min_singkawang_client_contrast_mode = mode;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('min_singkawang_client_contrast_mode', mode);
    }
    persistToServer('min_singkawang_client_contrast_mode', mode);
  }

  // Theme, Header, Footer setting objects
  static getThemeSettings() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const local = window.localStorage.getItem('min_singkawang_theme');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          CACHE.min_singkawang_theme = parsed;
          return parsed;
        } catch (e) {}
      }
    }
    return CACHE.min_singkawang_theme;
  }
  static saveThemeSettings(theme: any) {
    if (!this.checkAuthorization('settings:write', 'Mengubah Tema Madrasah')) return;
    CACHE.min_singkawang_theme = theme;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('min_singkawang_theme', JSON.stringify(theme));
    }
    persistToServer('min_singkawang_theme', theme);
    this.addLog("Update Theme Settings", "Mengubah palet warna branding, radius button, and jenis font Heading/Body");
  }

  static getHeaderSettings() {
    return CACHE.min_singkawang_header_settings;
  }
  static saveHeaderSettings(header: any) {
    if (!this.checkAuthorization('settings:write', 'Mengubah Header Builder')) return;
    CACHE.min_singkawang_header_settings = header;
    persistToServer('min_singkawang_header_settings', header);
    this.addLog("Update Header Builder", "Mengubah konfigurasi logo, nama website, sticky state, and CTA header");
  }

  static getFooterSettings() {
    return CACHE.min_singkawang_footer_settings;
  }
  static saveFooterSettings(footer: any) {
    if (!this.checkAuthorization('settings:write', 'Mengubah Footer Builder')) return;
    CACHE.min_singkawang_footer_settings = footer;
    persistToServer('min_singkawang_footer_settings', footer);
    this.addLog("Update Footer Builder", "Melakukan modifikasi link footer, info deskripsi, and copyright notice");
  }

  static getMenus() {
    return CACHE.min_singkawang_menus;
  }
  static saveMenus(menus: any[]) {
    if (!this.checkAuthorization('settings:write', 'Mengubah Menu Navigasi')) return;
    CACHE.min_singkawang_menus = menus;
    persistToServer('min_singkawang_menus', menus);
    this.addLog("Update Navigation Menus", "Mengubah urutan menu, memodifikasi label, sub-item, target link, and target window");
  }

  static getHomepageSections() {
    return (CACHE.min_singkawang_homepage_sections || []).sort((a: any, b: any) => a.order - b.order);
  }
  static saveHomepageSections(sections: any[]) {
    if (!this.checkAuthorization('settings:write', 'Mengatur Layout Beranda')) return;
    const ordered = sections.map((sect, index) => ({ ...sect, order: index + 1 }));
    CACHE.min_singkawang_homepage_sections = ordered;
    persistToServer('min_singkawang_homepage_sections', ordered);
    this.addLog("Update Homepage Builder", "Menyusun ulang urutan seksi beranda, menyembunyikan seksi, atau mengubah visibility");
  }

  static getPopups() {
    return CACHE.min_singkawang_popups;
  }
  static savePopups(popups: any[]) {
    if (!this.checkAuthorization('settings:write', 'Mengelola Popups Madrasah')) return;
    CACHE.min_singkawang_popups = popups;
    persistToServer('min_singkawang_popups', popups);
    this.addLog("Update Popups Manager", "Memperbarui pemicu popup info penting di halaman utama");
  }

  static getRedirects() {
    return CACHE.min_singkawang_redirects;
  }
  static saveRedirects(redirects: any[]) {
    if (!this.checkAuthorization('settings:write', 'Mengelola Aturan Pengalihan URL')) return;
    CACHE.min_singkawang_redirects = redirects;
    persistToServer('min_singkawang_redirects', redirects);
    this.addLog("Update Redirect Manager", "Mengubah rule pengalihan link URL legacy");
  }

  static getCustomPages() {
    return CACHE.min_singkawang_custom_pages;
  }
  static saveCustomPages(pages: any[]) {
    if (!this.checkAuthorization('settings:write', 'Menambah/Mengedit Halaman Dinamis')) return;
    CACHE.min_singkawang_custom_pages = pages;
    persistToServer('min_singkawang_custom_pages', pages);
    this.addLog("Update Custom Page Builder", "Menyimpan daftar halaman dinamis (Rich Text Layout)");
  }

  static getSettings(): SchoolSettings {
    return CACHE.min_singkawang_settings;
  }
  static saveSettings(settings: SchoolSettings) {
    if (!this.checkAuthorization('settings:write', 'Mengubah Konfigurasi Profil Madrasah')) return;
    CACHE.min_singkawang_settings = settings;
    persistToServer('min_singkawang_settings', settings);
    this.addLog("Update Settings", "Mengubah pengaturan profil utama atau kontak resmi madrasah");
    try {
      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: { 
          message: '⚙️ Konfigurasi Madrasah berhasil diperbarui oleh administrator.', 
          type: 'success', 
          category: 'settings' 
        }
      }));
    } catch {}
  }

  static getSeoSettings(): SeoSettings {
    return CACHE.min_singkawang_seo;
  }
  static saveSeoSettings(seo: SeoSettings) {
    if (!this.checkAuthorization('settings:write', 'Mengedit Setelan SEO Madrasah')) return;
    CACHE.min_singkawang_seo = seo;
    persistToServer('min_singkawang_seo', seo);
    this.addLog("Update SEO Settings", "Mengubah metadata global global, kata kunci indexing, dan OG Image utama");
    try {
      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: { 
          message: '🚀 Metadata SEO & indeks robot Google berhasil disinkronkan.', 
          type: 'success', 
          category: 'settings' 
        }
      }));
    } catch {}
  }

  static getTeachers(): Teacher[] {
    return (CACHE.min_singkawang_teachers || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  }
  static saveTeacher(teacher: Teacher) {
    if (!this.checkAuthorization('personnel:write', 'Menyimpan Data GTK/Pendidik')) return;
    const list = this.getTeachers();
    const idx = list.findIndex(t => t.id === teacher.id);
    if (idx > -1) {
      list[idx] = teacher;
      this.addLog("Edit GTK", `Mengubah data guru kependidikan: ${teacher.name}`);
    } else {
      list.push(teacher);
      this.addLog("Tambah GTK", `Menambahkan data guru baru: ${teacher.name}`);
    }
    CACHE.min_singkawang_teachers = list;
    persistToServer('min_singkawang_teachers', list);
  }
  static deleteTeacher(id: string) {
    if (!this.checkAuthorization('personnel:write', 'Menghapus Data GTK/Pendidik')) return;
    const list = this.getTeachers();
    const target = list.find(t => t.id === id);
    if (!target) return;
    const filtered = list.filter(t => t.id !== id);
    this.addLog("Hapus GTK", `Menghapus data guru kependidikan: ${target.name}`);
    CACHE.min_singkawang_teachers = filtered;
    persistToServer('min_singkawang_teachers', filtered);
  }

  static getFacilities(): Facility[] {
    return CACHE.min_singkawang_facilities || [];
  }
  static saveFacility(facility: Facility) {
    if (!this.checkAuthorization('personnel:write', 'Menyimpan Data Sarana Prasarana')) return;
    const list = this.getFacilities();
    const idx = list.findIndex(f => f.id === facility.id);
    if (idx > -1) {
      list[idx] = facility;
      this.addLog("Edit Sarpras", `Mengubah data sarana prasarana: ${facility.name}`);
    } else {
      list.push(facility);
      this.addLog("Tambah Sarpras", `Menambahkan data sarana prasarana baru: ${facility.name}`);
    }
    CACHE.min_singkawang_facilities = list;
    persistToServer('min_singkawang_facilities', list);
  }
  static deleteFacility(id: string) {
    if (!this.checkAuthorization('personnel:write', 'Menghapus Data Sarana Prasarana')) return;
    const list = this.getFacilities();
    const target = list.find(f => f.id === id);
    if (!target) return;
    const filtered = list.filter(f => f.id !== id);
    this.addLog("Hapus Sarpras", `Menghapus data sarana prasarana: ${target.name}`);
    CACHE.min_singkawang_facilities = filtered;
    persistToServer('min_singkawang_facilities', filtered);
  }

  static getPrograms(): Program[] {
    return CACHE.min_singkawang_programs || [];
  }
  static saveProgram(program: Program) {
    if (!this.checkAuthorization('personnel:write', 'Menyimpan Program Unggulan')) return;
    const list = this.getPrograms();
    const idx = list.findIndex(p => p.id === program.id);
    if (idx > -1) {
      list[idx] = program;
      this.addLog("Edit Program", `Mengubah data program unggulan: ${program.title}`);
    } else {
      list.push(program);
      this.addLog("Tambah Program", `Menambahkan program unggulan baru: ${program.title}`);
    }
    CACHE.min_singkawang_programs = list;
    persistToServer('min_singkawang_programs', list);
  }
  static deleteProgram(id: string) {
    if (!this.checkAuthorization('personnel:write', 'Menghapus Program Unggulan')) return;
    const list = this.getPrograms();
    const target = list.find(p => p.id === id);
    if (!target) return;
    const filtered = list.filter(p => p.id !== id);
    this.addLog("Hapus Program", `Menghapus program unggulan: ${target.title}`);
    CACHE.min_singkawang_programs = filtered;
    persistToServer('min_singkawang_programs', filtered);
  }

  static getAchievements(): Achievement[] {
    return CACHE.min_singkawang_achievements || [];
  }
  static saveAchievement(ach: Achievement) {
    if (!this.checkAuthorization('personnel:write', 'Menyimpan Prestasi Madrasah')) return;
    const list = this.getAchievements();
    const idx = list.findIndex(a => a.id === ach.id);
    if (idx > -1) {
      list[idx] = ach;
      this.addLog("Edit Prestasi", `Mengubah data prestasi siswa: ${ach.title}`);
    } else {
      list.push(ach);
      this.addLog("Tambah Prestasi", `Menambahkan prestasi baru: ${ach.title}`);
    }
    CACHE.min_singkawang_achievements = list;
    persistToServer('min_singkawang_achievements', list);
  }
  static deleteAchievement(id: string) {
    if (!this.checkAuthorization('personnel:write', 'Menghapus Prestasi Madrasah')) return;
    const list = this.getAchievements();
    const target = list.find(a => a.id === id);
    if (!target) return;
    const filtered = list.filter(a => a.id !== id);
    this.addLog("Hapus Prestasi", `Menghapus prestasi siswa: ${target.title}`);
    CACHE.min_singkawang_achievements = filtered;
    persistToServer('min_singkawang_achievements', filtered);
  }

  static getPosts(): Post[] {
    return CACHE.min_singkawang_posts || [];
  }
  static savePost(post: Post) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Warta Berita')) return;
    const list = this.getPosts();
    const idx = list.findIndex(p => p.id === post.id);
    if (idx > -1) {
      list[idx] = post;
      this.addLog("Edit Berita/Warta", `Mengubah warta berita: ${post.title}`, "posts", post.id);
    } else {
      list.push(post);
      this.addLog("Tambah Berita/Warta", `Membuat warta berita baru: ${post.title}`, "posts", post.id);
    }
    CACHE.min_singkawang_posts = list;
    persistToServer('min_singkawang_posts', list);
  }
  static deletePost(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Warta Berita')) return;
    const list = this.getPosts();
    const target = list.find(p => p.id === id);
    if (!target) return;
    const filtered = list.filter(p => p.id !== id);
    this.addLog("Hapus Berita/Warta", `Menghapus warta berita: ${target.title}`, "posts", id);
    CACHE.min_singkawang_posts = filtered;
    persistToServer('min_singkawang_posts', filtered);
  }
  static incrementPostViews(id: string) {
    const list = this.getPosts();
    const idx = list.findIndex(p => p.id === id);
    if (idx > -1) {
      list[idx].views += 1;
      persistToServer('min_singkawang_posts', list);
    }
  }

  static getCategories(): Category[] {
    return CACHE.min_singkawang_categories || [];
  }
  static saveCategory(category: Category) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Kategori Berita')) return;
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx > -1) {
      list[idx] = category;
      this.addLog("Edit Kategori Berita", `Mengubah kategori berita: ${category.name}`);
    } else {
      list.push(category);
      this.addLog("Tambah Kategori Berita", `Menambahkan kategori berita baru: ${category.name}`);
    }
    CACHE.min_singkawang_categories = list;
    persistToServer('min_singkawang_categories', list);
  }
  static deleteCategory(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Kategori Berita')) return;
    const list = this.getCategories();
    const target = list.find(c => c.id === id);
    if (!target) return;
    const filtered = list.filter(c => c.id !== id);
    this.addLog("Hapus Kategori Berita", `Menghapus kategori berita: ${target.name}`);
    CACHE.min_singkawang_categories = filtered;
    persistToServer('min_singkawang_categories', filtered);
  }

  static getTags(): Tag[] {
    return CACHE.min_singkawang_tags;
  }

  static getAnnouncements(): Announcement[] {
    return CACHE.min_singkawang_announcements || [];
  }
  static saveAnnouncement(ann: Announcement) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Pengumuman')) return;
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === ann.id);
    if (idx > -1) {
      list[idx] = ann;
      this.addLog("Edit Pengumuman", `Mengubah pengumuman penting: ${ann.title}`, "announcements", ann.id);
    } else {
      list.push(ann);
      this.addLog("Tambah Pengumuman", `Membuat pengumuman penting baru: ${ann.title}`, "announcements", ann.id);
    }
    CACHE.min_singkawang_announcements = list;
    persistToServer('min_singkawang_announcements', list);
  }
  static deleteAnnouncement(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Pengumuman')) return;
    const list = this.getAnnouncements();
    const target = list.find(a => a.id === id);
    if (!target) return;
    const filtered = list.filter(a => a.id !== id);
    this.addLog("Hapus Pengumuman", `Menghapus pengumuman penting: ${target.title}`, "announcements", id);
    CACHE.min_singkawang_announcements = filtered;
    persistToServer('min_singkawang_announcements', filtered);
  }
  static incrementAnnouncementViews(id: string) {
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === id);
    if (idx > -1) {
      list[idx].views += 1;
      persistToServer('min_singkawang_announcements', list);
    }
  }

  static getEvents(): Event[] {
    return CACHE.min_singkawang_events || [];
  }
  static saveEvent(evt: Event) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Agenda Kegiatan')) return;
    const list = this.getEvents();
    const idx = list.findIndex(e => e.id === evt.id);
    if (idx > -1) {
      list[idx] = evt;
      this.addLog("Edit Agenda", `Mengubah jadwal agenda kegiatan: ${evt.title}`, "events", evt.id);
    } else {
      list.push(evt);
      this.addLog("Tambah Agenda", `Menambahkan agenda baru: ${evt.title}`, "events", evt.id);
    }
    CACHE.min_singkawang_events = list;
    persistToServer('min_singkawang_events', list);
  }
  static deleteEvent(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Agenda Kegiatan')) return;
    const list = this.getEvents();
    const target = list.find(e => e.id === id);
    if (!target) return;
    const filtered = list.filter(e => e.id !== id);
    this.addLog("Hapus Agenda", `Menghapus jadwal agenda kegiatan: ${target.title}`, "events", id);
    CACHE.min_singkawang_events = filtered;
    persistToServer('min_singkawang_events', filtered);
  }

  static getGalleryItems(): GalleryItem[] {
    return CACHE.min_singkawang_gallery || [];
  }
  static saveGalleryItem(item: GalleryItem) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Koleksi Galeri')) return;
    const list = this.getGalleryItems();
    const idx = list.findIndex(g => g.id === item.id);
    if (idx > -1) {
      list[idx] = item;
      this.addLog("Edit Galeri", `Mengupdate koleksi galeri: ${item.title}`);
    } else {
      list.push(item);
      this.addLog("Tambah Galeri", `Melakukan unggahan multimedia galeri: ${item.title}`);
    }
    CACHE.min_singkawang_gallery = list;
    persistToServer('min_singkawang_gallery', list);
  }
  static deleteGalleryItem(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Koleksi Galeri')) return;
    const list = this.getGalleryItems();
    const target = list.find(g => g.id === id);
    if (!target) return;
    const filtered = list.filter(g => g.id !== id);
    this.addLog("Hapus Galeri", `Menghapus item galeri: ${target.title}`);
    CACHE.min_singkawang_gallery = filtered;
    persistToServer('min_singkawang_gallery', filtered);
  }

  static getDownloads(): DownloadItem[] {
    return CACHE.min_singkawang_downloads || [];
  }
  static saveDownload(item: DownloadItem) {
    if (!this.checkAuthorization('content:write', 'Menyimpan File Dokumen Unduhan')) return;
    const list = this.getDownloads();
    const idx = list.findIndex(d => d.id === item.id);
    if (idx > -1) {
      list[idx] = item;
      this.addLog("Edit Unduhan", `Mengubah file unduhan dokumen: ${item.title}`);
    } else {
      list.push(item);
      this.addLog("Tambah Unduhan", `Mengunggah file unduhan dokumen baru: ${item.title}`);
    }
    CACHE.min_singkawang_downloads = list;
    persistToServer('min_singkawang_downloads', list);
  }
  static deleteDownload(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus File Dokumen Unduhan')) return;
    const list = this.getDownloads();
    const target = list.find(d => d.id === id);
    if (!target) return;
    const filtered = list.filter(d => d.id !== id);
    this.addLog("Hapus Unduhan", `Menghapus file unduhan: ${target.title}`);
    CACHE.min_singkawang_downloads = filtered;
    persistToServer('min_singkawang_downloads', filtered);
  }
  static incrementDownloadCount(id: string) {
    const list = this.getDownloads();
    const idx = list.findIndex(d => d.id === id);
    if (idx > -1) {
      list[idx].downloads_count += 1;
      persistToServer('min_singkawang_downloads', list);
    }
  }

  static getTestimonials(): Testimonial[] {
    const list = CACHE.min_singkawang_testimonials || [];
    const merged = [...list];
    initialTestimonials.forEach(it => {
      if (!merged.some(m => m.id === it.id)) {
        merged.push(it);
      }
    });
    return merged;
  }
  static saveTestimonial(t: Testimonial) {
    if (!this.checkAuthorization('personnel:write', 'Menyimpan Testimoni')) return;
    const list = this.getTestimonials();
    const idx = list.findIndex(test => test.id === t.id);
    if (idx > -1) {
      list[idx] = t;
      this.addLog("Edit Testimoni", `Mengedit review wali murid: ${t.name}`);
    } else {
      list.push(t);
      this.addLog("Tambah Testimoni", `Menambahkan testimoni baru dari: ${t.name}`);
    }
    CACHE.min_singkawang_testimonials = list;
    persistToServer('min_singkawang_testimonials', list);
  }
  static deleteTestimonial(id: string) {
    if (!this.checkAuthorization('personnel:write', 'Menghapus Testimoni')) return;
    const list = this.getTestimonials();
    const target = list.find(t => t.id === id);
    if (!target) return;
    const filtered = list.filter(t => t.id !== id);
    this.addLog("Hapus Testimoni", `Menghapus testimoni dari: ${target.name}`);
    CACHE.min_singkawang_testimonials = filtered;
    persistToServer('min_singkawang_testimonials', filtered);
  }

  static getApplicants(): PPDBApplicant[] {
    return (CACHE.min_singkawang_applicants || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  static saveApplicant(app: PPDBApplicant) {
    const list = this.getApplicants();
    const idx = list.findIndex(a => a.id === app.id);
    const isNew = idx === -1;

    if (!isNew) {
      if (!this.checkAuthorization('ppdb:write', 'Memperbarui Berkas/Status PPDB')) return;
    }

    let isNewReport = false;
    if (idx > -1) {
      list[idx] = app;
      this.addLog("Update Status PPDB", `Ubah status pendaftaran ananda ${app.student_name} menjadi ${app.status}`);
    } else {
      list.push(app);
      this.addLog("Registrasi PPDB Baru", `Wali murid mendaftarkan siswa baru: ${app.student_name} (NIK: ${app.nik})`);
      isNewReport = true;
    }
    CACHE.min_singkawang_applicants = list;
    persistToServer('min_singkawang_applicants', list);

    try {
      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: {
          message: isNewReport
            ? `📝 PPDB Baru Masuk: Siswa baru '${app.student_name}' telah melakukan registrasi!`
            : `📝 Status PPDB Diperbarui: Pendaftaran '${app.student_name}' diubah menjadi '${app.status}'.`,
          type: isNewReport ? 'info' : 'success',
          category: 'ppdb'
        }
      }));
    } catch {}
  }
  static deleteApplicant(id: string) {
    if (!this.checkAuthorization('ppdb:write', 'Menghapus Berkas PPDB Online')) return;
    const list = this.getApplicants();
    const target = list.find(a => a.id === id);
    if (!target) return;
    const filtered = list.filter(a => a.id !== id);
    this.addLog("Hapus Berkas PPDB", `Klien administrator menghapus berkas PPDB: ${target.student_name}`);
    CACHE.min_singkawang_applicants = filtered;
    persistToServer('min_singkawang_applicants', filtered);
  }

  // News portal Comments Section connection
  static getComments(): any[] {
    return CACHE.min_singkawang_news_comments || [];
  }
  static saveComments(comments: any[]) {
    CACHE.min_singkawang_news_comments = comments;
    persistToServer('min_singkawang_news_comments', comments);
  }

  // Media Library Operations
  static getMedia(): any[] {
    return CACHE.min_singkawang_media || [];
  }
  static saveMedia(items: any[]) {
    if (!this.checkAuthorization('content:write', 'Menyimpan Konfigurasi Media')) return;
    CACHE.min_singkawang_media = items;
    persistToServer('min_singkawang_media', items);
  }
  static addMedia(item: any): any {
    if (!this.checkAuthorization('content:write', 'Mengunggah Berkas Media Baru')) return null;
    const mediaList = this.getMedia();
    const mediaUser = this.getLoggedInUser();
    const formattedItem = {
      ...item,
      id: item.id || "med_" + Math.random().toString(36).substring(2, 9),
      uploaded_by_name: mediaUser ? `${mediaUser.name} (${mediaUser.role})` : "Operator Utama",
      created_at: item.created_at || new Date().toISOString()
    };
    mediaList.unshift(formattedItem);
    this.saveMedia(mediaList);
    this.addLog("Upload Media", `Mengunggah berkas media: ${formattedItem.filename}`);
    return formattedItem;
  }
  static deleteMedia(id: string) {
    if (!this.checkAuthorization('content:write', 'Menghapus Berkas Media')) return;
    const mediaList = this.getMedia();
    const item = mediaList.find(m => m.id === id);
    if (!item) return;
    const filtered = mediaList.filter(m => m.id !== id);
    this.saveMedia(filtered);
    this.addLog("Hapus Media", `Menghapus berkas media: ${item.filename}`);
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return (CACHE.min_singkawang_audit_logs || []).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  static addLog(action: string, details: string, entity?: string, entityId?: string) {
    const logs = this.getAuditLogs();
    const activeUser = this.getLoggedInUser();
    const newLog: AuditLog = {
      id: "log_" + Math.random().toString(36).substring(2, 9),
      user_name: activeUser ? `${activeUser.name} (${activeUser.role})` : "Sistem Tamu / Publik",
      action,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    const limited = logs.slice(0, 100);
    CACHE.min_singkawang_audit_logs = limited;
    persistToServer('min_singkawang_audit_logs', limited);

    try {
      logToSupabaseAudit(
        activeUser?.id || null,
        action,
        entity || null,
        entityId || null,
        details
      );
    } catch (err) {
      console.warn('[Supabase Audit Logging] Trigger failed:', err);
    }
  }

  // Authentication simulator
  static getActiveUserRole(): string {
    const user = this.getLoggedInUser();
    return user ? user.role : 'Publik';
  }

  static getLoggedInUser() {
    if (!activeUserSession && typeof window !== 'undefined' && window.localStorage) {
      const local = window.localStorage.getItem('min_singkawang_active_user');
      if (local) {
        try {
          activeUserSession = JSON.parse(local);
        } catch (e) {}
      }
    }
    return activeUserSession;
  }

  // --- ROLE AND PERMISSION SERVICE LAYER ---
  static getRolePermissions(role: string): string[] {
    const permMap: Record<string, string[]> = {
      'Super Admin': ['settings:write', 'personnel:write', 'content:write', 'ppdb:write'],
      'Kepala Madrasah': ['settings:write', 'personnel:write', 'content:write', 'ppdb:write'],
      'Operator': ['personnel:write', 'content:write', 'ppdb:write'],
      'Editor': ['content:write']
    };
    return permMap[role] || [];
  }

  static hasPermission(permission: 'settings:write' | 'personnel:write' | 'content:write' | 'ppdb:write'): boolean {
    const role = this.getActiveUserRole();
    const permissions = this.getRolePermissions(role);
    return permissions.includes(permission);
  }

  static checkAuthorization(permission: 'settings:write' | 'personnel:write' | 'content:write' | 'ppdb:write', actionName: string): boolean {
    if (this.hasPermission(permission)) {
      return true;
    }
    
    // Log blocked action
    console.warn(`[MockDb Authorization Check] Blocked action: "${actionName}". Role "${this.getActiveUserRole()}" lacks '${permission}' permission.`);
    
    // Dispatch security log and toast notification
    try {
      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: { 
          message: `🚫 Akses Ditolak: Peran '${this.getActiveUserRole()}' tidak memiliki izin untuk '${actionName}'.`, 
          type: 'error', 
          category: 'security' 
        }
      }));
    } catch {}
    
    return false;
  }

  // Real backend authentication with local fallback
  static async authenticate(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        activeUserSession = data.user;
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('min_singkawang_active_user', JSON.stringify(data.user));
        }
        // Re-sync all cache records so user sees latest changes right after login
        await this.syncFromServer();
        return data.user;
      }
    } catch (err) {
      console.error('[MockDb Client Auth] login failed, trying client fallback', err);
    }

    // Client fallback: verify common accounts to ensure administrative entries always work
    const accounts = [
      {
        email: "admin@minsingkawang.sch.id",
        password: "admin123",
        name: "Suryadi, S.H.",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      },
      {
        email: "operator@minsingkawang.sch.id",
        password: "operator123",
        name: "Hendika, S.Kom.",
        role: "Operator",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
      },
      {
        email: "kepala@minsingkawang.sch.id",
        password: "kepala123",
        name: "H. Kamaludin, S.Ag., M.Pd.",
        role: "Kepala Madrasah",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
      },
      {
        email: "editor@minsingkawang.sch.id",
        password: "editor123",
        name: "Nurhasanah, S.Pd.I.",
        role: "Editor",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
      }
    ];

    const found = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (found) {
      const fallbackUser = {
        id: `u_${found.role.toLowerCase().replace(/ /g, '_')}`,
        email: found.email,
        name: found.name,
        role: found.role,
        avatar_url: found.avatar,
        created_at: new Date().toISOString()
      };
      activeUserSession = fallbackUser;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('min_singkawang_active_user', JSON.stringify(fallbackUser));
      }
      return fallbackUser;
    }

    return null;
  }

  static async login(email: string, role: string) {
    try {
      const response = await fetch('/api/auth/role-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, role })
      });
      if (response.ok) {
        const data = await response.json();
        activeUserSession = data.user;
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('min_singkawang_active_user', JSON.stringify(data.user));
        }
        await this.syncFromServer();
        return data.user;
      }
    } catch (err) {
      console.error('[MockDb Client Auth] role change failed', err);
    }
    // Fallback in-case server connection isn't instant
    const user = { id: `u_${role.toLowerCase().replace(/ /g, '_')}`, email, name: role, role, avatar_url: '', created_at: new Date().toISOString() };
    activeUserSession = user;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('min_singkawang_active_user', JSON.stringify(user));
    }
    return user;
  }

  static async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[MockDb Client Auth] logout request failed', err);
    }
    activeUserSession = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('min_singkawang_active_user');
    }
  }
}

export default MockDb;
