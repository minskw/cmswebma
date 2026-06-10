/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash, Edit, Download, Check, XCircle, AlertCircle, FileText, Megaphone, Calendar, Image, Video, Pin, Clock, MapPin, User, Eye } from 'lucide-react';
import MockDb from '../database/mockDb';
import { DownloadItem, PPDBApplicant, Announcement, Event, GalleryItem } from '../types';

interface CmsAcademicSectionProps {
  activeTab: string;
  downloads: DownloadItem[];
  onRefreshData: () => void;
}

export default function CmsAcademicSection({
  activeTab,
  downloads,
  onRefreshData
}: CmsAcademicSectionProps) {
  
  const [editDownload, setEditDownload] = useState<DownloadItem | null>(null);
  
  // Fetch real PPDB applicants directly from database
  const [applicants, setApplicants] = useState<PPDBApplicant[]>(() => MockDb.getApplicants());

  // Announcements Local States & Handlers
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => MockDb.getAnnouncements());
  const [editAnn, setEditAnn] = useState<Announcement | null>(null);

  // Events Local States & Handlers
  const [events, setEvents] = useState<Event[]>(() => MockDb.getEvents());
  const [editEvt, setEditEvt] = useState<Event | null>(null);

  // Gallery Local States & Handlers
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => MockDb.getGalleryItems());
  const [editGal, setEditGal] = useState<GalleryItem | null>(null);

  // 3. Announcement Handlers
  const handleCreateAnnouncement = () => {
    setEditAnn({
      id: "ann_" + Math.random().toString(36).substring(2, 9),
      title: "Pengumuman Pembagian Raport PAS Ganjil Utama",
      slug: "pembagian-raport-pas-ganjil",
      content: "Seluruh wali murid kelas I sampai kelas VI diundang menghadiri pembagian hasil evaluasi rapor siswa ganjil di kelas masing-masing bersama guru kelas. Mohon datang tepat waktu sesuai shift jadwal yang telah dibagikan.",
      views: 0,
      is_pinned: false,
      published_at: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editAnn) {
      MockDb.saveAnnouncement(editAnn);
      setEditAnn(null);
      setAnnouncements(MockDb.getAnnouncements());
      onRefreshData();
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?")) {
      MockDb.deleteAnnouncement(id);
      setAnnouncements(MockDb.getAnnouncements());
      onRefreshData();
    }
  };

  // 4. Event Handlers
  const handleCreateEvent = () => {
    setEditEvt({
      id: "evt_" + Math.random().toString(36).substring(2, 9),
      title: "Peringatan Hari Santri Nasional MIN Singkawang",
      description: "Upacara bersama bendera, pawai busana santri, and lomba tahfidz beregu antar kelas.",
      event_date: new Date().toISOString().split('T')[0],
      event_time: "07:30 - selesai",
      location: "Halaman Kampus Utama Madrasah",
      organizer: "Panitia Hari Santri & Komite",
      published_at: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEvt) {
      MockDb.saveEvent(editEvt);
      setEditEvt(null);
      setEvents(MockDb.getEvents());
      onRefreshData();
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda kegiatan ini?")) {
      MockDb.deleteEvent(id);
      setEvents(MockDb.getEvents());
      onRefreshData();
    }
  };

  // 5. Gallery Handlers
  const handleCreateGalleryItem = () => {
    setEditGal({
      id: "gal_" + Math.random().toString(36).substring(2, 9),
      type: "foto",
      title: "Kegiatan Kerja Bakti Lingkungan Sehat Santri Cilik",
      url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
      thumbnail_url: "",
      views: 0,
      created_at: new Date().toISOString()
    });
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editGal) {
      MockDb.saveGalleryItem(editGal);
      setEditGal(null);
      setGalleryItems(MockDb.getGalleryItems());
      onRefreshData();
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item galeri multimedia ini?")) {
      MockDb.deleteGalleryItem(id);
      setGalleryItems(MockDb.getGalleryItems());
      onRefreshData();
    }
  };

  // 1. PPDB approval workflows
  const handleUpdateStatus = (id: string, newStatus: 'submitted' | 'verified' | 'accepted' | 'rejected') => {
    const matched = applicants.find(app => app.id === id);
    if (matched) {
      const updated = { ...matched, status: newStatus };
      MockDb.saveApplicant(updated);
      setApplicants(MockDb.getApplicants());
      // Log audit
      MockDb.addLog("VERIFY_PPDB", `Verifikasi status siswa PPDB ${matched.name} menjadi ${newStatus}`);
      onRefreshData();
    }
  };

  const handleDeleteApplicant = (id: string) => {
    if (confirm("Hapus registrasi siswa PPDB ini secara permanen dari pendaftaran?")) {
      MockDb.deleteApplicant(id);
      setApplicants(MockDb.getApplicants());
      onRefreshData();
    }
  };

  // 2. Download center handlers
  const handleCreateDownload = () => {
    setEditDownload({
      id: "dl_" + Math.random().toString(36).substring(2, 9),
      title: "Formulir Surat Pernyataan Wali Santri 2026/2027",
      filename: "surat_pernyataan_wali_2026.pdf",
      category: "formulir",
      file_url: "#",
      file_size: "245 KB",
      downloads_count: 0
    });
  };

  const handleSaveDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDownload) {
      MockDb.saveDownload(editDownload);
      setEditDownload(null);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" id="cms_academic_section">
      
      {/* ======================= TAB A: PPDB ONLINE MANAGER ======================= */}
      {activeTab === 'ppdb' && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-slate-805 font-black text-sm uppercase tracking-tight">Pusat Seleksi Siswa Baru (PPDB Online)</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Validasi berkas, wawancara, verifikasi orang tua wali siswa baru MIN Singkawang.</p>
          </div>

          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-505 font-bold uppercase">
                  <th className="p-3">Calon Siswa</th>
                  <th className="p-3">Kontak Orang Tua</th>
                  <th className="p-3">Asal Sekolah</th>
                  <th className="p-3">Status Seleksi</th>
                  <th className="p-3 text-right">Opsi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-705 font-medium">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="text-left">
                        <span className="font-extrabold text-slate-800 text-[12px] block">{app.name}</span>
                        <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 block">NIK: {app.nik || "12030090400045"} | TTL: {app.birth_place}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-left font-semibold text-slate-600">
                        <p>{app.father_name || "Bpk. Suryono"}</p>
                        <p className="text-slate-400 font-mono text-[10px] mt-0.5">{app.phone || "0812-3456-7890"}</p>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 font-semibold">{app.previous_school || "TK Pembina Singkawang"}</td>
                    <td className="p-3">
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md border uppercase ${
                        app.status === 'accepted' 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-805" 
                          : app.status === 'verified' 
                          ? "bg-blue-50 border-blue-100 text-blue-805"
                          : app.status === 'rejected'
                          ? "bg-rose-50 border-rose-100 text-rose-805"
                          : "bg-slate-100 border-slate-205 text-slate-500"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'verified')} 
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200.5 rounded text-[9.5px] font-black cursor-pointer uppercase"
                          title="Verifikasi Berkas"
                        >
                          Verif
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'accepted')} 
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200.5 rounded text-[9.5px] font-black cursor-pointer uppercase"
                          title="Terima Siswa"
                        >
                          Lulus
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'rejected')} 
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-105 text-rose-700 border border-rose-200.5 rounded text-[9.5px] font-black cursor-pointer uppercase"
                          title="Tolak Siswa"
                        >
                          Gagal
                        </button>
                        <button 
                          onClick={() => handleDeleteApplicant(app.id)} 
                          className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 cursor-pointer border"
                          title="Hapus"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applicants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">Belum ada calon peserta didik PPDB terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB B: FILE DOWNLOADS CENTER ======================= */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {editDownload ? (
            <form onSubmit={handleSaveDownload} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-850 uppercase">Form Berkas Unduhan Baru</h4>
                <button type="submit" className="px-4.5 py-2 bg-emerald-800 text-white font-bold rounded cursor-pointer">Simpan Berkas</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Judul Dokumen Publik</label>
                  <input type="text" required value={editDownload.title} onChange={(e) => setEditDownload({...editDownload, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Nama File Fisik (e.g. pdf/docx)</label>
                  <input type="text" required value={editDownload.filename} onChange={(e) => setEditDownload({...editDownload, filename: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Grup Kategori Unduhan</label>
                  <select value={editDownload.category} onChange={(e) => setEditDownload({...editDownload, category: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="dokumen">Dokumen Umum Akademik</option>
                    <option value="formulir">Formulir Pendaftaran</option>
                    <option value="panduan">Buku Panduan / Regulasi Kurikulum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Ukuran Berkas (e.g. 1.2 MB)</label>
                  <input type="text" required value={editDownload.file_size} onChange={(e) => setEditDownload({...editDownload, file_size: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Link File URL Sumber</label>
                  <input type="text" required value={editDownload.file_url} onChange={(e) => setEditDownload({...editDownload, file_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Pusat Distribusi Berkas Unduhan</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manajemen penerbitan formulir pendaftaran, kalender akademik, dan silabus pembelajaran.</p>
                </div>
                <button onClick={handleCreateDownload} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Tambah File Baru</button>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-white shadow-2xs">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-505 font-bold uppercase">
                      <th className="p-3">Judul Berkas</th>
                      <th className="p-3">Nama File</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Hits Unduh</th>
                      <th className="p-3 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-705 font-medium">
                    {downloads.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-805">{d.title}</td>
                        <td className="p-3 font-mono text-[10.5px] text-slate-500">{d.filename}</td>
                        <td className="p-3">
                          <span className="bg-slate-105 text-slate-700 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase">{d.category}</span>
                        </td>
                        <td className="p-3 font-mono text-[10.5px] text-slate-500">{d.file_size}</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">{d.downloads_count}x download</td>
                        <td className="p-3 text-right animate-fade-in">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditDownload(d)} className="w-7 h-7 bg-slate-50 border hover:bg-slate-100 flex items-center justify-center rounded cursor-pointer leading-3"><Edit className="w-3.5 h-3.5 text-indigo-700" /></button>
                            <button onClick={() => { if(confirm("Hapus berkas ini?")) { MockDb.deleteDownload(d.id); onRefreshData(); } }} className="w-7 h-7 bg-rose-50 border border-rose-100 hover:bg-rose-100 flex items-center justify-center rounded cursor-pointer leading-3"><Trash className="w-3.5 h-3.5 text-rose-700" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB C: PENGUMUMAN & TICKER ======================= */}
      {activeTab === 'pengumuman' && (
        <div className="space-y-4 animate-fade-in" id="cms_announcement_workspace">
          {editAnn ? (
            <form onSubmit={handleSaveAnnouncement} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-800 uppercase flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-emerald-600" />
                  <span>Isi Konten Pengumuman Utama</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditAnn(null)} className="px-3 py-1.5 border rounded-lg cursor-pointer font-bold hover:bg-slate-50">Batal</button>
                  <button type="submit" className="px-4.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer">Simpan</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Judul Pengumuman</label>
                  <input type="text" required value={editAnn.title} onChange={(e) => setEditAnn({...editAnn, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Tanggal Terbit</label>
                  <input type="date" required value={editAnn.published_at} onChange={(e) => setEditAnn({...editAnn, published_at: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1 flex items-center gap-2">
                  <span>Isi Berkas / Pengumuman Lengkap</span>
                </label>
                <textarea required rows={6} value={editAnn.content} onChange={(e) => setEditAnn({...editAnn, content: e.target.value})} className="w-full px-3 py-2 border rounded-lg md:text-xs leading-relaxed font-sans" placeholder="Tulis pengumuman di sini..." />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_pinned" checked={editAnn.is_pinned} onChange={(e) => setEditAnn({...editAnn, is_pinned: e.target.checked})} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                <label htmlFor="is_pinned" className="text-slate-600 font-bold cursor-pointer select-none text-xs uppercase tracking-wide">Tandai sebagai Di-pin (Tampilkan paling utama di beranda)</label>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Manajemen Pengumuman & Ticker Utama</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Edit dan pin maklumat operasional harian madrasah yang penting di beranda.</p>
                </div>
                <button onClick={handleCreateAnnouncement} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer hover:bg-emerald-900 leading-tight">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Terbitkan Pengumuman</span>
                </button>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-white shadow-2xs">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-505 font-bold uppercase">
                      <th className="p-3">Judul Pengumuman</th>
                      <th className="p-3">Isi Singkat</th>
                      <th className="p-3">Tgl Rilis</th>
                      <th className="p-3">Status Pin</th>
                      <th className="p-3">Pembaca</th>
                      <th className="p-3 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-750 font-medium">
                    {announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {ann.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                            <span className="font-bold text-slate-805 line-clamp-1">{ann.title}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500 max-w-[240px] truncate">{ann.content}</td>
                        <td className="p-3 font-mono text-[10.5px] text-slate-400">{ann.published_at}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                            ann.is_pinned ? "bg-amber-50 border-amber-100 text-amber-800" : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}>
                            {ann.is_pinned ? "Pinned" : "Regular"}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{ann.views || 0} hits view</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditAnn(ann)} className="w-7 h-7 bg-slate-50 border hover:bg-slate-100 flex items-center justify-center rounded cursor-pointer leading-3"><Edit className="w-3.5 h-3.5 text-indigo-700" /></button>
                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="w-7 h-7 bg-rose-50 border border-rose-100 hover:bg-rose-100 flex items-center justify-center rounded cursor-pointer leading-3"><Trash className="w-3.5 h-3.5 text-rose-700" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {announcements.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">Tidak ada pengumuman tersedia.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB D: EVENTS & AGENDA ======================= */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-fade-in" id="cms_events_workspace">
          {editEvt ? (
            <form onSubmit={handleSaveEvent} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-800 uppercase flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Formulir Detail Agenda & Kegiatan</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditEvt(null)} className="px-3 py-1.5 border rounded-lg cursor-pointer col-span-1 font-bold hover:bg-slate-50">Batal</button>
                  <button type="submit" className="px-4.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer">Simpan Agenda</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Judul Agenda Kegiatan</label>
                  <input type="text" required value={editEvt.title} onChange={(e) => setEditEvt({...editEvt, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Penyelenggara / Organizer</label>
                  <input type="text" required value={editEvt.organizer} onChange={(e) => setEditEvt({...editEvt, organizer: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanggal Pelaksanaan</span>
                  </label>
                  <input type="date" required value={editEvt.event_date} onChange={(e) => setEditEvt({...editEvt, event_date: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Waktu / Jam</span>
                  </label>
                  <input type="text" required value={editEvt.event_time} onChange={(e) => setEditEvt({...editEvt, event_time: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 08:00 - selesai" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lokasi Fisik / Tempat</span>
                  </label>
                  <input type="text" required value={editEvt.location} onChange={(e) => setEditEvt({...editEvt, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Rincian Deskripsi Kegiatan</label>
                <textarea required rows={4} value={editEvt.description} onChange={(e) => setEditEvt({...editEvt, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg md:text-xs" />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Katalog Agenda & Kegiatan Madrasah</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kelola agenda akademik, rapat komite, dies natalis, and kalender ujian madrasah.</p>
                </div>
                <button onClick={handleCreateEvent} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer hover:bg-emerald-900 leading-tight">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kegiatan Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-white shadow-2xs">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-505 font-bold uppercase">
                      <th className="p-3">Nama Agenda</th>
                      <th className="p-3">Penyelenggara</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Jam</th>
                      <th className="p-3">Tempat</th>
                      <th className="p-3 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-705 font-medium">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-850">{evt.title}</td>
                        <td className="p-3 text-slate-600">{evt.organizer}</td>
                        <td className="p-3 font-mono text-emerald-800 font-bold">{evt.event_date}</td>
                        <td className="p-3 text-slate-500 font-mono">{evt.event_time}</td>
                        <td className="p-3 text-slate-600">{evt.location}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditEvt(evt)} className="w-7 h-7 bg-slate-50 border hover:bg-slate-100 flex items-center justify-center rounded cursor-pointer leading-3"><Edit className="w-3.5 h-3.5 text-indigo-700" /></button>
                            <button onClick={() => handleDeleteEvent(evt.id)} className="w-7 h-7 bg-rose-50 border border-rose-100 hover:bg-rose-100 flex items-center justify-center rounded cursor-pointer leading-3"><Trash className="w-3.5 h-3.5 text-rose-700" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">Belum ada agenda terdaftar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB E: GALLERY FOTO & VIDEO ======================= */}
      {activeTab === 'galeri' && (
        <div className="space-y-4 animate-fade-in" id="cms_gallery_workspace">
          {editGal ? (
            <form onSubmit={handleSaveGalleryItem} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-800 uppercase flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>Formulir Tambah Dokumen Media</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditGal(null)} className="px-3 py-1.5 border rounded-lg cursor-pointer font-bold hover:bg-slate-50">Batal</button>
                  <button type="submit" className="px-4.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer">Simpan Media</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Judul / Keterangan Media</label>
                  <input type="text" required value={editGal.title} onChange={(e) => setEditGal({...editGal, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Jenis Media</label>
                  <select value={editGal.type} onChange={(e) => setEditGal({...editGal, type: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg cursor-pointer">
                    <option value="foto">Foto Dokumentasi Kegiatan</option>
                    <option value="video">Video Dokumentasi (YouTube Embed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1 font-mono">Tautan Media URL Sumber (Direct URL / Youtube embeds)</label>
                <input type="text" required value={editGal.url} onChange={(e) => setEditGal({...editGal, url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]" />
              </div>

              {editGal.type === 'video' && (
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1 font-mono">Thumbnail Cover Foto URL (Opsional untuk video)</label>
                  <input type="text" value={editGal.thumbnail_url || ''} onChange={(e) => setEditGal({...editGal, thumbnail_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]" />
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Galeri Foto & Video Kegiatan Kampus</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kelola koleksi foto dokumentasi and tayangan video youtube kesiswaan.</p>
                </div>
                <button onClick={handleCreateGalleryItem} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer hover:bg-emerald-900 leading-tight">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Unggah Media Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-2xs group hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="h-40 bg-slate-100 relative overflow-hidden border-b">
                        <img 
                          src={item.type === 'video' ? (item.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600") : item.url} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                        <span className={`absolute top-2 left-2 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${
                          item.type === 'video' ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="p-3 text-left">
                        <h4 className="text-slate-850 font-bold text-[11px] leading-relaxed line-clamp-2">{item.title}</h4>
                        <p className="text-[9.5px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{item.views || 0} views</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 border-t flex justify-end gap-1">
                      <button onClick={() => setEditGal(item)} className="p-1 px-2.5 bg-white border rounded text-[10px] font-bold text-indigo-750 flex items-center gap-1 hover:bg-slate-100 cursor-pointer">Edit</button>
                      <button onClick={() => handleDeleteGalleryItem(item.id)} className="p-1 px-2.5 bg-rose-50 border border-rose-100 rounded text-[10px] font-bold text-rose-700 flex items-center gap-1 hover:bg-rose-100 cursor-pointer">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB F & G: GENERAL SUMMARIES ======================= */}
      {(activeTab === 'akademik_kalender' || activeTab === 'akademik_ekstrakurikuler') && (
        <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight border-b pb-2">
            Konfigurasi {activeTab === 'akademik_kalender' ? 'Kalender Pembelajaran' : 'Kegiatan Ekstrakurikuler'}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Halaman publik {activeTab === 'akademik_kalender' ? 'Kalender Akademik' : 'Ekstrakurikuler'} saat ini dikendalikan oleh modul visual dan database terpisah. Edit teks informatif pendukung langsung melalui menu <strong>Pengaturan Master &gt; Identitas & Slogan</strong> maupun tab <strong>Katalog Berkualitas Unduhan File</strong> untuk menyematkan dokumen PDF aslinya agar dapat didownload dengan mudah oleh wali murid.
          </p>
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border text-[11px] text-slate-600 font-medium">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Regulasi silabus terunggah secara otomatis dalam cache PWA offline.</span>
          </div>
        </div>
      )}

    </div>
  );
}
