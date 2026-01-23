'use client'

import { Typography } from "@mui/material";
import NumberFlow, { continuous } from "@number-flow/react";

interface NumberDisplayProps {
    title: string;
    content: string;
    number: number;
  }
  
export const NumberDisplay = ({ title, content, number, ...props }: NumberDisplayProps) => {
    return (
      <>
        <p className="text-center">{title}</p>
        <Typography variant="h2" className="text-center">
          <NumberFlow
            value={number}
            suffix={` ${content}`}
            plugins={[continuous]}
          />
        </Typography>
      </>
    );
  };