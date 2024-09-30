"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MPK() {
  const [parsedData, setParsedData] = useState<MPKResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mpk");
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

export default MPK;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface MPKResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
