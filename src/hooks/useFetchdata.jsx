import { useEffect, useState } from "react";
import { token } from "../config.js";
import axios from "axios";

const useFetchdata = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message + " 🥲");
        } else {
          setError("An unexpected error occurred");
        }
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchdata;
