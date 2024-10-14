
interface BarData {
  label: string;
  value: number;
}

interface DoughnutData {
  label: string;
  value: number;
}

interface LineData {
  label: string;
  revenue: number;
  cost: number;
}

export const barChartConfig = (data: BarData[]) => ({
  labels: data.map((d) => d.label),
  datasets: [
    {
      label: "Count",
      data: data.map((d) => d.value),
      backgroundColor: [
        "rgba(43, 63, 229, 0.8)",
        "rgba(250, 192, 19, 0.8)",
        "rgba(253, 135, 135, 0.8)",
      ],
      borderRadius: 5,
      barThickness: 10,
    },
  ],
});

export const doughnutChartConfig = (data: DoughnutData[]) => ({
  labels: data.map((d) => d.label),
  datasets: [
    {
      label: "Count",
      data: data.map((d) => d.value),
      backgroundColor: [
        "rgba(43, 63, 229, 0.8)",
        "rgba(250, 192, 19, 0.8)",
        "rgba(253, 135, 135, 0.8)",
      ],
      borderColor: [
        "rgba(43, 63, 229, 0.8)",
        "rgba(250, 192, 19, 0.8)",
        "rgba(253, 135, 135, 0.8)",
      ],
    },
  ],
});

export const lineChartConfig = (data: LineData[]) => ({
  labels: data.map((d) => d.label),
  datasets: [
    {
      label: "Revenue",
      data: data.map((d) => d.revenue),
      backgroundColor: "#064FF0",
      borderColor: "#064FF0",
      pointRadius: 5,
    },
    {
      label: "Cost",
      data: data.map((d) => d.cost),
      backgroundColor: "#FF3030",
      borderColor: "#FF3030",
    },
  ],
});