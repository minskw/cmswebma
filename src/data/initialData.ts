/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolSettings, SeoSettings, Teacher, Facility, Program, Achievement, Post, Category, Tag, Announcement, Event, GalleryItem, DownloadItem, Testimonial, PPDBApplicant } from '../types';

export const initialSchoolSettings: SchoolSettings = {
  school_name: "MIN Singkawang",
  npsn: "60721234",
  headmaster: "H. Kamaludin, S.Ag., M.Pd.",
  headmaster_nip: "197508122002121003",
  headmaster_avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  headmaster_speech: "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur kita panjatkan kehadirat Allah SWT atas limpahan rahmat dan karunia-Nya, sehingga website resmi MIN Singkawang dapat hadir sebagai pusat informasi, dinamika, dan kemajuan madrasah kita. Di era transformasi digital ini, kehadiran portal informasi adalah langkah strategis untuk mendekatkan layanan pendidikan madrasah kepada seluruh masyarakat secara transparan, akuntebel, dan cepat.\n\nMIN Singkawang berkomitmen mewujudkan generasi muda berkemajuan yang unggul dalam ilmu pengetahuan dan teknologi (IPTEK), sekaligus kokoh berlandaskan iman dan takwa (IMTAK). Semoga dengan adanya website ini, silaturahmi, sinergi, dan komunikasi konstruktif antara madrasah, orang tua, alumni, dan stakeholder pemangku kepentingan dapat terjalin dengan amat baik. Wassalamu'alaikum Warahmatullahi Wabarakatuh.",
  about_brief: "MIN Singkawang merupakan institusi pendidikan Islam dasar berstatus negeri yang berlokasi di Kota Singkawang, Kalimantan Barat. Menggabungkan kurikulum nasional dengan kecakapan keagamaan demi mengasuh insan cendekia yang berintegritas, kreatif, Islami, serta berprestasi tingkat nasional.",
  history: "MIN Singkawang didirikan pada tahun 1994 seiring dengan perkembangan pesat kebutuhan lembaga pendidikan dasar Islam berkualitas tinggi di Kota Singkawang. Bermula dari sebuah madrasah swasta prasaran kecil dibawah naungan yayasan lokal, melangkah berkat dedikasi kolektif para ulama dan tokoh masyarakat hingga akhirnya dinegerikan secara resmi oleh pemerintah. Dari dekade ke dekade, MIN Singkawang terus mengalami transformasi fisik, akademik, dan reputasi, menjadikannya salah satu sekolah dasar negeri rujukan unggul di wilayah Kalimantan Barat.",
  vision: "Terwujudnya Madrasah Unggul, Berakhlakul Karimah, Kompetitif, Ramah Anak, dan Berwawasan Lingkungan pada Tahun 2028.",
  mission: [
    "Menyelenggarakan proses pembelajaran yang inovatif, efektif, dan menantang berbasis teknologi informasi.",
    "Menumbuhkembangkan pembiasaan nilai-nilai agama Islam, akhlak karimah, dan budaya disiplin di kalangan seluruh civitas akademika.",
    "Mengembangkan pembinaan bakat khusus, seni budaya Islami, literasi sains, dan klub olahraga prestasi.",
    "Menciptakan lingkungan madrasah yang asri, bersih, sehat, inklusif, aman, dan kondusif bagi perlindungan hak tumbuh kembang anak.",
    "Membangun kolaborasi harmonis berkelanjutan bersama wali murid, instansi pemerintah, dan jaringan pendidikan nasional."
  ],
  objectives: [
    "Dapat mengantarkan 100% siswa lulusan madrasah fasih dalam membaca, menghafal juz 30 Al-Qur'an secara tartil, serta taat menjalankan sholat fardhu berjamaah.",
    "Pencapaian indeks peningkatan rata-rata nilai akademik kelulusan minimal di angka 85.0 setiap tahunnya.",
    "Memperoleh minimal 15 medali emas prestasi perlombaan sains, matematika, keagamaan, maupun olahraga baik tingkat kabupaten/kota hingga kancah internasional.",
    "Tercapainya kepuasan mutu layanan pendidikan bagi seluruh orang tua murid sekurang-kurangnya tingkat indeks 90%."
  ],
  accreditation_score: "96 (Peringkat A - Sangat Baik)",
  accreditation_number: "No. 1214/BAN-SM/KB/XII/2022",
  contact_email: "info@minsingkawang.sch.id",
  contact_phone: "(0562) 631234",
  contact_address: "Jl. Jenderal Sudirman No. 45, Condong, Kec. Singkawang Tengah, Kota Singkawang, Kalimantan Barat 79111",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.109038221616!2d108.97441164999998!3d0.90606775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31e401ca579978db%3A0x6bba46c535ee6174!2sCondong%2C%20Singkawang%20Tengah%2C%20Singkawang%20City%2C%20West%20Kalimantan!5e0!3m2!1sen!2sid!4v1717900000000!5m2!1sen!2sid",
  social_facebook: "https://facebook.com/minsingkawangofficial",
  social_instagram: "https://instagram.com/minsingkawangofficial",
  social_youtube: "https://youtube.com/minsingkawangofficial",
  slogan: "Unggul, Berakhlakul Karimah, Ramah Anak, dan Berwawasan Lingkungan",
  banner_slides: [
    {
      id: "slide_1",
      title: "Mencetak Generasi Unggul Berakhlakul Karimah",
      subtitle: "Madrasah Dasar Swakelola Negeri Terbaik & Berprestasi Nasional",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
      tag: "Akreditasi A Unggul"
    },
    {
      id: "slide_2",
      title: "Sarana Prasarana Belajar Digital Standar Nasional",
      subtitle: "Dilengkapi Ruang Baca Ber-AC, Laboratorium Smartboard, & Lingkungan Asri",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200",
      tag: "Fasilitas Belajar Unggulan"
    },
    {
      id: "slide_3",
      title: "Pendidikan Berbasis Karakter & Cinta Lingkungan",
      subtitle: "Bina Ilmu Pengetahuan Mutakhir & Perkuat Aqidah Akhlak Sejak Dini",
      image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=1200",
      tag: "Madrasah Ramah Anak"
    }
  ]
};

