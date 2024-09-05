import { useState } from 'react';

const useVisibility = () => {
  const [visibility, setVisibility] = useState({});

  const toggleVisibility = (id) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [id]: !prevVisibility[id],
    }));
  };

  return { visibility, toggleVisibility };
};

export default useVisibility;