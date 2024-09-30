"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MPL() {
  const [parsedData, setParsedData] = useState<MPLResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mpl");
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

export default MPL;

export interface Prediction {
  lat: number;
  lon: number;
  prediction: number;
}

export interface MPLResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
