"use client";

import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

declare global {
  interface Window {
    google: any;
  }
}

function Map({ data }: { data: Prediction[] }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded || loadError || !data || data.length === 0) {
      console.error('Data is missing or not loaded properly.');
      return;
    }
  
    const initializeMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 15.87, lng: 100.9925 },
          zoom: 8,
          mapTypeId: "satellite",
        });
  
        data.forEach((item) => {
          const { lat, lon, prediction, NDVI, NDWI, GLI, Precipitation, PlantID } = item;
          const color = prediction === 0 ? "red" : "green";
  
          const marker = new window.google.maps.Marker({
            position: { lat, lng: lon },
            map,
            title: `Lat: ${lat}, Lon: ${lon}`,
            icon:
              color === "green"
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          });
  
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <p style="padding: 10px; border-radius: 5px; font-weight: bold;">Lat: ${lat} | Lon: ${lon}</p>
                <p>NDVI: ${NDVI}</p>
                <p>NDWI: ${NDWI}</p>
                <p>GLI: ${GLI}</p>
                <p>Precipitation: ${Precipitation}</p>
                <p>PlantID: ${PlantID}</p>
                <p>Prediction: ${prediction}</p>
              </div>
            `,
          });
  
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }
    };
  
    initializeMap();
  }, [isLoaded, loadError, data]);
  

  if (!isLoaded) return;
  <div className="w-full h-full p-4">
    <div className="w-full h-full bg-sky-300 animate-pulse rounded-md flex justify-center items-center">
      <p className="font-extrabold text-4xl text-sky-600">
        กำลังเตรียมพร้อมข้อมูล...
      </p>
    </div>
  </div>;
  
  if (loadError)
    return <div>Error loading Google Maps: {loadError.message}</div>;

  return (
    <div className="flex w-full h-full">
      <div className="w-full">
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
      </div>
    </div>
  );
}

export default Map;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
  NDVI: number;
  NDWI: number;
  GLI: number;
  Precipitation: number;
  PlantID: string;
}
