/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import MockDb from './database/mockDb';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import AnnouncementTicker from './components/AnnouncementTicker';
import BackToTop from './components/BackToTop';
import ReadingProgressBar from './components/ReadingProgressBar';
import SearchModal from './components/SearchModal';
import AdminGuard from './components/AdminGuard';

// Dynamic code-splitting for high-performance chunk delivery (Core Web Vitals layout/LCP optimization)
const Home = lazy(() => import('./pages/Home'));
const Profil = lazy(() => import('./pages/Profil'));
const Akademik = lazy(() => import('./pages/Akademik'));
const Kesiswaan = lazy(() => import('./pages/Kesiswaan'));
const BeritaList = lazy(() => import('./pages/BeritaList'));
const Galeri = lazy(() => import('./pages/Galeri'));
const DownloadPage = lazy(() => import('./pages/Download'));
const CmsAdmin = lazy(() => import('./pages/CmsAdmin'));
import { useDynamicSeo } from './hooks/useDynamicSeo';

const getCleanPathname = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.includes('admin') || segments.includes('cms')) {
    const adminIdx = segments.indexOf('admin') !== -1 ? segments.indexOf('admin') : segments.indexOf('cms');
    return '/' + segments.slice(adminIdx).join('/');
  }
  
  const knownRoutes = ['profil', 'akademik', 'kesiswaan', 'berita', 'galeri', 'download', 'cms', 'admin'];
  for (const route of knownRoutes) {
    const idx = segments.findIndex(seg => seg === route || seg.startsWith(route + '_'));
    if (idx !== -1) {
      return '/' + segments.slice(idx).join('/');
    }
  }
  
  return '/';
};

