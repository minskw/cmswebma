/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolSettings } from '../types';
import { Mail, Phone, MapPin, Globe, Facebook, Instagram, Youtube, Award, ShieldAlert } from 'lucide-react';
import SocialFeedFooter from './SocialFeedFooter';

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (path: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  const sitemapSections = [
    {
      title: "Profil Madrasah",
      items: [
        { label: "Sambutan Kepala", path: "profil_sambutan", desc: "Amanah Kepala Madrasah" },
        { label: "Profil & Sejarah", path: "profil_singkat", desc: "Latar sejarah dan pendirian" },
        { label: "Visi, Misi & Tujuan", path: "profil_visi_misi", desc: "Target & fokus pendidikan" },
        { label: "Struktur Organisasi", path: "profil_organisasi", desc: "Susunan pengurus & komite" },
        { label: "Pendidik & GTK", path: "profil_gtk", desc: "Database guru & kependidikan" },
      ]
    },
    {
      title: "Akademik & Projek",
      items: [
        { label: "Kurikulum Merdeka", path: "akademik_kurikulum", desc: "Sistem pengajaran modern" },
        { label: "Kalender Pendidikan", path: "akademik_kalender", desc: "Agenda & jadwal belajar harian" },
        { label: "Projek P5RA Islami", path: "akademik_p5ra", desc: "Karakter rahmatan lil alamin" },
        { label: "Ekstrakurikuler", path: "akademik_ekstra", desc: "Wadah minat & bakat siswa" },
        { label: "Perpustakaan Digital", path: "akademik_perpus", desc: "E-buku & materi bacaan siswa" },
      ]
    },
    {
      title: "Kesiswaan & Sarana",
      items: [
        { label: "Aktivitas Harian", path: "kesiswaan_kegiatan", desc: "Pembiasaan ibadah & karakter" },
        { label: "Prestasi Unggul", path: "profil_prestasi", desc: "Capaian emas di ragam ajang" },
        { label: "Organisasi OSIM", path: "kesiswaan_organisasi", desc: "Kader kepemimpinan mandiri" },
        { label: "Sarana & Prasarana", path: "profil_sarana", desc: "Fasilitas & kelas interaktif" },
        { label: "Akreditasi BAN-SM", path: "profil_akreditasi", desc: "Status & sertifikat resmi" },
      ]
    },
    {
      title: "Informasi & Layanan",
      items: [
        { label: "Kabar Berita Terbaru", path: "berita", desc: "Pengumuman dan info prestasi" },
        { label: "Galeri Foto Kegiatan", path: "galeri", desc: "Dokumentasi aktivitas siswa" },
        { label: "Pusat Unduhan PDF", path: "download", desc: "Formulir, SK & berkas penting" },
        { label: "Hubungi Kontak Kami", path: "profil_kontak", desc: "Akses peta lokasi & layanan" },
        { label: "Program Unggulan", path: "profil_unggulan", desc: "Riset, tahfidz & kelas digital" },
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans tracking-tight border-t-4 border-emerald-700 pt-16 pb-8" id="school_footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Dynamic Social Media Feed Teaser Widget */}
        <SocialFeedFooter />
        
        {/* Top Header Module: Branding & Direct Contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Main Institution Info (Spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png" 
                alt="Logo Kemenag" 
                className="w-11 h-11 object-contain shrink-0"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div>
                <h3 className="text-white text-base font-extrabold uppercase tracking-wide leading-tight">
                  MIN Singkawang
                </h3>
                <p className="text-[10px] text-emerald-400 font-bold tracking-wide">
                  Madrasah Ibtidaiyah Negeri Singkawang
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed max-w-md">
              Penyelenggara pendidikan dasar umum berciri khas Islam rujukan dengan status Negeri di bawah binaan Kementerian Agama RI yang unggul, kompetitif, ramah anak, dan berwawasan lingkungan hidup.
            </p>
            
            {/* Accreditation Badge */}
            <div className="mt-2 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 max-w-xs">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block">STATUS AKREDITASI</span>
                <h4 className="text-xs font-black text-white tracking-wide">TERAKREDITASI A (UNGGUL)</h4>
                <p className="text-[9px] text-slate-400 leading-tight mt-0.5 mt-0.5">{settings.accreditation_number}</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-0.5">Penilaian BAN-SM: {settings.accreditation_score}</p>
              </div>
            </div>
          </div>

          {/* Quick Contact & Map Access (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-left">
            <h4 className="text-white text-xs font-black tracking-wider uppercase border-b border-slate-850 pb-2">
              LOKASI & RESPONS CEPAT
            </h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.contact_address}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hotline: {settings.contact_phone}</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>E-mail: {settings.contact_email}</span>
              </div>
            </div>
          </div>

          {/* Connected Social Channels Channel (Spans 3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-[11px] text-left">
            <h4 className="text-white text-xs font-black tracking-wider uppercase border-b border-slate-850 pb-2">
              SALURAN MEDIA SOSIAL
            </h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              Ikuti kabar perkembangan madrasah dan agenda belajar harian siswa murni lewat kanal resmi kami:
            </p>
            <div className="flex gap-3 pt-1">
              {settings.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200 text-slate-400 hover:scale-105"
                  title="Facebook MIN Singkawang"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-linear-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white flex items-center justify-center transition-all duration-200 text-slate-400 hover:scale-105"
                  title="Instagram Resmi MIN Singkawang"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_youtube && (
                <a 
                  href={settings.social_youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-200 text-slate-400 hover:scale-105"
                  title="Kanal Resmi YouTube Madrasah"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Dynamic Sitemap Tree Map (Spans full width, 4 column grid for high SEO and Internal crawl) */}
        <div className="py-12 border-b border-slate-805/60 grid grid-cols-2 md:grid-cols-4 gap-8">
          {sitemapSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4 text-left">
              <h4 className="text-white text-xs font-black tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.items.map((node, nodeIdx) => (
                  <li key={nodeIdx} className="group/node">
                    <button
                      type="button"
                      onClick={() => onNavigate(node.path)}
                      className="w-full text-left bg-transparent border-0 p-0 text-slate-400 hover:text-emerald-450 dark:hover:text-amber-400 cursor-pointer transition-colors duration-150 flex flex-col focus:outline-hidden"
                      title={`Kunjungi halaman ${node.label}`}
                    >
                      <span className="text-[12px] font-bold group-hover/node:translate-x-1 transition-transform duration-150 inline-flex items-center gap-1">
                        {node.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        {node.desc}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Embedded Maps Row & Small Footer Credits */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-4 flex flex-col md:flex-row gap-6 justify-between items-center text-xs text-slate-500">
        <div className="text-center md:text-left">
          <button 
            type="button"
            onClick={() => onNavigate('cms')} 
            className="text-center md:text-left bg-transparent border-0 hover:text-[#fbbf24] text-slate-500 cursor-pointer transition-colors focus:outline-hidden p-0 font-sans text-xs"
            title="Sistem Manajemen Madrasah"
          >
            © {new Date().getFullYear()} MIN Singkawang. Hak Cipta Dilindungi Undang-Undang.
          </button>
          <p className="text-[10px] mt-0.5">Sistem Portal Terpadu Madrasah Digital Modern</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] justify-center md:justify-end">
          <span className="text-emerald-500 font-semibold">ISO 9001:2015 Certified</span>
          <span>•</span>
          <span className="text-slate-400">Portal Resmi Terpadu</span>
        </div>
      </div>
    </footer>
  );
}
