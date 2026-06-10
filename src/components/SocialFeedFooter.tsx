/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Instagram, Facebook, Heart, MessageCircle, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook';
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  permalink: string;
}

const mockInstagramFeed: SocialPost[] = [
  {
    id: 'ig_1',
    platform: 'instagram',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400',
    caption: 'Alhamdulillah, siswa-siswi MIN Singkawang menorehkan prestasi gemilang dalam ajang Olimpiade Sains Sains Nasional! 🥇🏆 #MINSKW #MadrasahHebat #SiswaBerprestasi',
    likes: 124,
    comments: 18,
    date: '2 Hari yang lalu',
    permalink: 'https://instagram.com'
  },
  {
    id: 'ig_2',
    platform: 'instagram',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400',
    caption: 'Keseruan kegiatan Projek Penguatan Profil Pelajar Pancasila dan Profil Pelajar Rahmatan Lil Alamin (P5RA) pekan ini. Kreativitas tanpa batas! 🎨🌱 #P5RA #KurikulumMerdeka',
    likes: 98,
    comments: 12,
    date: '3 Hari yang lalu',
    permalink: 'https://instagram.com'
  },
  {
    id: 'ig_3',
    platform: 'instagram',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    caption: 'Pembiasaan karakter baik sejak dini: Shalat Dhuha berjamaah dan tadarus pagi di Masjid MIN Singkawang. Semoga berkah untuk mengawali kegiatan belajar. 🕌✨ #KarakterMulia #Religius',
    likes: 156,
    comments: 24,
    date: '5 Hari yang lalu',
    permalink: 'https://instagram.com'
  },
  {
    id: 'ig_4',
    platform: 'instagram',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
    caption: 'Rapat koordinasi komite madrasah bersama wali murid kelas VI bahasan persiapan asesmen akhir semester dan program pembekalan lanjutan. 📝🤝 #SinergiWali #MINSingkawang',
    likes: 84,
    comments: 6,
    date: '1 Pekan yang lalu',
    permalink: 'https://instagram.com'
  }
];

const mockFacebookFeed: SocialPost[] = [
  {
    id: 'fb_1',
    platform: 'facebook',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400',
    caption: 'Pemberitahuan Resmi: Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran Baru resmi dibuka secara online. Mari bergabung bersama keluarga besar MIN Singkawang! Hubungi kontak admin untuk berkas prasyarat.',
    likes: 210,
    comments: 45,
    date: '1 Hari yang lalu',
    permalink: 'https://facebook.com'
  },
  {
    id: 'fb_2',
    platform: 'facebook',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400',
    caption: 'Kegiatan Sosialisasi Literasi Perpustakaan Keliling bekerja sama dengan Dinas Kearsipan & Perpustakaan Daerah Singkawang. Tingkatkan minat baca anak-anak bangsa! 📚🇮🇩',
    likes: 142,
    comments: 29,
    date: '4 Hari yang lalu',
    permalink: 'https://facebook.com'
  },
  {
    id: 'fb_3',
    platform: 'facebook',
    imageUrl: 'https://images.unsplash.com/photo-1590075865003-e48277fda558?auto=format&fit=crop&q=80&w=400',
    caption: 'Pelatihan guru madrasah dalam pemanfaatan Smart Board dan metode pembelajaran berbasis ICT interaktif untuk mewujudkan Digital Madrasah 4.0. Semangat mengabdi bapak/ibu guru!',
    likes: 189,
    comments: 31,
    date: '1 Pekan yang lalu',
    permalink: 'https://facebook.com'
  },
  {
    id: 'fb_4',
    platform: 'facebook',
    imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=400',
    caption: 'Selamat Hari Pendidikan Nasional! Bersama-sama mendidik tunas bangsa dengan penuh cinta kasih, membekali iman, takwa, dan ilmu pengetahuan guna menyongsong Indonesia Emas. 🎓🕊️',
    likes: 245,
    comments: 52,
    date: '2 Pekan yang lalu',
    permalink: 'https://facebook.com'
  }
];

