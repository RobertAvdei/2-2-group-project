'use client'

import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const data = [
  { value: 20, label: 'Positive' },
  { value: 5, label: 'Negative' },
];

const size = {
  width: 300,
  height: 300,
};

export default function FeedbackChart() {
  return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      
    </PieChart>
  );
}