export const initialSeoSettings: SeoSettings = {
  title: "MIN Singkawang - Madrasah Ibtidaiyah Negeri Singkawang Resmi",
  description: "Selamat datang di Website Resmi MIN Singkawang. Pusat profil madrasah, pendaftaran PPDB online, pelayanan administrasi digital, berita kegiatan siswa, prestasi akreditasi unggul.",
  keywords: "MIN Singkawang, Madrasah Ibtidaiyah Negeri Singkawang, PPDB MIN Singkawang, Sekolah Dasar Islami Kalbar, Portal Pendidikan Singkawang, E-Learning MIN Singkawang",
  og_image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200",
  robots: "index, follow",
  canonical_url: "https://minsingkawang.sch.id"
};

export const initialTeachers: Teacher[] = [
  {
    id: "t1",
    name: "H. Kamaludin, S.Ag., M.Pd.",
    nip: "197508122002121003",
    role: "Kepala Madrasah",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
    status: "PNS",
    subjects: ["Kebijakan Madrasah", "Kepemimpinan Islami"],
    sort_order: 1
  },
  {
    id: "t2",
    name: "Nurhasanah, S.Pd.I.",
    nip: "198103152009022005",
    role: "Waka Kurikulum / Guru Kelas VI-A",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    status: "PNS",
    subjects: ["Tematik", "Bahasa Arab"],
    sort_order: 2
  },
  {
    id: "t3",
    name: "Ahmad Subagio, S.Pd.",
    nip: "198305212014021002",
    role: "Waka Kesiswaan / Guru PJOK",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    status: "PPPK",
    subjects: ["Pendidikan Jasmani", "Kesehatan dan Olahraga"],
    sort_order: 3
  },
  {
    id: "t4",
    name: "Siti Rahmawati, M.Pd.",
    nip: "198811092019032014",
    role: "Guru Kelas V-B",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    status: "PNS",
    subjects: ["Tematik IPA", "Matematika Dasar"],
    sort_order: 4
  },
  {
    id: "t5",
    name: "Yusuf Al-Bukhari, S.Th.I.",
    nip: "-",
    role: "Koordinator Keagamaan / Guru Al-Qur'an Hadits",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    status: "GTT",
    subjects: ["Al-Qur'an Hadits", "Fiqih", "Tahfidzul Qur'an"],
    sort_order: 5
  }
];

