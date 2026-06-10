/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolSettings, Teacher, Facility, Program, Achievement } from '../types';
import { Mail, Phone, MapPin, Award, CheckCircle, ArrowRight, UserCheck, Layers, Landmark, Map, Calendar, Users, Info, Sparkles, Clock, Printer, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OptimizedImage from '../components/OptimizedImage';
import ContactForm from '../components/ContactForm';
import { calculateReadingTime } from '../utils/readingTime';
import InteractiveMap from '../components/InteractiveMap';

interface ProfilProps {
  subPath: string; // which specific section to render (e.g. "profil_sambutan", "profil_singkat", etc.)
  settings: SchoolSettings;
  teachers: Teacher[];
  facilities: Facility[];
  programs: Program[];
  achievements: Achievement[];
  onNavigate: (path: string) => void;
  onSubmitContact: (data: { name: string; email: string; subject: string; message: string }) => void;
}

function getProfilReadingTime(subPath: string, settings: SchoolSettings, teachers: Teacher[], facilities: Facility[], programs: Program[], achievements: Achievement[]): number {
  let content = "";
  switch(subPath) {
    case "profil_sambutan":
      content = settings.headmaster + " " + settings.headmaster_speech;
      break;
    case "profil_singkat":
      content = settings.about_brief + " Selayang Pandang Madrasah Nama Lembaga NPSN Status Akreditasi Wilayah Layanan";
      break;
    case "profil_sejarah":
      content = settings.history + " Rentang Perjalanan Sejarah Berdiri Era Rintisan Awal 1994 Penegerian Resmi Pemerintah 2009 Era Digital Baru 2020 Sekarang";
      break;
    case "profil_visi_misi":
      content = settings.vision + " " + settings.mission.join(" ") + " Visi Utama Madrasah Misi Operasional";
      break;
    case "profil_tujuan":
      content = settings.objectives.join(" ") + " Tujuan Strategis Pendidikan";
      break;
    case "profil_organisasi":
      content = "Tata Struktur Organisasi Komite Kementerian Agama Pelindung Penasehat Kepala Madrasah " + settings.headmaster + " Ketua Komite Waka Kurikulum Waka Kesiswaan Tata Usaha";
      break;
    case "profil_gtk":
      content = "Data Pendidik Tenaga Kependidikan " + teachers.map(t => `${t.name} ${t.role} ${t.nip} ${t.subjects.join(" ")}`).join(" ");
      break;
    case "profil_sarana":
      content = "Sarana Prasarana Media Pembelajaran " + facilities.map(f => `${f.name} ${f.description} ${f.condition} ${f.capacity}`).join(" ");
      break;
    case "profil_akreditasi":
      content = settings.accreditation_number + " " + settings.accreditation_score + " Sertifikat Penilaian Akreditasi Lembaga Akreditasi A Sangat Baik";
      break;
    case "profil_prestasi":
      content = "Prestasi Unggul Penghargaan Terbaru " + achievements.map(a => `${a.title} ${a.winner} ${a.description} ${a.level}`).join(" ");
      break;
    case "profil_unggulan":
      content = "Penjelasan Program Unggulan Madrasah " + programs.map(p => `${p.title} ${p.description}`).join(" ");
      break;
    case "profil_kontak":
      content = "Hubungi Sekretariat Kami Alamat Lengkap Saluran Telepon Email Jam Pengaduan Layanan " + settings.contact_address + " " + settings.contact_phone + " " + settings.contact_email;
      break;
    default:
      content = "Profil Madrasah";
  }
  return calculateReadingTime(content);
}

export default function Profil({ subPath, settings, teachers, facilities, programs, achievements, onNavigate, onSubmitContact }: ProfilProps) {
  const [filterGtk, setFilterGtk] = useState<string>('SEMUA');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPDF = () => {
    const currentItem = sidebarMenuItems.find(i => i.path === subPath);
    const labelSanitized = currentItem ? currentItem.label.replace(/\s+/g, "_") : "Profil";
    const originalTitle = document.title;
    
    // Set dynamic filename suggestion
    document.title = `Profil_MIN_Singkawang_${labelSanitized}`;
    setIsExportingPdf(true);

    setTimeout(() => {
      window.print();
      
      setTimeout(() => {
        document.title = originalTitle;
        setIsExportingPdf(false);
      }, 1000);
    }, 400);
  };

  // Filter GTK status
  const filteredTeachers = teachers.filter(t => {
    if (filterGtk === 'SEMUA') return true;
    return t.status === filterGtk;
  });

  const sidebarMenuItems = [
    { label: "Sambutan Kepala", path: "profil_sambutan" },
    { label: "Profil Singkat", path: "profil_singkat" },
    { label: "Sejarah Madrasah", path: "profil_sejarah" },
    { label: "Visi dan Misi", path: "profil_visi_misi" },
    { label: "Tujuan Madrasah", path: "profil_tujuan" },
    { label: "Struktur Organisasi", path: "profil_organisasi" },
    { label: "Data GTK (Guru)", path: "profil_gtk" },
    { label: "Sarana & Prasarana", path: "profil_sarana" },
    { label: "Akreditasi", path: "profil_akreditasi" },
    { label: "Prestasi Madrasah", path: "profil_prestasi" },
    { label: "Program Unggulan", path: "profil_unggulan" },
    { label: "Kontak & Lokasi", path: "profil_kontak" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans tracking-tight" id="profil_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Page title section */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">PROFIL SEKOLAH</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">
            {sidebarMenuItems.find(i => i.path === subPath)?.label || "Informasi Profil"}
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Mengenal lebih dekat sejarah, tata kelola, personil kepegawaian, mutu fasilitas, serta visi perjuangan luhur MIN Singkawang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Rails panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs sticky top-32">
              <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider px-3 pb-3 mb-3 border-b border-slate-100 text-left">
                Kategori Profil
              </h3>
              <div className="flex flex-col gap-1">
                {sidebarMenuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
                      subPath === item.path 
                        ? "bg-emerald-800 text-white font-bold shadow-xs" 
                        : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Estimasi Waktu Baca: <strong className="text-slate-700 dark:text-slate-350 font-extrabold">{getProfilReadingTime(subPath, settings, teachers, facilities, programs, achievements)} Menit</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="no-print flex items-center gap-1.5 text-[10px] uppercase font-black text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200/65 dark:border-emerald-800/80 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer select-none"
                  title="Unduh Halaman Profil sebagai Dokumen Resmi PDF"
                  aria-label="Unduh Halaman Profil sebagai Dokumen Resmi PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-500 hover:text-slate-705 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/65 dark:border-slate-800/80 px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer select-none"
                  title="Cetak Halaman Profil Ini"
                  aria-label="Cetak Halaman Profil Ini"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                  <span>Cetak Profil</span>
                </button>
              </div>
            </div>
            
            {/* RENDER CURRENT SUBPATH VIEWS */}

            {/* A. Sambutan Kepala Madrasah */}
            {subPath === "profil_sambutan" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
                  <OptimizedImage 
                    src={settings.headmaster_avatar} 
                    alt={settings.headmaster}
                    className="w-48 h-56 object-cover rounded-xl shadow-xs border shrink-0 object-top"
                  />
                  <div>
                    <h3 className="text-slate-900 text-lg font-extrabold uppercase tracking-tight">{settings.headmaster}</h3>
                    <p className="text-emerald-700 text-xs font-bold mt-1">Kepala Madrasah Ibtidaiyah Negeri Singkawang</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">NIP. {settings.headmaster_nip}</p>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-sans italic">
                      "Pendidikan Islam Dasar adalah fondasi akhlak, intelektualitas, dan kreativitas masa depan peradaban islami inklusif."
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-slate-900 font-bold mb-4">Pesan-Pesan Kepala Madrasah:</h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-sans space-y-4 whitespace-pro-line">
                    {settings.headmaster_speech}
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                    Dirangkum pada: Juni 2026 • Sekretariat MIN Singkawang
                  </div>
                </div>
              </div>
            )}

            {/* B. Profil Singkat */}
            {subPath === "profil_singkat" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-2">Selayang Pandang Madrasah</h3>
                <p>{settings.about_brief}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 bg-slate-50 rounded-xl p-5 border border-slate-100 text-slate-700 font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Nama Lembaga</span>
                    <p className="font-bold text-sm text-slate-800">{settings.school_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">NPSN (Pusat)</span>
                    <p className="font-bold text-sm text-slate-800">{settings.npsn}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status Akreditasi</span>
                    <p className="font-bold text-sm text-emerald-700">{settings.accreditation_score}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Wilayah Layanan</span>
                    <p className="font-bold text-sm text-slate-800">Kota Singkawang, Kalbar</p>
                  </div>
                </div>
                <p>MIN Singkawang meyakini bahwa pendidikan dasar berkualitas tinggi adalah investasi mutlak generasi bertakwa. Madrasah ini berinduk langsung pada Direktorat Jenderal Pendidikan Islam, dan kami secara berskala mengadopsi standar administrasi kelas digital, sarana fisik nyaman, and kompetensi guru yang terakreditasi melatih tumbuh kembang putra-putri.</p>
              </div>
            )}
 
            {/* C. Sejarah */}
            {subPath === "profil_sejarah" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Rentang Perjalanan & Sejarah Berdiri</h3>
                <div className="relative border-l-2 border-emerald-700 pl-6 ml-2 space-y-8">
                  <div>
                    <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-emerald-700"></span>
                    <h4 className="font-bold text-slate-950 text-xs">Era Rintisan Awal (1994)</h4>
                    <p className="text-slate-500 mt-1">Lembaga diinisiasi oleh kepedulian tokoh ulama terkemuka Condong Singkawang sebagai madrasah swasta prasarana darurat 2 kelas guna melayani akses pendidikan Islam anak-anak marjinal.</p>
                  </div>
                  <div>
                    <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-emerald-700"></span>
                    <h4 className="font-bold text-slate-950 text-xs">Penegerian Resmi Pemerintah (2009)</h4>
                    <p className="text-slate-500 mt-1">Secara resmi terdaftar dan dinegerikan secara nasional, bertransformasi menjadi MIN Singkawang. Pembangunan fisik gedung utama dilipatgandakan.</p>
                  </div>
                  <div>
                    <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-emerald-700"></span>
                    <h4 className="font-bold text-slate-950 text-xs">Era Digital Baru (2020 - Sekarang)</h4>
                    <p className="text-slate-500 mt-1">Mengadopsi pemetaan kurikulum merdeka nasional berbasis e-learning terintegasi, ruang baca ber-AC, digital smartboard, and meraih capaian prestasi sains dan keagamaan gemilang kancah nasional.</p>
                  </div>
                </div>
                <p className="pt-4 border-t border-slate-100">{settings.history}</p>
              </div>
            )}

            {/* D. Visi dan Misi */}
            {subPath === "profil_visi_misi" && (
              <div className="space-y-8 text-xs text-slate-600 leading-relaxed font-sans">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase block mb-1">VISI UTAMA MADRASAH</span>
                  <h3 className="text-slate-900 text-base md:text-xl font-extrabold leading-normal bg-slate-50 p-6 rounded-xl border border-slate-100">
                    "{settings.vision}"
                  </h3>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase block mb-3">MISI OPERASIONAL</span>
                  <ul className="space-y-4">
                    {settings.mission.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start pb-3 border-b border-slate-50">
                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold shrink-0 flex items-center justify-center text-[11px] border border-emerald-100">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* E. Tujuan Madrasah */}
            {subPath === "profil_tujuan" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Tujuan Strategis Pendidikan</h3>
                <ul className="space-y-4">
                  {settings.objectives.map((item, idx) => (
                    <li key={idx} className="flex gap-4.5 items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <p className="text-slate-700">{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* F. Struktur Organisasai */}
            {subPath === "profil_organisasi" && (
              <div className="space-y-6 text-center">
                <h3 className="text-slate-900 text-lg font-bold text-left mb-6">Tata Struktur Organisasi & Komite</h3>
                {/* Visual Chart */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-sans max-w-2xl mx-auto flex flex-col gap-6">
                  <div className="bg-emerald-800 text-white rounded-lg p-3 mx-auto w-64 shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider block font-light">KEMENTERIAN AGAMA</span>
                    <p className="font-extrabold text-xs">PELINDUNG & PENASEHAT</p>
                  </div>
                  
                  <div className="w-1.5 h-6 bg-slate-300 mx-auto"></div>

                  <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                    <div className="bg-emerald-950 text-white rounded-lg p-3 shadow-xs">
                      <span className="text-[9px] uppercase tracking-wider block font-light">KEPALA MADRASAH</span>
                      <p className="font-extrabold text-xs">{settings.headmaster}</p>
                    </div>
                    
                    <div className="bg-amber-400 text-emerald-950 rounded-lg p-3 shadow-xs">
                      <span className="text-[9px] uppercase tracking-wider block">KETUA KOMITE</span>
                      <p className="font-extrabold text-xs">H. M. Yusuf, M.Ag.</p>
                    </div>
                  </div>

                  <div className="w-1.5 h-6 bg-slate-300 mx-auto"></div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-200 text-slate-800 rounded p-2 text-[10px]">
                      <span className="font-bold uppercase tracking-wide">WAKA KURIKULUM</span>
                      <p className="mt-0.5 font-sans">Nurhasanah, S.Pd.I.</p>
                    </div>
                    <div className="bg-slate-200 text-slate-800 rounded p-2 text-[10px]">
                      <span className="font-bold uppercase tracking-wide">WAKA KESISWAAN</span>
                      <p className="mt-0.5 font-sans">Ahmad Subagio, S.Pd.</p>
                    </div>
                    <div className="bg-slate-200 text-slate-800 rounded p-2 text-[10px]">
                      <span className="font-bold uppercase tracking-wide">TATA USAHA (TU)</span>
                      <p className="mt-0.5 font-sans">Hendika, S.Kom.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* G. Data GTK */}
            {subPath === "profil_gtk" && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-100 gap-4">
                  <h3 className="text-slate-900 text-lg font-bold">Data Pendidik & Tenaga Kependidikan</h3>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {['SEMUA', 'PNS', 'PPPK', 'GTT'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterGtk(t)}
                        className={`px-3 py-1 text-[10px] font-extrabold rounded-md cursor-pointer ${
                          filterGtk === t ? "bg-emerald-800 text-white" : "text-slate-600 hover:text-emerald-800"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTeachers.map((t) => (
                    <div key={t.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 hover:shadow-sm transition-shadow">
                      <OptimizedImage src={t.photo_url} alt={t.name} className="w-20 h-24 object-cover rounded-lg shrink-0 border bg-white object-top" />
                      <div className="text-left flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-slate-900 font-extrabold text-xs uppercase">{t.name}</h4>
                          <p className="text-[10px] text-emerald-800 font-bold mt-1">{t.role}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">NIP: {t.nip}</p>
                        </div>
                        <div className="mt-2">
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">{t.status}</span>
                          <p className="text-[9px] text-slate-500 mt-1">Mengajar: {t.subjects.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* H. Sarana dan Prasarana */}
            {subPath === "profil_sarana" && (
              <div className="space-y-6">
                <h3 className="text-slate-900 text-lg font-bold">Sarana Prasarana & Media Pembelajaran</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facilities.map((fac) => (
                    <div key={fac.id} className="bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                      <div className="h-40 bg-slate-100">
                        <OptimizedImage src={fac.image_url} alt={fac.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 Text-left">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-slate-900 font-bold text-xs">{fac.name}</h4>
                          <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">{fac.condition}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{fac.description}</p>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase mt-3 pt-2 border-t border-slate-50">Kapasitas: {fac.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* I. Akreditasi */}
            {subPath === "profil_akreditasi" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Sertifikat Penilaian Akreditasi Lembaga</h3>
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 max-w-xl mx-auto text-center border-4 border-emerald-700/60 shadow-lg relative">
                  <Award className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h4 className="text-lg font-black tracking-wide">AKREDITASI A (SANGAT BAIK)</h4>
                  <p className="text-xs text-slate-300 mt-1">{settings.accreditation_number}</p>
                  <p className="text-xs text-slate-200 mt-6 leading-relaxed">
                    Berdasarkan peninjauan komprehensif Badan Akreditasi Nasional Sekolah/Madrasah (BAN-SM) Provinsi Kalimantan Barat, MIN Singkawang memperoleh nilai rekor:
                  </p>
                  <div className="text-4xl font-black text-amber-400 mt-6">96</div>
                  <p className="text-[10px] uppercase text-emerald-300 font-mono tracking-widest mt-1">Sertifikasi Berlaku s.d. Tahun 2027</p>
                </div>
                <p className="pt-6 border-t border-slate-100 text-slate-500 text-center">Akreditasi resmi A mencerminkan komitmen keunggulan kami pada kurikulum, sediaan guru bersertifikat, fasilitas laborat, kualifikasi lulusan, and manajemen tata kelola madrasah.</p>
              </div>
            )}

            {/* J. Prestasi */}
            {subPath === "profil_prestasi" && (
              <div className="space-y-6">
                <h3 className="text-slate-900 text-lg font-bold">Prestasi Unggul & Penghargaan Terbaru</h3>
                <div className="flex flex-col gap-4">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start">
                      <OptimizedImage src={ach.image_url} alt={ach.title} className="w-full md:w-32 h-24 object-cover rounded-lg shrink-0 border" />
                      <div className="text-left flex-grow">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">{ach.level}</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{ach.year}</span>
                        </div>
                        <h4 className="text-slate-950 font-extrabold text-xs mt-1">{ach.title}</h4>
                        <p className="text-[10px] text-emerald-700 font-bold mt-1">Delegasi: {ach.winner}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 font-sans leading-relaxed">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* K. Program Unggulan */}
            {subPath === "profil_unggulan" && (
              <div className="space-y-6">
                <h3 className="text-slate-900 text-lg font-bold">Penjelasan Program Unggulan Madrasah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((prog) => (
                    <div key={prog.id} className="bg-slate-50 border rounded-xl p-5 flex gap-4 items-start text-left">
                      <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 font-bold">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-bold text-xs">{prog.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1.5">{prog.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* L. Kontak */}
            {subPath === "profil_kontak" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                  {/* Left Column: Details & Map */}
                  <div className="space-y-6">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">Hubungi Sekretariat Kami</h3>
                    
                    {/* Address List Details */}
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                        <MapPin className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase">Alamat Lengkap</h4>
                          <p className="text-xs text-slate-500 mt-1">{settings.contact_address}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                        <Phone className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase">Saluran Telepon</h4>
                          <p className="text-xs text-slate-500 mt-1">{settings.contact_phone}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <Mail className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase">Surat Elektronik (Email)</h4>
                          <p className="text-xs text-slate-500 mt-1">{settings.contact_email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Operational Info card */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-5 border border-emerald-100/60 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200 font-sans">
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase mb-3">Jam Pengaduan & Layanan</h4>
                      <ul className="text-xs space-y-2 font-sans">
                        <li className="flex justify-between">
                          <span>Senin - Kamis:</span>
                          <span className="font-bold">07:00 - 14:00 WIB</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Jumat:</span>
                          <span className="font-bold">07:00 - 11:00 WIB</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sabtu:</span>
                          <span className="font-bold">07:00 - 12:00 WIB</span>
                        </li>
                      </ul>
                      <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">
                        Lembaga tutup pada hari Minggu, Libur Hari Besar Keagamaan, serta tanggal merah Nasional kementerian.
                      </p>
                    </div>

                    {/* Interactive Map Component with custom coordinates */}
                    <div className="pt-2">
                      <InteractiveMap 
                        schoolName={settings.school_name} 
                        address={settings.contact_address} 
                      />
                    </div>
                  </div>

                  {/* Right Column: Secure Contact form */}
                  <div className="font-sans">
                    <ContactForm onSubmitSubmission={onSubmitContact} />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Dynamic PDF Export Guidance Popup */}
      <AnimatePresence>
        {isExportingPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-left no-print"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl inline-flex">
                  <FileText className="w-6 h-6 animate-pulse" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Asisten Ekspor Dokumen</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Format PDF Sedang Berkembang...</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-4">
                Sistem sedang memformat berkas profil resmi MIN Singkawang secara optimal untuk disimpan sebagai <strong>PDF Dokumen Sekolah</strong>.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3.5 border border-slate-100 dark:border-slate-850 text-[11px] font-sans text-slate-500 dark:text-slate-400 mb-6 flex flex-col gap-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">💡 Instruksi Cetak / Simpan PDF:</p>
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-emerald-600">1.</span>
                  <span>Ubah opsi <strong>"Tujuan / Destination"</strong> menjadi <strong>"Simpan sebagai PDF" (Save as PDF)</strong> pada dialog cetak sistem.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-emerald-600">2.</span>
                  <span>Centang pilihan <strong>"Grafik Latar Belakang / Background Graphics"</strong> agar warna aksen and lambang resmi tercetak dengan sempurna.</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-slate-400 animate-pulse">Mengalihkan ke dialog OS...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
