/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, ShieldCheck, Award, BookOpen } from 'lucide-react';

interface AuthorBioProps {
  authorName: string;
}

interface AuthorProfile {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  email?: string;
  badge?: string;
}

// Preset catalog of MIN Singkawang educators and contributors
const AUTHOR_CATALOG: Record<string, AuthorProfile> = {
  "Ahmad Subagio, S.Pd.": {
    name: "Ahmad Subagio, S.Pd.",
    role: "Waka Kesiswaan & Pendidik Kelas Tinggi",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    bio: "Mengabdi sejak tahun 2012 di MIN Singkawang. Berfokus pada pembinaan karakter unggul, kedisiplinan siswa, dan pengembangan bakat kepemimpinan melalui organisasi ekstra kurikuler madrasah.",
    email: "ahmad.subagio@kemenag.go.id",
    badge: "Waka Kesiswaan"
  },
  "Nurhasanah, S.Pd.I.": {
    name: "Nurhasanah, S.Pd.I.",
    role: "Pendidik Al-Qur'an Hadits & Pembimbing Komunitis Keagamaan",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    bio: "Berkomitmen tinggi dalam merancang pengajaran ilmu agama Islam yang ramah anak dan adaptif. Pembina aktif bimbingan khusus Tahfidzul Qur’an tingkat dasar.",
    email: "nurhasanah@kemenag.go.id",
    badge: "Guru Pengembang Keagamaan"
  },
  "Siti Rahmawati, M.Pd.": {
    name: "Siti Rahmawati, M.Pd.",
    role: "Waka Akademik & Penanggung Jawab Kurikulum Merdeka",
    avatarUrl: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=150",
    bio: "Pakar strategi pembelajaran interaktif berorientasi profil P5RA. Mengawal standardisasi e-Rapor dan integrasi perangkat literasi digital di lingkungan kelas pintar.",
    email: "siti.rahmawati@kemenag.go.id",
    badge: "Waka Akademik"
  },
  "Suryadi, S.H.": {
    name: "Suryadi, S.H.",
    role: "Kepala Urusan Tata Usaha & Pranata Humas Madrasah",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    bio: "Humas berdedikasi yang mengoordinasikan arus informasi publik, hubungan kemitraan, keamanan arsip rilis media, serta optimalisasi server portal terpadu madrasah.",
    email: "suryadi.tu@kemenag.go.id",
    badge: "Pranata Humas"
  }
};

export default function AuthorBio({ authorName }: AuthorBioProps) {
  // Normalize checking name to accommodate slight typo or formatting variations
  const key = Object.keys(AUTHOR_CATALOG).find(
    (k) => k.toLowerCase() === authorName?.trim().toLowerCase()
  );

  const profile: AuthorProfile = key ? AUTHOR_CATALOG[key] : {
    name: authorName || "Humas MIN Singkawang",
    role: "Staf Redaksi & Pengembang Literasi Digital",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    bio: "Pendidik dan kontributor aktif dalam penyebaran literasi digital, warta madrasah, serta dokumentasi kegiatan belajar mengajar guna kemajuan siswa MIN Singkawang.",
    email: "humas.minsingkawang@gmail.com",
    badge: "Kontributor Berita"
  };

  return (
    <div 
      className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xs group text-left"
      id="article_author_bio"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5">
        {/* Rounded Profile Picture Frame */}
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-emerald-600/30 dark:border-emerald-500/40 shadow-md group-hover:scale-105 transition-transform duration-300 bg-slate-200">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <span 
            className="absolute -bottom-0.5 -right-0.5 p-1 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full shadow-xs border-2 border-white dark:border-slate-900 flex items-center justify-center"
            title="Penulis Terverifikasi"
          >
            <ShieldCheck className="w-3 h-3" />
          </span>
        </div>

        {/* Text information body */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
            <h4 className="text-sm md:text-base font-black text-slate-950 dark:text-white tracking-tight">
              {profile.name}
            </h4>
            {profile.badge && (
              <span className="inline-flex self-center sm:self-auto items-center gap-1 uppercase tracking-wider text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-800/30">
                <Award className="w-2.5 h-2.5" />
                {profile.badge}
              </span>
            )}
          </div>

          <p className="text-[10px] md:text-xs font-extrabold text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {profile.role}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-2.5 max-w-2xl font-medium">
            {profile.bio}
          </p>

          {profile.email && (
            <div className="mt-3.5 flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
              <span>{profile.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