export const initialFacilities: Facility[] = [
  {
    id: "f1",
    name: "Ruang Kelas AC Modern berbasis Smartboard",
    description: "Seluruh ruang belajar telah dilengkapi dengan Air Conditioning (AC), proyektor multimedia pintar, meja kursi ergonomis, serta jaringan Wi-Fi internal berkecepatan tinggi demi menyokong ekosistem belajar digital ramah kenyamanan anak.",
    image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    condition: "Sangat Baik",
    capacity: "24 Ruang Kelas (Kapasitas @28 Siswa)"
  },
  {
    id: "f2",
    name: "Laboratorium Komputer & Sains Multi-Fungsi",
    description: "Laboratorium terpadu yang memadukan 30 unit komputer berspesifikasi mutakhir untuk UNBK/Assesmen Nasional serta perangkat alat praktikum sains dasar terlengkap guna mengeksplorasi eksperimen fisika dan biologi dasar.",
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    condition: "Sangat Baik",
    capacity: "1 Ruang Lab Komputer (Kapasitas 30 Siswa)"
  },
  {
    id: "f3",
    name: "Perpustakaan Baitul Hikmah Digital",
    description: "Menyediakan koleksi lebih dari 4.000 judul buku referensi akademis, buku cerita anak Islami, serta komputer akses e-library kementerian untuk menunjang program gerakan literasi harian siswa.",
    image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
    condition: "Baik",
    capacity: "Ruang Baca Ac (Menampung 50 Siswa sekaligus)"
  },
  {
    id: "f4",
    name: "Masjid Al-Ikhlas Lingkup Madrasah",
    description: "Pusat ibadah pembiasaan keagamaan, shalat dhuha berjamaah rutin, setoran hafalan hafalan tahfidz, serta pembacaan doa asmaul husna pagi sebelum proses pembalajaran harian dimulai.",
    image_url: "https://images.unsplash.com/photo-1590075865003-e48277fda558?auto=format&fit=crop&q=80&w=800",
    condition: "Sangat Baik",
    capacity: "Masjid Dua Lantai (Kapasitas 350 Jamaah)"
  }
];