export default function SocialFeedFooter() {
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedState, setFeedState] = useState<SocialPost[]>(mockInstagramFeed);

  const handlePlatformChange = (newPlatform: 'instagram' | 'facebook') => {
    setPlatform(newPlatform);
    setFeedState(newPlatform === 'instagram' ? mockInstagramFeed : mockFacebookFeed);
  };

  const handleRefreshSimulated = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  };

  return (
    <div className="w-full bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 mb-12" id="social_media_feed_section">
      {/* Feed Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="text-left">
          <span className="text-[10px] text-emerald-450 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Updates Feed
          </span>
          <h3 className="text-white text-sm md:text-base font-black uppercase mt-1 tracking-wide">
            Sorotan Media Sosial Madrasah
          </h3>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
            Dokumentasi instan agenda aktivitas, pengumuman seremonial, & prestasi siswa terintegrasi secara dinamis.
          </p>
        </div>

        {/* Buttons and switches */}
        <div className="flex items-center gap-2 self-start sm:self-center select-none">
          <div className="inline-flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[10px] font-black uppercase">
            <button
              onClick={() => handlePlatformChange('instagram')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                platform === 'instagram'
                  ? 'bg-[#E1306C] text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 shrink-0" />
              Instagram
            </button>
            <button
              onClick={() => handlePlatformChange('facebook')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                platform === 'facebook'
                  ? 'bg-[#1877F2] text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Facebook className="w-3.5 h-3.5 shrink-0" />
              Facebook
            </button>
          </div>

          <button
            onClick={handleRefreshSimulated}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
            title="Saran Sinkronisasi Ulang API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Social post feed grid map */}
      {isRefreshing ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 text-center text-slate-500 text-xs">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square bg-slate-900/40 rounded-xl animate-pulse flex items-center justify-center border border-slate-800/40">
              <span className="text-[10px] text-slate-600 font-extrabold font-mono uppercase">Fetching api...</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          {feedState.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square bg-slate-900 border border-slate-850 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image with fallbacks */}
              <img
                src={post.imageUrl}
                alt={`Social media image MIN ${post.id}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Black background visual opacity overlay mask */}
              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-left">
                {/* Meta platform info header row */}
                <div className="flex items-center justify-between text-slate-400 text-[9px] font-semibold">
                  <span className="flex items-center gap-1">
                    {post.platform === 'instagram' ? (
                      <Instagram className="w-3 h-3 text-[#E1306C]" />
                    ) : (
                      <Facebook className="w-3 h-3 text-[#1877F2]" />
                    )}
                    @min_singkawang
                  </span>
                  <span>{post.date}</span>
                </div>

                {/* Excerpt Caption summary string */}
                <p className="text-[10px] text-slate-200 line-clamp-4 leading-medium font-medium mt-1">
                  {post.caption}
                </p>

                {/* Micro metrics response labels */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 shrink-0">
                  <div className="flex gap-2.5 items-center select-none">
                    <span className="flex items-center gap-1.5 text-[10px] text-rose-500 font-extrabold font-mono">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-extrabold font-mono">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                  
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-slate-800 hover:bg-emerald-800 text-slate-300 hover:text-white transition-all"
                    title="Buka Post Original"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Integration placeholder status alert warning block */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
        <div className="flex items-center gap-2.5 text-left">
          <div className="p-1.5 rounded-lg bg-emerald-900/20 border border-emerald-800/30">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
              Struktur API Siap Kait (Graph API & Instagram Display API)
            </p>
            <p className="text-[9px] text-slate-450 leading-tight">
              Kanal terstruktur menggunakan token Instagram-Display-API. Dapat diubah ke mode live dinamis dengan mengisi isian Client Token di panel Pengaturan Pengembang madrasah.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            alert('Petunjuk Integrasi API:\n\n1. Daftarkan Facebook App di Meta Developer Console.\n2. Tambahkan produk "Instagram Basic Display API" atau "Graph API".\n3. Simpan App ID dan App Secret ke variabel .env PROD.\n4. Alirkan token akses jangka panjang ke pengontrol backend server via cron job.');
          }}
          className="px-2.5 py-1 text-[9px] bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold uppercase rounded border border-slate-700/50 cursor-pointer self-start md:self-center transition-colors select-none"
        >
          Lihat Petunjuk Integrasi
        </button>
      </div>
    </div>
  );
}
