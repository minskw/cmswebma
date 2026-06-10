import { useEffect } from 'react';
import { SchoolSettings, SeoSettings, Post, Program, Achievement, Event, Announcement } from '../types';

interface UseDynamicSeoProps {
  path: string;
  selectedPost: Post | null;
  settings: SchoolSettings;
  seo: SeoSettings;
  posts: Post[];
  programs: Program[];
  achievements: Achievement[];
  events?: Event[];
  announcements?: Announcement[];
}

export function useDynamicSeo({
  path,
  selectedPost,
  settings,
  seo,
  posts,
  programs,
  achievements,
  events = [],
  announcements = []
}: UseDynamicSeoProps) {
  useEffect(() => {
    let title = `${settings.school_name} - Islami, Unggul, Kompetitif`;
    let description = seo.description || settings.about_brief;
    let keywords = seo.keywords || 'MIN Singkawang, Madrasah Singkawang, PPDB MIN Singkawang, SD Islam Singkawang, Madrasah Ibtidaiyah Singkawang';
    let ogType = 'website';
    let ogImage = seo.og_image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200';
    
    // Normalize URL structures for SPA Hash routing so search consoles can index deep views
    const baseSiteUrl = window.location.origin;
    let currentUrl = baseSiteUrl;
    if (path !== 'home') {
      currentUrl = `${baseSiteUrl}/#${path}`;
    }
    if (path === 'berita' && selectedPost) {
      currentUrl = `${baseSiteUrl}/#berita?id=${selectedPost.id}`;
    }
    
    let jsonLdData: any = null;

    // Helper: Find or create meta tag
    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper: Find or create canonical rel link
    const updateCanonicalLink = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    // Helper: Find or create Schema JSON-LD script tag
    const updateJsonLd = (data: any) => {
      let element = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
      if (!element) {
        element = document.createElement('script');
        element.id = 'schema-jsonld';
        element.type = 'application/ld+json';
        document.head.appendChild(element);
      }
      element.textContent = JSON.stringify(data, null, 2);
    };

    // Define Default School Organization Schema.org JSON-LD
    const defaultSchoolSchema = {
      '@type': 'EducationalOrganization',
      '@id': `${baseSiteUrl}/#organization`,
      'name': settings.school_name,
      'alternateName': 'MIN Singkawang',
      'url': baseSiteUrl,
      'logo': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png',
      'description': settings.about_brief,
      'identifier': settings.npsn,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': settings.contact_address,
        'addressLocality': 'Singkawang',
        'addressRegion': 'Kalimantan Barat',
        'postalCode': '79111',
        'addressCountry': 'ID'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': settings.contact_phone,
        'contactType': 'Prasarana Informasi Madrasah',
        'email': settings.contact_email
      },
      'sameAs': [
        settings.social_facebook || '',
        settings.social_instagram || '',
        settings.social_youtube || ''
      ].filter(link => link !== '')
    };

    // Helper: Generate dynamic BreadcrumbList Schema.org JSON-LD
    const getBreadcrumbSchema = () => {
      const items = [{ '@type': 'ListItem', 'position': 1, 'name': 'Beranda', 'item': `${baseSiteUrl}/` }];
      
      const profilLabels: Record<string, string> = {
        profil_sambutan: 'Sambutan Kepala',
        profil_singkat: 'Selayang Pandang',
        profil_sejarah: 'Sejarah Lembaga',
        profil_visi_misi: 'Visi dan Misi',
        profil_tujuan: 'Tujuan Strategis',
        profil_organisasi: 'Struktur Organisasi',
        profil_gtk: 'Profil GTK',
        profil_sarana: 'Sarana & Prasarana',
        profil_akreditasi: 'Akreditasi',
        profil_prestasi: 'Prestasi',
        profil_unggulan: 'Program Unggulan',
        profil_kontak: 'Hubungi Kontak'
      };

      if (path.startsWith('profil_')) {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Profil',
          'item': `${baseSiteUrl}/#profil_singkat`
        });
        items.push({
          '@type': 'ListItem',
          'position': 3,
          'name': profilLabels[path] || 'Detail Profil',
          'item': `${baseSiteUrl}/#${path}`
        });
      } else if (path.startsWith('akademik_')) {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Akademik',
          'item': `${baseSiteUrl}/#akademik_kurikulum`
        });
        const label = path === 'akademik_kurikulum' ? 'Kurikulum Merdeka' : 'Kalender Akademik';
        items.push({
          '@type': 'ListItem',
          'position': 3,
          'name': label,
          'item': `${baseSiteUrl}/#${path}`
        });
      } else if (path.startsWith('kesiswaan_')) {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Kesiswaan',
          'item': `${baseSiteUrl}/#kesiswaan_ekstrakurikuler`
        });
        const label = path === 'kesiswaan_ekstrakurikuler' ? 'Ekstrakurikuler' : 'Kreativitas';
        items.push({
          '@type': 'ListItem',
          'position': 3,
          'name': label,
          'item': `${baseSiteUrl}/#${path}`
        });
      } else if (path === 'berita') {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Berita & Pengumuman',
          'item': `${baseSiteUrl}/#berita`
        });
        if (selectedPost) {
          items.push({
            '@type': 'ListItem',
            'position': 3,
            'name': selectedPost.title,
            'item': `${baseSiteUrl}/#berita?id=${selectedPost.id}`
          });
        }
      } else if (path === 'galeri') {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Galeri Foto & Video',
          'item': `${baseSiteUrl}/#galeri`
        });
      } else if (path === 'download') {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'Pusat Unduhan',
          'item': `${baseSiteUrl}/#download`
        });
      } else if (path.startsWith('ppdb_')) {
        items.push({
          '@type': 'ListItem',
          'position': 2,
          'name': 'PPDB Penerimaan Santri Baru',
          'item': `${baseSiteUrl}/#ppdb_form`
        });
      }

      return {
        '@type': 'BreadcrumbList',
        'itemListElement': items
      };
    };

    // 1. HOME / BERANDA ROUTE
    if (path === 'home') {
      title = `${settings.school_name} - ${seo.title || 'Membangun Karakter Qurani'}`;
      description = seo.description || settings.about_brief;
      
      const eventSchemas = (events || []).slice(0, 5).map(evt => {
        const hasTime = evt.event_date && evt.event_time;
        return {
          '@type': 'Event',
          '@id': `${baseSiteUrl}/#home?event=${evt.id}`,
          'name': evt.title,
          'description': evt.description,
          'startDate': hasTime ? `${evt.event_date}T${evt.event_time}` : evt.event_date,
          'location': {
            '@type': 'Place',
            'name': evt.location || 'MIN Singkawang',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': settings.contact_address,
              'addressLocality': 'Singkawang',
              'addressRegion': 'Kalimantan Barat',
              'addressCountry': 'ID'
            }
          },
          'image': ogImage,
          'organizer': {
            '@type': 'EducationalOrganization',
            'name': evt.organizer || settings.school_name,
            'url': baseSiteUrl
          }
        };
      });

      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@context': 'https://schema.org',
            ...defaultSchoolSchema
          },
          {
            '@type': 'WebSite',
            '@id': `${baseSiteUrl}/#website`,
            'url': baseSiteUrl,
            'name': settings.school_name,
            'description': seo.description || settings.about_brief,
            'publisher': { '@id': `${baseSiteUrl}/#organization` }
          },
          ...eventSchemas
        ]
      };
    }

    // 2. NEWS/WARTA LIST & ARTICLES ROUTE
    else if (path === 'berita') {
      if (selectedPost) {
        // Active Single Article Reading Mode using full NewsArticle Schema.org markup
        const cleanContentExcerpt = selectedPost.excerpt || selectedPost.content.substring(0, 160).replace(/[#*_`]/g, '') + '...';
        title = `${selectedPost.title} | ${settings.school_name}`;
        description = cleanContentExcerpt;
        ogType = 'article';
        ogImage = selectedPost.thumbnail_url || ogImage;

        jsonLdData = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'NewsArticle',
              '@id': `${baseSiteUrl}/#berita?id=${selectedPost.id}#article`,
              'isPartOf': {
                '@type': 'WebPage',
                '@id': `${baseSiteUrl}/#berita?id=${selectedPost.id}`
              },
              'headline': selectedPost.title,
              'description': cleanContentExcerpt,
              'articleBody': selectedPost.content,
              'image': selectedPost.thumbnail_url || ogImage,
              'datePublished': selectedPost.published_at || new Date().toISOString(),
              'dateModified': selectedPost.published_at || new Date().toISOString(),
              'author': {
                '@type': 'Person',
                'name': selectedPost.author_name || 'Humas Madrasah'
              },
              'publisher': {
                ...defaultSchoolSchema,
                '@context': 'https://schema.org'
              },
              'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `${baseSiteUrl}/#berita?id=${selectedPost.id}`
              }
            },
            getBreadcrumbSchema()
          ]
        };
      } else {
        // Global News Feed list
        title = `Berita, Warta & Pengumuman Resmi | ${settings.school_name}`;
        description = `Ikuti kabar berita terbaru, agenda kegiatan kurikulum, pengumuman penting, and perkembangan akademik MIN Singkawang.`;
        keywords = `berita min singkawang, pengumuman madrasah, kementerian agama singkawang, warta madrasah`;
        
        jsonLdData = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': `${baseSiteUrl}/#berita`,
              'name': 'Pusat Publikasi Berita MIN Singkawang',
              'description': description,
              'publisher': {
                ...defaultSchoolSchema,
                '@context': 'https://schema.org'
              },
              'hasPart': posts.slice(0, 5).map((p, idx) => ({
                '@type': 'NewsArticle',
                'position': idx + 1,
                'headline': p.title,
                'description': p.excerpt || p.content.substring(0, 150),
                'image': p.thumbnail_url,
                'datePublished': p.published_at,
                'url': `${baseSiteUrl}/#berita?id=${p.id}`
              }))
            },
            getBreadcrumbSchema()
          ]
        };
      }
    }

    // 3. PROFILE SUB-ROUTES (12 SECTIONS)
    else if (path.startsWith('profil_')) {
      const profileSections: Record<string, { label: string; desc: string }> = {
        profil_sambutan: {
          label: 'Sambutan Kepala Madrasah',
          desc: `Sambutan resmi dari ${settings.headmaster} selaku Kepala Madrasah MIN Singkawang.`
        },
        profil_singkat: {
          label: 'Selayang Pandang Profil',
          desc: settings.about_brief
        },
        profil_sejarah: {
          label: 'Sejarah Singkat Lembaga',
          desc: `Rentang sejarah perjalanan berdirinya MIN Singkawang sejak didirikan pada tahun 1994 s.d. penegerian.`
        },
        profil_visi_misi: {
          label: 'Visi dan Misi Strategis',
          desc: `Visi: ${settings.vision}. Misi operasional keunggulan madrasah.`
        },
        profil_tujuan: {
          label: 'Rencana & Tujuan Madrasah',
          desc: `Tujuan strategis MIN Singkawang guna melahirkan lulusan berakhlak mulia and berprestasi sains.`
        },
        profil_organisasi: {
          label: 'Struktur Organisasi & Tata Kelola',
          desc: 'Struktural organisasi MIN Singkawang kepemimpinan Kepala, Komite, Waka Kurikulum, Humas, and Kesiswaan.'
        },
        profil_gtk: {
          label: 'Jajaran Pendidik & Kepegawaian (GTK)',
          desc: 'Kenali profil kompetensi ustadz, ustadzah, guru kelas, dan tenaga kependidikan MIN Singkawang.'
        },
        profil_sarana: {
          label: 'Mutu Prasarana, Kelas Digital, & Sarpras',
          desc: 'Fasilitas pembelajaran komprehensif, ruang baca ber-AC, perpustakaan, and laboratorium komputer MIN Singkawang.'
        },
        profil_akreditasi: {
          label: 'Capaian Nilai Akreditasi Madrasah',
          desc: `Sertifikasi Akreditasi BAN-SM: MIN Singkawang mendapatkan peringkat A (Sangat Baik) dengan nilai rekor 96.`
        },
        profil_prestasi: {
          label: 'Direktori Prestasi Siswa & Guru',
          desc: 'Etalase kebanggaan prestasi emas siswa dalam bidang riset sains sosiologi, baca quran, and olahraga nasional.'
        },
        profil_unggulan: {
          label: '8 Program Unggulan Akademik',
          desc: 'Komitmen program andalan: Pemetaan IT madrasah digital, tahfizh Al-Quran juz 29-30, and olimpiade robotika.'
        },
        profil_kontak: {
          label: 'Kontak Resmi, Email & Lokasi Maps',
          desc: `Informasi sekretariat: beralamat di ${settings.contact_address}, nomor telepon ${settings.contact_phone}, email ${settings.contact_email}.`
        }
      };

      const sectionInfo = profileSections[path] || { label: 'Profil Madrasah', desc: settings.about_brief };
      title = `${sectionInfo.label} | ${settings.school_name}`;
      description = sectionInfo.desc;

      if (path === 'profil_kontak') {
        jsonLdData = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'LocalBusiness',
              '@id': `${baseSiteUrl}/#local-business`,
              'parentOrganization': {
                ...defaultSchoolSchema,
                '@context': 'https://schema.org'
              },
              'name': settings.school_name,
              'image': ogImage,
              'telephone': settings.contact_phone,
              'email': settings.contact_email,
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': settings.contact_address,
                'addressLocality': 'Singkawang',
                'addressRegion': 'Kalimantan Barat',
                'postalCode': '79111',
                'addressCountry': 'ID'
              },
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': -0.063,
                'longitude': 108.97
              }
            },
            getBreadcrumbSchema()
          ]
        };
      } else {
        jsonLdData = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'AboutPage',
              '@id': `${baseSiteUrl}/#${path}`,
              'name': sectionInfo.label,
              'description': sectionInfo.desc,
              'mainEntity': {
                ...defaultSchoolSchema,
                '@context': 'https://schema.org'
              }
            },
            getBreadcrumbSchema()
          ]
        };
      }
    }

    // 4. ACADEMIC SUB-ROUTES
    else if (path.startsWith('akademik_')) {
      const label = path === 'akademik_kurikulum' ? 'Kurikulum Merdeka' : 'Kalender Akademik';
      title = `${label} | ${settings.school_name}`;
      description = `Ketahui pedoman standar ${label.toLowerCase()} yang diterapkan di ${settings.school_name}.`;
      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${baseSiteUrl}/#${path}`,
            'name': label,
            'description': description,
            'isPartOf': {
              ...defaultSchoolSchema,
              '@context': 'https://schema.org'
            }
          },
          getBreadcrumbSchema()
        ]
      };
    }

    // 5. KESISWAAN SUB-ROUTES
    else if (path.startsWith('kesiswaan_')) {
      const label = path === 'kesiswaan_ekstrakurikuler' ? 'Urusan Ekstrakurikuler' : 'Karya & Kreativitas Siswa';
      title = `${label} | ${settings.school_name}`;
      description = `Wadah pembinaan minat kepemimpinan, olahraga kemasyarakatan, and ${label.toLowerCase()} siswa.`;
      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${baseSiteUrl}/#${path}`,
            'name': label,
            'description': description,
            'isPartOf': {
              ...defaultSchoolSchema,
              '@context': 'https://schema.org'
            }
          },
          getBreadcrumbSchema()
        ]
      };
    }

    // 6. GALLERY ALBUM
    else if (path === 'galeri') {
      title = `Koleksi Dokumentasi Galeri Media | ${settings.school_name}`;
      description = 'Kumpulan foto kegembiraan kegiatan literasi, wisuda akbar khatam quran, and video simulasi darurat KBM.';
      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ImageGallery',
            '@id': `${baseSiteUrl}/#galeri`,
            'name': 'Galeri Dokumentasi MIN Singkawang',
            'description': description,
            'publisher': {
              ...defaultSchoolSchema,
              '@context': 'https://schema.org'
            }
          },
          getBreadcrumbSchema()
        ]
      };
    }

    // 7. DOWNLOAD CENTER
    else if (path === 'download') {
      title = `Pusat Unduhan Berkas & Formulir Resmi | ${settings.school_name}`;
      description = 'Unduh lembaran draf pendaftaran, panduan teknis tata tertib siswa, formulir beasiswa, dan berkas kurikulum.';
      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${baseSiteUrl}/#download`,
            'name': 'Portal Unduh File',
            'description': description,
            'isPartOf': {
              ...defaultSchoolSchema,
              '@context': 'https://schema.org'
            }
          },
          getBreadcrumbSchema()
        ]
      };
    }

    // 8. PPDB ADMISSIONS
    else if (path.startsWith('ppdb_')) {
      title = `Penerimaan Peserta Didik Baru (PPDB) Online | ${settings.school_name}`;
      description = 'Portal pendaftaran digital santri murid baru tahun ajaran 2026/2027. Pastikan data pendaftaran Anda terverifikasi.';
      keywords = 'PPDB Online, pendaftaran siswa baru, MIN Singkawang pendaftaran, kementerian agama, penerimaan murid baru';
      jsonLdData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${baseSiteUrl}/#ppdb_form`,
            'name': 'PPDB Penerimaan Peserta Didik Baru Online',
            'description': description,
            'isPartOf': {
              ...defaultSchoolSchema,
              '@context': 'https://schema.org'
            }
          },
          getBreadcrumbSchema()
        ]
      };
    }

    // 9. CMS BACKOFFICE
    else if (path === 'cms') {
      title = `CMS Back-Office Administrator | ${settings.school_name}`;
      description = 'Panel kontrol integrasi data guru, berita, sarpras, PPDB, and audit sistem madrasah.';
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${baseSiteUrl}/#cms`,
        'name': 'CMS Panel Admin',
        'description': description
      };
    }

    // Execute Document Changes!
    document.title = title;
    
    // Core SEO tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateCanonicalLink(currentUrl);

    // Open Graph SEO tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:site_name', settings.school_name);

    // Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // Structured JSON-LD update
    if (jsonLdData) {
      updateJsonLd(jsonLdData);
    }
  }, [path, selectedPost, settings, seo, posts, programs, achievements, events, announcements]);
}