export const initialPrograms: Program[] = [
  {
    id: "p1",
    title: "Tahfidzul Qur'an Intensif",
    slug: "tahfidzul-quran-intensif",
    description: "Program pembiasaan khusus menghafal Al-Qur'an terfokus dengan bimbingan mualim bersanad, menargetkan lulusan minimal menguasai hafalan Juz 30 dan Juz 29 secara fasih serta berakhlak mulia.",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    icon_name: "BookOpen"
  },
  {
    id: "p2",
    title: "Sains & Matematika Club (Olimpiade)",
    slug: "sains-matematika-club",
    description: "Kelas inkubator khusus untuk menyeleksi dan membina siswa berpotensi bidang IPA, Sains, dan Matematika, guna dilatih memenangkan Kompetisi Sains Madrasah (KSM) dan OSN tingkat nasional.",
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    icon_name: "Atom"
  },
  {
    id: "p3",
    title: "E-Learning Integratif Pintar",
    slug: "e-learning-integratif",
    description: "Pembelajaran berbasis platform digital interaktif di dalam kelas memanfaatkan game edukasi kuis, portofolio online, dan evaluasi instan guna menciptakan kecakapan abad ke-21.",
    image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    icon_name: "Tv"
  },
  {
    id: "p4",
    title: "Karakter Cinta Lingkungan (Adiwiyata)",
    slug: "adiwiyata-karakter",
    description: "Menanamkan etos daur ulang sampah, pengelolaan kebun sekolah hidroponik, kampanye nol plastik di kantin, demi memupuk kemandirian dan rasa peduli ekosistem alami sejak dini.",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    icon_name: "Leaf"
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: "a1",
    title: "Juara 1 Kompetisi Sains Madrasah (KSM) Bidang Matematika",
    category: "Akademik",
    level: "Nasional",
    year: "2025",
    winner: "Muhammad Fatih Al-Ayubi (Kelas V-A)",
    image_url: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=500",
    description: "Berhasil meraih medali emas kehormatan dalam kancah Kompetisi Sains Madrasah Tingkat Nasional 2025 yang digelar di Jakarta, menyisihkan ratusan kompetitor delegasi seluruh provinsi Indonesia."
  },
  {
    id: "a2",
    title: "Juara Umum Cabang Musabaqah Hifdzil Qur'an (MHQ) 1 Juz",
    category: "Non-Akademik",
    level: "Provinsi",
    year: "2025",
    winner: "Aisyah Humaira (Kelas IV-B)",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500",
    description: "Menyabet peringkat tertinggi penampil terbaik hafalan mutqin, kefasihan makhraj, dan keindahan irama tartil dalam Festival Anak Sholeh Indonesia (FASI) Kalbar ke-XII."
  },
  {
    id: "a3",
    title: "Medali Perak Olimpiade Olahraga Siswa Nasional (O2SN) Bulutangkis",
    category: "Non-Akademik",
    level: "Nasional",
    year: "2024",
    winner: "Rian Hidayat (Kelas VI-A)",
    image_url: "https://images.unsplash.com/photo-1552667466-07770ae110d6?auto=format&fit=crop&q=80&w=500",
    description: "Menorehkan prestasi gemilang menyapu podium runner-up cabang bulutangkis putra setelah bertanding sengit melawan perwakilan perkumpulan klub asal Jawa Timur."
  }
];

export const initialCategories: Category[] = [
  { id: "c1", name: "Berita Madrasah", slug: "berita-madrasah", description: "Warta kabar terbaru mengenai dinamika madrasah" },
  { id: "c2", name: "Pengumuman", slug: "pengumuman", description: "Informasi resmi, maklumat, atau surat keputusan kepala madrasah" },
  { id: "c3", name: "Prestasi Siswa", slug: "prestasi-siswa", description: "Capaian kebanggaan murid di kancah daerah maupun nasional" },
  { id: "c4", name: "Artikel Opini", slug: "artikel-opini", description: "Tulisan edukatif, kajian agama, serta tips pengasuhan anak dari guru" }
];

export const initialTags: Tag[] = [
  { id: "t_1", name: "Madrasah", slug: "madrasah" },
  { id: "t_2", name: "PPDB 2026", slug: "ppdb-2026" },
  { id: "t_3", name: "Sains", slug: "sains" },
  { id: "t_4", name: "KSM", slug: "ksm" },
  { id: "t_5", name: "Hafalan Qur'an", slug: "hafalan-quran" }
];

