/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { FileText, Plus, Search, Trash, Edit, Save, ArrowLeft, Globe, Share2, AlertCircle, FolderOpen, Tag, Pin } from 'lucide-react';
import { Post, Category } from '../types';
import RichTextEditor from './RichTextEditor';
import MockDb from '../database/mockDb';

interface CmsNewsSectionProps {
  posts: Post[];
  onSavePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onRefreshData?: () => void;
}

export default function CmsNewsSection({
  posts,
  onSavePost,
  onDeletePost,
  onRefreshData
}: CmsNewsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Category management and sub-tab states
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'categories'>('news');
  const [categories, setCategories] = useState<Category[]>(() => MockDb.getCategories());
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    slug: ''
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (post.author_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (filteredPosts.length === 0) return;
    const allSelected = filteredPosts.every(p => selectedIds.includes(p.id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredPosts.some(fp => fp.id === id)));
    } else {
      setSelectedIds(prev => {
        const next = [...prev];
        filteredPosts.forEach(fp => {
          if (!next.includes(fp.id)) next.push(fp.id);
        });
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    if (count === 0) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${count} artikel secara massal? Tindakan ini permanen.`)) {
      selectedIds.forEach(id => {
        MockDb.deletePost(id);
      });
      setSelectedIds([]);
      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: {
          message: `🔥 Berhasil menghapus ${count} artikel secara massal.`,
          type: 'success',
          category: 'database'
        }
      }));
      if (onRefreshData) onRefreshData();
    }
  };

  const handleBulkUpdateStatus = (newStatus: 'draft' | 'publish' | 'schedule') => {
    const count = selectedIds.length;
    if (count === 0) return;
    
    selectedIds.forEach(id => {
      const post = posts.find(p => p.id === id);
      if (post) {
        MockDb.savePost({ ...post, status: newStatus });
      }
    });
    
    setSelectedIds([]);
    
    const statusLabel = newStatus === 'publish' ? 'Diterbitkan' : newStatus === 'schedule' ? 'Dijadwalkan' : 'Draf';
    window.dispatchEvent(new CustomEvent('cms-global-notification', {
      detail: {
        message: `⚡ Berhasil mengubah status ${count} artikel menjadi "${statusLabel}".`,
        type: 'success',
        category: 'database'
      }
    }));
    if (onRefreshData) onRefreshData();
  };

  const handleCreateNewPost = () => {
    const defaultCatId = categories[0]?.id || "c1";
    const newPost: Post = {
      id: "post_" + Math.random().toString(36).substring(2, 9),
      title: "Rapat Koordinasi Evaluasi Pengisian Anggaran",
      slug: "rapat-koordinasi-pengisian-anggaran-" + Math.floor(Math.random() * 100),
      excerpt: "Sekretariat madrasah menyelenggarakan rapat koordinasi evaluasi tata kelola anggaran sisa semester genap...",
      content: "Isi konten utama berita madrasah baru. Rapat ini dihadiri oleh dewan pengawas demi menciptakan tata akunting yang transparan.",
      thumbnail_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400",
      category_id: defaultCatId,
      tags: ["madrasah", "anggaran"],
      status: "draft",
      views: 0,
      published_at: new Date().toISOString(),
      author_id: "u1",
      author_name: "Suryadi, S.H.",
      seo_title: "",
      seo_description: "",
      og_title: "",
      og_description: "",
      og_image: ""
    };
    setEditPost(newPost);
  };

  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPost) {
      onSavePost(editPost);
      setEditPost(null);
      if (onRefreshData) onRefreshData();
    }
  };

  // Category CRUD Handlers
  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const slugified = categoryForm.slug.trim() || categoryForm.name.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const categoryData: Category = {
      id: editingCategoryId || 'cat_' + Math.random().toString(36).substring(2, 9),
      name: categoryForm.name.trim(),
      slug: slugified,
      description: categoryForm.description.trim()
    };

    MockDb.saveCategory(categoryData);
    const updatedCategories = MockDb.getCategories();
    setCategories(updatedCategories);

    // Reset Form
    setCategoryForm({ name: '', description: '', slug: '' });
    setEditingCategoryId(null);

    // Toast
    window.dispatchEvent(new CustomEvent('cms-global-notification', {
      detail: {
        message: editingCategoryId ? `✅ Kategori "${categoryData.name}" berhasil diperbarui.` : `✅ Kategori baru "${categoryData.name}" berhasil dibuat.`,
        type: 'success',
        category: 'database'
      }
    }));
    
    if (onRefreshData) onRefreshData();
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name,
      description: cat.description || '',
      slug: cat.slug
    });
  };

  const handleDeleteCategory = (catId: string) => {
    const usageCount = posts.filter(p => p.category_id === catId).length;
    if (usageCount > 0) {
      alert(`Kategori tidak dapat dihapus karena masih digunakan sebagai kategori untuk ${usageCount} artikel berita. Harap ubah kategori artikel-artikel tersebut terlebih dahulu.`);
      return;
    }

    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      MockDb.deleteCategory(catId);
      const updatedCategories = MockDb.getCategories();
      setCategories(updatedCategories);

      window.dispatchEvent(new CustomEvent('cms-global-notification', {
        detail: {
          message: `🔥 Kategori "${cat.name}" berhasil dihapus.`,
          type: 'success',
          category: 'database'
        }
      }));
      
      if (onRefreshData) onRefreshData();
    }
  };

  return (
    <div className="space-y-6 font-sans text-left animate-fade-in" id="cms_news_section_component">
      {editPost ? (
        /* Form Editor Screen */
        <form onSubmit={handleSavePostForm} className="bg-white border rounded-xl p-6 shadow-xs space-y-5 text-sm" id="post_editor_form">
          <div className="flex items-center justify-between border-b pb-3.5">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => setEditPost(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-slate-850 font-black text-sm uppercase tracking-wide">Penyunting Berita Redaksi</h3>
            </div>
            <button 
              type="submit" 
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 border border-emerald-855 text-white font-black text-xs rounded-lg transition-all cursor-pointer shadow-xs uppercase tracking-wider"
            >
              Simpan Postingan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Judul Utama Berita</label>
              <input 
                type="text" 
                required 
                value={editPost.title}
                onChange={(e) => {
                  const val = e.target.value;
                  const slugified = val.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
                  setEditPost({ ...editPost, title: val, slug: slugified });
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Slug URL Permalink (Automated)</label>
              <input 
                type="text" 
                required 
                value={editPost.slug}
                onChange={(e) => setEditPost({ ...editPost, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-400 font-mono text-xs focus:outline-hidden cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Abstraksi Ringkas / Kutipan Utama (Excerpt)</label>
            <input 
              type="text" 
              required 
              value={editPost.excerpt || ''}
              onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Visual RichTextEditor */}
          <div>
            <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Isi Konten Berita Lengkap</label>
            <RichTextEditor 
              value={editPost.content || ''}
              onChange={(content) => setEditPost({ ...editPost, content })}
              placeholder="Tulis draf isi warta Anda selengkap-lengkapnya di sini..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Status Publikasi</label>
              <select 
                value={editPost.status}
                onChange={(e) => setEditPost({ ...editPost, status: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="draft">Draft (Tunda Rilis)</option>
                <option value="publish">Publish (Terbit Langsung)</option>
                <option value="schedule">Schedule (Terjadwal PWA)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Waktu Rilis Terbit</label>
              <input 
                type="datetime-local" 
                required
                value={editPost.published_at ? new Date(editPost.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                onChange={(e) => setEditPost({ ...editPost, published_at: new Date(e.target.value).toISOString() })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-700 font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Nama Jurnalis Penulis</label>
              <input 
                type="text" 
                required
                value={editPost.author_name}
                onChange={(e) => setEditPost({ ...editPost, author_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Kategori Warta (Dynamic)</label>
              <select 
                value={editPost.category_id || (categories[0]?.id || '')}
                onChange={(e) => setEditPost({ ...editPost, category_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-705 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Tags (Pisahkan dengan koma)</label>
              <input 
                type="text" 
                value={(editPost.tags || []).join(', ')}
                onChange={(e) => setEditPost({ 
                  ...editPost, 
                  tags: e.target.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) 
                })}
                placeholder="sekolah, prestasi, kemenag"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10.5px] text-slate-400 font-bold uppercase mb-1.5">Gambar Utama URL Cover</label>
              <input 
                type="text" 
                value={editPost.thumbnail_url}
                onChange={(e) => setEditPost({ ...editPost, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200.5 rounded-lg text-slate-40y font-mono text-xs focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Sematkan Berita (Pinned News Option) */}
          <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Pin className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-amber-950 dark:text-amber-350 uppercase tracking-tight">Sematkan Artikel Berita (Pinned News)</h4>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-500">Berita penting terpilih akan selalu ditampilkan di paling atas daftar berita.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={!!editPost.is_pinned}
                onChange={(e) => setEditPost({ ...editPost, is_pinned: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-205 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* SEO and Social Open Graph Metadata */}
          <div className="p-4.5 bg-slate-50 border rounded-xl space-y-4">
            <h5 className="text-[10.5px] font-black text-rose-800 uppercase tracking-widest flex items-center gap-1.5 border-b pb-1.5">
              <span>🛠️ Konfigurasi SEO & Open-Graph Sosial</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">A. Target Google Search Index</span>
                <div>
                  <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Override HTML Title</label>
                  <input 
                    type="text" 
                    value={editPost.seo_title || ''}
                    onChange={(e) => setEditPost({ ...editPost, seo_title: e.target.value })}
                    placeholder={editPost.title}
                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Meta Description Tag</label>
                  <textarea 
                    rows={2} 
                    value={editPost.seo_description || ''}
                    onChange={(e) => setEditPost({ ...editPost, seo_description: e.target.value })}
                    placeholder={editPost.excerpt}
                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-800 font-sans"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">B. Pratinjau Chat Medsos (Facebook/WA/X)</span>
                <div>
                  <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">OG Title</label>
                  <input 
                    type="text" 
                    value={editPost.og_title || ''}
                    onChange={(e) => setEditPost({ ...editPost, og_title: e.target.value })}
                    placeholder={editPost.title}
                    className="w-full px-3 py-2 bg-white border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">OG Image URL Cover Override</label>
                  <input 
                    type="text" 
                    value={editPost.og_image || ''}
                    onChange={(e) => setEditPost({ ...editPost, og_image: e.target.value })}
                    placeholder={editPost.thumbnail_url}
                    className="w-full px-3 py-2 bg-white border rounded-lg font-mono text-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Not Editing - Show Tabs & Respective View */
        <div className="space-y-6">
          <div className="flex border-b border-slate-100 pb-px gap-2" id="news_sub_tabs">
            <button
              type="button"
              onClick={() => setActiveSubTab('news')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeSubTab === 'news'
                  ? 'border-emerald-800 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Daftar Artikel Berita
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('categories')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                activeSubTab === 'categories'
                  ? 'border-emerald-800 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              Kelola Kategori Kustom ({categories.length})
            </button>
          </div>

          {activeSubTab === 'news' ? (
            /* List Table Screen */
            <div className="space-y-4" id="posts_directory_list">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
                <div>
                  <h3 className="text-slate-850 font-black text-[15px] uppercase tracking-tight">Kanal Kelola Berita & Informasi</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Daftar tulisan redaksional warta, rilis berita resmi, dan artikel sekolah.</p>
                </div>
                <button 
                  onClick={handleCreateNewPost}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 border border-emerald-850 text-white font-black text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Berita Baru
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search bar widget */}
                <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 w-full max-w-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari judul berita atau penulis..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 focus:outline-none w-full"
                  />
                </div>

                {/* Selection info badge */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl px-4 py-2 text-[11px] font-bold self-start sm:self-auto">
                    <span>⚡ {selectedIds.length} item pilihan terpilih</span>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="hover:underline text-emerald-600 font-extrabold uppercase text-[10px] cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk actions tools panel */}
              {selectedIds.length > 0 && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4.5 bg-emerald-850 text-white rounded-2xl shadow-md border border-emerald-700 animate-fade-in text-left">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider block text-emerald-350">Tindakan Massal (Bulk Actions)</span>
                    <p className="text-[10px] text-emerald-100">Ubah status publikasi atau hapus sekali klik untuk {selectedIds.length} berita terpilih secara bebarengan.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <span className="text-[9.5px] uppercase font-black text-emerald-250 mr-1 hidden lg:inline">Set Status:</span>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('publish')}
                      className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 hover:border-emerald-500 font-bold rounded-lg text-[10px] tracking-wide uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer text-white"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#00e3a5]" /> Terbitkan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('draft')}
                      className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 hover:border-emerald-500 font-bold rounded-lg text-[10px] tracking-wide uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer text-white"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-300" /> Tunda (Draft)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('schedule')}
                      className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 hover:border-emerald-500 font-bold rounded-lg text-[10px] tracking-wide uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer text-white"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-400" /> Jadwalkan
                    </button>

                    <div className="h-6 w-px bg-emerald-800/80 mx-1 hidden md:block"></div>

                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 border border-rose-500 hover:border-rose-455 font-bold rounded-lg text-[10px] tracking-wide uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer text-white"
                    >
                      <Trash className="w-3.5 h-3.5" /> Hapus Terpilih ({selectedIds.length})
                    </button>
                  </div>
                </div>
              )}

              {/* Table list */}
              <div className="overflow-x-auto border rounded-xl bg-white shadow-xs">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-100 select-none">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                          checked={filteredPosts.length > 0 && filteredPosts.every(p => selectedIds.includes(p.id))}
                          onChange={toggleSelectAll}
                          title="Pilih / Batal Pilih Semua"
                        />
                      </th>
                      <th className="p-4 w-[280px]">Judul Warta</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Waktu Rilis</th>
                      <th className="p-4">Jurnalis</th>
                      <th className="p-4">Pembaca</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredPosts.map((post) => {
                      const getCatName = () => {
                        const found = categories.find(cat => cat.id === post.category_id);
                        return found ? found.name : "Uncategorized";
                      };
                      const isSelected = selectedIds.includes(post.id);
                      return (
                        <tr key={post.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-emerald-50/20' : ''}`}>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(post.id)}
                            />
                          </td>
                          <td className="p-4 font-bold text-slate-800 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={post.thumbnail_url} className="w-10 h-8 object-cover rounded border border-slate-100 shrink-0" alt="" />
                              <div className="flex flex-col min-w-0">
                                <span className="line-clamp-1 flex items-center gap-1.5 flex-wrap">
                                  {post.is_pinned && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-sm shrink-0">
                                      <Pin className="w-2.5 h-2.5 fill-white" /> PIN
                                    </span>
                                  )}
                                  <span>{post.title}</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                              {getCatName()}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-500">
                            {new Date(post.published_at).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-4 text-slate-650">{post.author_name}</td>
                          <td className="p-4 font-mono text-slate-500 font-bold">{post.views}x read</td>
                          <td className="p-4">
                            <span className={`text-[9.5px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${
                              post.status === 'publish'
                                ? "bg-emerald-50 border-emerald-100 text-emerald-800 shadow-2xs"
                                : post.status === 'schedule'
                                ? "bg-amber-50 border-amber-100 text-amber-800 animate-pulse"
                                : "bg-slate-100 border-slate-200 text-slate-500"
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => setEditPost(post)}
                                className="w-8 h-8 rounded-lg border text-indigo-700 bg-indigo-50 border-indigo-100 hover:bg-indigo-150 flex items-center justify-center cursor-pointer transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Hapus warta "${post.title}"?`)) {
                                    onDeletePost(post.id);
                                    if (onRefreshData) onRefreshData();
                                  }
                                }}
                                className="w-8 h-8 rounded-lg border text-rose-700 bg-rose-50 border-rose-100 hover:bg-rose-150 flex items-center justify-center cursor-pointer transition-colors"
                                title="Hapus"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPosts.length === 0 && (
                  <p className="p-6 text-center text-slate-400">Tidak ada berita yang sesuai dengan kata kunci pencarian Anda.</p>
                )}
              </div>
            </div>
          ) : (
            /* Classify / Category Layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="cms_category_builder_panel">
              {/* Left: Form */}
              <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div>
                  <h4 className="text-slate-850 font-black text-xs uppercase tracking-tight flex items-center gap-1.5 text-emerald-800">
                    <FolderOpen className="w-4 h-4" />
                    <span>{editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {editingCategoryId ? 'Sunting detail kategori warta Anda' : 'Buat pengelompokan klasifikasi baru untuk berita'}
                  </p>
                </div>

                <form onSubmit={handleSaveCategoryForm} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Nama Kategori</label>
                    <input 
                      type="text" 
                      required 
                      value={categoryForm.name}
                      onChange={(e) => {
                        const nameVal = e.target.value;
                        const slugVal = nameVal.toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-');
                        setCategoryForm({ ...categoryForm, name: nameVal, slug: slugVal });
                      }}
                      placeholder="Contoh: Info Kesiswaan"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Slug URL Kategori (Automated)</label>
                    <input 
                      type="text" 
                      required 
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="info-kesiswaan"
                      className="w-full px-3.5 py-2 bg-slate-100 border border-slate-205 rounded-lg text-xs text-slate-500 font-mono focus:outline-hidden cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Deskripsi Ringkas</label>
                    <textarea 
                      rows={3} 
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Tulis deskripsi ringkas tentang klasifikasi artikel ini..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-[11px] rounded-lg cursor-pointer text-center uppercase tracking-wider transition-all shadow-xs"
                    >
                      {editingCategoryId ? 'Simpan Perubahan' : 'Buat Kategori'}
                    </button>
                    {editingCategoryId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingCategoryId(null);
                          setCategoryForm({ name: '', description: '', slug: '' });
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[11px] rounded-lg cursor-pointer text-center uppercase transition-all"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right: Table */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
                <div className="p-4 border-b">
                  <h4 className="text-slate-850 font-black text-xs uppercase tracking-tight">Katalog Kategori Terdaftar</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Gunakan daftar ini untuk mengedit atau menghapus kategori berita madrasah.</p>
                </div>
                
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-100 select-none">
                        <th className="p-3">Nama Kategori</th>
                        <th className="p-3">Slug / Link</th>
                        <th className="p-3">Deskripsi</th>
                        <th className="p-3 text-right">Opsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {categories.map((cat) => {
                        const postUsageCount = posts.filter(p => p.category_id === cat.id).length;
                        return (
                          <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{cat.name}</span>
                                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100/60 px-1.5 py-0.5 rounded-full font-mono tracking-wide">
                                  {postUsageCount} Berita
                                </span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[10px] text-slate-400">/{cat.slug}</td>
                            <td className="p-3 text-slate-500 max-w-[200px] truncate">{cat.description || '-'}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditCategory(cat)}
                                  className="w-7 h-7 rounded border text-indigo-700 bg-indigo-50 border-indigo-100 hover:bg-indigo-150 flex items-center justify-center cursor-pointer transition-colors"
                                  title="Sunting Kategori"
                                >
                                  <Edit className="w-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="w-7 h-7 rounded border text-rose-700 bg-rose-50 border-rose-100 hover:bg-rose-150 flex items-center justify-center cursor-pointer transition-colors"
                                  title="Hapus Kategori"
                                >
                                  <Trash className="w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">Belum ada kategori yang ditambahkan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
