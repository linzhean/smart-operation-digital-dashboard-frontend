import React, { useEffect, useState } from 'react';

interface ChartComponentProps {
  apiEndpoint: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ apiEndpoint }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data from ${apiEndpoint}`);  // 打印 API 端点
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setHtmlContent(text);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const parsedHtml = <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;

  return (
    <div className="chart">
      {parsedHtml}
    </div>
  );
};

export default ChartComponent;
