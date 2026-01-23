"use client";
import { LineChart } from "@mui/x-charts";

export default function RequestsChart() {
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];
  return (
    <LineChart
      className="text-gray-700 dark:text-gray-200"
      key={'Line Chart'}
      height={275}
      width={675}
      series={[{ data: pData, label: "Requests", yAxisId: "leftAxisId" }]}
      xAxis={[{ scaleType: "point", data: xLabels, height: 28 }]}
      yAxis={[{ id: "leftAxisId", width: 50 }]}
    />
  );
}
