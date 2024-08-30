import React from 'react';

interface KPIDetailsProps {
  selectedKPI: string;
}

const KPIDetails: React.FC<KPIDetailsProps> = ({ selectedKPI }) => {
  const kpiDetailsMap: { [key: string]: string } = {
    '廢品率': '廢品率詳細資料：...',
    '生產線效率': '生產線效率詳細資料：...',
    '訂單完成率': '訂單完成率詳細資料：...',
    '生產利用率': '生產利用率詳細資料：...',
    '停工時間': '停工時間詳細資料：...',
    '維護成本': '維護成本詳細資料：...',
  };

  return (
    <div>
      <h2>{selectedKPI}</h2>
      {/* <p>{kpiDetailsMap[selectedKPI]}</p> */}
    </div>
  );
};

export default KPIDetails;
