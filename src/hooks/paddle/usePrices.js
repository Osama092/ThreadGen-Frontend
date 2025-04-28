import { useState, useEffect } from 'react';
import { fetchPrices } from 'services/paddle/pricesService';

export const usePrices = () => {
  const [prices, setPrices] = useState([]);
  const [priceLoading, setLoading] = useState(true);
  const [priceError, setError] = useState(null);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const data = await fetchPrices();
        setPrices(data);
      } catch (err) {
        setError('Error fetching prices');
      } finally {
        setLoading(false);
      }
    };

    getPrices();
  }, []);

  return { prices, priceLoading, priceError };
};

export default usePrices;