export const initialPosts: Post[] = [
  {
    id: "post1",
    title: "Pendaftaran PPDB MIN Singkawang Tahun Pelajaran 2026/2027 Resmi Dibuka: Jalur Reguler & Prestasi",
    slug: "pendaftaran-ppdb-min-singkawang-2026-2027-dibuka",
    excerpt: "MIN Singkawang kembali membuka kesempatan bagi putra-putri terbaik bangsa untuk bergabung bersama kami melalui portal PPDB online 2026. Tersedia jalur reguler dan jalur penelusuran bakat prestasi...",
    content: "MIN Singkawang secara resmi membuka gelombang penerimaan peserta didik baru (PPDB) untuk Tahun Ajaran 2026/2027. Pada pengisian PPDB tahun ini, madrasah menyediakan fasilitas pendaftaran berbasis satu pintu menggunakan platform portal online mandiri guna mempermudah aksesibilitas bagi calon wali murid di dalam maupun di luar Kota Singkawang.\n\n### Jalur Pendaftaran:\n1. **Jalur Zonasi & Reguler**: Diperuntukkan bagi seluruh pendaftar yang memenuhi kriteria usia minimal 6 tahun pada 1 Juli 2026.\n2. **Jalur Prestasi Akademik & Keagamaan**: Diperuntukkan bagi anak yang mengantongi prestasi perlombaan minimal tingkat kabupaten/kota atau melampirkan piagam hafalan Juz Al-Qur'an secara resmi.\n\n### Persyaratan Berkas Digital:\n- Scan Kartu Keluarga asli (KK)\n- Scan Akta Kelahiran asli calon peserta didik\n- Scan Kartu Identitas Anak (KIA) jika memiliki\n- Surat Keterangan Imunisasi Dasar Lengkap\n\nKuota penerimaan tahun ajaran ini ditargetkan sebanyak 112 siswa baru yang akan dibagi rata ke dalam 4 rombel belajar modern yang aman dan ramah anak. Kami menghimbau para orang tua untuk sigap mempelajari alur pengisian formulir tertera di situs resmi demi kelancaran administrasi pendaftaran putra-putri tercinta.",
    thumbnail_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
    category_id: "c2", // Pengumuman
    tags: ["ppdb-2026", "madrasah"],
    status: "publish",
    views: 452,
    published_at: "2026-06-08T08:00:00Z",
    author_id: "u1",
    author_name: "Ahmad Subagio, S.Pd.",
    seo_title: "PPDB MIN Singkawang Resmi Dibuka: Panduan & Jalur Masuk",
    seo_description: "Daftarkan putra-putri terbaik Anda di MIN Singkawang Tahun Pelajaran 2026/2027. Akses alur pendaftaran, persyaratan, serta jadwal kelulusan online di sini."
  },
  {
    id: "post2",
    title: "Siswa MIN Singkawang Berhasil Sabet Penghargaan Utama KSM Matematika Tingkat Nasional",
    slug: "siswa-min-singkawang-sabet-penghargaan-ksm-nasional",
    excerpt: "Ananda Muhammad Fatih Al-Ayubi, perwakilan siswa MIN Singkawang, berhasil menorehkan tinta emas keberhasilan membanggakan dengan membawa pulang Medali Emas Kompetisi Sains Madrasah...",
    content: "Kami segenap civitas akademika MIN Singkawang bersyukur tiada tara atas keberhasilan prestasi luar biasa dari ananda **Muhammad Fatih Al-Ayubi** (Siswa Kelas V-A) yang berhasil mencatatkan namanya sebagai Peraih Medali Emas sekaligus Juara Utama Tingkat Nasional dalam Kompetisi Sains Madrasah (KSM) 2025 yang digelar di Jakarta.\n\nKSM merupakan agenda mercusuar tahunan tingkat nasional yang mempertemukan talenta-talenta eksakta terbaik dari seluruh madrasah ibtidaiyah, tsanawiyah, dan aliyah di Nusantara.\n\nKepala MIN Singkawang, H. Kamaludin, S.Ag., M.Pd. menyampaikan apresiasi tulus. 'Prestasi mulia ini membuktikan bahwa siswa madrasah mampu berdiri setinggi-tingginya dan bersaing menguasai bidang sains matematika tingkat nasional tanpa melalaikan penanaman nilai agama sebagai jangkar moralitas mereka.' Terima kasih juga disampaikan kepada bapak-ibu mentor club sains madrasah yang telah mengorbankan waktu bekerja keras mendampingi proses belajar mengajar intesif ananda.",
    thumbnail_url: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800",
    category_id: "c3", // Prestasi Siswa
    tags: ["ksm", "sains", "madrasah"],
    status: "publish",
    views: 312,
    published_at: "2026-06-05T09:30:00Z",
    author_id: "u1",
    author_name: "Nurhasanah, S.Pd.I.",
    seo_title: "Siswa MIN Singkawang Juara KSM Matematika Nasional 2025",
    seo_description: "Kabar membanggakan dari MIN Singkawang! Muhammad Fatih Al-Ayubi menyabet Medali Emas matematika KSM Nasional Terpadu 2025."
  },
  {
    id: "post3",
    title: "Implementasi Proyek Profil Pelajar Pancasila Rahmatan Lil Alamin (P5RA) Bertema Kewirausahaan Melalui Bazar Hidroponik",
    slug: "p5ra-bazar-hidroponik-min-singkawang",
    excerpt: "Siswa-siswi MIN Singkawang mementaskan antusiasme belajar bernilai dalam acara pameran P5RA bertema Green Entrepreneurship. Mereka mengelola sayuran hidroponik madrasah...",
    content: "Sebagai komitmen penerapan Kurikulum Merdeka yang humanis, MIN Singkawang sukses melaksanakan gelar karya Projek Penguatan Profil Pelajar Pancasila Rahmatan lil Alamin (P5RA) edisi semester genap tahun ajaran ini. \n\nMembawakan payung tema utama 'Wirausaha Muslim Hijau Sejak Dini', para peserta didik dari tingkat kelas IV ditantang untuk membidani proses pengelolaan kebun hidroponik mini milik madrasah secara meluas, mulai dari penyemaian bibit kangkung dan pakcoy, merawat kebersihan pipa sirkulasi air, hingga memanen dan menjajakan hasil kebun ke tengah bazar wali murid.\n\nBazar yang diselenggarakan di lapangan serbaguna madrasah tersebut dipadati oleh puluhan pengunjung dari unsur komite sekolah and lingkungan masyarakat sekitar. Lewat aktivitas nyata ini, para siswa tidak melulu dibekali kecakapan sains botani, namun turut melatih kecakapan berkolaborasi, kepemimpinan jujur, matematika berdagang Islami, serta mempraktekkan gaya hidup berkelanjutan menyukai pangan sehat.",
    thumbnail_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    category_id: "c1", // Berita Madrasah
    tags: ["madrasah", "sains"],
    status: "publish",
    views: 189,
    published_at: "2026-06-01T10:15:00Z",
    author_id: "u1",
    author_name: "Siti Rahmawati, M.Pd.",
    seo_title: "P5RA Kewirausahaan Hidroponik Islami MIN Singkawang",
    seo_description: "Aktivitas seru siswa MIN Singkawang mempraktekkan modul P5RA Kurikulum Merdeka berlandaskan kewirausahaan muslim hijau."
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Informasi Pembagian Rapor Semester Genap dan Libur Akhir Tahun Pelajaran 2025/2026",
    slug: "informasi-pembagian-rapor-dan-libur-akhir-tahun",
    content: "Berdasarkan kalender akademik resmi Provinsi Kalbar, pembagian buku laporan hasil belajar (e-Rapor) semester genap akan didistribusikan pada hari Sabtu, 20 Juni 2026 secara tatap muka bertempat di ruang kelas masing-masing. Wali murid diwajibkan hadir tanpa diwakilkan. Setelah pembagian rapor, libur kenaikan kelas akan berlangsung mulai 22 Juni s.d. 12 Juli 2026. Masuk perdana semester ganjil dimulai 13 Juli 2026.",
    views: 948,
    is_pinned: true,
    published_at: "2026-06-08T02:00:00Z"
  },
  {
    id: "ann2",
    title: "Pemberitahuan Pelaksanaan Ujian Penilaian Akhir Semester (PAS) Genap Berbasis Digital",
    slug: "pelaksanaan-pas-genap-berbasis-digital",
    content: "Akan diselenggarakan Penilaian Akhir Semester Genap mulai tanggal 2 s.d. 8 Juni 2026. Ujian memanfaatkan tablet atau smartphone masing-masing siswa melalui server E-Learning lokal MIN Singkawang. Orang tua diharapkan menyokong pengawasan jam belajar dan menjaga kesiapan gawai putra-putrinya di rumah.",
    views: 421,
    is_pinned: false,
    published_at: "2026-05-25T03:00:00Z"
  }
];

