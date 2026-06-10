/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, ZoomIn, ZoomOut, MousePointerClick, Star, Landmark, Navigation2, HelpCircle, RefreshCw } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';

interface InteractiveMapProps {
  schoolName: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

// Subcomponent to smoothly pan and zoom Google Maps
function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  useEffect(() => {
    if (map && zoom !== undefined) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  return null;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function InteractiveMap({
  schoolName = "MIN Singkawang",
  address,
  latitude = 0.901859,
  longitude = 108.986689
}: InteractiveMapProps) {
  
  const [currentLayer, setCurrentLayer] = useState<'modern' | 'satellite' | 'classic'>('modern');
  const [viewedCoords, setViewedCoords] = useState<{ lat: number; lng: number }>({ lat: latitude, lng: longitude });
  const [activeLandmark, setActiveLandmark] = useState<string>('school');
  const [zoom, setZoom] = useState<number>(16);

  // Elegant predefined nearby landmarks for users to interact with
  const landmarks = useMemo(() => [
    {
      id: 'school',
      name: 'MIN Singkawang (Madrasah)',
      lat: latitude,
      lng: longitude,
      desc: 'Kampus utama madrasah berstandar digital dan ramah anak.',
      icon: Star,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200'
    },
    {
      id: 'kemenag',
      name: 'Kantor Kemenag Singkawang',
      lat: 0.901112,
      lng: 108.981541,
      desc: 'Kantor Kementerian Agama Kota Singkawang selaku instansi pembina.',
      icon: Landmark,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200'
    },
    {
      id: 'masjid',
      name: 'Masjid Raya Singkawang',
      lat: 0.898864,
      lng: 108.974950,
      desc: 'Masjid Agung tertua & ikonik kebanggaan masyarakat Singkawang.',
      icon: Navigation2,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200'
    }
  ], [latitude, longitude]);

  const mapTypeId = useMemo(() => {
    switch (currentLayer) {
      case 'satellite':
        return 'satellite';
      case 'classic':
        return 'hybrid';
      case 'modern':
      default:
        return 'roadmap';
    }
  }, [currentLayer]);

  // Reset viewport focus to the school marker
  const handleResetFocus = () => {
    setActiveLandmark('school');
    setViewedCoords({ lat: latitude, lng: longitude });
    setZoom(17);
  };

  // Focus and jump map to a custom landmark
  const handleNavigateToLandmark = (item: typeof landmarks[0]) => {
    setActiveLandmark(item.id);
    setViewedCoords({ lat: item.lat, lng: item.lng });
    setZoom(17);
  };

  // Zoom actions helpers
  const handleZoomIn = () => {
    setZoom(z => Math.min(21, z + 1));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(1, z - 1));
  };

  const activeLandmarkObj = useMemo(() => {
    return landmarks.find(item => item.id === activeLandmark) || landmarks[0];
  }, [landmarks, activeLandmark]);

  if (!hasValidKey) {
    return (
      <div className="bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl border border-slate-150 dark:border-slate-800/80 p-5 font-sans text-left relative overflow-hidden animate-fade-in" id="interactive_map_wrapper">
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h4 className="text-slate-900 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Sistem Navigasi & Peta Interaktif</span>
            </h4>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hubungkan kunci API Google Maps untuk melihat peta lokasi sekolah interaktif.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850/50 min-h-[300px]">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-full flex items-center justify-center text-amber-500 dark:text-amber-400 mb-4 animate-bounce">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Google Maps API Key Diperlukan</h5>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 max-w-md leading-relaxed">
            Peta interaktif menggunakan Google Maps API untuk menyajikan navigasi presisi tinggi, info wilayah kustom, dan rute navigasi.
          </p>
          
          <div className="mt-5 w-full max-w-md bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 text-left text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-400">
            <p className="font-bold text-slate-800 dark:text-slate-300 mb-1.5">Langkah Aktivasi Panel Peta:</p>
            <ol className="list-decimal list-inside space-y-1.5 font-sans">
              <li>Dapatkan kunci API resmi: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-extrabold text-green-700">Konsol Google Cloud</a></li>
              <li>Pencet tombol gerigi <strong className="font-bold text-slate-850 dark:text-slate-100">Settings</strong> (⚙️) di ujung kanan atas layar ini</li>
              <li>Buka tab <strong className="font-bold text-slate-850 dark:text-slate-100">Secrets</strong></li>
              <li>Ketik nama kunci: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-rose-600 dark:text-rose-455">GOOGLE_MAPS_PLATFORM_KEY</code>, lalu tekan Enter</li>
              <li>Masukkan nilai API key yang Anda miliki, lalu tekan Enter</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl border border-slate-150 dark:border-slate-800/80 p-5 font-sans relative overflow-hidden" id="interactive_map_wrapper">
      <div className="flex items-start md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-4 flex-col sm:flex-row">
        <div>
          <h4 className="text-slate-900 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Sistem Navigasi Google Maps Interaktif</span>
          </h4>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan kontrol layer, navigasi presisi tinggi Google, dan telusuri koordinat madrasah.
          </p>
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-0.5 rounded-xl text-[10px]" id="map_layer_selection_switches">
          <button
            type="button"
            onClick={() => setCurrentLayer('modern')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'modern' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Peta
          </button>
          <button
            type="button"
            onClick={() => setCurrentLayer('satellite')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'satellite' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Satelit
          </button>
          <button
            type="button"
            onClick={() => setCurrentLayer('classic')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'classic' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Hibrida
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Landmarks Directory Panel */}
        <div className="lg:col-span-1 flex flex-col gap-3 justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              Daftar Titik Penanda
            </span>
            <div className="flex flex-col gap-2" id="landmarks_selector_list">
              {landmarks.map((item) => {
                const Icon = item.icon;
                const isFocused = activeLandmark === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigateToLandmark(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isFocused 
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-990/10 shadow-3xs' 
                        : 'border-slate-100 dark:border-slate-855 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg shrink-0 border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0 text-left">
                      <h5 className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h5>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-snug line-clamp-2 mt-0.5 font-sans">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 select-none">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              <span>Titik Aktif (Peta)</span>
            </div>
            <div className="text-[10px] font-mono leading-relaxed space-y-1.5 text-slate-500 dark:text-slate-400" id="current_map_coordinates_panel">
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1">
                <span>Lat:</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">{viewedCoords.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lng:</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">{viewedCoords.lng.toFixed(6)}</span>
              </div>
            </div>
            
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeLandmarkObj.lat},${activeLandmarkObj.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full text-center py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-97 cursor-pointer"
            >
              <Navigation2 className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span>Rute Petunjuk Arah</span>
            </a>
          </div>
        </div>

        {/* Map Rendering Container */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-slate-250/30 dark:border-slate-800 bg-slate-100 min-h-[320px] md:min-h-[380px] text-slate-800" id="interactive_google_map_render_box">
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: latitude, lng: longitude }}
              zoom={zoom}
              mapTypeId={mapTypeId}
              mapId="MIN_SINGKAWANG_MAP"
              style={{ width: '100%', height: '100%', minHeight: '380px' }}
              gestureHandling="cooperative"
              disableDefaultUI={true}
              onCameraChanged={(ev) => {
                if (ev.detail && ev.detail.center) {
                  setViewedCoords({ lat: ev.detail.center.lat, lng: ev.detail.center.lng });
                }
              }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              <MapController center={viewedCoords} zoom={zoom} />
              
              {landmarks.map((item) => (
                <AdvancedMarker
                  key={item.id}
                  position={{ lat: item.lat, lng: item.lng }}
                  onClick={() => {
                    setActiveLandmark(item.id);
                    setViewedCoords({ lat: item.lat, lng: item.lng });
                    setZoom(17);
                  }}
                >
                  <Pin
                    background={item.id === 'school' ? '#065f46' : item.id === 'kemenag' ? '#d97706' : '#4f46e5'}
                    border={item.id === 'school' ? '#044d35' : item.id === 'kemenag' ? '#b45309' : '#3730a3'}
                    glyphColor="#ffffff"
                  />
                </AdvancedMarker>
              ))}

              {activeLandmark && (() => {
                const selectedItem = landmarks.find(lm => lm.id === activeLandmark);
                if (!selectedItem) return null;
                return (
                  <InfoWindow
                    position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
                    onCloseClick={() => setActiveLandmark('')}
                  >
                    <div className="p-1 max-w-sm text-slate-900 text-left bg-white rounded">
                      <span className="text-[8px] uppercase font-bold text-emerald-700 tracking-wider block mb-0.5">Penanda Aktif</span>
                      <h4 className="font-extrabold text-[11px] leading-snug">{selectedItem.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-sans">{selectedItem.desc}</p>
                      {selectedItem.id === 'school' && (
                        <p className="text-[9px] text-slate-400 mt-1 leading-snug border-t border-slate-100 pt-1">{address}</p>
                      )}
                    </div>
                  </InfoWindow>
                );
              })()}
            </Map>
          </APIProvider>

          {/* Float Toolbar Overlays on Map */}
          <div className="absolute right-4 bottom-4 z-40 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 shadow-md flex flex-col gap-1 items-center" id="map_overlay_zoom_controllers">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Perbesar Peta"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Perkecil Peta"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-6 border-b border-slate-100 dark:border-slate-800 mx-1 my-0.5" />
            <button
              type="button"
              onClick={handleResetFocus}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Kembalikan Fokus ke Madrasah"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
