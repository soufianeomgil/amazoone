"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface MapPickerProps {
  onSelect: (data: {
    lat: number;
    lng: number;
    formattedAddress: string;
    city?: string;
    region?: string;
    country?: string;
  }) => void;
}

export default function MapPicker({ onSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!mapRef.current || !inputRef.current) return;

    async function initMap() {
      // ✅ Set global Google Maps options (NEW WAY)
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        libraries: ["places"],
      });

      // ✅ Load required libraries
      const { Map } = await importLibrary("maps");
      const { Autocomplete } = await importLibrary("places");
      const { Marker } = await importLibrary("marker");

      const map = new Map(mapRef.current!, {
        center: { lat: 33.5731, lng: -7.5898 }, // Morocco default
        zoom: 12,
      });

      const marker = new Marker({ map });

      const autocomplete = new Autocomplete(inputRef.current!, {
        fields: ["address_components", "geometry", "formatted_address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        map.setCenter({ lat, lng });
        marker.setPosition({ lat, lng });

        const components = place.address_components || [];
        const get = (type: string) =>
          components.find((c) => c.types.includes(type))?.long_name;

        onSelect({
          lat,
          lng,
          formattedAddress: place.formatted_address!,
          city: get("locality"),
          region: get("administrative_area_level_1"),
          country: get("country"),
        });
      });
    }

    initMap();
  }, [onSelect]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        placeholder="Search for your address"
        className="w-full border rounded px-3 py-2"
      />
      <div
        ref={mapRef}
        className="w-full h-[350px] rounded border"
      />
    </div>
  );
}
