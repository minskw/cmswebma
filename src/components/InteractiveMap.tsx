/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, RefreshCw, ZoomIn, ZoomOut, MousePointerClick, Star, Landmark, Navigation2 } from 'lucide-react';

interface InteractiveMapProps {
  schoolName: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

// Ensure Leaflet is loaded exactly once client-side
let leafletLoadPromise: Promise<any> | null = null;

function fetchLeaflet(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if ((window as any).L) return Promise.resolve((window as any).L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    // 1. Inject Leaflet's pristine CSS stylesheet
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    // 2. Inject Leaflet's JS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      resolve((window as any).L);
    };
    script.onerror = (err) => {
      leafletLoadPromise = null; // Let it retry if it failed
      reject(err);
    };
    document.body.appendChild(script);
  });

  return leafletLoadPromise;
}

export default function InteractiveMap({
  schoolName = "MIN Singkawang",
  address,
  latitude = 0.901859,
  longitude = 108.986689
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const otherMarkersRef = useRef<any[]>([]);
  
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentLayer, setCurrentLayer] = useState<'modern' | 'satellite' | 'classic'>('modern');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat: latitude, lng: longitude });
  const [viewedCoords, setViewedCoords] = useState<{ lat: number; lng: number }>({ lat: latitude, lng: longitude });
  const [activeLandmark, setActiveLandmark] = useState<string | null>(null);

  // Elegant predefined nearby landmarks for users to interact with
  const landmarks = [
    {
      id: 'school',
      name: 'MIN Singkawang (Madrasah)',
      lat: 0.901859,
      lng: 108.986689,
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
  ];

  const mapProviders = {
    modern: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    classic: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const attributionText = '© OpenStreetMap contributors © CARTO © Esri GIS';

  useEffect(() => {
    let active = true;

    fetchLeaflet()
      .then((L) => {
        if (!active) return;
        if (!L) {
          setLoadError("Dynamic map library failed to bind.");
          return;
        }

        // Initialize Map
        if (mapContainerRef.current && !mapInstanceRef.current) {
          // Initialize map with school location
          const leafletMap = L.map(mapContainerRef.current, {
            center: [latitude, longitude],
            zoom: 16,
            zoomControl: false, // Customized controls below
            attributionControl: false // Minimal UI
          });

          // Add modern Map tile layer initially
          const tileLayer = L.tileLayer(mapProviders.modern, {
            maxZoom: 19,
            attribution: attributionText
          }).addTo(leafletMap);

          // Custom styled popup for our school
          const schoolPopupContent = `
            <div class="p-3 font-sans max-w-sm text-left">
              <span class="text-[9px] uppercase font-bold text-emerald-700 tracking-wider block mb-1">Pusat Lokasi</span>
              <h4 class="font-extrabold text-slate-900 text-xs leading-snug">${schoolName}</h4>
              <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">${address || 'Jl. Jenderal Sudirman No. 45, Condong'}</p>
              <div class="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                <span class="text-[8px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded">Lat: ${latitude.toFixed(6)}</span>
                <span class="text-[8px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded">Lng: ${longitude.toFixed(6)}</span>
              </div>
            </div>
          `;

          // Create standard school marker
          const schoolMarker = L.marker([latitude, longitude])
            .addTo(leafletMap)
            .bindPopup(schoolPopupContent, { closeButton: false });

          // Listen for user pan / move actions to update viewed coords
          leafletMap.on('move', () => {
            const center = leafletMap.getCenter();
            setViewedCoords({ lat: center.lat, lng: center.lng });
          });

          // Mount references
          mapInstanceRef.current = leafletMap;
          markerInstanceRef.current = schoolMarker;
          
          // Force opening the school popup initially
          schoolMarker.openPopup();

          setIsReady(true);
        }
      })
      .catch((err) => {
        console.error("Leaflet loader error:", err);
        setLoadError("Sambungan internet lambat. Peta interaktif gagal dimuat.");
      });

    return () => {
      active = false;
    };
  }, [latitude, longitude, schoolName, address]);

  // Handle Map layer swaps (Modern vs Satellite vs Classic)
  const handleLayerChange = (layerKey: 'modern' | 'satellite' | 'classic') => {
    const L = (window as any).L;
    if (!mapInstanceRef.current || !L) return;

    setCurrentLayer(layerKey);

    // Remove old layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add new Tile layer
    L.tileLayer(mapProviders[layerKey], {
      maxZoom: 19,
      attribution: attributionText
    }).addTo(mapInstanceRef.current);
  };

  // Zoom actions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Reset viewport focus to the school marker
  const handleResetFocus = () => {
    if (mapInstanceRef.current && markerInstanceRef.current) {
      setActiveLandmark('school');
      mapInstanceRef.current.setView([latitude, longitude], 17, { animate: true, duration: 1 });
      markerInstanceRef.current.openPopup();
    }
  };

  // Focus and jump map to a custom landmark
  const handleNavigateToLandmark = (item: typeof landmarks[0]) => {
    const L = (window as any).L;
    if (!mapInstanceRef.current || !L) return;

    setActiveLandmark(item.id);

    // Clear any auxiliary temporary markers
    otherMarkersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    otherMarkersRef.current = [];

    // Pan viewport to target coords
    mapInstanceRef.current.setView([item.lat, item.lng], 17, { animate: true, duration: 1.2 });

    // Show custom popup
    if (item.id === 'school') {
      if (markerInstanceRef.current) {
        markerInstanceRef.current.openPopup();
      }
    } else {
      const helperMarker = L.marker([item.lat, item.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2.5 font-sans text-left max-w-xs">
            <h5 class="font-extrabold text-slate-900 text-xs leading-snug">${item.name}</h5>
            <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">${item.desc}</p>
          </div>
        `, { closeButton: false })
        .addTo(mapInstanceRef.current);

      helperMarker.openPopup();
      otherMarkersRef.current = [helperMarker];
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl border border-slate-150 dark:border-slate-800/80 p-5 font-sans relative overflow-hidden" id="interactive_map_wrapper">
      <div className="flex items-start md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-4 flex-col sm:flex-row">
        <div>
          <h4 className="text-slate-900 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Sistem Navigasi & Peta Interaktif</span>
          </h4>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan kontrol layer, navigasi presisi tinggi, and telusuri koordinat madrasah.
          </p>
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-0.5 rounded-xl text-[10px]" id="map_layer_selection_switches">
          <button
            type="button"
            onClick={() => handleLayerChange('modern')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'modern' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sleek
          </button>
          <button
            type="button"
            onClick={() => handleLayerChange('satellite')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'satellite' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Satelit
          </button>
          <button
            type="button"
            onClick={() => handleLayerChange('classic')}
            className={`px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all uppercase cursor-pointer ${
              currentLayer === 'classic' ? 'bg-slate-900 text-white dark:bg-slate-800 text-[10px]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            OSM
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
                const isFocused = activeLandmark === item.id || (item.id === 'school' && !activeLandmark);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigateToLandmark(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isFocused 
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-990/10 shadow-3xs' 
                        : 'border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg shrink-0 border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 select-none">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              <span>Titik Kamera (Peta)</span>
            </div>
            <div className="text-[10px] font-mono leading-relaxed space-y-1.5 text-slate-500 dark:text-slate-400" id="current_map_coordinates_panel">
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-1">
                <span>Latitude:</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">{viewedCoords.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">{viewedCoords.lng.toFixed(6)}</span>
              </div>
            </div>
            
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full text-center py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-97 cursor-pointer"
            >
              <Navigation2 className="w-3.5 h-3.5 shrink-0" />
              <span>Rute Petunjuk Arah</span>
            </a>
          </div>
        </div>

        {/* Map Rendering Container */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-slate-250/30 dark:border-slate-800 bg-slate-100 min-h-[320px] md:min-h-[380px]" id="interactive_leaflet_map_render_box">
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-55">
              <span className="text-3xl mb-3">📡</span>
              <p className="text-xs text-rose-500 font-extrabold">{loadError}</p>
              <p className="text-[10px] text-slate-400 mt-2 max-w-sm">
                Harap periksa koneksi internet Anda. Kami menggunakan OpenStreetMap untuk render peta interaktif Anda.
              </p>
            </div>
          ) : (
            <>
              {/* Actual Map element */}
              <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-1" id="interactive_actual_map_container" />

              {!isReady && (
                <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin mb-2" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 animate-pulse">Menyiapkan Mesin Peta...</span>
                </div>
              )}

              {/* Float Toolbar Overlays on Map */}
              {isReady && (
                <div className="absolute right-4 bottom-4 z-40 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 shadow-md flex flex-col gap-1 items-center" id="map_overlay_zoom_controllers">
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
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
