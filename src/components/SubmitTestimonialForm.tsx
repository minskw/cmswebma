/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Smile, Sparkles, MessageCircle, Send, CheckCircle, X, Info } from 'lucide-react';
import { Testimonial } from '../types';

interface SubmitTestimonialFormProps {
  onAddTestimonial: (testimonial: Testimonial) => void;
  onClose?: () => void;
}

export default function SubmitTestimonialForm({ onAddTestimonial, onClose }: SubmitTestimonialFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const characterLimit = 180;

  // Elegant photorealistic avatar presets for Students, Alumni, and Parents
  const avatarPresets = [
    { label: "Siswa", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150" },
    { label: "Siswi", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { label: "Alumni Muda", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { label: "Alumnus Perempuan", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { label: "Wali Laki-laki", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
    { label: "Wali Perempuan", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !content.trim()) return;

    const newTestimonial: Testimonial = {
      id: `ts_${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      content: content.trim().substring(0, characterLimit),
      avatar_url: avatarPresets[selectedAvatar].url,
      rating,
      created_at: new Date().toISOString()
    };

    onAddTestimonial(newTestimonial);
    setIsSuccess(true);
    
    // Automatically reset after brief display
    setTimeout(() => {
      setName('');
      setRole('');
      setContent('');
      setRating(5);
      setIsSuccess(false);
      if (onClose) onClose();
    }, 2000);
  };

  const charLeft = characterLimit - content.length;
  const isCharWarning = charLeft <= 25;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center" id="submission_success_banner">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-extrabold tracking-tight">Testimoni Terkirim!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            Terima kasih atas aspirasi Anda. Testimoni Anda telah tersimpan dan akan segera muncul di beranda utama MIN Singkawang.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
            <div>
              <h3 className="text-slate-900 dark:text-white font-extrabold text-base tracking-tight flex items-center gap-2">
                <Smile className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Kirim Aspirasi & Testimoni</span>
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mari bagikan perjalanan belajar Anda bersama MIN Singkawang.
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Tutup formulir"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="student_name_input" className="block text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider mb-1.5">
                Nama Lengkap <span className="text-amber-500">*</span>
              </label>
              <input
                id="student_name_input"
                type="text"
                required
                maxLength={45}
                placeholder="Contoh: Muhammad Ali, S.Pd."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>

            {/* Role / Profession Details */}
            <div>
              <label htmlFor="student_role_input" className="block text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider mb-1.5">
                Status / Hubungan <span className="text-amber-500">*</span>
              </label>
              <input
                id="student_role_input"
                type="text"
                required
                maxLength={50}
                placeholder="Contoh: Alumni 2018 / Wali Murid Kelas 5"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Avatar Presets Grid Choice */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider mb-1.5">
              Pilih Foto Profil (Avatar) <span className="text-amber-500">*</span>
            </label>
            <div className="grid grid-cols-6 gap-3 pt-1">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(idx)}
                  className={`relative p-0.5 rounded-full aspect-square flex items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === idx 
                      ? 'ring-2 ring-emerald-600 dark:ring-emerald-500 scale-105 shadow-xs' 
                      : 'hover:scale-102 hover:opacity-90 opacity-70'
                  }`}
                  title={`Gunakan profil preset ${preset.label}`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  {selectedAvatar === idx && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 border border-white dark:border-slate-900 rounded-full flex items-center justify-center" id={`active_avatar_check_${idx}`}>
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rating selection (Stars) */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider mb-1">
              Beri Nilai (Penilaian Bintang)
            </label>
            <div className="flex gap-1 py-1" id="star_rating_selection">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 -ml-1 text-slate-300 hover:text-amber-400 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  title={`Beri nilai ${star} dari 5 bintang`}
                  aria-label={`Beri nilai ${star} dari 5 bintang`}
                >
                  <Star 
                    className={`w-5 h-5 transition-transform duration-100 ${
                      star <= (hoverRating || rating) 
                        ? 'text-amber-500 fill-amber-500 scale-110' 
                        : 'text-slate-300 dark:text-slate-700'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea with Character Limit counter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="testimonial_feedback_content" className="block text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                Aspirasi / Kesan & Pesan <span className="text-amber-500">*</span>
              </label>
              <span className={`text-[10px] font-black tracking-widest ${isCharWarning ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                {charLeft} SISA KARAKTER
              </span>
            </div>
            <textarea
              id="testimonial_feedback_content"
              required
              rows={3}
              maxLength={characterLimit}
              placeholder="Berikan masukan konstruktif, kesan, pesan atau rasa bangga Anda terhadap perkembangan madrasah..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-950 dark:text-white placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-hidden transition-colors resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Notice Info Box */}
          <div className="px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-905 flex gap-2 items-start" id="submit_notice_info">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Sesuai instruksi madrasah, demi menjaga privasi dan ketertiban bersama, semua testimoni wajib mematuhi batas karakter ({characterLimit} kata/karakter) agar tetap ringkas, padat, dan mudah dibaca oleh publik.
            </p>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={!name.trim() || !role.trim() || !content.trim()}
            className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Testimoni</span>
          </button>
        </form>
      )}
    </div>
  );
}
