import React, { useState } from 'react';
import { FileText, Eye, AlertCircle, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { isGoogleDriveUrl, convertGoogleDriveToEmbedUrl, convertGoogleDriveToImageUrl } from '../utils/googleDriveHelper';

interface DriveFileEmbedProps {
  url: string | null | undefined;
  title?: string;
  className?: string;
  height?: string | number;
}

export const DriveFileEmbed: React.FC<DriveFileEmbedProps> = ({
  url,
  title = "Dokumen Pendukung",
  className = "",
  height = "480px"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!url) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
        Tautan dokumen tidak tersedia.
      </div>
    );
  }

  const isGDrive = isGoogleDriveUrl(url);

  if (!isGDrive) {
    // Fallback if not Google Drive link - just display static preview box or image as applicable
    const looksLikeImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url.split('?')[0]);
    if (looksLikeImage) {
      return (
        <div className={`relative overflow-hidden rounded-xl border border-slate-100 ${className}`}>
          <img 
            src={url} 
            alt={title}
            className="w-full h-auto object-cover max-h-[500px]"
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    return (
      <div className={`p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3.5 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-slate-800 tracking-wide">{title}</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Dokumen eksternal diluar Google Drive. Silakan kunjungi tautan eksternal secara langsung.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-emerald-850 hover:bg-emerald-950 text-white rounded-lg text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 transition-colors"
          >
            <span>Buka Tautan Resmi</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const embedUrl = convertGoogleDriveToEmbedUrl(url);
  const imageUrl = convertGoogleDriveToImageUrl(url);

  // We can try loading the content inside iframe.
  return (
    <div className={`relative flex flex-col w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden ${className}`}>
      
      {/* File Header Details */}
      <div className="bg-slate-50 dark:bg-slate-950/80 px-4.5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-[70%] text-left">
          <div className="w-7 h-7 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h5 className="text-[11.5px] font-black tracking-wide text-slate-800 dark:text-white leading-none truncate">{title}</h5>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mt-1">Google Drive Tersemat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Tab Baru"
            className="p-1.5 text-slate-450 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://drive.google.com/uc?export=download&id=${url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Download Langsung"
            className="p-1.5 text-slate-450 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-955" style={{ height }}>
        {/* Loading overlay spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-10 space-y-2 text-center p-4">
            <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Memuat Dokumen Google Drive...</p>
            <p className="text-[9px] text-slate-400">Pastikan izin sebaran file diset ke "Siapa saja yang memiliki link" di Google Drive.</p>
          </div>
        )}

        {/* Error / block container */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-50 dark:bg-slate-950 p-6 z-10 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <div className="space-y-1">
              <span className="font-extrabold text-xs text-slate-800 dark:text-white block">Tidak dapat memuat pratinjau</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Google Drive membatasi penampilan langsung di halaman ini, atau file telah dihapus.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-[10px] font-extrabold tracking-widest uppercase transition-all shadow-xs"
            >
              Unduh / Lihat di Google Drive
            </a>
          </div>
        )}

        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 select-none z-1"
          allow="autoplay"
          title={title}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>

      {/* Quick advice footer */}
      <div className="bg-slate-50 dark:bg-slate-950/40 px-4.5 py-1.5 border-t border-slate-150 dark:border-slate-800 text-[9px] text-slate-400 text-left">
        * Dokumen disimpan secara terpusat di server Google Workspace MIN Singkawang.
      </div>
    </div>
  );
};

export default DriveFileEmbed;
