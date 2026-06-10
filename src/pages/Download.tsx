/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DownloadItem } from '../types';
import { Download, Search, FileText, CheckCircle, ExternalLink, RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { isGoogleDriveUrl } from '../utils/googleDriveHelper';
import { DriveFileEmbed } from '../components/DriveFileEmbed';

interface DownloadProps {
  items: DownloadItem[];
  onIncrementDownload: (id: string) => void;
}

export default function DownloadPage({ items, onIncrementDownload }: DownloadProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [previewItem, setPreviewItem] = useState<DownloadItem | null>(null);
  const [toasts, setToasts] = useState<{ id: string; title: string; filename: string }[]>([]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'SEMUA' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToast = (title: string, filename: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, filename }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDownloadClick = (item: DownloadItem) => {
    onIncrementDownload(item.id);
    addToast(item.title, item.filename);
    
    // Open the download link or filename URL in a new tab
    const targetUrl = item.file_url || item.filename;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans tracking-tight text-left" id="download_root_page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Title Banner */}
        <div className="text-left bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 mb-8 border border-emerald-700 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">PUSAT DATA UNDUHAN</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold uppercase leading-none">Download Dokumen Resmi</h2>
          <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-2.5">
            Unduh formulir kesepakatan tata tertib wali murid, brosur pendaftaran PPDB, kalender libur akademik, silabus pendidik, maupun materi suplemen kurikulum merdeka.
          </p>
        </div>

        {/* Filter Toolbar controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4.5 rounded-xl border border-slate-100 shadow-xs">
          
          <div className="flex flex-wrap gap-1 w-full md:w-auto shrink-0">
            {['SEMUA', 'dokumen', 'formulir', 'panduan'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-colors uppercase ${
                  selectedCategory === cat ? "bg-emerald-800 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === 'SEMUA' ? 'Semua Berkas' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari brosur, formulir, panduan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* List Table items layout */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border hover:border-emerald-200/60 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all shadow-xs"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border shrink-0">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-slate-950 font-extrabold text-xs uppercase leading-snug">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 leading-none">{item.filename} ({item.file_size})</p>
                    <span className="inline-block mt-2 bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4.5 w-full md:w-auto self-end md:self-center justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    {item.downloads_count} Kali Diunduh
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPreviewItem(item)}
                      className="px-3.5 py-2 text-[10px] font-bold text-slate-700 bg-slate-50 border hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      PREVIEW PDF
                    </button>
                    <button 
                      onClick={() => handleDownloadClick(item)}
                      className="px-3.5 py-2 text-[10px] font-bold text-white bg-emerald-800 hover:bg-emerald-950 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> UNDUH FILE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl max-w-sm mx-auto">
            <span className="text-3xl">📂</span>
            <p className="text-xs text-slate-500 mt-2">Berkas unduhan tidak ditemukan.</p>
          </div>
        )}

        {/* Simulated PDF Preview popup Modal drawer */}
        {previewItem && (
          <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md p-4 flex justify-center items-center">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal header */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                <div className="text-left">
                  <h4 className="font-extrabold text-xs uppercase tracking-tight">{previewItem.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">Pratinjau Lembar Dokumen Resmi Madrasah</p>
                </div>
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 text-xs font-bold leading-none cursor-pointer rounded-md"
                >
                  Tutup [ ✕ ]
                </button>
              </div>

              {/* Simulated Paper Sheets or Google Drive iframe inside modal */}
              <div className="bg-slate-100 p-4 md:p-8 overflow-y-auto flex-grow max-h-[70vh]">
                {isGoogleDriveUrl(previewItem.file_url) || isGoogleDriveUrl(previewItem.filename) ? (
                  <div className="w-full">
                    <DriveFileEmbed
                      url={previewItem.file_url || previewItem.filename}
                      title={previewItem.title}
                      height="540px"
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md border max-w-2xl mx-auto p-12 text-left space-y-8 min-h-[600px] text-slate-700 relative select-none">
                    {/* Stamp */}
                    <div className="absolute top-12 right-12 border-4 border-emerald-700/30 text-emerald-700/30 font-black tracking-widest uppercase p-2 text-xs rounded rotate-12">
                      SALINAN SAH
                    </div>

                    {/* Letterhead */}
                    <div className="text-center border-b-2 border-double border-slate-900 pb-5 max-w-xl mx-auto space-y-1">
                      <h5 className="font-bold text-xs uppercase text-slate-900 leading-snug">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h5>
                      <p className="text-[11px] font-extrabold uppercase text-slate-900 leading-none">KANTOR KEMENTERIAN AGAMA KOTA SINGKAWANG</p>
                      <p className="text-[12px] font-black uppercase text-slate-950 leading-none">MADRASAH IBTIDAIYAH NEGERI SINGKAWANG</p>
                      <p className="text-[9px] text-slate-400">Jl. Jenderal Sudirman No. 45, Condong, Kota Singkawang Tengah • Telp: (0562) 631234</p>
                    </div>

                    {/* Body Title */}
                    <div className="text-center space-y-1">
                      <h6 className="font-extrabold text-xs uppercase underline tracking-wide">SURAT KEPUTUSAN KELAYAKAN RESMI</h6>
                      <p className="text-[10px] text-slate-400 font-mono">Nomor : B-1215/MIn-Skw/PP.00.4/06/2026</p>
                    </div>

                    {/* Mimic text paragraph lines */}
                    <div className="text-xs space-y-4 leading-relaxed font-sans mt-8 text-neutral-600">
                      <p>Menimbang, bahwa dalam rangka tertib administrasi, pemenuhan keadilan publik, dan pemetaan kelulusan calon siswa didik baru Madrasah Ibtidaiyah Negeri Singkawang Tahun Ajaran 2026/2027 secara teratur.</p>
                      <p>Mengingat, Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional beserta standar kelayakan kurikulum kementerian agama.</p>
                      <p>MEMUTUSKAN, Menetapkan berkas standard operasional prosedur ini sah, berkekuatan hukum, and wajib diindahkan oleh wali murid terdaftar.</p>
                    </div>

                    {/* Signature block */}
                    <div className="pt-12 text-right w-64 ml-auto space-y-1 text-xs">
                      <p>Dikeluarkan di: Singkawang</p>
                      <p>Pada tanggal: 8 Juni 2026</p>
                      <p className="font-bold pt-4">Kepala MIN Singkawang,</p>
                      <div className="h-10"></div>
                      <p className="font-extrabold underline">H. Kamaludin, S.Ag., M.Pd.</p>
                      <p className="text-[9px] text-slate-400">NIP. 197508122002121003</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer action */}
              <div className="bg-slate-50 p-4 shrink-0 border-t flex justify-end gap-2">
                <button 
                  onClick={() => handleDownloadClick(previewItem)}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> UNDUH PDF SEKARANG
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modern, Floating Toast Notification Stack in bottom-right anchor */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md shadow-2xl rounded-xl p-4 border border-slate-800 hover:border-emerald-500/40 transition-colors duration-200 flex items-start gap-3"
            >
              <div className="p-1 px-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Unduhan Dimulai</h5>
                <p className="text-xs font-extrabold text-slate-100 leading-snug mt-1 break-words">{toast.title}</p>
                <p className="text-[9px] text-slate-400 mt-1.5 font-mono truncate">{toast.filename}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer bg-transparent border-0"
                title="Sembunyikan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
