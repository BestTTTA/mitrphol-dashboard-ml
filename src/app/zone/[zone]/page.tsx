"use client";
import { useState, useEffect, useRef } from "react";
import Map from "@/components/Map";
import { usePathname } from "next/navigation";

function Zone() {
  const [parsedData, setParsedData] = useState<ZoneResponse | null>(null);
  const [countRed, setCountRed] = useState<number>(0);
  const [countYellow, setCountYellow] = useState<number>(0);
  const [countGreen, setCountGreen] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const dataFetchedRef = useRef(false);
  const pathname = usePathname();
  const zone = pathname.split("/").pop();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/zone?zone=${zone}`);
        const data = await response.json();
        setParsedData(data);

        // Categorize predictions by color
        const redCount = data.predictions.filter(
          (item: Prediction) => item.prediction < 10
        ).length;

        const yellowCount = data.predictions.filter(
          (item: Prediction) => item.prediction >= 10 && item.prediction < 12
        ).length;

        const greenCount = data.predictions.filter(
          (item: Prediction) => item.prediction > 12
        ).length;

        setCountRed(redCount);
        setCountYellow(yellowCount);
        setCountGreen(greenCount);
        setTotalCount(data.predictions.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    }

    if (!dataFetchedRef.current && zone) {
      loadData();
      dataFetchedRef.current = true;
    }
  }, [zone]);

  const percentageRed =
    totalCount > 0 ? ((countRed / totalCount) * 100).toFixed(2) : "0";
  const percentageYellow =
    totalCount > 0 ? ((countYellow / totalCount) * 100).toFixed(2) : "0";
  const percentageGreen =
    totalCount > 0 ? ((countGreen / totalCount) * 100).toFixed(2) : "0";

  return (
    <main className="w-full">
      {parsedData ? (
        <div className="flex">
          <Map
            data={parsedData.predictions.map((item) => ({
              ...item,
              color:
                item.prediction < 10
                  ? "red"
                  : item.prediction >= 10 && item.prediction < 12
                  ? "yellow"
                  : "green",
            }))}
          />

          <div className="mt-8 p-2 flex flex-col items-center w-60">
            <div className="w-full flex flex-col justify-center items-center p-2">
              <p className="text-sky-400 font-bold text-sm">High Prediction</p>
              <p className="text-xl text-green-600 font-bold">
                {percentageGreen}%
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {countGreen} Plantation
              </p>
            </div>
            <div className="bg-gray-700 h-[1px] w-[70%]"></div>
            <div className="w-full flex flex-col justify-center items-center p-2">
              <p className="text-sky-400 font-bold text-sm">Medium Prediction (10-12)</p>
              <p className="text-xl text-yellow-500 font-bold">
                {percentageYellow}%
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {countYellow} Plantation
              </p>
            </div>
            <div className="bg-gray-700 h-[1px] w-[70%]"></div>
            <div className="w-full flex flex-col justify-center items-center p-2">
              <p className="text-sky-400 font-bold text-sm">Low Prediction</p>
              <p className="text-xl text-red-600 font-bold">
                {percentageRed}%
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {countRed} Plantation
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-4">
          <div className="flex-col w-full h-full bg-sky-300 animate-pulse rounded-md flex justify-center items-center">
            <p className="font-extrabold text-4xl text-sky-600">กำลังเตรียมพร้อมข้อมูล...</p>
            <p className="text-sm text-gray-600">*หมายเหตุ การเตรียมพร้อมข้อมูลอาจใช้เวลามากกว่า 1 นาที</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Zone;

export interface Prediction {
  lat: number;
  lon: number;
  prediction_lower_bound: number;
  prediction: number;
  prediction_upper_bound: number;
  NDVI: number;
  NDWI: number;
  GLI: number;
  Precipitation: number;
  PlantID: string;
}

export interface ZoneResponse {
  zone: string;
  prediction_date: string;
  predictions: Prediction[];
}
