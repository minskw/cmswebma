/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, ArrowLeft, LogOut, CheckCircle2, ShieldX } from 'lucide-react';
import { verifyUserRoleAgainstSupabase } from '../lib/supabase';
import MockDb from '../database/mockDb';

interface AdminGuardProps {
  children: React.ReactNode;
  userRole: string;
  currentUser: any;
  onLogout: () => void;
  onNavigate: (newPath: string) => void;
}

export default function AdminGuard({
  children,
  userRole,
  currentUser,
  onLogout,
  onNavigate
}: AdminGuardProps) {
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [supabaseVerifiedRole, setSupabaseVerifiedRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSupabaseAuthorization() {
      setIsVerifying(true);
      setVerificationError(null);

      try {
        if (!currentUser) {
          // No user is logged in, that's handled by CmsAdmin login screen,
          // but we still want the guard to let it render or restrict custom triggers.
          setIsVerifying(false);
          return;
        }

        // Run verification query against Supabase profiles table
        // We look up by the user's ID or Email address
        const identifier = currentUser.id || currentUser.email;
        const verifiedRole = await verifyUserRoleAgainstSupabase(identifier);

        if (!active) return;

        if (verifiedRole) {
          setSupabaseVerifiedRole(verifiedRole);
          console.log(`[Admin Router Guard] Authorized Supabase Role discovered: ${verifiedRole}`);
        } else {
          console.warn('[Admin Router Guard] No profile matched in profiles table. Using local authenticated session role.');
        }
      } catch (err: any) {
        console.error('[Admin Router Guard] Error performing Supabase auth profiling checks:', err);
        if (active) {
          setVerificationError('Gagal memverifikasi wewenang penataan aset via server Supabase.');
        }
      } finally {
        if (active) {
          setIsVerifying(false);
        }
      }
    }

    checkSupabaseAuthorization();

    return () => {
      active = false;
    };
  }, [currentUser]);

  // Allowed Roles check: 'Super Admin', 'Kepala Madrasah', or 'Operator'
  const finalRoleToCheck = supabaseVerifiedRole || userRole;
  const isAuthorized = ['Super Admin', 'Kepala Madrasah', 'Operator'].includes(finalRoleToCheck);

  if (!currentUser) {
    // If there is no authenticated session user, the CmsAdmin component will draw
    // the interactive Login overlay. Allow it to render so the user can sign in.
    return <>{children}</>;
  }

  // Render a futuristic, clean loading spinner while verifying authorization against Supabase Postgres
  if (isVerifying) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#01352e] text-white" 
        id="router_guard_loader_fullscreen"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#00e3a5] border-t-transparent rounded-full mb-5 shadow-lg"
        />
        <motion.p 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-xs font-mono font-bold text-[#00e3a5] tracking-widest uppercase"
        >
          Mengaudit Hak Akses & Supabase DB Profiles...
        </motion.p>
      </div>
    );
  }

  // Block renders for unauthorized roles (e.g., 'Editor' or guest accounts attempting rogue access)
  if (!isAuthorized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-slate-950 font-sans tracking-tight text-slate-100 p-4 select-none" 
        id="unauthorized_access_view"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-md w-full bg-slate-900 border-2 border-rose-800/40 rounded-2xl p-8 shadow-2xl space-y-6 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-rose-950/60 border border-rose-800 rounded-full flex items-center justify-center shadow-md animate-pulse">
            <ShieldX className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-rose-400 uppercase tracking-tight">AKSES DIALANGKAN</h1>
            <p className="text-xs font-semibold font-mono text-rose-300 bg-rose-950/40 p-1.5 rounded border border-rose-900/40">
              ID USER: {currentUser?.email}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Selesai diaudit oleh modul <span className="text-rose-450 font-bold">Supabase Router Guard</span>. Akun Anda saat ini memiliki status peran <span className="text-rose-400 font-bold">'{finalRoleToCheck}'</span>, yang dilarang melakukan state update atau mengakses unit administrasi CMS.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-[11px] text-slate-400 text-left space-y-1">
            <span className="font-bold text-slate-300 block mb-1">Daftar Akun yang Diperbolehkan:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Super Admin (Penuh)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Kepala Madrasah (Semua Tab)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Operator (Koreksi GTK & PPDB)</span>
            </div>
          </div>

          {/* Navigational and control triggers */}
          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={async () => {
                await onLogout();
                onNavigate('home');
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar & Ganti Akun</span>
            </button>
            
            <button 
              onClick={() => onNavigate('home')}
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali Ke Portal Umum</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Proceed with fully authorized CMS dashboard
  return <>{children}</>;
}
