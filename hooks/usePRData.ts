// src/hooks/usePRData.ts
import axios from "axios";
import { useEffect, useState } from "react";

export const usePRData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://opensheet.elk.sh/1syC7HgH2Xz_G10GgLoMrq0d7xx86SJZZ1tTk8pwYeH8/Sheet1")
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
