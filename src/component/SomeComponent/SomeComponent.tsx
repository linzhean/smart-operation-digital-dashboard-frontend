// src/component/SomeComponent/SomeComponent.tsx
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

const SomeComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('http://140.131.115.153:8080/some-api-endpoint');
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Some Component</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default SomeComponent;
