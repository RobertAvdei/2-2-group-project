import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000];
const xLabels = [
  'Model A',
  'Model B',
  'Model C',
];

export default function ConfidenceChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <BarChart
        series={[
          { data: uData, label: 'Confidence', id: 'conId' },
        ]}
        xAxis={[{ data: xLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
      />
    </Box>
  );
}