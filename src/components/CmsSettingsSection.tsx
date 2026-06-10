/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Save, Info, ArrowUp, ArrowDown, Trash, Plus, FileCode, Copy, CheckCircle, ShieldAlert } from 'lucide-react';
import MockDb from '../database/mockDb';
import { SchoolSettings, SeoSettings } from '../types';

interface CmsSettingsSectionProps {
  activeTab: string;
  settings: SchoolSettings;
  seoSettings: SeoSettings;
  sqlSchemaCode: string;
  onRefreshData: () => void;
}

export default function CmsSettingsSection({
  activeTab,
  settings,
  seoSettings,
  sqlSchemaCode,
  onRefreshData
}: CmsSettingsSectionProps) {
  
  // Local active states
  const [formSettings, setFormSettings] = useState<SchoolSettings>({ ...settings });
  const [formSeo, setFormSeo] = useState<SeoSettings>({ ...seoSettings });
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Quick show alert
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveSettings = (updated: SchoolSettings) => {
    MockDb.saveSettings(updated);
    setFormSettings({ ...updated });
    // Write log
    MockDb.addLog("SAVE_CONFIG", `Merubah parameter master identitas portal pada seksi tab ${activeTab}`);
    onRefreshData();
    triggerNotification("✅ Konfigurasi Pengaturan Master berhasil disimpan!");
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    MockDb.saveSeoSettings(formSeo);
    MockDb.addLog("SAVE_SEO", "Pembaruan metadata SEO publik madrasah");
    onRefreshData();
    triggerNotification("✅ Pengaturan SEO & Kamus Robot Google berhasil dimutakhirkan!");
  };

  // Slideshow ordering logic
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...(formSettings.hero_slides || [])];
    if (direction === 'up' && index > 0) {
      const temp = slides[index];
      slides[index] = slides[index - 1];
      slides[index - 1] = temp;
    } else if (direction === 'down' && index < slides.length - 1) {
      const temp = slides[index];
      slides[index] = slides[index + 1];
      slides[index + 1] = temp;
    }
    const updated = { ...formSettings, hero_slides: slides };
    handleSaveSettings(updated);
  };

  const deleteSlide = (index: number) => {
    if (confirm("Hapus slide banner ini dari slider carousel depan?")) {
      const slides = (formSettings.hero_slides || []).filter((_, idx) => idx !== index);
      const updated = { ...formSettings, hero_slides: slides };
      handleSaveSettings(updated);
    }
  };

  const addSlide = () => {
    const newSlide = {
      image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
      title: "Sarana Pembelajaran Berbasis Digital Madrasah Unggulan",
      subtitle: "Kombinasi teknologi mutakhir melahirkan santri berdaya saing global"
    };
    const updated = { ...formSettings, hero_slides: [...(formSettings.hero_slides || []), newSlide] };
    handleSaveSettings(updated);
  };

  const updateSlideField = (index: number, field: string, value: string) => {
    const slides = [...(formSettings.hero_slides || [])];
    slides[index] = { ...slides[index], [field]: value };
    setFormSettings({ ...formSettings, hero_slides: slides });
  };

  return (
    <div className="space-y-6 text-left font-sans text-sm animate-fade-in" id="cms_settings_section">
      
      {notification && (
        <div className="fixed bottom-6 right-6 z-55 bg-[#00251e] border border-emerald-500 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_rgba(0,183,121,0.25)]">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ======================= IDENTITAS & SLOGAN ======================= */}
      {activeTab === 'sets_identitas' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Identitas, NPSN & Slogan</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi nama lembaga pemerintah, nomor statistik, dan motto utama.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nama Madrasah / Lembaga</label>
              <input type="text" value={formSettings.school_name} onChange={(e) => setFormSettings({ ...formSettings, school_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input type="text" value={formSettings.npsn || '60721105'} onChange={(e) => setFormSettings({ ...formSettings, npsn: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Slogan Utama / Banner Slogan</label>
              <input type="text" value={formSettings.slogan} onChange={(e) => setFormSettings({ ...formSettings, slogan: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nilai Akreditasi Madrasah (grade)</label>
              <input type="text" value={formSettings.accreditation || 'A (Sangat Unggul)'} onChange={(e) => setFormSettings({ ...formSettings, accreditation: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Email Kontak Resmi</label>
              <input type="email" value={formSettings.contact_email} onChange={(e) => setFormSettings({ ...formSettings, contact_email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Telepon Kantor</label>
              <input type="text" value={formSettings.contact_phone} onChange={(e) => setFormSettings({ ...formSettings, contact_phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Alamat Domisili Fisik</label>
              <input type="text" value={formSettings.address} onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </form>
      )}

      {/* ======================= TEKS BANNER & TICKER ======================= */}
      {activeTab === 'sets_topbar' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Running Text & Announcement Ticker</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Edit teks berjalan di topbar situs untuk pemberitahuan instan.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Teks Pemberitahuan Ticker Berjalan (Running Ticker)</label>
            <textarea rows={3} value={formSettings.running_text || 'Penerimaan Peserta Didik Baru (PPDB) Madrasah Ibtidaiyah Negeri (MIN) Singkawang Tahun Pelajaran 2026/2027 Telah Resmi Dibuka! Segera Daftarkan Putra-Putri Anda Secara Online Sebelum Kuota Terpenuhi.'} onChange={(e) => setFormSettings({ ...formSettings, running_text: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Topbar Notice Alert</label>
            <input type="text" value={formSettings.topbar_text || 'NPSN: 60721105 | Terakreditasi B-A Kemenag'} onChange={(e) => setFormSettings({ ...formSettings, topbar_text: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs" />
          </div>
        </form>
      )}

      {/* ======================= IMAGE HERO SLIDER CAROUSEL ======================= */}
      {activeTab === 'sets_hero_slider' && (
        <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Banners Carousel Hero Slideshow</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Atur urutan penayangan gambar, ganti cover, tambah atau hapus jajaran banner depan.</p>
            </div>
            <button onClick={addSlide} className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-910 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah Banner Slide</button>
          </div>

          <div className="space-y-4.5">
            {(formSettings.hero_slides || []).map((slide, index) => (
              <div key={index} className="p-4 bg-slate-50 border rounded-xl flex flex-col lg:flex-row items-stretch gap-4 text-xs">
                <div className="w-full lg:w-44 shrink-0 bg-slate-200 rounded-lg overflow-hidden border">
                  <img src={slide.image_url} className="w-full h-full object-cover min-h-[90px]" alt="" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Judul Slide Banner</span>
                      <input type="text" value={slide.title} onChange={(e) => updateSlideField(index, 'title', e.target.value)} className="w-full px-2 py-1 bg-white border rounded mt-0.5" />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Keterangan Sub-informasi</span>
                      <input type="text" value={slide.subtitle} onChange={(e) => updateSlideField(index, 'subtitle', e.target.value)} className="w-full px-2 py-1 bg-white border rounded mt-0.5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase">Thumbnail Banner Cover URL</span>
                    <input type="text" value={slide.image_url} onChange={(e) => updateSlideField(index, 'image_url', e.target.value)} className="w-full px-2.5 py-1 bg-white border rounded mt-0.5 font-mono text-[10px]" />
                  </div>
                </div>
                <div className="lg:w-28 shrink-0 flex lg:flex-col items-center justify-center gap-1.5 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-3">
                  <button onClick={() => moveSlide(index, 'up')} className="p-1 px-2.5 bg-white border rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"><ArrowUp className="w-3 h-3 text-slate-600" /> Up</button>
                  <button onClick={() => moveSlide(index, 'down')} className="p-1 px-2.5 bg-white border rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"><ArrowDown className="w-3 h-3 text-slate-600" /> Down</button>
                  <button onClick={() => deleteSlide(index)} className="p-1 px-2 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 flex items-center gap-1 cursor-pointer text-rose-700 leading-3 shadow-2xs"><Trash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t flex justify-end">
            <button onClick={() => handleSaveSettings(formSettings)} className="px-5 py-2.5 bg-emerald-800 text-white font-extrabold text-xs rounded-lg cursor-pointer">TERAPKAN SUSUNAN SLIDER &times;</button>
          </div>
        </div>
      )}

      {/* ======================= SAMBUTAN & SEJARAH ======================= */}
      {activeTab === 'sets_sejarah' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Sambutan Kepala Madrasah & Sejarah</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi teks selamat datang, nama kepala sekolah, NIP, and cerita berdirinya sekolah.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nama Kepala Madrasah (Kasek)</label>
              <input type="text" value={formSettings.principal_name || 'H. Kamarudin, S.Ag'} onChange={(e) => setFormSettings({ ...formSettings, principal_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">NIP Kepala Madrasah</label>
              <input type="text" value={formSettings.principal_nip || '197410222005011002'} onChange={(e) => setFormSettings({ ...formSettings, principal_nip: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Foto Kepala Madrasah URL</label>
            <input type="text" value={formSettings.principal_image_url || ''} onChange={(e) => setFormSettings({ ...formSettings, principal_image_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
          </div>
          <div>
            <label className="block text-[#006e5d] font-bold uppercase text-[10px] mb-1">☕ Teks Pidato Sambutan Hangat Kepala Sekolah</label>
            <textarea rows={5} value={formSettings.welcome_message || ''} onChange={(e) => setFormSettings({ ...formSettings, welcome_message: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">📜 Sejarah Lengkap Berdirinya MIN Singkawang</label>
            <textarea rows={6} value={formSettings.history_text || ''} onChange={(e) => setFormSettings({ ...formSettings, history_text: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
          </div>
        </form>
      )}

      {/* ======================= VISI, MISI & TUJUAN ======================= */}
      {activeTab === 'sets_visi_misi' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Visi, Misi & Tujuan Madrasah</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Format misi and tujuan madrasah (Simpan satu butir per baris baru).</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Pernyataan Visi Sekolah</label>
            <input type="text" value={formSettings.vision} onChange={(e) => setFormSettings({ ...formSettings, vision: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Misi Sekolah (Satu butir per baris baru)</label>
            <textarea rows={5} value={(formSettings.missions || []).join('\n')} onChange={(e) => setFormSettings({ ...formSettings, missions: e.target.value.split('\n').filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg font-sans leading-relaxed text-xs" placeholder="Mewujudkan lulusan fashih..." />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Tujuan Madrasah (Satu butir per baris baru)</label>
            <textarea rows={5} value={(formSettings.objectives || []).join('\n')} onChange={(e) => setFormSettings({ ...formSettings, objectives: e.target.value.split('\n').filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg font-sans leading-relaxed text-xs" placeholder="Meningkatkan kemandirian belajar..." />
          </div>
        </form>
      )}

      {/* ======================= FOOTER & MAP LOCATION ======================= */}
      {activeTab === 'sets_footer' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Footer, Sosial Media & Maps</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi hak cipta website, link profil dinas, and peta lokasi.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Facebook Link URL</label>
              <input type="text" value={formSettings.facebook_url || ''} onChange={(e) => setFormSettings({ ...formSettings, facebook_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Instagram Link URL</label>
              <input type="text" value={formSettings.instagram_url || ''} onChange={(e) => setFormSettings({ ...formSettings, instagram_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Copyright Notice Publik</label>
            <input type="text" value={formSettings.copyright_text} onChange={(e) => setFormSettings({ ...formSettings, copyright_text: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Source Code Google Maps Embed Iframe (src saja)</label>
            <input type="text" value={formSettings.maps_embed_src || ''} onChange={(e) => setFormSettings({ ...formSettings, maps_embed_src: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
          </div>
        </form>
      )}

      {/* ======================= GLOBAL SEO & SITEMAP XML ======================= */}
      {activeTab === 'sets_seo' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSeo} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3.5">
              <div>
                <h3 className="text-slate-800 font-black text-sm uppercase">Global SEO Master & Google Metadata</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi tag pencarian Google, keywords indeks, and deskripsi global.</p>
              </div>
              <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan Metadata</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">SEO Title Global</label>
                <input type="text" value={formSeo.meta_title} onChange={(e) => setFormSeo({ ...formSeo, meta_title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">SEO Keywords (koma dipisah)</label>
                <input type="text" value={formSeo.meta_keywords} onChange={(e) => setFormSeo({ ...formSeo, meta_keywords: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Meta Description Global</label>
              <textarea rows={3} value={formSeo.meta_description} onChange={(e) => setFormSeo({ ...formSeo, meta_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1 font-sans">Robots.txt Directives</label>
                <input type="text" value={formSeo.robots_directive || 'index, follow'} onChange={(e) => setFormSeo({ ...formSeo, robots_directive: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1 font-sans">Canonical Absolute Link URL</label>
                <input type="text" value={formSeo.canonical_url || 'https://minsingkawang.sch.id'} onChange={(e) => setFormSeo({ ...formSeo, canonical_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </form>

          {/* Interactive Sitemap generator workspace */}
          <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-slate-800 font-black text-sm uppercase border-b pb-2">XML Sitemap & PWA Pre-cache Diagnostic</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Tekan tombol di bawah untuk men-simulasi generator peta situs XML standard Google Search Console. Dokumen ini diindeks otomatis oleh service worker PWA untuk merayapi seluruh rilis berita utama.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-[10.5px] max-h-32 overflow-y-auto whitespace-pre">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://minsingkawang.sch.id/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://minsingkawang.sch.id/profil</loc>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://minsingkawang.sch.id/berita</loc>
    <changefreq>hourly</changefreq>
  </url>
</urlset>`}
            </div>
            <button 
              onClick={() => triggerNotification("📂 XML Google Sitemap berhasil dirilis & didaftarkan pada Search Console!")}
              className="px-4 py-2 border border-emerald-500 font-bold text-xs text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Re-generate Sitemap & Sync Robots
            </button>
          </div>
        </div>
      )}

      {/* ======================= STRUKTUR SUPABASE SCHEMA SQL ======================= */}
      {activeTab === 'sets_db' && (
        <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-2.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Skema Basis Data SQL (Supabase PostgreSQL DDL)</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Struktur tabel relasional database jika PWA berpindah ke cloud hosting.</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(sqlSchemaCode);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2000);
                triggerNotification("📋 Kode DDL SQL berhasil dikopi ke clipboard!");
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-205 border text-slate-700 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? "Tersalin!" : "Kopi SQL"}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed border border-slate-900 border-t-4 border-t-emerald-500 shadow-inner">
            <pre>{sqlSchemaCode}</pre>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs leading-relaxed text-slate-600">
            <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-800 uppercase text-[10.5px]">Peringatan Keamanan Database</p>
              <p className="mt-0.5">Kode DDL di atas mencakup pembuatan trigger UUID, audit logging liaison, dan indexing otomatis B-Tree untuk menjamin kecepatan kueri berita bermega-mega byte secara stabil di Cloud PostgreSQL.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
