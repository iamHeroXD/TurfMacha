"use client";

import { useEffect, useRef, useState } from "react";
import { Turf } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TurfMapProps {
  turfs?: Turf[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  selectedTurf?: Turf | null;
}

const USER_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="8" fill="#65e42a" stroke="white" stroke-width="2.5"/>
  <circle cx="10" cy="10" r="3.5" fill="white"/>
</svg>`;

const TURF_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
  <path d="M16 0 C7.16 0 0 7.16 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7.16 24.84 0 16 0Z" fill="#65e42a"/>
  <circle cx="16" cy="16" r="7" fill="white"/>
  <path d="M13 16 L15.5 18.5 L20 13" stroke="#65e42a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;base64,${btoa(svg.trim())}`;

export function TurfMap({
  turfs = [],
  center = [12.9716, 77.5946],
  zoom = 13,
  className = "h-[400px]",
  selectedTurf,
}: TurfMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const lRef = useRef<typeof import("leaflet") | null>(null);
  const turfIconRef = useRef<import("leaflet").Icon | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let map: import("leaflet").Map;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      lRef.current = L;

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

      map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // User location marker
      const userIcon = L.icon({
        iconUrl: svgToDataUri(USER_ICON_SVG),
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -14],
      });

      L.marker(center, { icon: userIcon })
        .addTo(map)
        .bindPopup("<strong style='color:#65e42a'>You are here</strong>");

      turfIconRef.current = L.icon({
        iconUrl: svgToDataUri(TURF_ICON_SVG),
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
      });

      setMapReady(true);
    };

    initMap().catch(console.error);

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
        lRef.current = null;
        turfIconRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers whenever turfs or selectedTurf change (including initial render after map ready)
  useEffect(() => {
    const L = lRef.current;
    const map = mapInstanceRef.current;
    const turfIcon = turfIconRef.current;
    if (!mapReady || !L || !map || !turfIcon) return;

    // Remove existing turf markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const newMarkers: import("leaflet").Marker[] = [];

    turfs.forEach((turf) => {
      if (!turf.latitude || !turf.longitude) return;

      const popup = L.popup({ maxWidth: 220 }).setContent(`
        <div style="font-family:system-ui;padding:4px;min-width:160px">
          <h3 style="font-weight:700;font-size:13px;color:white;margin:0 0 3px 0;line-height:1.3">${turf.name}</h3>
          <p style="font-size:11px;color:rgba(255,255,255,0.55);margin:0 0 8px 0">${turf.city}</p>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:11px;color:rgba(255,255,255,0.5)">⭐ ${turf.rating?.toFixed(1) || "New"}</span>
            <span style="font-size:13px;font-weight:700;color:#65e42a">${formatPrice(turf.price_per_hour)}/hr</span>
          </div>
        </div>
      `);

      const marker = L.marker([turf.latitude, turf.longitude], { icon: turfIcon })
        .addTo(map)
        .bindPopup(popup);

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Fit bounds to show all markers
    if (newMarkers.length > 1 && !selectedTurf) {
      const group = L.featureGroup(newMarkers);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15), { animate: false });
        }
      }, 50);
    } else if (selectedTurf?.latitude && selectedTurf?.longitude) {
      map.setView([selectedTurf.latitude, selectedTurf.longitude], 15);
    } else if (newMarkers.length === 1) {
      map.setView([turfs[0].latitude, turfs[0].longitude], 14);
    }
  }, [mapReady, turfs, selectedTurf]);

  return (
    <div
      ref={mapRef}
      className={`${className} rounded-xl overflow-hidden`}
      style={{ zIndex: 0 }}
    />
  );
}
