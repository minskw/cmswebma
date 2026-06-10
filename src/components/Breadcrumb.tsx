import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  selectedPost?: { title: string } | null;
}

export default function Breadcrumb({ currentPath, onNavigate, selectedPost }: BreadcrumbProps) {
  // If we are on home page, do not render breadcrumbs
  if (currentPath === 'home') return null;

  // Let's analyze path structure
  const items: Array<{ label: string; path?: string }> = [
    { label: 'Beranda', path: 'home' }
  ];

  // Helper mappings
  const profilLabels: Record<string, string> = {
    profil_sambutan: 'Sambutan Kepala Madrasah',
    profil_singkat: 'Profil Singkat',
    profil_sejarah: 'Sejarah Madrasah',
    profil_visi_misi: 'Visi dan Misi',
    profil_tujuan: 'Tujuan Madrasah',
    profil_organisasi: 'Struktur Organisasi',
    profil_gtk: 'Data GTK (Guru & Staff)',
    profil_sarana: 'Sarana & Prasarana',
    profil_akreditasi: 'Akreditasi Resmi',
    profil_prestasi: 'Prestasi Madrasah',
    profil_unggulan: 'Program Unggulan',
    profil_kontak: 'Hubungi Kontak'
  };

  const akademikLabels: Record<string, string> = {
    akademik_kurikulum: 'Kurikulum Merdeka',
    akademik_kalender: 'Kalender Akademik',
    akademik_p5ra: 'Projek P5RA Islami',
    akademik_ekstra: 'Ekstrakurikuler Siswa',
    akademik_perpus: 'Perpustakaan Digital'
  };

  const kesiswaanLabels: Record<string, string> = {
    kesiswaan_kegiatan: 'Kegiatan Harian Siswa',
    kesiswaan_prestasi: 'Prestasi Unggul Siswa',
    kesiswaan_organisasi: 'Organisasi Siswa (OSIM)'
  };

  // Build breadcrumb items based on path hierarchy
  if (currentPath.startsWith('profil_')) {
    items.push({ label: 'Profil Madrasah', path: 'profil_singkat' });
    const subLabel = profilLabels[currentPath] || 'Detail Profil';
    items.push({ label: subLabel });
  } else if (currentPath.startsWith('akademik_')) {
    items.push({ label: 'Akademik', path: 'akademik_kurikulum' });
    const subLabel = akademikLabels[currentPath] || 'Detail Akademik';
    items.push({ label: subLabel });
  } else if (currentPath.startsWith('kesiswaan_')) {
    items.push({ label: 'Kesiswaan', path: 'kesiswaan_kegiatan' });
    const subLabel = kesiswaanLabels[currentPath] || 'Detail Kesiswaan';
    items.push({ label: subLabel });
  } else if (currentPath === 'berita') {
    items.push({ label: 'Berita & Pengumuman', path: selectedPost ? 'berita' : undefined });
    if (selectedPost) {
      // Truncate title if it is too long for breadcrumb display
      const truncatedTitle = selectedPost.title.length > 40 
        ? selectedPost.title.substring(0, 37) + '...' 
        : selectedPost.title;
      items.push({ label: truncatedTitle });
    }
  } else if (currentPath === 'galeri') {
    items.push({ label: 'Galeri Foto & Video' });
  } else if (currentPath === 'download') {
    items.push({ label: 'Pusat Unduhan Dokumen' });
  } else if (currentPath === 'cms') {
    items.push({ label: 'CMS Admin Portal' });
  } else {
    // Fallback for general paths
    const formattedLabel = currentPath
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    items.push({ label: formattedLabel });
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-white border-b border-slate-100/80 shadow-xs py-3 px-4 md:px-8 font-sans"
      id="dynamic_breadcrumb_nav"
    >
      <div className="max-w-7xl mx-auto flex items-center">
        <ol 
          className="flex flex-wrap items-center gap-1.5 md:gap-2.5 text-slate-500 text-[11px] font-medium uppercase tracking-wide"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li 
                key={index} 
                className="flex items-center gap-1.5 md:gap-2.5"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350 shrink-0" aria-hidden="true" />
                )}
                
                {isLast ? (
                  <>
                    <span 
                      className="text-emerald-800 font-bold max-w-[200px] md:max-w-[400px] truncate animate-fade-in"
                      itemProp="name"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                    <meta itemProp="item" content={item.path ? `${window.location.origin}/#${item.path}` : window.location.origin} />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => item.path && onNavigate(item.path)}
                      className={`flex items-center gap-1 hover:text-emerald-700 transition-colors focus:outline-none cursor-pointer border-0 bg-transparent p-0 text-left font-medium ${
                        index === 0 ? 'text-slate-400' : 'text-slate-500'
                      }`}
                      type="button"
                    >
                      {index === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
                      <span>{item.label}</span>
                    </button>
                    <meta itemProp="item" content={item.path ? `${window.location.origin}/#${item.path}` : window.location.origin} />
                    <meta itemProp="name" content={item.label} />
                  </>
                )}
                
                <meta itemProp="position" content={(index + 1).toString()} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
