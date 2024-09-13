import { useState, useEffect } from 'react';
import billService from 'services/billsService';

const useBills = (user) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await billService.getBills(user);
        setBills(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user]);

  return { bills, loading, error };
};

export default useBills;