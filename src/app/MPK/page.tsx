"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map";

function MPK() {
  const [parsedData, setParsedData] = useState<MPKResponse | null>(null);
  const [countEqualZero, setCountEqualZero] = useState<number>(0);
  const [countEqualOne, setCountEqualOne] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/api/mpk");
      const data = await response.json();
      setParsedData(data);

      const zeroCount = data.predictions.filter(
        (item: Prediction) => item.prediction === 0
      ).length;

      const oneCount = data.predictions.filter(
        (item: Prediction) => item.prediction === 1
      ).length;

      setCountEqualZero(zeroCount);
      setCountEqualOne(oneCount);
      setTotalCount(data.predictions.length);
    }
    loadData();
  }, []);

  const percentageZero =
    totalCount > 0 ? ((countEqualZero / totalCount) * 100).toFixed(2) : "0";
  const percentageOne =
    totalCount > 0 ? ((countEqualOne / totalCount) * 100).toFixed(2) : "0";

  // const raiPerPrediction = 1;
  // const areaZeroRai = countEqualZero * raiPerPrediction;
  // const areaOneRai = countEqualOne * raiPerPrediction;

  return (
    <main className="w-full">
      {parsedData ? (
        <div className="flex">
          <Map data={parsedData.predictions} />

          <div className="mt-4 p-2 flex flex-col items-center w-60">
            <div className="w-full flex flex-col justify-center items-center p-2">
              <p className="text-sky-400 font-bold">Greater than standard</p>
              <p className="text-xl text-green-600 font-bold">
                {percentageOne}%
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {countEqualOne} Plantation
              </p>
            </div>
            <div className="bg-gray-700 h-[1px] w-[70%]"></div>
            <div className="w-full flex flex-col justify-center items-center p-2">
              <p className="text-sky-400 font-bold">Less than standard</p>
              <p className="text-xl text-red-600 font-bold">
                {percentageZero}%
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {countEqualZero} Plantation
              </p>
            </div>
            {/* <p>
              Predictions equal to 0: {countEqualZero} ({percentageZero}%) - {areaZeroRai} ไร่
            </p>
            <p>
              Predictions equal to 1: {countEqualOne} ({percentageOne}%) - {areaOneRai} ไร่
            </p> */}
          </div>
        </div>
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