const getNormalizedPathAndHashOfRoute = (rawPathname: string, hash: string): { route: string; adminSubTab?: string } => {
  const pathname = getCleanPathname(rawPathname);
  // 1. Check if the URL targets the admin/cms route
  const isAdminPath = pathname === '/admin' || pathname === '/cms' || pathname.startsWith('/admin/') || pathname.startsWith('/cms/');
  const isAdminHash = hash.startsWith('#/admin') || hash.startsWith('#admin') || hash.startsWith('#/cms') || hash.startsWith('#cms');
  
  if (isAdminPath || isAdminHash) {
    // Determine any sub-tab for the administration panel
    let adminSubTab = '';
    
    // Extract from hash
    if (hash.startsWith('#/admin/')) {
      adminSubTab = hash.substring('#/admin/'.length);
    } else if (hash.startsWith('#admin/')) {
      adminSubTab = hash.substring('#admin/'.length);
    } else if (hash.startsWith('#/cms/')) {
      adminSubTab = hash.substring('#/cms/'.length);
    } else if (hash.startsWith('#cms/')) {
      adminSubTab = hash.substring('#cms/'.length);
    } else if (pathname.startsWith('/admin/')) {
      adminSubTab = pathname.substring('/admin/'.length);
    } else if (pathname.startsWith('/cms/')) {
      adminSubTab = pathname.substring('/cms/'.length);
    }
    
    // Strip trailing slash/query params if present
    adminSubTab = adminSubTab.replace(/\/$/, '').split('?')[0];
    
    return { route: 'cms', adminSubTab };
  }
  
  // 2. Fallback to general hash routes
  if (hash && hash !== '#') {
    const cleanedHash = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
    if (cleanedHash) {
      return { route: cleanedHash };
    }
  }
  
  // 3. Fallback to general pathname routes
  const cleanedPath = pathname.replace(/^\//, '').split('?')[0].replace(/\/$/, '');
  if (cleanedPath && cleanedPath !== 'admin' && cleanedPath !== 'cms') {
    return { route: cleanedPath };
  }
  
  return { route: 'home' };
};

export default function App() {
  // Navigation Path Router State using normalized hash-fallback
  const [path, setPath] = useState<string>(() => {
    const { route } = getNormalizedPathAndHashOfRoute(window.location.pathname, window.location.hash);
    return route;
  });

  useEffect(() => {
    const handleNavigationChange = () => {
      const { route, adminSubTab } = getNormalizedPathAndHashOfRoute(window.location.pathname, window.location.hash);
      
      // Safety redirect: rewrite the primary URL to a safe hash-based URL immediately to bypass hosting platform redirection/404 constraints
      const rawPathname = window.location.pathname;
      const pathname = getCleanPathname(rawPathname);
      if (pathname === '/admin' || pathname === '/cms' || pathname.startsWith('/admin/') || pathname.startsWith('/cms/')) {
        const targetHash = adminSubTab ? `#/admin/${adminSubTab}` : `#/admin/ikhtisar`;
        window.history.replaceState(null, '', targetHash);
      } else if (pathname !== '/' && pathname.length > 1) {
        const cleanP = pathname.replace(/^\//, '').split('?')[0].replace(/\/$/, '');
        if (cleanP && cleanP !== 'admin' && cleanP !== 'cms' && !window.location.hash) {
          window.history.replaceState(null, '', `#/${cleanP}`);
        }
      }
      
      setPath(route);
    };

    // Run once on mount to handle direct-load redirection safely and standardise routing
    handleNavigationChange();

    window.addEventListener('popstate', handleNavigationChange);
    window.addEventListener('hashchange', handleNavigationChange);
    return () => {
      window.removeEventListener('popstate', handleNavigationChange);
      window.removeEventListener('hashchange', handleNavigationChange);
    };
  }, []);

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Global search modal open/close state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // PWA Install Prompt States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  
  const [dbSynced, setDbSynced] = useState<boolean>(false);

  // Theme Toggle State (Light or Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => MockDb.getClientTheme());

  // Accessibility States
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large' | 'xlarge' | 'huge'>(() => MockDb.getClientTextSize());

  const [contrastMode, setContrastMode] = useState<'normal' | 'high-contrast' | 'grayscale' | 'invert'>(() => MockDb.getClientContrastMode());

  // Initial backend database state synchronization on load
  useEffect(() => {
    const syncDatabase = async () => {
      try {
        await MockDb.syncFromServer();
        // Load synchronized settings
        setTheme(MockDb.getClientTheme());
        setTextSize(MockDb.getClientTextSize());
        setContrastMode(MockDb.getClientContrastMode());
        setThemeSettings(MockDb.getThemeSettings());
      } catch (err) {
        console.error('[App initialization] Server synchronization failed or backend offline.', err);
      } finally {
        setDbSynced(true);
      }
    };
    syncDatabase();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    MockDb.saveClientTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Text size handling
    const html = window.document.documentElement;
    const sizeMap = {
      small: '87.5%', // ~14px
      normal: '100%', // ~16px
      large: '115%', // ~18.4px
      xlarge: '130%', // ~20.8px
      huge: '150%', // ~24px
    };
    html.style.fontSize = sizeMap[textSize];
    MockDb.saveClientTextSize(textSize);
  }, [textSize]);

  useEffect(() => {
    // Contrast modes handling
    const html = window.document.documentElement;
    html.classList.remove('high-contrast-mode', 'grayscale-mode', 'invert-mode');

    if (contrastMode === 'high-contrast') {
      html.classList.add('high-contrast-mode');
    } else if (contrastMode === 'grayscale') {
      html.classList.add('grayscale-mode');
    } else if (contrastMode === 'invert') {
      html.classList.add('invert-mode');
    }
    MockDb.saveClientContrastMode(contrastMode);
  }, [contrastMode]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for browser install prompts to allow PWA triggers
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      console.log('[PWA] MIN Singkawang was installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] user choice: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };
  
  // Real Local Database States loaded from MockDb
  const [settings, setSettings] = useState(() => MockDb.getSettings());
  const [seo, setSeo] = useState(() => MockDb.getSeoSettings());
  const [posts, setPosts] = useState(() => MockDb.getPosts());
  const [categories, setCategories] = useState(() => MockDb.getCategories());
  const [teachers, setTeachers] = useState(() => MockDb.getTeachers());
  const [facilities, setFacilities] = useState(() => MockDb.getFacilities());
  const [downloads, setDownloads] = useState(() => MockDb.getDownloads());
  const [applicants, setApplicants] = useState(() => MockDb.getApplicants());
  const [auditLogs, setAuditLogs] = useState(() => MockDb.getAuditLogs());
  const [events, setEvents] = useState(() => MockDb.getEvents());
  const [announcements, setAnnouncements] = useState(() => MockDb.getAnnouncements());
  const [galleryItems, setGalleryItems] = useState(() => MockDb.getGalleryItems());
  const [programs, setPrograms] = useState(() => MockDb.getPrograms());
  const [testimonials, setTestimonials] = useState(() => MockDb.getTestimonials());
  const [achievements, setAchievements] = useState(() => MockDb.getAchievements());
  const [themeSettings, setThemeSettings] = useState(() => MockDb.getThemeSettings());
  
  // Active selected states
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [userRole, setUserRole] = useState(() => MockDb.getActiveUserRole());
  const [currentUser, setCurrentUser] = useState(() => MockDb.getLoggedInUser());

  // Dynamic Metadata generator for SEO & JSON-LD
  useDynamicSeo({
    path,
    selectedPost,
    settings,
    seo,
    posts,
    programs,
    achievements,
    events,
    announcements
  });

  // Watch for router transitions and reset standard view scroll positions
  const handleNavigate = (newPath: string) => {
    setPath(newPath);
    // Reset reading filters
    if (newPath !== 'berita') {
      setSelectedPost(null);
    }
    if (newPath === 'cms' || newPath === 'admin') {
      window.location.hash = '/admin/ikhtisar';
    } else if (newPath === 'home') {
      try {
        window.history.pushState({}, '', '#/');
      } catch (e) {
        window.location.hash = '/';
      }
    } else {
      try {
        window.history.pushState({}, '', `#/${newPath}`);
      } catch (e) {
        window.location.hash = `/${newPath}`;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAllStates = () => {
    setSettings(MockDb.getSettings());
    setSeo(MockDb.getSeoSettings());
    setPosts(MockDb.getPosts());
    setCategories(MockDb.getCategories());
    setTeachers(MockDb.getTeachers());
    setFacilities(MockDb.getFacilities());
    setDownloads(MockDb.getDownloads());
    setApplicants(MockDb.getApplicants());
    setAuditLogs(MockDb.getAuditLogs());
    setEvents(MockDb.getEvents());
    setAnnouncements(MockDb.getAnnouncements());
    setGalleryItems(MockDb.getGalleryItems());
    setPrograms(MockDb.getPrograms());
    setTestimonials(MockDb.getTestimonials());
    setAchievements(MockDb.getAchievements());
    setThemeSettings(MockDb.getThemeSettings());
    setUserRole(MockDb.getActiveUserRole());
    setCurrentUser(MockDb.getLoggedInUser());
  };

  // Sync state helpers when actions trigger in child panels
  const handleSaveSettings = (newSettings: any) => {
    MockDb.saveSettings(newSettings);
    setSettings(newSettings);
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleSaveSeo = (newSeo: any) => {
    MockDb.saveSeoSettings(newSeo);
    setSeo(newSeo);
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleSavePost = (newPost: any) => {
    MockDb.savePost(newPost);
    setPosts(MockDb.getPosts());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleDeletePost = (id: string) => {
    MockDb.deletePost(id);
    setPosts(MockDb.getPosts());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleSaveTeacher = (newTeacher: any) => {
    MockDb.saveTeacher(newTeacher);
    setTeachers(MockDb.getTeachers());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleDeleteTeacher = (id: string) => {
    MockDb.deleteTeacher(id);
    setTeachers(MockDb.getTeachers());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleIncrementPostViews = (id: string) => {
    MockDb.incrementPostViews(id);
    setPosts(MockDb.getPosts());
  };

  const handleIncrementDownload = (id: string) => {
    MockDb.incrementDownloadCount(id);
    setDownloads(MockDb.getDownloads());
  };

  const handleIncrementGalleryViews = (id: string) => {
    MockDb.saveGalleryItem({
      ...galleryItems.find(g => g.id === id)!,
      views: (galleryItems.find(g => g.id === id)?.views || 0) + 1
    });
    setGalleryItems(MockDb.getGalleryItems());
  };

  const handleSubmitApplicant = (newApp: any) => {
    MockDb.saveApplicant(newApp);
    setApplicants(MockDb.getApplicants());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleSubmitContact = (data: { name: string; email: string; subject: string; message: string }) => {
    MockDb.addLog(
      `Aspirasi Masuk: ${data.subject}`,
      `Nama: ${data.name} (${data.email}) - Detail Pesan: "${data.message}"`
    );
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleUpdateApplicantStatus = (app: any) => {
    MockDb.saveApplicant(app);
    setApplicants(MockDb.getApplicants());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleDeleteApplicant = (id: string) => {
    MockDb.deleteApplicant(id);
    setApplicants(MockDb.getApplicants());
    setAuditLogs(MockDb.getAuditLogs());
  };

  const handleLogout = () => {
    MockDb.logout();
    setUserRole(MockDb.getActiveUserRole());
    setCurrentUser(null);
  };

  // SQL Script Schema Code representing the absolute premium structure of Supabase
  const sqlSchemaCode = `
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Permissions Liaison Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (Linked with Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL, -- auth.users link
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    role_id UUID REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts / News Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    thumbnail_url TEXT,
    category_id UUID,
    status VARCHAR(20) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PPDB Applicants Table
CREATE TABLE ppdb_applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL UNIQUE,
    gender VARCHAR(20) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100),
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on audit_logs columns of interest
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity, entity_id);
  `.trim();

  if (path === 'cms') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans tracking-tight" id="main_admin_fullscreen_wrapper">
        {themeSettings && (
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --theme-primary: ${themeSettings.primaryColor || '#005a4c'};
              --theme-primary-hover: ${themeSettings.primaryHoverColor || '#004231'};
              --theme-secondary: ${themeSettings.secondaryColor || '#ca8a04'};
              --theme-accent: ${themeSettings.accentColor || '#10b981'};
            }
            body, p, span, div, li, a, label, select, input, textarea {
              font-family: "${themeSettings.bodyFont || 'Plus Jakarta Sans'}", ui-sans-serif, system-ui, sans-serif !important;
            }
            h1, h2, h3, h4, h5, h6, .font-heading {
              font-family: "${themeSettings.headingFont || 'Plus Jakarta Sans'}", ui-sans-serif, system-ui, sans-serif !important;
            }
            button, .rounded-xl, .rounded-lg, .rounded-2xl, .rounded-3xl {
              border-radius: ${themeSettings.borderRadius || '12px'} !important;
            }
          ` }} />
        )}
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#01352e] text-white" id="cms_fullscreen_loader">
            <div className="w-12 h-12 border-4 border-[#00e3a5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-sans font-semibold text-[#00e3a5] tracking-wide animate-pulse">Memuat Panel Administrator MIN Singkawang...</p>
          </div>
        }>
          <AdminGuard
            userRole={userRole}
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          >
            <CmsAdmin
              settings={settings}
              seoSettings={seo}
              posts={posts}
              events={events}
              announcements={announcements}
              teachers={teachers}
              facilities={facilities}
              downloads={downloads}
              auditLogs={auditLogs}
              onSaveSettings={handleSaveSettings}
              onSaveSeo={handleSaveSeo}
              onSavePost={handleSavePost}
              onDeletePost={handleDeletePost}
              onSaveTeacher={handleSaveTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              sqlSchemaCode={sqlSchemaCode}
              onRefreshData={handleUpdateAllStates}
              onNavigate={handleNavigate}
            />
          </AdminGuard>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-905 flex flex-col justify-between font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-200" id="main_app_layout">
      {themeSettings && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: ${themeSettings.primaryColor || '#005a4c'};
            --theme-primary-hover: ${themeSettings.primaryHoverColor || '#004231'};
            --theme-secondary: ${themeSettings.secondaryColor || '#ca8a04'};
            --theme-accent: ${themeSettings.accentColor || '#10b981'};
          }
          
          /* Dynamic Theme Font Overrides */
          body, p, span, div, li, a, label, select, input, textarea {
            font-family: "${themeSettings.bodyFont || 'Plus Jakarta Sans'}", ui-sans-serif, system-ui, sans-serif !important;
          }
          h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: "${themeSettings.headingFont || 'Plus Jakarta Sans'}", ui-sans-serif, system-ui, sans-serif !important;
          }
          
          /* Button Radius Overrides */
          button, .rounded-xl, .rounded-lg, .rounded-2xl, .rounded-3xl {
            border-radius: ${themeSettings.borderRadius || '12px'} !important;
          }

          /* Emerald Color Substitution (Substitusi Warna Emerald dengan Warna Utama Pilihan CMS) */
          .bg-emerald-800, 
          .bg-emerald-900,
          .bg-emerald-700,
          .bg-\\[\\#005a4c\\],
          .hover\\:bg-emerald-800:hover, 
          .hover\\:bg-emerald-900:hover,
          .hover\\:bg-emerald-700:hover,
          .border-b-emerald-800,
          .border-t-emerald-800 {
            background-color: var(--theme-primary) !important;
          }
          .bg-emerald-950,
          .hover\\:bg-emerald-950:hover {
            background-color: var(--theme-primary-hover) !important;
          }
          .text-emerald-800, 
          .text-emerald-700, 
          .text-emerald-600,
          .hover\\:text-emerald-700:hover, 
          .hover\\:text-emerald-800:hover {
            color: var(--theme-primary) !important;
          }
          .border-emerald-700, 
          .border-emerald-800,
          .border-emerald-600,
          .border-emerald-500 {
            border-color: var(--theme-primary) !important;
          }
          .bg-emerald-50 {
            background-color: color-mix(in srgb, var(--theme-primary) 8%, #f8fafc) !important;
          }
          .bg-emerald-150,
          .bg-emerald-100 {
            background-color: color-mix(in srgb, var(--theme-primary) 15%, #f1f5f9) !important;
          }
          .text-emerald-900 {
            color: color-mix(in srgb, var(--theme-primary) 85%, #0f172a) !important;
          }
          .text-emerald-300 {
            color: color-mix(in srgb, var(--theme-primary) 30%, #ffffff) !important;
          }
          .text-emerald-100 {
            color: color-mix(in srgb, var(--theme-primary) 10%, #ffffff) !important;
          }
          
          /* Gradient Color Substitution */
          .from-emerald-800 {
            --tw-gradient-from: var(--theme-primary) !important;
            --tw-gradient-to: var(--tw-gradient-from) !important;
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
          }
          .to-emerald-950 {
            --tw-gradient-to: var(--theme-primary-hover) !important;
          }
        ` }} />
      )}
      
      {/* Global Reading Progress Bar fixed at the absolute top */}
      <ReadingProgressBar />
      
      {/* Universal Sticky Glass Header with real settings values */}
      <Navigation 
        currentPath={path} 
        onNavigate={handleNavigate} 
        settings={settings}
        userRole={userRole}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        textSize={textSize}
        onTextSizeChange={setTextSize}
        contrastMode={contrastMode}
        onContrastModeChange={setContrastMode}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Real-time Scrolling Announcement Widget from CMS */}
      <AnnouncementTicker 
        announcements={announcements}
        onNavigate={handleNavigate}
      />

      {/* Offline Status PWA Alert Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-inner border-y border-amber-500 animate-slide-down sticky top-[72px] z-45" id="offline_pwa_banner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-amber-100 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M21 21h1.5M4.5 21h4.5m0 0H3m6 0H1.5M12 18.75V16.5m0-3V11.25m0-3V6.75M9.75 6h4.5" />
          </svg>
          <span className="tracking-wide text-center">
            <strong>Mode Offline Aktif:</strong> Anda sedang menjelajahi portal dalam mode hemat kuota / offline. Beberapa konten statis & halaman profil dimuat dari PWA Local Cache.
          </span>
        </div>
      )}

      {/* PWA App Install Banner */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white px-6 py-4 text-xs font-sans flex flex-col md:flex-row items-center justify-between gap-4 shadow-md sticky top-[72px] z-45 border-b border-emerald-700 animate-fade-in no-print" id="pwa_install_banner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/10 shrink-0">
              📲
            </div>
            <div className="text-left col-span-3">
              <p className="font-bold text-white leading-tight">Pasang Aplikasi MIN Singkawang!</p>
              <p className="text-[10px] text-emerald-250 mt-1">Akses portal madrasah lebih cepat langsung dari home screen, hemat kuota data internet, dan nikmati fitur offline secara penuh.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="px-3.5 py-1.5 text-[10px] bg-transparent hover:bg-white/11 border border-transparent hover:border-slate-300 text-slate-300 hover:text-white rounded-lg transition-all font-bold cursor-pointer"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleInstallPwa}
              className="px-4 py-2 text-[10px] bg-white text-emerald-990 hover:bg-emerald-50 active:scale-95 transition-all rounded-lg font-black uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Pasang Aplikasi
            </button>
          </div>
        </div>
      )}

      {/* Primary Dynamic Modular Workspace Grid Container */}
      <main className="flex-grow">
        
        {/* Dynamic Breadcrumb Navigation for SEO & path tracking */}
        <Breadcrumb 
          currentPath={path} 
          onNavigate={handleNavigate} 
          selectedPost={selectedPost} 
        />
        
        <Suspense fallback={
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-905" id="suspense_fallback_loader">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-sans font-semibold text-emerald-800 dark:text-emerald-400">Memuat Halaman Portal...</p>
          </div>
        }>
          {/* Route 1: BERANDA HOMEPAGE */}
          {path === "home" && (
            <Home 
              settings={settings}
              posts={posts}
              events={events}
              programs={programs}
              achievements={achievements}
              testimonials={testimonials}
              galleryItems={galleryItems}
              announcements={announcements}
              onNavigate={handleNavigate}
              onSelectPost={(post) => {
                setSelectedPost(post);
                setPath('berita');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddTestimonial={(newTestimonial) => {
                MockDb.saveTestimonial(newTestimonial);
                setTestimonials(MockDb.getTestimonials());
              }}
            />
          )}

          {/* Route 2: PROFIL DEPARTMENTS (12 subPaths handled dynamically inside Profil page) */}
          {path.startsWith("profil_") && (
            <Profil 
              subPath={path} 
              settings={settings}
              teachers={teachers}
              facilities={facilities}
              programs={programs}
              achievements={achievements}
              onNavigate={handleNavigate}
              onSubmitContact={handleSubmitContact}
            />
          )}



          {/* Route 3: AKADEMIK SECTIONS */}
          {path.startsWith("akademik_") && (
            <Akademik subPath={path} onNavigate={handleNavigate} />
          )}

          {/* Route 4: KESISWAAN SECTIONS */}
          {path.startsWith("kesiswaan_") && (
            <Kesiswaan subPath={path} onNavigate={handleNavigate} />
          )}

          {/* Route 5: MEDIA REDAKSI BERITA / INFORMASI */}
          {path === "berita" && (
            <BeritaList 
              posts={posts} 
              categories={categories}
              selectedPost={selectedPost}
              onSelectPost={setSelectedPost}
              onIncrementViews={handleIncrementPostViews}
            />
          )}

          {/* Route 6: GALERI ALBUM FOTO & EMBED VIDEOS */}
          {path === "galeri" && (
            <Galeri 
              items={galleryItems} 
              onIncrementViews={handleIncrementGalleryViews}
            />
          )}



          {/* Route 8: PUSAT UNDUHAN BERKAS */}
          {path === "download" && (
            <DownloadPage 
              items={downloads} 
              onIncrementDownload={handleIncrementDownload}
            />
          )}

          {/* Route 10: CMS BACK-OFFICE OPERATIONS MASTER PANEL */}
          {path === "cms" && (
            <CmsAdmin
              settings={settings}
              seoSettings={seo}
              posts={posts}
              events={events}
              announcements={announcements}
              teachers={teachers}
              facilities={facilities}
              downloads={downloads}
              auditLogs={auditLogs}
              onSaveSettings={handleSaveSettings}
              onSaveSeo={handleSaveSeo}
              onSavePost={handleSavePost}
              onDeletePost={handleDeletePost}
              onSaveTeacher={handleSaveTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              sqlSchemaCode={sqlSchemaCode}
            />
          )}
        </Suspense>

      </main>

      {/* Universal Footer styling */}
      <Footer onNavigate={handleNavigate} settings={settings} />

      {/* Global Search Dialog Modal overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onSelectPost={(post) => {
          setSelectedPost(post);
          setPath('berita');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        posts={posts}
        announcements={announcements}
        downloads={downloads}
        teachers={teachers}
        facilities={facilities}
        achievements={achievements}
        events={events}
        programs={programs}
      />

      {/* Floating Back to Top widget */}
      <BackToTop />

    </div>
  );
}
