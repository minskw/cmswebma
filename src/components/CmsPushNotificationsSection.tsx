/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Activity, CheckCircle2, AlertCircle, Trash2, ShieldCheck, Mail, Radio } from 'lucide-react';
import MockDb from '../database/mockDb';

export default function CmsPushNotificationsSection() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [bcasts, setBcasts] = useState<any[]>([]);
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [sseClientId, setSseClientId] = useState<string>('');
  
  // Notification form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'all' | 'staff' | 'visitors'>('all');
  
  // Local active client subscription state
  const [notifPermission, setNotifPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [isCurrentlySubscribed, setIsCurrentlySubscribed] = useState(false);

  // Load subscribers list & broadcast history from server database
  const refreshData = async () => {
    try {
      // 1. Fetch subscribers List
      const sRes = await fetch('/api/notifications/subscribers');
      if (sRes.ok) {
        const sData = await sRes.json();
        setSubscribers(sData);
      }
      
      // 2. Fetch entire DB to find history and check local active subscription
      const dbRes = await fetch('/api/db');
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        const history = dbData.min_singkawang_push_notifications || [];
        setBcasts(history);

        const activeList = dbData.min_singkawang_push_subscriptions || [];
        const currentEndpoint = window.location.origin + '_local_session';
        const hasSub = activeList.some((s: any) => s.endpoint === currentEndpoint);
        setIsCurrentlySubscribed(hasSub);
      }
    } catch (err) {
      console.warn('[Push Notification console] Failed to load server data:', err);
    }
  };

  useEffect(() => {
    refreshData();

    // 3. Connect to live Server-Sent Events (SSE) stream
    let sseSource: EventSource | null = null;
    try {
      sseSource = new EventSource('/api/notifications/stream');
      
      sseSource.onopen = () => {
        setSseConnected(true);
      };

      sseSource.onerror = (err) => {
        console.warn('[SSE Connection] Closed or attempting reconnect...', err);
        setSseConnected(false);
      };

      sseSource.addEventListener('message', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === 'welcome') {
            setSseClientId(payload.clientId);
          } else if (payload.type === 'notification') {
            // Trigger local native browser alert!
            const alertNotif = payload.notification;
            if (Notification.permission === 'granted') {
              new Notification(alertNotif.title, {
                body: alertNotif.body,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png'
              });
            }
            // Dynamic refresh log history
            setBcasts(prev => [alertNotif, ...prev]);
            refreshData();
          }
        } catch (parseErr) {
          // heartbeat or unparseable payload
        }
      });
    } catch (sseErr) {
      console.error('[SSE Init error]', sseErr);
    }

    return () => {
      if (sseSource) sseSource.close();
    };
  }, []);

  // Request browser Notification permissions and Register/Subscribe session
  const handleToggleLocalSubscription = async () => {
    if (typeof Notification === 'undefined') {
      alert("Browser Anda tidak mendukung Web Notifications API.");
      return;
    }

    if (Notification.permission === 'denied') {
      alert("Izin notifikasi diblokir pada browser Anda. Izinkan secara manual melalui baris gembok URL.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotifPermission(permission);

    if (permission === 'granted') {
      const activeUser = MockDb.getLoggedInUser();
      const currentEndpoint = window.location.origin + '_local_session';

      if (!isCurrentlySubscribed) {
        // Register client info on server
        const subData = {
          endpoint: currentEndpoint,
          user_name: activeUser ? `${activeUser.name} (${activeUser.role})` : 'Operator / Pengunjung Uji Coba',
          user_id: activeUser?.id || 'visitor_sim',
          role: activeUser ? activeUser.role : 'Pengunjung Binaan',
          user_agent: navigator.userAgent.slice(0, 80)
        };

        try {
          const res = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: subData })
          });
          if (res.ok) {
            setIsCurrentlySubscribed(true);
            new Notification("Berhasil Terdaftar!", {
              body: "Sesi browser Anda kini siap menerima kiriman siaran notifikasi MIN Singkawang.",
              icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png'
            });
            refreshData();
          }
        } catch (err) {
          console.error('[Subscribe API error]', err);
        }
      } else {
        // Unregister client subscription
        try {
          const res = await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: currentEndpoint })
          });
          if (res.ok) {
            setIsCurrentlySubscribed(false);
            refreshData();
          }
        } catch (err) {
          console.error('[Unsubscribe API error]', err);
        }
      }
    }
  };

  // Launch live push broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert('Mohon isi Judul dan Konten notifikasi.');
      return;
    }

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, audience })
      });

      if (res.ok) {
        const resData = await res.json();
        setTitle('');
        setBody('');
        alert(`Siaran notifikasi berhasil disebarkan! Terkirim ke ${resData.broadcastCount} client stream aktif.`);
        refreshData();
      } else {
        alert('Gagal meluncurkan siaran notifikasi.');
      }
    } catch (err) {
      console.error('[Send push broadcast error]', err);
    }
  };

  return (
    <div className="space-y-6 font-sans text-left animate-fade-in text-sm text-slate-800" id="push_notif_section_panel">
      
      {/* SECTION HEADER CARDS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-slate-900 text-lg font-black tracking-tight uppercase">Pusat Siaran Push Notifikasi</h2>
          <p className="text-xs text-slate-500 mt-1">
            Rencanakan, kelola, dan siarkan pemberitahuan PWA instan kepada guru, tata usaha, orang tua, dan pengunjung madrasah.
          </p>
        </div>
        
        {/* Connection status badge */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono border ${
            sseConnected
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <span className={`w-2 h-2 rounded-full ${sseConnected ? "bg-emerald-500 animate-ping" : "bg-amber-400"}`}></span>
            <span>Realtime Endpoint: {sseConnected ? `Active (SSE)` : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* METRIC DASHBOARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white border rounded-xl flex items-center gap-4 shadow-3xs">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold text-[10.5px] uppercase block">Pendaftar Langganan</span>
            <span className="text-lg font-extrabold text-slate-900">{subscribers.length} Pelanggan</span>
          </div>
        </div>

        <div className="p-5 bg-white border rounded-xl flex items-center gap-4 shadow-3xs">
          <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Radio className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold text-[10.5px] uppercase block">Client Berjalan Saat Ini</span>
            <span className="text-lg font-extrabold text-slate-900">{sseConnected ? "1 Sesi Aktif" : "0 Offline"}</span>
          </div>
        </div>

        <div className="p-5 bg-white border rounded-xl flex items-center gap-4 shadow-3xs">
          <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Activity className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold text-[10.5px] uppercase block">Histori Broadcast</span>
            <span className="text-lg font-extrabold text-slate-900">{bcasts.length} Siaran</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN 1: BROADCAST SENDER FORM */}
        <div className="bg-white p-6 border rounded-xl shadow-2xs space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-emerald-800" />
              Buat Siaran Baru (Broadcast Console)
            </h3>
            <p className="text-[11.5px] text-slate-400 mt-1">Mengirimkan notifikasi langsung ke desktop/layar handphone pengguna secara instan.</p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Judul Notifikasi (Title)</label>
              <input 
                type="text" 
                required
                placeholder="cth: Pengumuman Hasil Kelulusan Semester Genap"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Isi Pesan Notifikasi (Notification Body)</label>
              <textarea 
                required
                rows={3}
                placeholder="Rincian informasi penting yang ingin dipush. Buat sepadat mungkin agar terbaca di smartphone."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Segmen Target Audiens</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-700 font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="all">Semua Audiens (Pengunjung & Pengurus)</option>
                <option value="staff">Khusus Akun Terdaftar (Kepala / Operator / Guru)</option>
                <option value="visitors">Khusus Pengunjung Non-Administrator</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-950 border border-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              Lepaskan Siaran (Push Broadcast)
            </button>
          </form>
        </div>

        {/* COLUMN 2: LOCAL SIMULATION & SUBSCRIBER LISTS */}
        <div className="space-y-6">
          
          {/* Local testing box */}
          <div className="bg-emerald-800/10 border border-emerald-800/20 rounded-xl p-5 text-left">
            <h4 className="font-extrabold text-[#115e59] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-800" />
              Simulasikan di Browser Anda (DevOps Testing Hub)
            </h4>
            <p className="text-[12px] text-teal-850 mt-1">
              Untuk menguji sistem notifikasi ini secara langsung, klik tombol di bawah untuk mendaftarkan browser/sesi aktif Anda agar dapat menerima notifikasi instan.
            </p>

            <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
              <button 
                onClick={handleToggleLocalSubscription}
                className={`w-full md:w-auto px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  isCurrentlySubscribed
                    ? "bg-amber-600 hover:bg-amber-700 text-white border border-amber-700"
                    : "bg-emerald-800 hover:bg-emerald-950 text-white border border-emerald-900"
                }`}
              >
                {isCurrentlySubscribed ? "Matikan Langganan Sesi Ini" : "Daftarkan Browser Pengujian Ini"}
              </button>
              
              <div className="text-[11.5px] text-slate-500 font-mono flex items-center gap-1">
                <span>Status Izin Browser:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10.5px] uppercase ${
                  notifPermission === 'granted'
                    ? "bg-emerald-100 text-emerald-800"
                    : notifPermission === 'default'
                    ? "bg-slate-100 text-slate-650"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {notifPermission}
                </span>
              </div>
            </div>
          </div>

          {/* List of active subscribers */}
          <div className="bg-white p-5 border rounded-xl shadow-2xs space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Arsip Daftar Browser Berlangganan</h4>
              <p className="text-[11px] text-slate-400">Total {subscribers.length} device atau browser terdaftar aktif.</p>
            </div>

            <div className="max-h-[220px] overflow-y-auto divide-y-2 border rounded-lg bg-slate-50 divide-slate-100" id="subscribers_scroller">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-3 text-xs flex items-center justify-between text-left">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-800 block">{sub.user_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[280px]">Device: {sub.user_agent}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-slate-400">
                    <span className="px-1.5 py-0.5 bg-slate-200 rounded-sm text-slate-600 font-sans font-bold">{sub.role || 'Guest'}</span>
                    <span>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))}
              {subscribers.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">Belum ada pelanggan / device terdaftar di database server.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RECENT HISTORIES */}
      <div className="bg-white p-6 border rounded-xl shadow-2xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#24b47e]" />
            Catatan Dokumen Notifikasi Terkirim (Broadcast Logs)
          </h3>
          <p className="text-[11.5px] text-slate-400 mt-1">Histori siaran notifikasi yang telah disebarkan dari panel administrator.</p>
        </div>

        <div className="overflow-x-auto border rounded-xl bg-slate-50/50">
          <table className="w-full text-xs text-left" id="notification_history_table">
            <thead className="bg-slate-100 text-slate-500 uppercase tracking-widest text-[9.5px] font-black border-b">
              <tr>
                <th className="p-4">Tanggal Rilis</th>
                <th className="p-4">Judul Notifikasi</th>
                <th className="p-4">Isi Pesan Notifikasi</th>
                <th className="p-4 text-center">Audiens Target</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {bcasts.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-450 whitespace-nowrap">
                    {new Date(b.created_at || b.timestamp || Date.now()).toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{b.title}</td>
                  <td className="p-4 text-slate-600 max-w-sm break-words">{b.body}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className="px-2 py-1 bg-teal-50 border border-teal-200 text-teal-800 font-bold uppercase rounded-md text-[9.5px]">
                      {b.audience === 'all' ? 'Semua' : b.audience === 'staff' ? 'Operator/Guru' : 'Pengunjung'}
                    </span>
                  </td>
                </tr>
              ))}
              {bcasts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-sans">
                    Belum ada riwayat pengiriman notifikasi dari konsol ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
