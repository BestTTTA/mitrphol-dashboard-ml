"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function SB() {
  const [parsedData, setParsedData] = useState<SBResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/sb");
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

export default SB;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface SBResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
