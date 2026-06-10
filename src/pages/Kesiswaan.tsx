/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Calendar, Trophy, Users, Award, BookOpen, Compass, ArrowUpRight, Clock, Printer } from 'lucide-react';
import { calculateReadingTime } from '../utils/readingTime';

interface KesiswaanProps {
  subPath: string; // "kesiswaan_kegiatan", "kesiswaan_prestasi", "kesiswaan_organisasi", "kesiswaan_ppdb"
  onNavigate: (path: string) => void;
}

function getKesiswaanReadingTime(subPath: string): number {
  let content = "";
  switch(subPath) {
    case "kesiswaan_kegiatan":
      content = "Agenda Pembiasaan Harian Siswa Pembentukan akhlak karimah tidak bisa diajarkan lewat teori semata, melainkan butuh komitmen pembiasaan harian yang ditaati bersama. Berikut alur ritual pembiasaan pagi madrasah kami sebelum asupan kognitif kelas dibuka Doa Bersama Asmaul Husna Shalat Dhuha Berjamaah Literasi Tadarus Al-Quran Pembelajaran Efektif Smart Selain penekanan keagamaan, kami mengasuh ketangkasan fisik. Siswa dilatih berani bersosialisasi lewat mading kelas, pementasan drama kepahlawanan Islami, and upacara bendera merah putih disiplin setiap hari senin.";
      break;
    case "kesiswaan_prestasi":
      content = "Gerbang Prestasi Kejuaraan Siswa Setiap medali yang berkilau adalah tetes keringat latihan keras dan untaian doa guru wali asuh yang tulus ikhlas. Berikut rangkuman kehormatan medali madrasah dalam satu periode ajaran terakhir Kompetisi Sains Madrasah KSM Matematika Terintegrasi Dimenangkan oleh ananda Muhammad Fatih Al-Ayubi perwakilan kontingen Kalimantan Barat Musabaqah Hifdzil Quran MHQ 1 Juz Tartil Kategori Anak Disabet oleh ananda Aisyah Humaira dalam festival FASI daerah ke XII Olimpiade Olahraga Siswa Nasional O2SN Bulutangkis Tunggal Putra Diraih oleh ananda Rian Hidayat setelah penyisihan ketat 6 pertandingan berturut.";
      break;
    case "kesiswaan_organisasi":
      content = "Organisasi Siswa Intra Madrasah OSIM OSIM adalah laboratorium kepemimpinan perdana anak madrasah. Melalui kepengurusan OSIM, kami membiasakan nilai-nilai kebersamaan jujur, toleransi mendengarkan pendapat orang lain, tata cara memimpin rapat, menyusun anggaran program kemanusiaan, serta dinamika pemilihan umum raya secara rukun damai Kabinet Pengurus OSIM Periode 2025 2026 Ketua OSIM Zaki Al-Mubarak Wakil Ketua Nayla Ramadhani Sekretaris Rizqi Pratama Bendahara Umum Safira Humaira Setiap tahunnya, OSIM memelopori pengumpulan derma infak bencana alam, pementasan kreasi milad madrasah, kerja bakti bersih pantai Singkawang, serta mengoordinasi ketertiban antrean sholat dhuha berjamaah.";
      break;
    default:
      content = "Kesiswaan Madrasah";
  }
  return calculateReadingTime(content);
}

