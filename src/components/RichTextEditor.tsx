/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, Quote, Link, Image, Eye, Code, Trash2, ArrowUpRight } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis isi konten berita di sini...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [htmlValue, setHtmlValue] = useState(value || '');

  // Keep internal state in sync with external value on mount or when external value changes drastically
  useEffect(() => {
    if (value !== htmlValue) {
      setHtmlValue(value || '');
      if (editorRef.current && activeTab === 'visual') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleVisualInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlValue(content);
      onChange(content);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setHtmlValue(content);
    onChange(content);
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  };

  // Sync contentEditable innerHTML when switching back to visual tab
  useEffect(() => {
    if (activeTab === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = htmlValue;
    }
  }, [activeTab]);

  const executeCommand = (command: string, arg: string = '') => {
    if (activeTab !== 'visual') return;
    document.execCommand(command, false, arg);
    handleVisualInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL Link (contoh: https://minsingkawang.sch.id):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL Gambar (contoh: https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600):');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 flex flex-col font-sans mb-4 shadow-sm transition-colors duration-200">
      
      {/* Editor Header Bar with Toolbar and Tab Toggles */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Formatting Buttons (Only enabled in visual tab) */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Garis Bawah (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></span>

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h1>')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Judul 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Judul 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></span>

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Daftar Bullet"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Daftar Angka"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Kutipan"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1"></span>

          <button
            type="button"
            onClick={insertLink}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Masukkan Tautan Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Masukkan Gambar"
          >
            <Image className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            disabled={activeTab === 'code'}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-xs font-semibold cursor-pointer"
            title="Hapus Format Tulisan"
          >
            Clear Format
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-white dark:bg-slate-850 text-emerald-800 dark:text-emerald-400 shadow-sm'
                : 'text-slate-550 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual WYSIWYG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-850 text-emerald-800 dark:text-emerald-400 shadow-sm'
                : 'text-slate-555 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Source</span>
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="relative flex-1 min-h-[320px] transition-all bg-white dark:bg-slate-950">
        
        {/* Visual WYSIWYG Editor using ContentEditable */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleVisualInput}
          className={`w-full min-h-[320px] max-h-[500px] overflow-y-auto p-4 md:p-5 focus:outline-none text-xs text-slate-800 dark:text-slate-200 prose prose-slate dark:prose-invert max-w-none text-left ${
            activeTab === 'visual' ? 'block' : 'hidden'
          }`}
          style={{ direction: 'ltr' }}
          placeholder={htmlValue ? '' : placeholder}
        />
        {/* Simulated contentEditable Placeholder */}
        {!htmlValue && activeTab === 'visual' && (
          <div className="absolute top-4 left-4 text-slate-400 dark:text-slate-600 pointer-events-none text-xs select-none">
            {placeholder}
          </div>
        )}

        {/* Coded Editor mode (HTML text area view) */}
        <textarea
          value={htmlValue}
          onChange={handleCodeChange}
          placeholder="Isi kode HTML atau teks kaya..."
          className={`w-full min-h-[320px] max-h-[500px] overflow-y-auto p-4 md:p-5 focus:outline-none font-mono text-xs text-slate-800 dark:text-slate-250 bg-slate-950 text-emerald-500 border-none resize-none text-left ${
            activeTab === 'code' ? 'block' : 'hidden'
          }`}
        />
      </div>

      {/* Helper Footer Status Bar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
        <span className="font-medium tracking-wide">
          Mode Edit: <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">{activeTab}</span>
        </span>
        <span className="font-mono">
          Karakter: <span className="font-semibold">{htmlValue ? htmlValue.length : 0}</span>
        </span>
      </div>
    </div>
  );
}
