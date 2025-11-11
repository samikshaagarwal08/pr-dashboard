"use client";

import { useEffect, useState } from "react";
// @ts-ignore
import Papa from "papaparse";

interface MakeRun {
  statusLabel: string;
  duration: number;
  credits: number;
  timestamp: string;
}

export const useMakeData = () => {
  const [data, setData] = useState<MakeRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const res = await fetch("/data/make_runs.csv"); // place your csv in /public/data
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true });
        setData(parsed.data as MakeRun[]);
      } catch (err) {
        console.error("Error loading Make.com data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCSV();
  }, []);

  return { data, loading };
};
