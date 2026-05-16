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

      // Fix default markers
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // User location marker
      const userIcon = L.divIcon({
        html: `<div style="
          width: 16px; height: 16px;
          background: #00d4aa;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(0,212,170,0.3);
        "></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker(center, { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>Your Location</b>");

      // Turf markers
      turfs.forEach((turf) => {
        if (!turf.latitude || !turf.longitude) return;

        const turfIcon = L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #00d4aa, #00b894);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 28px; height: 28px;
            box-shadow: 0 4px 15px rgba(0,212,170,0.4);
            display: flex; align-items: center; justify-content: center;
          "><div style="transform:rotate(45deg); font-size:12px;">📍</div></div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });

        const popup = L.popup({
          maxWidth: 220,
          className: "turf-popup",
        }).setContent(`
          <div style="font-family: system-ui; padding: 4px;">
            <h3 style="font-weight: 700; font-size: 14px; color: white; margin: 0 0 4px 0;">${turf.name}</h3>
            <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 0 0 8px 0;">${turf.address}</p>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: rgba(255,255,255,0.5);">⭐ ${turf.rating?.toFixed(1) || "New"}</span>
              <span style="font-size: 13px; font-weight: 700; color: #00d4aa;">${formatPrice(turf.price_per_hour)}/hr</span>
            </div>
          </div>
        `);

        L.marker([turf.latitude, turf.longitude], { icon: turfIcon })
          .addTo(map)
          .bindPopup(popup);
      });

      // If single turf, add its marker
      if (selectedTurf) {
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
  }, []);

  return (
    <div
      ref={mapRef}
      className={`${className} rounded-2xl overflow-hidden`}
      style={{ zIndex: 0 }}
    />
  );
}
