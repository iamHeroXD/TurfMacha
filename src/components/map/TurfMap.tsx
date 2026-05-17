"use client";

import { useEffect, useRef } from "react";
import { Turf } from "@/types";
import { formatPrice } from "@/lib/utils";

interface TurfMapProps {
  turfs?: Turf[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  selectedTurf?: Turf | null;
}

// Inline SVG data URIs — no CDN dependency
const USER_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2.5"/>
  <circle cx="10" cy="10" r="3.5" fill="white"/>
</svg>`;

const TURF_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
  <path d="M16 0 C7.16 0 0 7.16 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7.16 24.84 0 16 0Z" fill="#10b981"/>
  <circle cx="16" cy="16" r="7" fill="white"/>
  <path d="M13 16 L15.5 18.5 L20 13" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let L: typeof import("leaflet");
    let map: import("leaflet").Map;

    const initMap = async () => {
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Disable default icon URL resolution (prevents broken icon paths)
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

      // User location marker (inline SVG — no CDN)
      const userIcon = L.icon({
        iconUrl: svgToDataUri(USER_ICON_SVG),
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -14],
      });

      L.marker(center, { icon: userIcon })
        .addTo(map)
        .bindPopup("<strong style='color:#10b981'>You are here</strong>");

      // Turf markers
      const turfIcon = L.icon({
        iconUrl: svgToDataUri(TURF_ICON_SVG),
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
      });

      const markers: import("leaflet").Marker[] = [];

      turfs.forEach((turf) => {
        if (!turf.latitude || !turf.longitude) return;

        const popup = L.popup({ maxWidth: 220 }).setContent(`
          <div style="font-family:system-ui;padding:4px;min-width:160px">
            <h3 style="font-weight:700;font-size:13px;color:white;margin:0 0 3px 0;line-height:1.3">${turf.name}</h3>
            <p style="font-size:11px;color:rgba(255,255,255,0.55);margin:0 0 8px 0;line-height:1.4">${turf.city}</p>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:11px;color:rgba(255,255,255,0.5)">⭐ ${turf.rating?.toFixed(1) || "New"}</span>
              <span style="font-size:13px;font-weight:700;color:#10b981">${formatPrice(turf.price_per_hour)}/hr</span>
            </div>
          </div>
        `);

        const marker = L.marker([turf.latitude, turf.longitude], { icon: turfIcon })
          .addTo(map)
          .bindPopup(popup);

        markers.push(marker);
      });

      // Fit bounds to show all markers when multiple turfs are shown
      if (markers.length > 1 && !selectedTurf) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.15));
      } else if (selectedTurf?.latitude && selectedTurf?.longitude) {
        map.setView([selectedTurf.latitude, selectedTurf.longitude], 15);
      }
    };

    initMap().catch(console.error);

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapRef}
      className={`${className} rounded-xl overflow-hidden`}
      style={{ zIndex: 0 }}
    />
  );
}
