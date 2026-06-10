/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Users, Plus, Trash, Edit, Star, Sparkles, Building, Quote, ArrowLeft } from 'lucide-react';
import MockDb from '../database/mockDb';
import { Teacher, Program, Facility, Testimonial } from '../types';

interface CmsFacultySectionProps {
  activeTab: string;
  teachers: Teacher[];
  facilities: Facility[];
  onRefreshData: () => void;
}

export default function CmsFacultySection({
  activeTab,
  teachers,
  facilities,
  onRefreshData
}: CmsFacultySectionProps) {
  
  // Local lists fetched directly or synced from props
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [editFacility, setEditFacility] = useState<Facility | null>(null);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);

  const programs = MockDb.getPrograms();
  const testimonials = MockDb.getTestimonials();

  // 1. GTK Staff handlers
  const handleCreateTeacher = () => {
    setEditTeacher({
      id: "t_" + Math.random().toString(36).substring(2, 9),
      name: "Ustadz Hanafi, S.Pd.I.",
      nip: "198511202016041005",
      role: "Waka Humas / Guru Fiqih",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      status: "PNS",
      subjects: ["Fiqih Islam", "Budi Pekerti"],
      sort_order: 10
    });
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTeacher) {
      MockDb.saveTeacher(editTeacher);
      setEditTeacher(null);
      onRefreshData();
    }
  };

  // 2. Program Unggulan handlers
  const handleCreateProgram = () => {
    setEditProgram({
      id: "p_" + Math.random().toString(36).substring(2, 9),
      title: "Tahfidz Autopilot",
      slug: "tahfidz-autopilot",
      description: "Inkubasi pembiasaan setoran mutawatir hafalan Juz 30-29 fashih Alquran.",
      image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400",
      icon_name: "BookOpen"
    });
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProgram) {
      MockDb.saveProgram(editProgram);
      setEditProgram(null);
      onRefreshData();
    }
  };

  // 3. Fasilitas handlers
  const handleCreateFacility = () => {
    setEditFacility({
      id: "f_" + Math.random().toString(36).substring(2, 9),
      name: "UKS Bersih & Apotek Hidup",
      description: "Fasilitas penanganan kesehatan darurat pertama anak yang higienis.",
      image_url: "https://images.unsplash.com/photo-1538108176447-280586497def?auto=format&fit=crop&q=80&w=400",
      condition: "Sangat Baik",
      capacity: "3 Ranjang Rawat Pasien"
    });
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFacility) {
      MockDb.saveFacility(editFacility);
      setEditFacility(null);
      onRefreshData();
    }
  };

  // 4. Testimoni handlers
  const handleCreateTestimonial = () => {
    setEditTestimonial({
      id: "test_" + Math.random().toString(36).substring(2, 9),
      name: "Drs. H. Mulyadi",
      role: "Orang Tua Walid",
      content: "Asuhan karakter di madrasah ini sangat membekas santun di keseharian anak.",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      created_at: new Date().toISOString()
    });
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTestimonial) {
      MockDb.saveTestimonial(editTestimonial);
      setEditTestimonial(null);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" id="cms_faculty_section">
      
      {/* ======================= TAB A: DATA GTK TEACHERS ======================= */}
      {activeTab === 'gtk' && (
        <div className="space-y-4">
          {editTeacher ? (
            <form onSubmit={handleSaveTeacher} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditTeacher(null)} className="p-1 hover:bg-slate-100 rounded">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <h4 className="font-extrabold text-[13px] text-slate-800 uppercase">Input Detail GTK Pendidik</h4>
                </div>
                <button type="submit" className="px-4.5 py-2 bg-emerald-800 text-white font-bold rounded cursor-pointer">Simpan Biodata</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Nama Lengkap & Gelar</label>
                  <input type="text" required value={editTeacher.name} onChange={(e) => setEditTeacher({...editTeacher, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Nomor Induk Pegawai (NIP / NUPTK)</label>
                  <input type="text" required value={editTeacher.nip} onChange={(e) => setEditTeacher({...editTeacher, nip: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Jabatan Dinas / Role</label>
                  <input type="text" required value={editTeacher.role} onChange={(e) => setEditTeacher({...editTeacher, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Status Kepegawaian</label>
                  <select value={editTeacher.status} onChange={(e) => setEditTeacher({...editTeacher, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (Pemerintah Perjanjian Kerja)</option>
                    <option value="GTT">GTT (Guru Tidak Tetap / Swasta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Guru Mata Pelajaran (Pisahkan koma)</label>
                  <input type="text" value={(editTeacher.subjects || []).join(', ')} onChange={(e) => setEditTeacher({...editTeacher, subjects: e.target.value.split(',').map(s=>s.trim())})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Foto Portret URL</label>
                  <input type="text" value={editTeacher.photo_url} onChange={(e) => setEditTeacher({...editTeacher, photo_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-[10.5px]" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Urutan Sortir Tampilan (Sort Order)</label>
                  <input type="number" value={editTeacher.sort_order} onChange={(e) => setEditTeacher({...editTeacher, sort_order: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Data Kepegawaian GTK Madrasah</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daftar guru pendidik, staff fungsional, dan tata usaha MIN Singkawang.</p>
                </div>
                <button onClick={handleCreateTeacher} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Tambah GTK</button>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-white">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-505 font-bold uppercase">
                      <th className="p-3">Nama GTK</th>
                      <th className="p-3">NIP</th>
                      <th className="p-3">Jabatan</th>
                      <th className="p-3">Urutan</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-705">
                    {teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-3 font-bold text-slate-805">
                          <div className="flex items-center gap-2.5">
                            <img src={t.photo_url} className="w-8 h-8 rounded-full object-cover border" alt="" />
                            <span>{t.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[10.5px] text-slate-500">{t.nip || "-"}</td>
                        <td className="p-4">{t.role}</td>
                        <td className="p-4 font-mono text-slate-500">{t.sort_order}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9.5px] font-bold">{t.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditTeacher(t)} className="w-7 h-7 bg-slate-50 border hover:bg-slate-100 flex items-center justify-center rounded cursor-pointer"><Edit className="w-3.5 h-3.5 text-indigo-700" /></button>
                            <button onClick={() => { if(confirm(`Hapus GTK ${t.name}?`)) { MockDb.deleteTeacher(t.id); onRefreshData(); } }} className="w-7 h-7 bg-rose-50 border border-rose-100 hover:bg-rose-100 flex items-center justify-center rounded cursor-pointer"><Trash className="w-3.5 h-3.5 text-rose-700" /></button>
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

      {/* ======================= TAB B: PROGRAM UNGGULAN ======================= */}
      {activeTab === 'program' && (
        <div className="space-y-4">
          {editProgram ? (
            <form onSubmit={handleSaveProgram} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-850 uppercase">Form Program Unggulan</h4>
                <button type="submit" className="px-4.5 py-2 bg-emerald-800 text-white font-bold rounded cursor-pointer">Simpan Program</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Judul Program</label>
                  <input type="text" required value={editProgram.title} onChange={(e) => setEditProgram({...editProgram, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Icon name (Lucide)</label>
                  <input type="text" required value={editProgram.icon_name} onChange={(e) => setEditProgram({...editProgram, icon_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Deskripsi Singkat Program</label>
                <textarea required rows={3} value={editProgram.description} onChange={(e) => setEditProgram({...editProgram, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-sans" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Cover Foto URL</label>
                <input type="text" value={editProgram.image_url} onChange={(e) => setEditProgram({...editProgram, image_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Katalog Program Unggulan</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Program pencetak masa depan, tahfidz, robotik, sains dan entrepreneurship.</p>
                </div>
                <button onClick={handleCreateProgram} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Tambah Program</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((p) => (
                  <div key={p.id} className="bg-white border rounded-xl overflow-hidden p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <img src={p.image_url} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center text-emerald-800 font-bold text-xs">P</div>
                        <h4 className="text-slate-800 font-bold text-xs">{p.title}</h4>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-end gap-1.5">
                      <button onClick={() => setEditProgram(p)} className="p-1 px-2.5 bg-slate-50 border rounded text-[10.5px] font-bold text-indigo-700 flex items-center gap-1 cursor-pointer">Edit</button>
                      <button onClick={() => { if(confirm('Hapus program?')) { MockDb.deleteProgram(p.id); onRefreshData(); } }} className="p-1 px-2.5 bg-rose-50 border border-rose-100 rounded text-[10.5px] font-bold text-rose-700 flex items-center gap-1 cursor-pointer">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB C: FACILITIES SARPRAS ======================= */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          {editFacility ? (
            <form onSubmit={handleSaveFacility} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-850 uppercase">Form Sarana Prasarana</h4>
                <button type="submit" className="px-4.5 py-2 bg-emerald-800 text-white font-bold rounded cursor-pointer">Simpan Sarpras</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Nama Sarana / Ruangan</label>
                  <input type="text" required value={editFacility.name} onChange={(e) => setEditFacility({...editFacility, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Kapasitas Tempat</label>
                  <input type="text" required value={editFacility.capacity} onChange={(e) => setEditFacility({...editFacility, capacity: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Kondisi Kelayakan</label>
                  <select value={editFacility.condition} onChange={(e) => setEditFacility({...editFacility, condition: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="Sangat Baik">Sangat Baik (Prima)</option>
                    <option value="Baik">Baik (Berfungsi Terawat)</option>
                    <option value="Perbaikan">Sedang Dalam Tahap Renovasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Foto Sarana URL</label>
                  <input type="text" value={editFacility.image_url} onChange={(e) => setEditFacility({...editFacility, image_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Deskripsi & Kelengkapan Detail Alat</label>
                <textarea required rows={3} value={editFacility.description} onChange={(e) => setEditFacility({...editFacility, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Katalog Prasarana & Sarpras Kelas</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daftar gedung dwi-warna, lab komputer, perpustakaan, and UKS penunjang optimal belajar anak.</p>
                </div>
                <button onClick={handleCreateFacility} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer"><Building className="w-3.5 h-3.5" /> Tambah Sarpras</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((f) => (
                  <div key={f.id} className="bg-white border rounded-xl overflow-hidden p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <img src={f.image_url} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-slate-800 font-bold text-xs">{f.name}</h4>
                        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase border ${
                          f.condition === 'Sangat Baik' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"
                        }`}>{f.condition}</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">Kapasitas: {f.capacity}</p>
                      <p className="text-[10.5px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">{f.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-end gap-1.5">
                      <button onClick={() => setEditFacility(f)} className="p-1 px-2.5 bg-slate-50 border rounded text-[10.5px] font-bold text-indigo-700 cursor-pointer">Edit</button>
                      <button onClick={() => { if(confirm('Hapus prasarana?')) { MockDb.deleteFacility(f.id); onRefreshData(); } }} className="p-1 px-2.5 bg-rose-50 border border-rose-100 rounded text-[10.5px] font-bold text-rose-700 cursor-pointer">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB D: TESTIMONIALS ======================= */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          {editTestimonial ? (
            <form onSubmit={handleSaveTestimonial} className="bg-white border rounded-xl p-6 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3.5">
                <h4 className="font-extrabold text-[13px] text-slate-850 uppercase">Form Testimoni Wali</h4>
                <button type="submit" className="px-4.5 py-2 bg-emerald-800 text-white font-bold rounded cursor-pointer">Simpan Testimoni</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Nama Tokoh / Alumni</label>
                  <input type="text" required value={editTestimonial.name} onChange={(e) => setEditTestimonial({...editTestimonial, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Keterangan / Pekerjaan (Role)</label>
                  <input type="text" required value={editTestimonial.role} onChange={(e) => setEditTestimonial({...editTestimonial, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Bintang Rating (1-5)</label>
                  <input type="number" required min={1} max={5} value={editTestimonial.rating} onChange={(e) => setEditTestimonial({...editTestimonial, rating: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Avatar Foto URL</label>
                  <input type="text" value={editTestimonial.avatar_url} onChange={(e) => setEditTestimonial({...editTestimonial, avatar_url: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Seluruh Kesan & Pesan Unggulan (Content)</label>
                <textarea required rows={3} value={editTestimonial.content} onChange={(e) => setEditTestimonial({...editTestimonial, content: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-slate-800 font-black text-sm uppercase tracking-tight">Komentar Testimoni Terverifikasi</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Testimoni tulus dari orang tua wali santri and alumni kesuksesan belajar.</p>
                </div>
                <button onClick={handleCreateTestimonial} className="px-3.5 py-1.5 text-xs bg-emerald-800 text-white font-bold rounded flex items-center gap-1 cursor-pointer"><Quote className="w-3.5 h-3.5" /> Tambah Testimoni</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white border rounded-xl p-4 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <img src={t.avatar_url} className="w-9 h-9 rounded-full object-cover border" alt="" />
                        <div className="text-left">
                          <p className="text-slate-800 font-black text-xs leading-none">{t.name}</p>
                          <p className="text-[9.5px] text-slate-450 mt-1">{t.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 justify-center text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">"{t.content}"</p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t flex justify-end gap-1.5">
                      <button onClick={() => setEditTestimonial(t)} className="p-1 px-2 text-[10.5px] font-bold text-indigo-700 cursor-pointer">Edit</button>
                      <button onClick={() => { if(confirm('Hapus testimoni?')) { MockDb.deleteTestimonial(t.id); onRefreshData(); } }} className="p-1 px-2 text-[10.5px] font-bold text-rose-700 cursor-pointer">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
