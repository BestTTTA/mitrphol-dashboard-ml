"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MPV() {
  const [parsedData, setParsedData] = useState<MPVResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mpv");
      const data = await response.json();
      setParsedData(data);
    }
    loadData();
  }, []);

  return (
    <main className="w-full">
      {parsedData ? (
        <Map
          data={parsedData.predictions} 
        />
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

export default MPV;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface MPVResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
