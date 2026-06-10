/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, AlertTriangle, CalendarDays, Award, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Event } from '../types';

interface EventCalendarProps {
  initialEvents: Event[];
}

interface CalendarItem {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'holiday' | 'exam';
  date: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD" for multi-day
  time?: string;
  location?: string;
  organizer?: string;
}

export default function EventCalendar({ initialEvents }: EventCalendarProps) {
  // Current active date context for Month view
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 9)); // Default to June 2026 to fit local time metadata
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-06-12"); // Default highlighted day (Bazar day)
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // Standard month list in Indonesian
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Defined holidays and exam sessions to enrich events
  const extraCalendarItems: CalendarItem[] = useMemo(() => [
    {
      id: "exam_pas",
      title: "Penilaian Akhir Semester (PAS) Genap",
      description: "Pelaksanaan assesmen semester genap tingkat dasar berbasis platform E-Learning digital lokal.",
      type: "exam",
      date: "2026-06-02",
      endDate: "2026-06-08",
      time: "07:30 - 12:30 WIB",
      location: "Ruang Kelas & Lab Komputer",
      organizer: "Kurikulum MIN Singkawang"
    },
    {
      id: "holiday_pancasila",
      title: "Libur Hari Lahir Pancasila",
      description: "Hari libur nasional memperingati lahirnya ideologi persatuan bangsa Pancasila.",
      type: "holiday",
      date: "2026-06-01",
      time: "Satu Hari Penuh",
      location: "Nasional",
      organizer: "Pemerintah RI"
    },
    {
      id: "holiday_adha",
      title: "Libur Hari Raya Idul Adha 1447 H",
      description: "Peringatan hari raya kurban, libur nasional keagamaan.",
      type: "holiday",
      date: "2026-06-17",
      time: "Satu Hari Penuh",
      location: "Nasional",
      organizer: "Kementerian Agama RI"
    },
    {
      id: "holiday_semester_end",
      title: "Libur Kenaikan Kelas & Akhir Semester Genap",
      description: "Masa libur panjang akhir tahun ajaran pelajaran 2025/2026 bagi seluruh jenjang kelas.",
      type: "holiday",
      date: "2026-06-22",
      endDate: "2026-07-12",
      time: "Tiga Pekan",
      location: "Rumah Masing-masing",
      organizer: "Dinas Pendidikan & Kemenag"
    },
    {
      id: "event_silaturahmi",
      title: "Silaturahmi Komite & Rapat Wali Murid Akhir Tahun",
      description: "Pertemuan pelaporan perkembangan program madrasah adiwiyata, keuangan, serta pembagian rapor.",
      type: "event",
      date: "2026-06-19",
      time: "08:30 - 11:30 WIB",
      location: "Masjid Al-Ikhlas MIN",
      organizer: "Komite & Kepala Madrasah"
    },
    {
      id: "event_ppdb_re-registration",
      title: "Daftar Ulang & Registrasi PPDB Gelombang I",
      description: "Verifikasi berkas fisik, pengukuran seragam sekolah, serta pencetakan kartu induk siswa baru.",
      type: "event",
      date: "2026-06-15",
      endDate: "2026-06-20",
      time: "08:00 - 14:00 WIB",
      location: "Gedung Pusat Pelayanan Terpadu Satu Atap",
      organizer: "Panitia Penerimaan Siswa Baru"
    }
  ], []);

  // Merge events dynamically
  const allCalendarItems: CalendarItem[] = useMemo(() => {
    // Core event list mapped
    const parsedInitials: CalendarItem[] = initialEvents.map(evt => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      type: 'event',
      date: evt.event_date,
      time: evt.event_time,
      location: evt.location,
      organizer: evt.organizer
    }));

    return [...parsedInitials, ...extraCalendarItems];
  }, [initialEvents, extraCalendarItems]);

  // Navigate semesters / months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetMonth = () => {
    setCurrentDate(new Date(2026, 5, 9));
    setSelectedDateStr("2026-06-12");
  };

  // Helper function to check if a calendar item falls on a specific date string (YYYY-MM-DD)
  const isItemForDate = (item: CalendarItem, dateStr: string) => {
    if (!dateStr) return false;
    if (item.endDate) {
      return item.date <= dateStr && dateStr <= item.endDate;
    }
    return item.date === dateStr;
  };

  // Generate 42 calendar grid cells
  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];

    // Pre-month filler
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateString: ""
      });
    }

    // Active month days
    for (let i = 1; i <= totalDays; i++) {
      const dayStr = String(i).padStart(2, '0');
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dateString = `${currentYear}-${monthStr}-${dayStr}`;
      cells.push({
        day: i,
        isCurrentMonth: true,
        dateString
      });
    }

    // Post-month filler to round out standard 6 weekly rows (42 blocks)
    const remainingSlots = 42 - cells.length;
    for (let i = 1; i <= remainingSlots; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateString: ""
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Get index list of calendar items to render on a day block
  const getItemsForDate = (dateStr: string) => {
    return allCalendarItems.filter(item => isItemForDate(item, dateStr));
  };

  // Currently Selected Day info list
  const selectedDayItems = useMemo(() => {
    return allCalendarItems.filter(item => isItemForDate(item, selectedDateStr));
  }, [allCalendarItems, selectedDateStr]);

  // General list filters for the entire displayed month inside panel
  const monthlyItemsList = useMemo(() => {
    return allCalendarItems.filter(item => {
      const itemMonth = new Date(item.date).getMonth();
      const itemYear = new Date(item.date).getFullYear();
      
      const inThisMonth = itemMonth === currentMonth && itemYear === currentYear;
      
      let inScopeByEndRange = false;
      if (item.endDate) {
        const endMonth = new Date(item.endDate).getMonth();
        const endYear = new Date(item.endDate).getFullYear();
        inScopeByEndRange = (endMonth === currentMonth && endYear === currentYear);
      }

      if (!(inThisMonth || inScopeByEndRange)) return false;
      if (selectedTypeFilter !== "ALL" && item.type !== selectedTypeFilter.toLowerCase()) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [allCalendarItems, currentMonth, currentYear, selectedTypeFilter]);

  // Render cell backgrounds and border outlines depending on highlight types
  const getCellClasses = (cell: { day: number; isCurrentMonth: boolean; dateString: string }) => {
    if (!cell.isCurrentMonth) {
      return "bg-slate-50/40 text-slate-350 dark:bg-slate-900/10 dark:text-slate-600 select-none cursor-default";
    }

    const { dateString } = cell;
    const isSelected = selectedDateStr === dateString;
    const dayItems = getItemsForDate(dateString);

    const hasHoliday = dayItems.some(item => item.type === 'holiday');
    const hasExam = dayItems.some(item => item.type === 'exam');
    const hasEvent = dayItems.some(item => item.type === 'event');

    let bgClass = "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80";
    let borderClass = "border-slate-100 dark:border-slate-800/60";
    let textClass = "text-slate-700 dark:text-slate-300";

    if (isSelected) {
      bgClass = "bg-emerald-50 dark:bg-emerald-950/40";
      borderClass = "border-emerald-500 shadow-xs";
      textClass = "text-emerald-700 dark:text-emerald-400 font-bold";
    } else if (hasHoliday) {
      bgClass = "bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30";
      textClass = "text-rose-700 dark:text-rose-400 font-bold";
    } else if (hasExam) {
      bgClass = "bg-cyan-50/40 dark:bg-cyan-950/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/30";
      textClass = "text-cyan-700 dark:text-cyan-400 font-bold";
    }

    // Is it Sunday? mark red text
    const isSunday = new Date(currentYear, currentMonth, cell.day).getDay() === 0;
    if (isSunday && !isSelected) {
      textClass = "text-rose-500 font-semibold";
    }

    return `${bgClass} ${borderClass} ${textClass} cursor-pointer transition-all duration-150`;
  };

  return (
    <div className="bg-white dark:bg-slate-905 border border-slate-150/40 dark:border-slate-800/70 rounded-3xl p-6 md:p-8 shadow-sm" id="school_monthly_calendar_root">
      
      {/* Title Header with descriptive label & Type Legend filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Kalender Pendidikan Interaktif</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400 leading-relaxed max-w-xl">
            Akses agenda kegiatan madrasah, jadwal ujian Penilaian Akhir Semester (PAS), agenda wisuda siswa, rapat pleno komite, serta daftar libur nasional.
          </p>
        </div>

        {/* Legend item Filters */}
        <div className="flex flex-wrap gap-2 select-none">
          {["ALL", "EVENT", "EXAM", "HOLIDAY"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedTypeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border outline-hidden cursor-pointer ${
                selectedTypeFilter === filter
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {filter === "ALL" ? "Semua" : filter === "EVENT" ? "Kegiatan" : filter === "EXAM" ? "Ujian" : "Hari Libur"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* LEFT COLUMN: INTERACTIVE MONTH CALENDAR GRID (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Calendar controls */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 md:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 outline-hidden"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white min-w-36 text-center select-none tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 md:p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 outline-hidden"
                title="Bulan Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action button */}
            <button
              type="button"
              onClick={handleResetMonth}
              className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-hidden tracking-wider uppercase font-mono transition-colors"
              title="Kembali ke Bulan Berjalan"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Juni 2026
            </button>
          </div>

          {/* Weekday indicator labels */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
            <div className="text-rose-500 py-1 font-extrabold">Min</div>
            <div className="py-1">Sen</div>
            <div className="py-1">Sel</div>
            <div className="py-1">Rab</div>
            <div className="py-1">Kam</div>
            <div className="py-1">Jum</div>
            <div className="py-1">Sab</div>
          </div>

          {/* Actual 42 grid cells container */}
          <div className="grid grid-cols-7 gap-1.5" id="calendar_grid_layout">
            {calendarCells.map((cell, idx) => {
              const cellItems = cell.dateString ? getItemsForDate(cell.dateString) : [];
              const isSelected = cell.dateString === selectedDateStr;

              return (
                <div
                  key={idx}
                  onClick={() => cell.isCurrentMonth && setSelectedDateStr(cell.dateString)}
                  className={`relative min-h-[55px] md:min-h-[64px] border rounded-xl p-1.5 flex flex-col justify-between select-none ${getCellClasses(cell)}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="text-[11px] font-bold z-10">{cell.day}</span>
                  
                  {/* Indicators (Dots represent events on this date) */}
                  {cell.isCurrentMonth && cellItems.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1 mt-auto shrink-0">
                      {cellItems.slice(0, 3).map((item, itemIdx) => (
                        <span 
                          key={itemIdx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.type === 'holiday' 
                              ? 'bg-rose-500' 
                              : item.type === 'exam' 
                                ? 'bg-cyan-500' 
                                : 'bg-emerald-500'
                          }`}
                          title={item.title}
                        />
                      ))}
                      {cellItems.length > 3 && (
                        <span className="text-[7px] text-slate-450 leading-none font-bold">+{cellItems.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Micro gradient ring of choice */}
                  {isSelected && (
                    <span className="absolute inset-0 rounded-xl border-2 border-emerald-500 pointer-events-none z-20" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Small type description labels footer legend */}
          <div className="flex justify-start items-center gap-4 text-[10px] text-slate-500 dark:text-slate-450 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/30">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Kegiatan Madrasah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Sesi Ujian / PAS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Hari Libur resmi</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AGENDA DETAILS LISTING (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-5 text-left">
          
          {/* Section banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">FOKUS DETAIL HARI</span>
            <h4 className="text-xs font-black text-slate-900 dark:text-white inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {selectedDateStr ? (
                new Date(selectedDateStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              ) : (
                "Pilih tanggal di kalender"
              )}
            </h4>
          </div>

          <div className="min-h-[220px]" id="calendar_agenda_detailed_cards">
            <AnimatePresence mode="wait">
              {selectedDayItems.length > 0 ? (
                <motion.div
                  key={selectedDateStr}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  {selectedDayItems.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className={`rounded-2xl p-4.5 border text-left transition-all duration-205 ${
                        item.type === 'holiday'
                          ? 'border-rose-100 dark:border-rose-950/20 bg-rose-50/20 dark:bg-rose-950/10'
                          : item.type === 'exam'
                            ? 'border-cyan-100 dark:border-cyan-950/20 bg-cyan-50/20 dark:bg-cyan-950/10'
                            : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/30'
                      }`}
                    >
                      {/* Badge identifier label */}
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                          item.type === 'holiday'
                            ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                            : item.type === 'exam'
                              ? 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {item.type === 'holiday' ? 'Hari Libur' : item.type === 'exam' ? 'Sesi Ujian' : 'Agenda Kegiatan'}
                        </span>
                        
                        {item.organizer && (
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[150px]">
                            Oleh: {item.organizer}
                          </span>
                        )}
                      </div>

                      {/* Info layout header body details */}
                      <h5 className="text-slate-900 dark:text-white text-sm font-black leading-snug">{item.title}</h5>
                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium mt-1.5 block">{item.description}</p>
                      
                      {/* Meta timers */}
                      <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-mono mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-850">
                        {item.time && (
                          <span className="flex items-center gap-1 leading-none">
                            <Clock className="w-3.5 h-3.5 text-slate-350" />
                            {item.time}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1 leading-none">
                            <MapPin className="w-3.5 h-3.5 text-slate-350" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl"
                >
                  <AlertTriangle className="w-7 h-7 text-slate-300 dark:text-slate-700 mb-2.5" />
                  <h6 className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">Tidak Ada Agenda Khusus</h6>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                    Hari ini berjalan sesuai dengan KBM normal harian. Hubungi administrasi via keluhan digital jika ada pertanyaan lain.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* List all items within the currently viewed overall month (high summary value) */}
          <div className="mt-2.5 pt-4 border-t border-slate-100 dark:border-slate-850">
            <h4 className="text-slate-900 dark:text-white text-xs font-black tracking-tight uppercase mb-3 flex items-center gap-1.5">
              <span>Ikhtisar Agenda Bulan Ini</span>
              <span className="p-0.5 px-1.5 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] rounded-md font-mono">
                {monthlyItemsList.length}
              </span>
            </h4>
            
            <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-200">
              {monthlyItemsList.map((item) => {
                const dayDate = new Date(item.date).getDate();
                const abbreviatedMonth = new Date(item.date).toLocaleDateString('id-ID', { month: 'short' });
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDateStr(item.date)}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/60 cursor-pointer text-left gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex flex-col items-center justify-center font-bold font-mono text-[10px] ${
                        item.type === 'holiday'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450'
                          : item.type === 'exam'
                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450'
                      }`}>
                        <span className="font-bold text-xs leading-none">{dayDate}</span>
                        <span className="text-[7px] uppercase tracking-wider leading-none">{abbreviatedMonth}</span>
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug truncate">
                          {item.title}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5 truncate max-w-xs leading-none font-mono">
                          {item.time || "Satu Hari Penuh"}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      item.type === 'holiday'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30'
                        : item.type === 'exam'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                );
              })}

              {monthlyItemsList.length === 0 && (
                <p className="text-[10px] text-slate-400 italic text-center py-4">
                  Tidak ada agenda atau jadwal ujian/libur terekam pada bulan {monthNames[currentMonth]}.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
