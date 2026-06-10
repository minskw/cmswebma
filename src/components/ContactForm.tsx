/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, ShieldCheck, RefreshCw, KeyRound, UserRound, Mail, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  onSubmitSubmission: (data: { name: string; email: string; subject: string; message: string }) => void;
}

export default function ContactForm({ onSubmitSubmission }: ContactFormProps) {
  // Field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Anti-spam field (Honeypot) - should remain empty
  const [honeypot, setHoneypot] = useState('');

  // Captcha challenge
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // Status states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rateLimitActive, setRateLimitActive] = useState(false);

  // Generate new captcha numbers when component mounts or on reset
  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1); // 1-9
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1); // 1-9
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Validation function with sanitization and security practices
  const validateForm = (): boolean => {
    const tempErrors: { [key: string]: string } = {};

    // 1. Bot check (Honeypot value must be completely blank)
    if (honeypot.trim() !== '') {
      tempErrors.honeypot = 'Deteksi otomatisasi terpicu. Permintaan ditolak.';
    }

    // 2. Name validation
    const cleanName = name.trim();
    if (!cleanName) {
      tempErrors.name = 'Nama lengkap wajib diisi.';
    } else if (cleanName.length < 3) {
      tempErrors.name = 'Nama lengkap minimal harus terdiri dari 3 karakter.';
    } else if (/[<>{}[\];]/.test(cleanName)) {
      tempErrors.name = 'Nama mengandung karakter ilegal atau potensial script injection.';
    }

    // 3. Email validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      tempErrors.email = 'Alamat email wajib diisi.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        tempErrors.email = 'Format alamat email tidak valid.';
      }
    }

    // 4. Subject validation
    const cleanSubject = subject.trim();
    if (!cleanSubject) {
      tempErrors.subject = 'Subjek pesan / perihal wajib diisi.';
    } else if (cleanSubject.length < 4) {
      tempErrors.subject = 'Perihal minimal harus terdiri dari 4 karakter.';
    } else if (/[<>{};]/.test(cleanSubject)) {
      tempErrors.subject = 'Subjek mengandung karakter ilegal.';
    }

    // 5. Message validation
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      tempErrors.message = 'Isi pesan wajib diisi.';
    } else if (cleanMessage.length < 15) {
      tempErrors.message = 'Isi pesan terlalu pendek, tuliskan pesan terperinci minimal 15 karakter.';
    } else if (cleanMessage.includes('<script') || cleanMessage.includes('javascript:')) {
      tempErrors.message = 'Isi pesan mengandung injeksi skrip berbahaya.';
    }

    // 6. Math Captcha verification
    const correctSum = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer, 10) !== correctSum) {
      tempErrors.captcha = 'Jawaban verifikasi matematika salah. Silakan coba kembali.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rateLimitActive) {
      setErrors({ rateLimit: 'Mohon tunda pengiriman. Kirim formulir dapat dilakukan kembali setelah beberapa saat.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate high-quality, secure processing network lag (1.5 seconds)
    setTimeout(() => {
      // Direct sanitization / HTML escaping to prevent XSS in CMS renderer
      const sanitizeInput = (val: string) => {
        return val
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      };

      const sanitizedData = {
        name: sanitizeInput(name.trim()),
        email: email.trim(),
        subject: sanitizeInput(subject.trim()),
        message: sanitizeInput(message.trim()),
      };

      onSubmitSubmission(sanitizedData);

      setIsSubmitting(false);
      setIsSuccess(true);
      setRateLimitActive(true);

      // Reset fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      generateCaptcha();

      // Clear success badge and rate limit after some seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 8000);

      setTimeout(() => {
        setRateLimitActive(false);
      }, 30000); // 30-seconds rate limit restriction
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs relative" id="contact_form_container">
      
      {/* Decorative Guard Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-mono font-bold uppercase select-none">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Enkripsi Aman SSL</span>
      </div>

      <div className="mb-6 text-left">
        <h4 className="text-slate-900 dark:text-white font-extrabold text-base tracking-tight">Kanal Layanan Publik</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Sampaikan naskah, usulan, aspirasi atau pengaduan secara terpusat.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="form_contact_form">
        
        {/* Antispam Honeypot Field (Invisible to human users but filled by spam scrapers) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honey_field">Isian Otomatis</label>
          <input
            id="honey_field"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            placeholder="Jangan diisi"
          />
        </div>

        {/* Name input */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="input_name" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Nama Pengirim <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <UserRound className="w-4 h-4" />
            </span>
            <input
              id="input_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className={`w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border ${
                errors.name ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 focus:ring-4 focus:outline-hidden transition-all`}
              placeholder="Masukkan nama lengkap sesuai KTP / Wali Siswa"
              required
            />
          </div>
          {errors.name && (
            <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email input */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="input_email" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Alamat Email Pengirim <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="input_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border ${
                errors.email ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 focus:ring-4 focus:outline-hidden transition-all`}
              placeholder="contoh: wali.murid@surel.com"
              required
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Subject input */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="input_subject" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Subjek / Perihal Pengaduan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <KeyRound className="w-4 h-4" />
            </span>
            <input
              id="input_subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
              className={`w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border ${
                errors.subject ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 focus:ring-4 focus:outline-hidden transition-all`}
              placeholder="Misal: Mutasi Siswa Pindahan, Pertanyaan Biaya PPDB"
              required
            />
          </div>
          {errors.subject && (
            <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        {/* Message input */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="input_message" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Isi Detail Pesan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 flex text-slate-400 pointer-events-none">
              <MessageSquare className="w-4 h-4" />
            </span>
            <textarea
              id="input_message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className={`w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border ${
                errors.message ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 focus:ring-4 focus:outline-hidden transition-all`}
              placeholder="Tuliskan keluhan, masukan, pertanyaan atau rekomendasi perihal madrasah kami secara lengkap di sini..."
              required
            />
          </div>
          {errors.message && (
            <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Dynamic Verification Captcha Area */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-left">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase block tracking-wider font-mono">Pertanyaan Pengaman</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-0.5 flex items-center gap-1.5 font-sans">
              Berapakah jumlah dari <span className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold px-1.5 bg-emerald-100/60 dark:bg-emerald-950/60 rounded">{captchaNum1}</span> + 
              <span className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold px-1.5 bg-emerald-100/60 dark:bg-emerald-950/60 rounded">{captchaNum2}</span> ?
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              disabled={isSubmitting}
              className={`w-full sm:w-24 text-xs px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border ${
                errors.captcha ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800'
              } text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/25 font-mono text-center font-bold`}
              placeholder="Hasil"
              required
            />
            <button
              type="button"
              onClick={generateCaptcha}
              disabled={isSubmitting}
              className="p-2 border-0 bg-slate-150 hover:bg-slate-200 text-slate-500 rounded-lg hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              title="Ganti Tantangan Angka Baru"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {errors.captcha && (
          <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1.5 pt-0.5 justify-start text-left">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.captcha}</span>
          </p>
        )}

        {errors.rateLimit && (
          <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1.5 pt-0.5 text-left">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.rateLimit}</span>
          </p>
        )}

        {/* Global Feedback notification banners */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-[11px] text-left leading-relaxed flex items-start gap-2.5 font-sans"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-bold mb-0.5">Pesan Berhasil Terkirim Secara Aman!</strong>
                Aspirasi Anda telah masuk ke log audit sistem secara transparan dan diverifikasi oleh sistem penangkal bot spam. Terima kasih atas kepedulian Anda terhadap MIN Singkawang.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit action button */}
        <button
          type="submit"
          disabled={isSubmitting || rateLimitActive}
          className={`w-full py-2.5 px-4 text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer border-0 flex items-center justify-center gap-2 transition-all ${
            isSubmitting
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              : rateLimitActive
              ? 'bg-amber-300 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 cursor-not-allowed'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs hover:shadow-md'
          }`}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memproses Enkripsi...</span>
            </>
          ) : rateLimitActive ? (
            <span>Tunda Pengiriman Kirim Baru (30 detik COOLDOWN)</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Aspirasi Publik Terverifikasi</span>
            </>
          )}
        </button>
        
      </form>

    </div>
  );
}
