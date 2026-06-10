/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Image as ImageIcon, Search, Download, Trash2, Copy, Check, UploadCloud,
  File, Plus, HelpCircle, HardDrive, Info, Share2, Filter, AlertTriangle, List, Grid, CheckCircle,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MockDb from '../database/mockDb';
import { isGoogleDriveUrl, convertGoogleDriveToImageUrl } from '../utils/googleDriveHelper';

interface CmsMediaLibrarySectionProps {
  onRefreshData?: () => void;
}

export default function CmsMediaLibrarySection({
  onRefreshData
}: CmsMediaLibrarySectionProps) {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'document'>('all');
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Interactive Upload Drop-Zone States
  const [isDragActive, setIsDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Custom Manual Add Trigger States
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualBucket, setManualBucket] = useState('general');
  const [manualMime, setManualMime] = useState('image/jpeg');
  const [manualSize, setManualSize] = useState('450000'); // bytes
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Micro-toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = () => {
    setMediaList(MockDb.getMedia());
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (url: string, id: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      triggerToast(`📋 Tautan media berhasil disalin ke papan klip!`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      // Fallback for iframe sandboxes
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedId(id);
      triggerToast(`📋 Tautan media berhasil disalin!`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };

  // Drag and Drop core handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Convert uploaded local file to readable base64 object
  const processLocalFile = (file: File) => {
    const reader = new FileReader();
    setUploadProgress(10);
    
    // Animate progress simulation for premium feel
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 15;
      });
    }, 80);

    reader.onloadend = () => {
      clearInterval(timer);
      setUploadProgress(100);
      
      const fileUrl = reader.result as string;
      const roundedSize = file.size;
      
      const newMediaItem = {
        filename: file.name,
        file_path: fileUrl,
        bucket_name: file.type.startsWith('image/') ? 'general' : 'documents',
        mime_type: file.type || 'application/octet-stream',
        file_size: roundedSize
      };

      setTimeout(() => {
        MockDb.addMedia(newMediaItem);
        loadMedia();
        if (onRefreshData) onRefreshData();
        setUploadProgress(null);
        setShowUploadModal(false);
        triggerToast(`🎉 Berhasil mengunggah ${file.name} ke pustaka media!`);
      }, 2500);
    };

    reader.onerror = () => {
      clearInterval(timer);
      setUploadProgress(null);
      triggerToast(`❌ Gagal membaca dokumen lokal.`);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processLocalFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processLocalFile(e.target.files[0]);
    }
  };

  // Submit external or manually-registered asset metadata
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualUrl) {
      alert("Harap lengkapi nama berkas dan URL tautan eksternal.");
      return;
    }

    setUploadProgress(20);
    const mockVal = parseInt(manualSize, 10) || 450000;

    const interval = setInterval(() => {
      setUploadProgress(v => {
        if (v === null) return null;
        if (v >= 90) { clearInterval(interval); return 90; }
        return v + 20;
      });
    }, 70);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      let processedUrl = manualUrl;
      let processedMime = manualMime;
      
      if (isGoogleDriveUrl(manualUrl)) {
        // If they chose document or the file ends with .pdf, mark as PDF
        if (manualName.toLowerCase().endsWith('.pdf') || manualBucket === 'documents' || manualMime === 'application/pdf') {
          processedMime = 'application/pdf';
        } else {
          processedMime = 'image/jpeg';
          processedUrl = convertGoogleDriveToImageUrl(manualUrl);
        }
      }
      
      const newItem = {
        filename: manualName,
        file_path: processedUrl,
        bucket_name: manualBucket,
        mime_type: processedMime,
        file_size: mockVal
      };

      MockDb.addMedia(newItem);
      loadMedia();
      if (onRefreshData) onRefreshData();
      
      // Cleanup States
      setUploadProgress(null);
      setManualName('');
      setManualUrl('');
      setShowUploadModal(false);
      triggerToast(`⚓ Berhasil menautkan aset eksternal${isGoogleDriveUrl(manualUrl) ? ' (Google Drive)' : ''}: ${manualName}`);
    }, 800);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus '${name}' secara permanen dari server?`)) {
      MockDb.deleteMedia(id);
      loadMedia();
      if (onRefreshData) onRefreshData();
      triggerToast(`🗑️ Berkas '${name}' berhasil dihapus.`);
    }
  };

  // Filtering list based on search term & choices
  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.mime_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.bucket_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isImage = item.mime_type.startsWith('image/');
    const isDoc = !isImage;
    
    const matchesType = selectedType === 'all' || 
                        (selectedType === 'image' && isImage) || 
                        (selectedType === 'document' && isDoc);
                        
    const matchesBucket = selectedBucket === 'all' || item.bucket_name === selectedBucket;

    return matchesSearch && matchesType && matchesBucket;
  });

  // Calculate unique buckets
  const buckets = Array.from(new Set(mediaList.map(m => m.bucket_name || 'general')));

  // Format File Size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6" id="cms_media_library_root">
      
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#01352e] border border-[#00e3a5] text-white text-xs font-semibold py-3.5 px-5 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm"
          >
            <CheckCircle className="w-5 h-5 text-[#00e3a5] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
              <FolderOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-sans font-black text-slate-900 tracking-tight uppercase">MEDIA LIBRARY / PUSTAKA</h2>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5 uppercase">Kelola Berkas Publikasi & Dokumen Terpusat</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Berkas Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Quick Find */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Cari media berdasarkan nama berkas, ekstensi mimes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-200 outline-none focus:border-emerald-500 rounded-xl transition-all"
            />
          </div>

          {/* Quick Filters Options */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
              <button 
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedType === 'all' ? 'bg-white shadow-2xs text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setSelectedType('image')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedType === 'image' ? 'bg-white shadow-2xs text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Gambar ({mediaList.filter(m => m.mime_type?.startsWith('image/')).length})
              </button>
              <button 
                onClick={() => setSelectedType('document')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedType === 'document' ? 'bg-white shadow-2xs text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Dokumen ({mediaList.filter(m => !m.mime_type?.startsWith('image/')).length})
              </button>
            </div>

            {/* Bucket Dropdown select */}
            <select
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value)}
              className="text-xs bg-white border border-slate-200 p-2 rounded-xl text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="all">Semua Folder / Bucket</option>
              {buckets.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <div className="flex border border-slate-200 rounded-lg p-0.5 shadow-2xs bg-white">
              <button 
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded cursor-pointer ${viewLayout === 'grid' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
                title="Tampilan Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded cursor-pointer ${viewLayout === 'list' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
                title="Tampilan List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid / List Workspace rendering */}
      {filteredMedia.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-14 text-center">
          <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-xs font-bold text-slate-700 uppercase">Tidak Ada Berkas Ditemukan</h3>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Pustaka media kosong atau tidak ada berkas yang cocok dengan filter pencarian pencocokan Anda. Unggah berkas gambar/PDF baru untuk disebar.
          </p>
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredMedia.map(item => {
              const isImage = item.mime_type?.startsWith('image/');
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col h-full"
                >
                  {/* Thumbnail Preview Area */}
                  <div className="aspect-square bg-slate-50 border-b border-light/5 relative overflow-hidden flex items-center justify-center shrink-0">
                    {isImage ? (
                      <img 
                        src={item.file_path} 
                        alt={item.filename}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-rose-500 p-4">
                        <FileText className="w-10 h-10 mb-1 animate-pulse" />
                        <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded uppercase mt-0.5">
                          {item.mime_type?.split('/')[1] || 'DOC'}
                        </span>
                      </div>
                    )}

                    {/* Quick copy overlay screen */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-200">
                      <button
                        onClick={() => copyToClipboard(item.file_path, item.id)}
                        className="bg-white hover:bg-emerald-50 text-slate-800 font-bold p-2 rounded-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 text-xs shadow-md flex items-center gap-1"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-605" />}
                      </button>
                      <a
                        href={item.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-100 text-slate-800 p-2 rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-md flex items-center justify-center"
                        title="Lihat Penuh"
                      >
                        <Share2 className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Attachment metadata */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-0.5">
                      <span className="text-[8px] bg-slate-100 text-slate-500 uppercase font-mono px-1.5 py-0.5 rounded font-extrabold max-w-full truncate block whitespace-nowrap">
                        📁 {item.bucket_name || 'general'}
                      </span>
                      <strong className="text-[11px] text-slate-800 font-bold block truncate" title={item.filename}>
                        {item.filename}
                      </strong>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between mt-auto">
                      <div className="font-mono text-[9px] text-slate-400 space-y-0.5">
                        <span className="block">{formatBytes(item.file_size)}</span>
                        <span className="block text-[8px] text-slate-300">Oleh: {item.uploaded_by_name || 'Operator'}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id, item.filename)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-lg cursor-pointer transition-all"
                        title="Hapus Berkas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List Layout Option */
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
                <th className="p-3 pl-4">Berkas</th>
                <th className="p-3">Folder</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Kapasitas</th>
                <th className="p-3">Pengunggah</th>
                <th className="p-3">Ditambahkan</th>
                <th className="p-3 pr-4 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedia.map(item => {
                const isImage = item.mime_type?.startsWith('image/');
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5 max-w-xs min-w-[200px]">
                        {isImage ? (
                          <img 
                            src={item.file_path} 
                            alt={item.filename}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-bold text-slate-800 block truncate" title={item.filename}>
                          {item.filename}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-semibold">
                        {item.bucket_name}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">{item.mime_type}</td>
                    <td className="p-3 text-slate-500 font-mono">{formatBytes(item.file_size)}</td>
                    <td className="p-3 text-slate-550">{item.uploaded_by_name || 'Admin'}</td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(item.file_path, item.id)}
                          className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Salin Tautan (Copy URL)"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Akses Langsung"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id, item.filename)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-lg cursor-pointer transition-colors"
                          title="Hapus dari Server"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Dialog / Form */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop close blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!uploadProgress) setShowUploadModal(false); }}
              className="absolute inset-0 bg-slate-900"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-black font-sans uppercase tracking-tight text-slate-900">UNGGAH ASSET MEDIA</h3>
                </div>
                <button
                  disabled={uploadProgress !== null}
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-40"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar Loader */}
              {uploadProgress !== null && (
                <div className="space-y-2 bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between font-mono text-[10px] text-emerald-800 font-bold uppercase">
                    <span>Sedang mengunggah berkas ke Supabase bucket...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-250 rounded-full w-full overflow-hidden">
                    <motion.div 
                      className="bg-[#00e3a5] h-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
              )}

              {uploadProgress === null && (
                <div className="space-y-4">
                  
                  {/* Strategy A: Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isDragActive 
                        ? 'border-emerald-500 bg-emerald-50/50 scale-102 font-bold' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/40'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="media_direct_input" 
                      multiple={false}
                      accept="image/*,application/pdf"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-slate-700 block mb-0.5">Tarik & Letakkan Berkas atau Klik</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Mendukung Gambar (PNG, JPG, WebP) & Dokumen PDF (Maks 10MB)</span>
                  </div>

                  {/* Visual OR Separator */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[9px] font-mono font-extrabold uppercase text-slate-400">Atau Tautkan URL Eksternal</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>

                  {/* Strategy B: Manual URL Entry */}
                  <form onSubmit={handleManualSubmit} className="space-y-3 text-xs text-slate-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-600 block uppercase text-[10px]">Nama Berkas</label>
                        <input 
                          type="text"
                          required
                          placeholder="Contoh: modul_belajar.pdf"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          className="w-full border border-slate-200 p-2 text-xs rounded-xl outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-600 block uppercase text-[10px]">Pilih Folder / Bucket</label>
                        <select
                          value={manualBucket}
                          onChange={(e) => setManualBucket(e.target.value)}
                          className="w-full border border-slate-200 p-2 text-xs text-slate-650 rounded-xl outline-none focus:border-emerald-500"
                        >
                          <option value="general">general (Gambar & Rilis)</option>
                          <option value="documents">documents (PDF Unduhan)</option>
                          <option value="banners">banners (Slide Header)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-extrabold text-slate-600 block uppercase text-[10px]">Tautan URL Berkas</label>
                        {isGoogleDriveUrl(manualUrl) && (
                          <span className="text-[9px] bg-blue-50 text-blue-600 font-extrabold px-2 py-0.5 rounded-full uppercase">
                            ✓ Google Drive Terdeteksi
                          </span>
                        )}
                      </div>
                      <input 
                        type="url"
                        required
                        placeholder="Contoh: https://drive.google.com/file/d/xxxx/view?usp=sharing"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="w-full border border-slate-200 p-2 text-xs rounded-xl outline-none focus:border-emerald-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        Dukung tautan share <b>Google Drive</b>, Dropbox, Unsplash, dsb. Sistem akan otomatis mengubah tautan sharing Anda ke direct-stream url yang aman dan andal.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-600 block uppercase text-[10px]">Mime-Type Konten</label>
                        <select
                          value={manualMime}
                          onChange={(e) => setManualMime(e.target.value)}
                          className="w-full border border-slate-200 p-2 text-xs text-slate-650 rounded-xl outline-none focus:border-emerald-500"
                        >
                          <option value="image/jpeg">image/jpeg (Foto Utama)</option>
                          <option value="image/png">image/png (Transparan)</option>
                          <option value="image/webp">image/webp (Responsif)</option>
                          <option value="application/pdf">application/pdf (Brosur/Ebook)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-slate-600 block uppercase text-[10px]">Kapasitas Berkas (Bytes)</label>
                        <input 
                          type="number"
                          value={manualSize}
                          onChange={(e) => setManualSize(e.target.value)}
                          className="w-full border border-slate-200 p-2 text-xs rounded-xl outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!manualName || !manualUrl}
                      className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Simpan Metadata Media</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