export const initialEvents: Event[] = [
  {
    id: "ev1",
    title: "Bazar Gelar Karya P5RA Kewirausahaan",
    description: "Kegiatan pertunjukkan karya kreasi, tanaman organik hidroponik, kerajinan limbah plastik, dan jajanan hasil olahan mandiri siswa kelas IV s.d. VI.",
    event_date: "2026-06-12",
    event_time: "08:00 - 12:00 WIB",
    location: "Lapangan Serbaguna MIN Singkawang",
    organizer: "Panitia Projek P5RA Madrasah",
    published_at: "2026-06-08T00:00:00Z"
  },
  {
    id: "ev2",
    title: "Khatmil Qur'an & Wisuda Tahfidz Juz 30-29 Angkatan Ke-VIII",
    description: "Seremoni mulia apresiasi kelulusan hafalan Quran siswa-siswi kelas VI yang telah menyucikan setoran hafalan hafalan mutqin minimal 1 juz.",
    event_date: "2026-06-16",
    event_time: "07:30 - selesai",
    location: "Aula Pertemuan Hotel Mahkota Singkawang",
    organizer: "Komite Sekolah & Humas MIN",
    published_at: "2026-06-07T00:00:00Z"
  },
  {
    id: "ev3",
    title: "Rapat Pleno Sosialisasi PPDB bersama Wali Murid Baru",
    description: "Pertemuan koordinasi administratif, pengenalan sistem asrama/e-learning, pemetaan baju seragam, serta orientasi lingkungan pendidikan dasar Islam.",
    event_date: "2026-07-04",
    event_time: "09:00 - 11:30 WIB",
    location: "Masjid Al-Ikhlas MIN Singkawang",
    organizer: "Panitia Penerimaan Siswa Baru",
    published_at: "2026-06-05T00:00:00Z"
  }
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "g1",
    type: "foto",
    title: "Halaman Madrasah nan Asri di Pagi Hari",
    url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
    album_id: "alb1",
    views: 240,
    created_at: "2026-06-07T12:00:00Z"
  },
  {
    id: "g2",
    type: "foto",
    title: "Bazar Organik Hidroponik Anak Didik",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    album_id: "alb1",
    views: 189,
    created_at: "2026-06-01T12:00:00Z"
  },
  {
    id: "g3",
    type: "foto",
    title: "Eksperimen Seru Lab Sains Dasar",
    url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    album_id: "alb2",
    views: 154,
    created_at: "2026-05-28T12:00:00Z"
  },
  {
    id: "g4",
    type: "video",
    title: "Profil Resmi MIN Singkawang - Sekolah Ramah Anak Kalbar",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube Embed Link Placeholder
    thumbnail_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    views: 1105,
    created_at: "2026-05-15T12:00:00Z"
  },
  {
    id: "g5",
    type: "foto",
    title: "Pembacaan Kitab Suci Al-Qur'an Bersama",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
    album_id: "alb2",
    views: 312,
    created_at: "2026-05-20T12:00:00Z"
  },
  {
    id: "g6",
    type: "foto",
    title: "Latihan Pramuka Luar Ruangan & Kemah Bakti",
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
    album_id: "alb3",
    views: 224,
    created_at: "2026-05-10T12:00:00Z"
  },
  {
    id: "g7",
    type: "foto",
    title: "Pembelajaran Kreatif Menggambar dan Seni Lukis",
    url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    album_id: "alb2",
    views: 198,
    created_at: "2026-05-05T12:00:00Z"
  },
  {
    id: "g8",
    type: "foto",
    title: "Pekan Olahraga Santri dan Lomba Lari Cepat",
    url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
    album_id: "alb3",
    views: 176,
    created_at: "2026-05-01T12:00:00Z"
  },
  {
    id: "g9",
    type: "foto",
    title: "Upacara Hari Besar Nasional Khidmat",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    album_id: "alb1",
    views: 265,
    created_at: "2026-04-25T12:00:00Z"
  },
  {
    id: "g10",
    type: "video",
    title: "Keseruan Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    views: 450,
    created_at: "2026-04-20T12:00:00Z"
  }
];