export default function Kesiswaan({ subPath, onNavigate }: KesiswaanProps) {

  const sidebarMenuItems = [
    { label: "Kegiatan Harian Siswa", path: "kesiswaan_kegiatan" },
    { label: "Prestasi Unggul Siswa", path: "kesiswaan_prestasi" },
    { label: "Organisasi Siswa (OSIM)", path: "kesiswaan_organisasi" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans tracking-tight" id="kesiswaan_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Banner header top section */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">KESISWAAN</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">
            {sidebarMenuItems.find(i => i.path === subPath)?.label || "Informasi Kesiswaan"}
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Mewujudkan wadah aktualisasi diri, kepemimpinan demokratis organisasi osim, serta perkembangan prestasi yang unggul.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Menu Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs sticky top-32">
              <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider px-3 pb-3 mb-3 border-b border-slate-100 text-left">
                Kategori Kesiswaan
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

           {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Estimasi Waktu Baca: <strong className="text-slate-700 dark:text-slate-350 font-extrabold">{getKesiswaanReadingTime(subPath)} Menit</strong></span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print flex items-center gap-1.5 text-[10px] uppercase font-black text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/65 dark:border-slate-800/80 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer select-none"
                title="Cetak Halaman Kesiswaan Ini"
                aria-label="Cetak Halaman Kesiswaan Ini"
              >
                <Printer className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                <span>Cetak Kesiswaan</span>
              </button>
            </div>
            
            {/* 1. Kegiatan Siswa */}
            {subPath === "kesiswaan_kegiatan" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Agenda Pembiasaan Harian Siswa</h3>
                <p>Pembentukan akhlak karimah tidak bisa diajarkan lewat teori semata, melainkan butuh komitmen pembiasaan harian yang ditaati bersama. Berikut alur ritual pembiasaan pagi madrasah kami sebelum asupan kognitif kelas dibuka:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="p-4 bg-emerald-50 border border-emerald-100/60 rounded-xl">
                    <h4 className="font-extrabold text-xs text-emerald-900 mb-2">06:45 - Doa Bersama & Asmaul Husna</h4>
                    <p className="text-[11px] text-emerald-950">Berdiri rapi melantunkan dzikir pagi di halaman madrasah untuk menenteramkan emosi belajar anak.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100/60 rounded-xl">
                    <h4 className="font-extrabold text-xs text-emerald-900 mb-2">07:00 - Shalat Dhuha Berjamaah</h4>
                    <p className="text-[11px] text-emerald-950">Pembiasaan spiritualitas Sholat Dhuha harian bertempat di Masjid Al-Ikhlas didampingi asisten guru keagamaan.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <h4 className="font-extrabold text-xs text-slate-800 mb-2">07:15 - Literasi Tadarus Al-Qur'an</h4>
                    <p className="text-[11px]">Siswa membaca, melafadzkan, and menyimak mushaf Juz 30 didalam kelas dipandu guru kelas masing-masing.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <h4 className="font-extrabold text-xs text-slate-800 mb-2">07:30 - Pembelajaran Efektif Smart</h4>
                    <p className="text-[11px]">Akses utama kurikulum merdeka didukung media LCD Projector pintar and game sela edukasi menyenangkan.</p>
                  </div>
                </div>
                <p>Selain penekanan keagamaan, kami mengasuh ketangkasan fisik. Siswa dilatih berani bersosialisasi lewat mading kelas, pementasan drama kepahlawanan Islami, and upacara bendera merah putih disiplin setiap hari senin.</p>
              </div>
            )}

            {/* 2. Prestasi Siswa */}
            {subPath === "kesiswaan_prestasi" && (
              <div className="space-y-6">
                <h3 className="text-slate-900 text-lg font-bold">Gerbang Prestasi Kejuaraan Siswa</h3>
                <p className="text-xs text-slate-600 font-sans">Setiap medali yang berkilau adalah tetes keringat latihan keras dan untaian doa guru wali asuh yang tulus ikhlas. Berikut rangkuman kehormatan medali madrasah dalam satu periode ajaran terakhir:</p>
                
                <div className="space-y-4 mt-6">
                  <div className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                    <Trophy className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-left font-sans">
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded tracking-wide uppercase">JUARA 1 TINGKAT NASIONAL</span>
                      <h4 className="text-slate-900 font-bold text-xs mt-1">Kompetisi Sains Madrasah (KSM) - Matematika Terintegrasi 2025</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Dimenangkan oleh ananda Muhammad Fatih Al-Ayubi perwakilan kontingen Kalimantan Barat.</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                    <Trophy className="w-8 h-8 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-left font-sans">
                      <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded tracking-wide uppercase">JUARA UMUM PROVINSI</span>
                      <h4 className="text-slate-900 font-bold text-xs mt-1">Musabaqah Hifdzil Qur'an (MHQ) 1 Juz & Tartil Kategori Anak</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Disabet oleh ananda Aisyah Humaira dalam festival FASI daerah ke-XII.</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                    <Trophy className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-left font-sans">
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded tracking-wide uppercase">MEDALI PERAK NASIONAL</span>
                      <h4 className="text-slate-900 font-bold text-xs mt-1">Olimpiade Olahraga Siswa Nasional (O2SN) - Bulutangkis Tunggal Putra</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Diraih oleh ananda Rian Hidayat setelah penyisihan ketat 6 pertandingan berturut.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Organisasi Siswa */}
            {subPath === "kesiswaan_organisasi" && (
              <div className="space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                <h3 className="text-slate-900 text-lg font-bold mb-4">Organisasi Siswa Intra Madrasah (OSIM)</h3>
                <p>OSIM adalah laboratorium kepemimpinan perdana anak madrasah. Melalui kepengurusan OSIM, kami membiasakan nilai-nilai kebersamaan jujur, toleransi mendengarkan pendapat orang lain, tata cara memimpin rapat, menyusun anggaran program kemanusiaan, serta dinamika pemilihan umum raya secara rukun damai.</p>
                
                <div className="bg-slate-50 rounded-xl p-6.5 border border-slate-100 my-6">
                  <h4 className="text-slate-900 font-extrabold text-sm mb-2.5">Kabinet Pengurus OSIM Periode 2025/2026 :</h4>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex justify-between border-b pb-1">
                      <span className="font-bold text-slate-700">Ketua OSIM :</span>
                      <span className="text-emerald-800 font-semibold">Zaki Al-Mubarak (Kelas V-B)</span>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span className="font-bold text-slate-700">Wakil Ketua :</span>
                      <span className="text-emerald-800 font-semibold">Nayla Ramadhani (Kelas V-A)</span>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span className="font-bold text-slate-700">Sekretaris :</span>
                      <span className="text-slate-600">Rizqi Pratama (Kelas IV-A)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-bold text-slate-700">Bendahara Umum :</span>
                      <span className="text-slate-600">Safira Humaira (Kelas V-C)</span>
                    </li>
                  </ul>
                </div>
                 <p>Setiap tahunnya, OSIM memelopori pengumpulan derma infak bencana alam, pementasan kreasi milad madrasah, kerja bakti bersih pantai Singkawang, serta mengoordinasi ketertiban antrean sholat dhuha berjamaah.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
