/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Calendar, Star, Sparkles, Award, Compass, BookOpenCheck, Layers, Landmark, ShieldCheck, Clock, Printer } from 'lucide-react';
import { calculateReadingTime } from '../utils/readingTime';
import EventCalendar from '../components/EventCalendar';
import MockDb from '../database/mockDb';

interface AkademikProps {
  subPath: string; // "akademik_kurikulum", "akademik_kalender", "akademik_p5ra", "akademik_ekstra", "akademik_perpus"
  onNavigate: (path: string) => void;
}

function getAkademikReadingTime(subPath: string): number {
  let content = "";
  switch(subPath) {
    case "akademik_kurikulum":
      content = "Kurikulum Merdeka Integratif Modern MIN Singkawang bangga menerapkan Kurikulum Merdeka secara resmi sesuai keputusan standar nasional. Kami percaya bahwa setiap anak memiliki keunikan bakat kodrati. Model pengajaran kami dirancang fleksibel guna memberikan ruang eksplorasi kreativitas yang mendalam tanpa menegasikan penempaan fundamental karakter agamis. Intrakurikuler Kokurikuler P5RA Ekstrakurikuler Melalui implementasi digital di kelas, guru-guru kami memanfaatkan video visual pembelajaran interaktif sehingga suasana belajar terasa menyenangkan, merangsang rasa kepintaran bertanya, and ramah terhadap perkembangan kognitif emosional anak usia dasar.";
      break;
    case "akademik_kalender":
      content = "Agenda Kalender Pelaksanaan Belajar Mengajar Berikut gambaran tema sirkulasi kegiatan belajar, assesmen kelas, rapat organisasi, and cuti akhir libur sekolah semester ganjil mendatang Permulaan Tahun Ajaran Baru, MATSAMA Masa Ta'aruf Siswa Madrasah Lomba HUT Kemerdekaan RI Ke-81 Antar Kelas, Persiapan Asesmen Tingkat Nasional Pelaksanaan Ujian Penilaian Tengah Semester PTS Ganjil Digital Kemah Dakwah Pramuka Penggalang Bulanan Madrasah, Peringatan Hari Santri Sosialisasi Persiapan UAS Ganjil, Gelar Projek P5RA Tema 1 Ujian PAS Ganjil, Rapat Komite Madrasah, Penyerahan e-Rapor, Libur Semester";
      break;
    case "akademik_p5ra":
      content = "Projek Penguatan Profil Pelajar Pancasila Rahmatan Lil Alamin P5RA P5RA adalah pilar penentu jati diri lulusan madrasah di era disosiasi modern. Program ini dirancang kementerian agama untuk menyeimbangkan wawasan kebinekaan pancasila dengan keluhuran falsafah Rahmatan lil Alamin menebar damai kasih sayang sekalian alam semesta Green Entrepreneurship Bazar Hidroponik Islami Para siswa diajak bercocok tanam pipa air hidroponik berkelanjutan, menguji pH nutrisi air secara berkala, memanen, and menjual hasil sayuran kepada komite wali murid. Menggabungkan kemandirian berniaga Islami dengan kepedulian krisis pangan.";
      break;
    case "akademik_ekstra":
      content = "Pilihan Ekstrakurikuler Peminatan Siswa Melalui bimbingan langsung para pelatih ahli kesiswaan, kami melayani sediaan ruang gerak penjelajahan bakat non-akademis Pramuka Penggalang Wajib Membina disiplin, bela negara, rasa cinta tanah air, kecakapan pertolongan darurat, karakter beradab mulia, and solidaritas karsa sejak masa kanak-kanak Tahfidzul Qur'an Club Inkubator pemantapan hafalan Quran Juz 30-29 setoran khusus dengan standard fashih makhorijul huruf Sains Robotik Club Mengasah kemampuan logika sains, matematika, serta eksperimen teknologi robotika perakitan dasar tingkat awal Seni Kaligrafi Tilawah Melestarikan nilai estetika seni Islam, melatih keindahan menulis mushaf, serta olah suara murattal yang syahdu Pencak Silat Pagar Nusa Seni bela diri olahraga warisan ulama guna menumbuhkan ketangkasan fisik berwatak kesatria berisikan budi mulia";
      break;
    case "akademik_perpus":
      content = "Perpustakaan Baitul Hikmah Digital Baitul Hikmah Library Nama Baitul Hikmah kami sematkan sebagai inspirasi mercusuar keilmuan peradaban islam di Baghdad dahulu. Perpustakaan MIN Singkawang bukan sekadar tumpukan kertas kaku biasa; ini adalah wadah berdiskusi interaktif, mendengarkan storytelling guru lewat proyektor pintar, and mengunduh ebook referensi di tablet madrasah Koleksi 4.000+ Judul Buku Cerita, Ilmu Pengetahuan, Sastra Anak Islami Sertifikasi e-Library Kementerian Terkoneksi Penghargaan Raja Ratu Literasi untuk Peminjam Buku Tersering Ruang Membaca Ber-AC Nyaman Bebas Gangguan Kebisingan";
      break;
    default:
      content = "Akademik Madrasah";
  }
  return calculateReadingTime(content);
}

