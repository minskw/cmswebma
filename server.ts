/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateSitemapXml } from './src/utils/sitemap';
import { generateRssXml, generateAtomXml } from './src/utils/rss';
import { initialPosts, initialAnnouncements, initialEvents, initialCategories } from './src/data/initialData';
import { getDatabaseState, saveDatabaseState, saveDatabaseKey } from './src/database/serverDb';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middlewares to parse JSON and urlencoded request bodies
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Server-side active sessions memory storage (complying with no-localStorage guidelines)
  let activeSessionUser: any = null;

  // Resilient stateless request session helper to prevent losing access when Cloud Run scales/restarts
  const getRequestUser = (req: any) => {
    const sessionHeader = req.headers['x-user-session'];
    if (sessionHeader) {
      try {
        const decoded = Buffer.from(sessionHeader, 'base64').toString('utf-8');
        return JSON.parse(decoded);
      } catch (e) {
        try {
          return JSON.parse(sessionHeader);
        } catch (inner) {}
      }
    }
    return activeSessionUser;
  };

  // Serve RSS 2.0 feed dynamically
  app.get(['/rss.xml', '/feed.xml'], (req, res) => {
    try {
      const host = req.get('host') || 'minsingkawang.sch.id';
      const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
      const protocol = isHttps ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      const rssXml = generateRssXml(baseUrl, initialPosts, initialCategories);

      res.header('Content-Type', 'application/rss+xml; charset=utf-8');
      res.status(200).send(rssXml);
    } catch (err) {
      console.error('Error generating dynamic RSS feed:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Serve Atom 1.0 feed dynamically
  app.get('/atom.xml', (req, res) => {
    try {
      const host = req.get('host') || 'minsingkawang.sch.id';
      const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
      const protocol = isHttps ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      const atomXml = generateAtomXml(baseUrl, initialPosts, initialCategories);

      res.header('Content-Type', 'application/atom+xml; charset=utf-8');
      res.status(200).send(atomXml);
    } catch (err) {
      console.error('Error generating dynamic Atom feed:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Serve the XML Sitemap dynamically at /sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    try {
      // Determine the domain dynamically based on incoming host, defaulting to the official domain of the Madrasah
      const host = req.get('host') || 'minsingkawang.sch.id';
      const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
      const protocol = isHttps ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      // Crawl and generate standard XML content
      const sitemapXml = generateSitemapXml(
        baseUrl,
        initialPosts,
        initialAnnouncements,
        initialEvents,
        initialCategories
      );

      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.status(200).send(sitemapXml);
    } catch (err) {
      console.error('Error generating dynamic sitemap.xml:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Serve Robots.txt dynamically pointing to the dynamic sitemap
  app.get('/robots.txt', (req, res) => {
    try {
      const host = req.get('host') || 'minsingkawang.sch.id';
      const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
      const protocol = isHttps ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      const robotsText = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/*',
        'Disallow: /cms*',
        '',
        `Sitemap: ${baseUrl}/sitemap.xml`
      ].join('\n');

      res.header('Content-Type', 'text/plain; charset=utf-8');
      res.status(200).send(robotsText);
    } catch (err) {
      console.error('Error serving dynamic robots.txt:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Active Server-Sent Events client trackers
  let notificationClients: { id: string; res: any }[] = [];

  // 1. Establish SSE stream connection
  app.get('/api/notifications/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    const clientRecord = { id: clientId, res };
    notificationClients.push(clientRecord);

    // Write initial connection greeting
    res.write(`data: ${JSON.stringify({ type: 'welcome', clientId })}\n\n`);

    // Keep connection alive with occasional heartbeat packets
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
      } catch (e) {
        // Suppress or ignore if res is closed
      }
    }, 45000);

    req.on('close', () => {
      clearInterval(heartbeatInterval);
      notificationClients = notificationClients.filter(c => c.id !== clientId);
    });
  });

  // 2. Subscribe user / visitor to push notifications list
  app.post('/api/notifications/subscribe', (req, res) => {
    try {
      const { subscription } = req.body;
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Payload tidak valid. Memerlukan details endpoint.' });
      }

      const db = getDatabaseState();
      const subs = db.min_singkawang_push_subscriptions || [];

      // Check if already registered
      const existsIdx = subs.findIndex((s: any) => s.endpoint === subscription.endpoint);
      if (existsIdx > -1) {
        subs[existsIdx] = { ...subs[existsIdx], ...subscription, updated_at: new Date().toISOString() };
      } else {
        subs.push({
          id: 'sub_' + Math.random().toString(36).substring(2, 9),
          ...subscription,
          created_at: new Date().toISOString()
        });
      }

      db.min_singkawang_push_subscriptions = subs;
      saveDatabaseState(db);

      res.json({ success: true, count: subs.length });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal meregistrasi subscription', details: err?.message });
    }
  });

  // 3. Unsubscribe user / visitor from push notifications list
  app.post('/api/notifications/unsubscribe', (req, res) => {
    try {
      const { endpoint } = req.body;
      if (!endpoint) {
        return res.status(400).json({ error: 'Memerlukan endpoint untuk membatalkan langganan.' });
      }

      const db = getDatabaseState();
      const subs = db.min_singkawang_push_subscriptions || [];
      const filtered = subs.filter((s: any) => s.endpoint !== endpoint);

      db.min_singkawang_push_subscriptions = filtered;
      saveDatabaseState(db);

      res.json({ success: true, count: filtered.length });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal membatalkan subscription', details: err?.message });
    }
  });

  // 4. Retrieve all current active subscribers list
  app.get('/api/notifications/subscribers', (req, res) => {
    try {
      const db = getDatabaseState();
      const subs = db.min_singkawang_push_subscriptions || [];
      res.json(subs);
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal mengambil daftar pelanggan', details: err?.message });
    }
  });

  // 5. Broadcast a push notification to selected audience in real-time
  app.post('/api/notifications/send', (req, res) => {
    try {
      const { title, body, audience } = req.body;
      if (!title || !body) {
        return res.status(400).json({ error: 'Judul dan isi notifikasi wajib diisi.' });
      }

      const db = getDatabaseState();
      const subs = db.min_singkawang_push_subscriptions || [];
      
      // Save notification into history logs
      const notificationsHistory = db.min_singkawang_push_notifications || [];
      const newNotification = {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        title,
        body,
        audience: audience || 'all',
        created_at: new Date().toISOString()
      };
      
      notificationsHistory.unshift(newNotification);
      db.min_singkawang_push_notifications = notificationsHistory.slice(0, 50); // limit history
      
      // Create system/audit log
      const auditLogs = db.min_singkawang_audit_logs || [];
      const reqUser = getRequestUser(req);
      const pushLog = {
        id: "log_" + Math.random().toString(36).substring(2, 9),
        user_name: reqUser ? `${reqUser.name} (${reqUser.role})` : "Sistem Utama",
        action: "Siaran Push Notifikasi",
        details: `Meluncurkan siaran push notifikasi: "${title}" ke audiens: ${audience || 'semua'}`,
        timestamp: new Date().toISOString()
      };
      auditLogs.unshift(pushLog);
      db.min_singkawang_audit_logs = auditLogs.slice(0, 100);

      saveDatabaseState(db);

      // Broadcast to live stream clients
      const payloadString = JSON.stringify({
        type: 'notification',
        notification: newNotification
      });

      let broadcastCount = 0;
      notificationClients.forEach((client) => {
        try {
          client.res.write(`data: ${payloadString}\n\n`);
          broadcastCount++;
        } catch (e) {
          console.warn('Gagal mendorong notifikasi ke salah satu client', e);
        }
      });

      res.json({
        success: true,
        broadcastCount,
        registeredSubscribersCount: subs.length,
        notification: newNotification
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal menyiarkan notifikasi', details: err?.message });
    }
  });

  // REST API: Get entire Database State
  app.get('/api/db', (req, res) => {
    try {
      const state = getDatabaseState();
      res.json(state);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve database state', details: err?.message });
    }
  });

  // REST API: Save singular Database Key
  app.post('/api/db/save-item', (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ error: 'Missing required "key" field in payload' });
      }

      // Security check: intercept state modifications on CMS administrative modules
      const publicWriteableKeys = [
        'min_singkawang_news_comments',
        'min_singkawang_applicants', // standard applicants submission
        'min_singkawang_theme',
        'min_singkawang_text_size',
        'min_singkawang_contrast_mode'
      ];

      if (!publicWriteableKeys.includes(key)) {
        const allowedRoles = ['Super Admin', 'Kepala Madrasah', 'Operator'];
        const reqUser = getRequestUser(req);
        const userRole = reqUser ? reqUser.role : null;
        if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({ 
            error: 'Akses Ditolak', 
            details: `Peran Anda '${userRole || 'Tamu'}' tidak diizinkan untuk mengubah konfigurasi CMS.` 
          });
        }
      }

      const state = saveDatabaseKey(key, value);
      res.json({ success: true, key, state });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update database key', details: err?.message });
    }
  });

  // REST API: Save/overwrite entire Database State
  app.post('/api/db/save-all', (req, res) => {
    try {
      const { state } = req.body;
      if (!state) {
        return res.status(400).json({ error: 'Missing required "state" field in payload' });
      }

      // Restrict save-all to Super Admin, Kepala Madrasah, and Operator
      const allowedRoles = ['Super Admin', 'Kepala Madrasah', 'Operator'];
      const reqUser = getRequestUser(req);
      const userRole = reqUser ? reqUser.role : null;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Akses Ditolak', 
          details: `Peran Anda '${userRole || 'Tamu'}' tidak diizinkan menduplikasi atau menimpa basis data.` 
        });
      }

      saveDatabaseState(state);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update database', details: err?.message });
    }
  });

  // Real Backend Auth APIs: Check active session
  app.get('/api/auth/me', (req, res) => {
    res.json({ user: getRequestUser(req) });
  });

  // Real Backend Auth APIs: Authenticate administrator
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const db = getDatabaseState();
      
      const accounts = [
        {
          email: "admin@minsingkawang.sch.id",
          password: "admin123",
          name: "Suryadi, S.H.",
          role: "Super Admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
        },
        {
          email: "operator@minsingkawang.sch.id",
          password: "operator123",
          name: "Hendika, S.Kom.",
          role: "Operator",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        },
        {
          email: "kepala@minsingkawang.sch.id",
          password: "kepala123",
          name: "H. Kamaludin, S.Ag., M.Pd.",
          role: "Kepala Madrasah",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
        },
        {
          email: "editor@minsingkawang.sch.id",
          password: "editor123",
          name: "Nurhasanah, S.Pd.I.",
          role: "Editor",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
        }
      ];

      const found = accounts.find(
        a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );

      if (found) {
        activeSessionUser = {
          id: `u_${found.role.toLowerCase().replace(/ /g, '_')}`,
          email: found.email,
          name: found.name,
          role: found.role,
          avatar_url: found.avatar,
          created_at: new Date().toISOString()
        };

        // Inject audit log
        const logs = db.min_singkawang_audit_logs || [];
        const newLog = {
          id: "log_" + Math.random().toString(36).substring(2, 9),
          user_name: `${activeSessionUser.name} (${activeSessionUser.role})`,
          action: "User Login",
          details: `Berhasil masuk ke CMS Admin sebagai ${found.role} (${found.name})`,
          timestamp: new Date().toISOString()
        };
        logs.unshift(newLog);
        db.min_singkawang_audit_logs = logs.slice(0, 100);
        saveDatabaseState(db);

        return res.json({ success: true, user: activeSessionUser });
      }

      res.status(401).json({ error: 'Email atau Kata Sandi salah. Harap periksa kembali kredensial Anda.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Kesalahan internal otentikasi', details: err?.message });
    }
  });

  // Real Backend Auth APIs: Direct action role change
  app.post('/api/auth/role-change', (req, res) => {
    try {
      const { role, email } = req.body;
      const db = getDatabaseState();
      
      let name = "Staf Kependidikan";
      let avatar_url = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150";
      if (role === 'Super Admin') name = "Suryadi, S.H.";
      if (role === 'Kepala Madrasah') {
        name = "H. Kamaludin, S.Ag., M.Pd.";
        avatar_url = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150";
      }
      if (role === 'Operator') name = "Hendika, S.Kom.";
      if (role === 'Editor') name = "Nurhasanah, S.Pd.I.";

      activeSessionUser = {
        id: `u_${role.toLowerCase().replace(/ /g, '_')}`,
        email,
        name,
        role,
        avatar_url,
        created_at: new Date().toISOString()
      };

      // Log this in actions
      const logs = db.min_singkawang_audit_logs || [];
      const newLog = {
        id: "log_" + Math.random().toString(36).substring(2, 9),
        user_name: `${activeSessionUser.name} (${activeSessionUser.role})`,
        action: "Simulate Role Change",
        details: `Berhasil berganti ke peran akses: ${role}`,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      db.min_singkawang_audit_logs = logs.slice(0, 100);
      saveDatabaseState(db);

      res.json({ success: true, user: activeSessionUser });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal merubah sistem role', details: err?.message });
    }
  });

  // Real Backend Auth APIs: Logout completely
  app.post('/api/auth/logout', (req, res) => {
    try {
      const db = getDatabaseState();
      const logs = db.min_singkawang_audit_logs || [];
      const reqUser = getRequestUser(req);
      const newLog = {
        id: "log_" + Math.random().toString(36).substring(2, 9),
        user_name: reqUser ? `${reqUser.name} (${reqUser.role})` : "Sistem Utama",
        action: "User Logout",
        details: "Keluar dari menu panel administrator",
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      db.min_singkawang_audit_logs = logs.slice(0, 100);
      saveDatabaseState(db);

      activeSessionUser = null;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal log out', details: err?.message });
    }
  });

  // Global Content Search API endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim().toLowerCase();
      if (!q) {
        return res.json([]);
      }

      // 1. Direct Supabase Client Lazy-Initialization and Querying
      const supabaseUrl = process.env.SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseKey);

          const matchedResults: any[] = [];

          // Query matching publish posts
          const { data: postsData } = await supabase
            .from('posts')
            .select('id, title, slug, excerpt, published_at')
            .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
            .limit(10);

          if (postsData) {
            postsData.forEach((p: any) => {
              matchedResults.push({
                id: p.id,
                title: p.title,
                type: 'news',
                excerpt: p.excerpt || (p.content ? p.content.slice(0, 110) + '...' : 'Berita Resmi'),
                path: 'berita',
                extra: p.published_at ? new Date(p.published_at).toLocaleDateString('id-ID') : 'Redaksi'
              });
            });
          }

          // Query matching announcements
          const { data: annData } = await supabase
            .from('announcements')
            .select('id, title, slug, content, published_at')
            .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
            .limit(5);

          if (annData) {
            annData.forEach((a: any) => {
              matchedResults.push({
                id: a.id,
                title: a.title,
                type: 'announcement',
                excerpt: a.content ? a.content.slice(0, 110) + '...' : 'Pengumuman Resmi',
                path: 'home',
                extra: a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID') : 'Informasi'
              });
            });
          }

          // Query matching downloads
          const { data: downData } = await supabase
            .from('downloads')
            .select('id, title, filename, category, file_size, downloads_count')
            .or(`title.ilike.%${q}%,filename.ilike.%${q}%`)
            .limit(5);

          if (downData) {
            downData.forEach((d: any) => {
              matchedResults.push({
                id: d.id,
                title: d.title,
                type: 'download',
                excerpt: `Berkas Kategori: ${d.category} - File: ${d.filename}`,
                path: 'download',
                extra: `${d.file_size || 'Unknown'} • ${d.downloads_count || 0} Unduhan`
              });
            });
          }

          // Return immediately if live database records are successfully returned
          if (matchedResults.length > 0) {
            return res.json(matchedResults);
          }
        } catch (dbErr) {
          console.warn('[Search Endpoint] Supabase query context failed or tables not seeded, returning memory fallbacks.', dbErr);
        }
      }

      // 2. Real File-Backed database matching fallback (loads from dynamic active DB!)
      const matches: any[] = [];
      const db = getDatabaseState();

      const postsList = db.min_singkawang_posts || [];
      const announcementsList = db.min_singkawang_announcements || [];
      const downloadsList = db.min_singkawang_downloads || [];
      const teachersList = db.min_singkawang_teachers || [];
      const facilitiesList = db.min_singkawang_facilities || [];
      const achievementsList = db.min_singkawang_achievements || [];
      const programsList = db.min_singkawang_programs || [];

      // Matching posts news
      postsList.forEach((p: any) => {
        if (p.title.toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q))) {
          matches.push({
            id: p.id,
            title: p.title,
            type: 'news',
            excerpt: p.excerpt || (p.content || '').slice(0, 110) + '...',
            path: 'berita',
            extra: p.author_name || 'Redaksi'
          });
        }
      });

      // Matching announcements
      announcementsList.forEach((a: any) => {
        if (a.title.toLowerCase().includes(q) || (a.content || '').toLowerCase().includes(q)) {
          matches.push({
            id: a.id,
            title: a.title,
            type: 'announcement',
            excerpt: a.content ? a.content.slice(0, 110) + '...' : 'Pengumuman Penting Madrasah',
            path: 'home',
            extra: new Date(a.published_at).toLocaleDateString('id-ID')
          });
        }
      });

      // Matching downloads
      downloadsList.forEach((d: any) => {
        if (d.title.toLowerCase().includes(q) || (d.filename || '').toLowerCase().includes(q) || (d.category || '').toLowerCase().includes(q)) {
          matches.push({
            id: d.id,
            title: d.title,
            type: 'download',
            excerpt: `Berkas Kategori: ${d.category} - File: ${d.filename}`,
            path: 'download',
            extra: `${d.file_size} • ${d.downloads_count} Unduhan`
          });
        }
      });

      // Matching GTK Teachers
      teachersList.forEach((t: any) => {
        if (t.name.toLowerCase().includes(q) || (t.role || '').toLowerCase().includes(q)) {
          matches.push({
            id: t.id,
            title: t.name,
            type: 'teacher',
            excerpt: `GTK / Guru Pendidik: ${t.role} (${t.status || 'PNS'})`,
            path: 'profil_gtk',
            extra: t.nip ? `NIP: ${t.nip}` : 'GTK Madrasah'
          });
        }
      });

      // Matching Facilities
      facilitiesList.forEach((f: any) => {
        if (f.name.toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q)) {
          matches.push({
            id: f.id,
            title: f.name,
            type: 'facility',
            excerpt: f.description.slice(0, 110) + '...',
            path: 'profil_sarana',
            extra: `Kondisi: ${f.condition}`
          });
        }
      });

      // Matching Achievements
      achievementsList.forEach((ach: any) => {
        if (ach.title.toLowerCase().includes(q) || (ach.winner || '').toLowerCase().includes(q) || (ach.description && ach.description.toLowerCase().includes(q))) {
          matches.push({
            id: ach.id,
            title: ach.title,
            type: 'achievement',
            excerpt: `Pemenang: ${ach.winner} (${ach.level} • ${ach.year}) - ${ach.description || ''}`,
            path: 'profil_prestasi'
          });
        }
      });

      // Matching Programs
      programsList.forEach((prog: any) => {
        if (prog.title.toLowerCase().includes(q) || (prog.description || '').toLowerCase().includes(q)) {
          matches.push({
            id: prog.id,
            title: prog.title,
            type: 'program',
            excerpt: prog.description.slice(0, 110) + '...',
            path: 'profil_unggulan'
          });
        }
      });

      res.json(matches.slice(0, 20));
    } catch (err) {
      console.error('Error running search endpoint:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Determine if we should run in production asset-serving mode
  const distPath = path.join(process.cwd(), 'dist');
  // Auto-import fs if it's not present, to ensure checks are safe
  const fs = await import('fs');
  const hasBuiltAssets = fs.existsSync(distPath);
  const isProduction = process.env.NODE_ENV === 'production' || 
                        __dirname.includes('dist') || 
                        hasBuiltAssets;

  if (!isProduction) {
    console.log('[MIN Singkawang Server] Starting in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[MIN Singkawang Server] Starting in PRODUCTION asset-serving mode (serving from:', distPath, ')');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MIN Singkawang Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
