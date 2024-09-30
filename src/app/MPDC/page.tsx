"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MPDC() {
  const [parsedData, setParsedData] = useState<MPDCResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mpdc");
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

export default MPDC;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface MPDCResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