export const initialDownloadItems: DownloadItem[] = [
  {
    id: "d1",
    title: "Brosur PPDB Online MIN Singkawang TA 2026/2027",
    filename: "PPDB_MIN_Singkawang_2026_Brosur.pdf",
    category: "dokumen",
    file_url: "#",
    file_size: "2.4 MB",
    downloads_count: 512,
    created_at: "2026-06-07T09:00:00Z"
  },
  {
    id: "d2",
    title: "Kalender Akademik Madrasah Tahun Ajaran Terbaru KB/Kemenag",
    filename: "Kalender_Akademik_MIN_Singkawang_2025_2026.pdf",
    category: "panduan",
    file_url: "#",
    file_size: "1.1 MB",
    downloads_count: 341,
    created_at: "2026-05-20T09:00:00Z"
  },
  {
    id: "d3",
    title: "Formulir Surat Pernyataan Kesanggupan Tata Tertib Wali Murid",
    filename: "Form_Pernyataan_Orang_Tua_Tata_Tertib.docx",
    category: "formulir",
    file_url: "#",
    file_size: "145 KB",
    downloads_count: 219,
    created_at: "2026-06-07T08:00:00Z"
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "ts1",
    name: "Dr. Heri Gunawan, M.T.",
    role: "Orang Tua ananda Ridho (Kelas IV)",
    content: "Kami sangat terkesan dengan komitmen keagamaan di MIN Singkawang. Selain materi akademisnya yang berkelas, pembiasaan shalat dhuha dan setoran tahfidz di masjid madrasah berjalan sangat konsisten. Perkembangan karakter anak saya luar biasa sopan, mandiri, dan bersemangat.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    created_at: "2026-06-01T08:00:00Z"
  },
  {
    id: "ts2",
    name: "Siti Masitah, S.Pd.",
    role: "Orang Tua ananda Farhana (Alumnus - melanjutkan ke MTsN 1)",
    content: "Anak saya terbantu sekali dengan kelas Olimpiade Sains Club di MIN Singkawang. Fasilitasnya sangat bagus, lab komputernya lengkap AC, bimbingan gurunya tulus dan ikhlas gratis dari hati. Alhamdulilah Farhana sangat matang menembus persaingan SMP rujukan berbekal bekal madrasah.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    created_at: "2026-05-18T08:00:00Z"
  },
  {
    id: "ts3",
    name: "H. Akhmad Fauzi, S.H.",
    role: "Alumni MIN (Tahun 2008 / Praktisi Hukum)",
    content: "Masa-masa belajar di MIN Singkawang menanamkan pondasi moral yang sangat kokoh. Dari pembinaan karakter dasar, kedisiplinan ibadah, hingga semangat belajar pantang menyerah. Saya bangga menjadi bagian dari keluarga besar madrasah yang hebat dan bermartabat ini.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    created_at: "2026-05-10T08:00:00Z"
  }
];

export const initialApplicants: PPDBApplicant[] = [
  {
    id: "ap1",
    student_name: "Yusuf Al-Farabi",
    nik: "7311021408190001",
    gender: "Laki-laki",
    pob: "Singkawang",
    dob: "2019-08-14",
    father_name: "Budi Santoso",
    phone_number: "081234567890",
    address: "Jl. Diponegoro Gang Merpati No. 12, Singkawang Barat",
    previous_school: "TK Raudhatul Athfal Al-Ikhsan",
    status: "verified",
    created_at: "2026-06-08T11:20:00Z"
  },
  {
    id: "ap2",
    student_name: "Keisha Nazwa Aurelia",
    nik: "7311035201190002",
    gender: "Perempuan",
    pob: "Sambas",
    dob: "2019-01-22",
    father_name: "Hendrayanto",
    phone_number: "089876543210",
    address: "Perumahan Roban Permai Blok C4, Singkawang Tengah",
    previous_school: "TK Pertiwi Singkawang",
    status: "submitted",
    created_at: "2026-06-09T03:45:00Z"
  }
];