export default function Akademik({ subPath, onNavigate }: AkademikProps) {
  const events = MockDb.getEvents();
  
  const sidebarMenuItems = [
    { label: "Kurikulum Merdeka", path: "akademik_kurikulum" },
    { label: "Kalender Akademik", path: "akademik_kalender" },
    { label: "Projek P5RA Islami", path: "akademik_p5ra" },
    { label: "Ekstrakurikuler Siswa", path: "akademik_ekstra" },
    { label: "Perpustakaan Digital", path: "akademik_perpus" },
  ];

  const agendaKalender = [
    { bulan: "JULI 2026", agenda: "Permulaan Tahun Ajaran Baru, MATSAMA (Masa Ta'aruf Siswa Madrasah)" },
    { bulan: "AGUSTUS 2026", agenda: "Lomba HUT Kemerdekaan RI Ke-81 Antar Kelas, Persiapan Asesmen Tingkat Nasional" },
    { bulan: "SEPTEMBER 2026", agenda: "Pelaksanaan Ujian Penilaian Tengah Semester (PTS) Ganjil Digital" },
    { bulan: "OKTOBER 2026", agenda: "Kemah Dakwah Pramuka Penggalang Bulanan Madrasah, Peringatan Hari Santri" },
    { bulan: "NOVEMBER 2026", agenda: "Sosialisasi Persiapan UAS Ganjil, Gelar Projek P5RA Tema 1" },
    { bulan: "DESEMBER 2026", agenda: "Ujian PAS Ganjil, Rapat Komite Madrasah, Penyerahan e-Rapor, Libur Semester" }
  ];

  const ekskulList = [
    { nama: "Pramuka Penggalang (Wajib)", deskripsi: "Membina disiplin, bela negara, rasa cinta tanah air, kecakapan pertolongan darurat, karakter beradab mulia, and solidaritas karsa sejak masa kanak-kanak.", icon: "Compass" },
    { nama: "Tahfidzul Qur'an Club", deskripsi: "Inkubator pemantapan hafalan Quran Juz 30-29 setoran khusus dengan standard fashih makhorijul huruf.", icon: "BookOpenCheck" },
    { nama: "Sains & Robotik Club", deskripsi: "Mengasah kemampuan logika sains, matematika, serta eksperimen teknologi robotika perakitan dasar tingkat awal.", icon: "Sparkles" },
    { nama: "Seni Kaligrafi & Tilawah", deskripsi: "Melestarikan nilai estetika seni Islam, melatih keindahan menulis mushaf, serta olah suara murattal yang syahdu.", icon: "Award" },
    { nama: "Pencak Silat Pagar Nusa", deskripsi: "Seni bela diri olahraga warisan ulama guna menumbuhkan ketangkasan fisik berwatak kesatria berisikan budi mulia.", icon: "ShieldCheck" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans tracking-tight" id="akademik_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Banner header top section */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">AKADEMIK MADRASAH</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">
            {sidebarMenuItems.find(i => i.path === subPath)?.label || "Informasi Akademik"}
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Sistem evaluasi pembelajaran, penegakan disiplin santun karakter, kurikulum merdeka kementerian, serta program pembinaan keterampilan siswa min singkawang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Rails panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs sticky top-32">
              <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider px-3 pb-3 mb-3 border-b border-slate-100 text-left">
                Kategori Akademik
              </h3>
              <div className="flex flex-col gap-1">
                {sidebarMenuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
                      subPath === item.path 
                        ? "bg-emerald-800 text-white font-bold" 
                        : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core main academic view */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Estimasi Waktu Baca: <strong className="text-slate-700 dark:text-slate-350 font-extrabold">{getAkademikReadingTime(subPath)} Menit</strong></span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/65 dark:border-slate-800/80 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer select-none"
                title="Cetak Halaman Akademik Ini"
                aria-label="Cetak Halaman Akademik Ini"
              >
                <Printer className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                <span>Cetak Akademik</span>
              </button>
            </div>
            
            {/* 1. Kurikulum Merdeka */}
            {subPath === "akademik_kurikulum" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="font-bold text-lg text-slate-900">Kurikulum Merdeka Integratif Modern</h3>
                <p>MIN Singkawang bangga menerapkan <strong>Kurikulum Merdeka</strong> secara resmi sesuai keputusan standar nasional. Kami percaya bahwa setiap anak memiliki keunikan bakat kodrati. Model pengajaran kami dirancang fleksibel guna memberikan ruang eksplorasi kreativitas yang mendalam tanpa menegasikan penempaan fundamental karakter agamis.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 font-sans">
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100/60">
                    <h4 className="font-extrabold text-xs text-emerald-900 mb-2 uppercase">Intrakurikuler</h4>
                    <p className="text-[11px] text-emerald-950">Fokus pada konsep esensial literasi sains, numerasi matematika, serta penguasaan bahasa arab dan studi kitab fardu dasar agama.</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200/60">
                    <h4 className="font-extrabold text-xs text-amber-900 mb-2 uppercase">Kokurikuler (P5RA)</h4>
                    <p className="text-[11px] text-amber-950">Projek kolaboratif lintas mata pelajaran guna menginduksi kepedulian ekologi hidup berkelanjutan and budi pekerti moderasi santun.</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="font-extrabold text-xs text-blue-900 mb-2 uppercase">Ekstrakurikuler</h4>
                    <p className="text-[11px] text-blue-950">Inkubasi penyaluran hobi, olah raga, bela diri pramuka penggalang, and club olimpiade untuk bersaing tingkat propinsi.</p>
                  </div>
                </div>

                <p>Melalui implementasi digital di kelas, guru-guru kami memanfaatkan video visual pembelajaran interaktif sehingga suasana belajar terasa menyenangkan, merangsang rasa kepintaran bertanya, and ramah terhadap perkembangan kognitif emosional anak usia dasar.</p>
              </div>
            )}

            {/* 2. Kalender Akademik */}
            {subPath === "akademik_kalender" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-slate-900 text-lg font-bold mb-2">Kalender Akademik & Agenda Kegiatan</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Telusuri secara visual agenda bulanan terpadu MIN Singkawang. Anda dapat menyaring agenda berdasarkan kategori kegiatan, ujian berbasis komputer (CBT), serta hari libur nasional keagamaan.
                  </p>
                </div>

                {/* Monthly Visual Interactive Calendar */}
                <div id="visual_academic_calendar_wrapper" className="border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs">
                  <EventCalendar initialEvents={events} />
                </div>

                {/* Big Picture Semester Plan */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-slate-900 text-sm font-extrabold mb-1 uppercase tracking-tight">Garis Besar Agenda Semester Ganjil</h4>
                  <p className="text-[11px] text-slate-450 font-sans mb-4">
                    Ikhtisar kronologis agenda rujukan kepala madrasah, kementerian agama kota, dan dewan komite sekolah:
                  </p>
                  
                  <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
                    {agendaKalender.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-150 last:border-0 hover:bg-slate-50/50 transition-colors font-sans p-4 text-xs">
                        <div className="font-extrabold text-emerald-800 tracking-wider mb-1 md:mb-0 md:col-span-1">{item.bulan}</div>
                        <div className="text-slate-600 md:col-span-3 leading-relaxed font-medium">{item.agenda}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Projek P5RA */}
            {subPath === "akademik_p5ra" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-2">Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin (P5RA)</h3>
                <p>P5RA adalah pilar penentu jati diri lulusan madrasah di era disosiasi modern. Program ini dirancang kementerian agama untuk menyeimbangkan wawasan kebinekaan pancasila dengan keluhuran falsafah <em>Rahmatan lil 'Alamin</em> (menebar damai kasih sayang sekalian alam semesta).</p>
                
                <div className="bg-slate-50 rounded-2xl p-6.5 border border-slate-100 my-6">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">PROGRAM UNGGULAN SEMESTER INI :</span>
                  <h4 className="text-slate-900 font-extrabold text-sm mb-2">Green Entrepreneurship - Bazar Hidroponik Islami</h4>
                  <p className="mb-4">Para siswa diajak bercocok tanam pipa air hidroponik berkelanjutan, menguji pH nutrisi air secara berkala, memanen, and menjual hasil sayuran kepada komite wali murid. Menggabungkan kemandirian berniaga Islami dengan kepedulian krisis pangan.</p>
                  <button 
                    onClick={() => onNavigate('berita')}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Saksikan Dokumentasi Bazar P5RA <Award className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Ekstrakurikuler */}
            {subPath === "akademik_ekstra" && (
              <div className="space-y-6">
                <h3 className="text-slate-900 text-lg font-bold">Pilihan Ekstrakurikuler Peminatan Siswa</h3>
                <p className="text-xs text-slate-500 font-sans">Melalui bimbingan langsung para pelatih ahli kesiswaan, kami melayani sediaan ruang gerak penjelajahan bakat non-akademis:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {ekskulList.map((ekskul, idx) => (
                    <div key={idx} className="bg-slate-50 border rounded-xl p-5 flex gap-4 text-left hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 font-bold">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-bold text-xs">{ekskul.nama}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1.5">{ekskul.deskripsi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Perpustakaan */}
            {subPath === "akademik_perpus" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Perpustakaan Baitul Hikmah Digital</h3>
                <div className="relative h-56 bg-slate-100 rounded-2xl overflow-hidden mb-6">
                  <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800" alt="Baitul Hikmah Library" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                </div>
                <p>Nama <strong>Baitul Hikmah</strong> kami sematkan sebagai inspirasi mercusuar keilmuan peradaban islam di Baghdad dahulu. Perpustakaan MIN Singkawang bukan sekadar tumpukan kertas kaku biasa; ini adalah wadah berdiskusi interaktif, mendengarkan storytelling guru lewat proyektor pintar, and mengunduh ebook referensi di tablet madrasah.</p>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100/60 my-6 text-emerald-950 font-sans">
                  <h4 className="font-extrabold text-xs text-emerald-900 mb-2 uppercase">Layanan Unggulan Perpus:</h4>
                  <ul className="text-xs space-y-2 list-disc pl-4">
                    <li>Koleksi 4.000+ Judul Buku Cerita, Ilmu Pengetahuan, Sastra Anak Islami</li>
                    <li>Sertifikasi e-Library Kementerian Terkoneksi</li>
                    <li>Penghargaan "Raja & Ratu Literasi" untuk Peminjam Buku Tersering</li>
                    <li>Ruang Membaca Ber-AC Nyaman & Bebas Gangguan Kebisingan</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
