"use client"

import { Typography } from "@mui/material"; 
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import {Box} from "@mui/material";
import { useState } from "react";

import * as React from "react";
import { Test } from "./test";
import { InputFileUpload } from "./inputFileUpload";
import { ListDividers } from "./ListDividers";

export default function BasicTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom>
          ML Model Serving System
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
    label="Dashboard"
    {...a11yProps(0)}
    sx={{
      textTransform: 'none',
      color: 'primary.main',

      '&:hover': {
        color: 'primary.light',
        backgroundColor: 'rgba(25, 118, 210, 0.08)', // subtle blue hover
      },

      '&.Mui-selected': {
        color: 'primary.main',
        fontWeight: 600,
      },
    }}
  />
          <Tab
    label="Prediction"
    {...a11yProps(1)}
    sx={{
      textTransform: 'none',
      color: 'primary.main',

      '&:hover': {
        color: 'primary.light',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      },

      '&.Mui-selected': {
        color: 'primary.main',
        fontWeight: 600,
      },
    }}
  />
          <Tab
    label="Model info"
    {...a11yProps(2)}
    sx={{
      textTransform: 'none',
      color: 'primary.main',

      '&:hover': {
        color: 'primary.light',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      },

      '&.Mui-selected': {
        color: 'primary.main',
        fontWeight: 600,
      },
    }}
  />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {Test()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {InputFileUpload()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {ListDividers()}
      </CustomTabPanel>
    </Box>
  );
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}