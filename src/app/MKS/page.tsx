"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MAC() {
  const [parsedData, setParsedData] = useState<MACResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mks");
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

export default MAC;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface MACResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
