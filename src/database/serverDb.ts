import fs from 'fs';
import path from 'path';
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

// DB file path
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'database', 'db_store.json');

// Default builder structures
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
    content: '# Panduan Bantuan & FAQ Madrasah\n\nSelamat datang di pusat bantuan MIN Singkawang. Berikut adalah rangkuman tanya jawab yang sering diajukan oleh wali murid:\n\n### 1. Bagaimana proses pendaftaran PPDB?\nPendaftaran dilakukan 100% secara digital gratis melalui menu **PPDB Online** di website ini. Siapkan berkas NIK, Akta Lahir, and Kartu Keluarga.\n\n### 2. Apakah ada biaya pendaftaran PPDB?\nTidak, seluruh rangkaian seleksi berkas PPDB di madrasah kami bebas dari pungutan biaya apapun (Gratis).\n\n### 3. Apa kurikulum yang digunakan di madrasah?\nKami menerapkan **Kurikulum Merdeka mandiri** yang diperkaya nilai-nilai keagamaan kementerian agama RI.\n\n### 4. Jam berapa pembelajaran dimulai?\nKBM dimulai pukul 07.00 WIB didahului pembiasaan karakter utama (Sholat dhuha, tadarus Al-Quran) dan berakhir pukul 13.00 WIB.',
    seo_title: 'Pertanyaan Umum (FAQ) - MIN Singkawang',
    seo_description: 'Jawaban lengkap atas segala pertanyaan Anda mengenai pendaftaran murid baru, kegiatan KBM, & seragam madrasah.',
    social_share_img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    is_published: true
  }
];

// Combine all values to initial database state
const getInitialDbState = () => ({
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
    { id: "log1", user_name: "Operator Utama", action: "Inisiasi Platform", details: "Penyambungan portal sistem database CMS MIN Singkawang di port 3000", timestamp: new Date(Date.now() - 3600000).toISOString() },
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
  // Accessibility and Theme overrides in database
  min_singkawang_client_theme: 'light',
  min_singkawang_client_text_size: 'normal',
  min_singkawang_client_contrast_mode: 'normal'
});

// Load DB from file with auto-seeding
export function getDatabaseState(): any {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const serialized = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(serialized);
    }
  } catch (error) {
    console.error('[DATABASE HELPER] Error loading database file, re-seeding.', error);
  }

  // If file doesn't exist or is corrupted, write initial and return
  const initialState = getInitialDbState();
  saveDatabaseState(initialState);
  return initialState;
}

// Save complete state to file
export function saveDatabaseState(state: any): void {
  try {
    // Ensure containing directories exist
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('[DATABASE HELPER] Failed to save DB store to disk.', error);
  }
}

// Update single key in database state
export function saveDatabaseKey(key: string, value: any): any {
  const current = getDatabaseState();
  current[key] = value;
  saveDatabaseState(current);
  return current;
}
