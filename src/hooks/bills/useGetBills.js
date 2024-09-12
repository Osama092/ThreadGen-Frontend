import { useState, useEffect } from 'react';
import { MdConveyorBelt } from 'react-icons/md';
import { getBillById } from 'services/billsService';

const useBills = () => {
  const [bills, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = "tempuser0999@gmail.com";

  useEffect(() => {
    if (!user) return;
    console.log('User:', user);

    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await getBillById(user);
        console.log('Data:', data);
        setBill(data);
      } catch (err) {
        console.log('Error:', err);
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