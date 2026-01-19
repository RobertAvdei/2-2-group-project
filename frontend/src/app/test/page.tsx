'use client'

import { Grid, Typography } from "@mui/material"; 
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import {Box} from "@mui/material";
import {Stack} from "@mui/material";
import {Button} from "@mui/material";
import {SvgIcon} from "@mui/material";
import {styled} from "@mui/material"; 
import { useState } from "react";
import {Radio} from "@mui/material"; 
import {RadioGroup} from "@mui/material"; 
import {Rating} from "@mui/material";
import {CircularProgress } from "@mui/material";
import {List} from "@mui/material";
import {ListItem} from "@mui/material";
import {ListItemText} from "@mui/material";
import {Divider} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import * as React from "react";



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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

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

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export function InputFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("No results yet.");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

const runPrediction = async () => {
  if (!file) {
    setResult("Please upload a file first.");
    return;
  }

  setLoading(true); //  start spinner

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
  } catch (error) {
    setResult("Error running prediction.");
  } finally {
    setLoading(false); 
  }
};


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Button
        component="label"
        variant="outlined"
        startDecorator={
          <SvgIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          </SvgIcon>
        }
      >
        {file ? file.name : "Upload a file"}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>

      <Button onClick={runPrediction}>
        Run Prediction
      </Button>

      {loading && <CircularIndeterminate />}

      <pre
        style={{
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "6px",
        }}
      >
        {result}
      </pre>
        <Typography variant="h4" gutterBottom>
         Please rate the accuracy of the predicition
        </Typography>
        <HoverRating />
         <Button >
        Submit Review
        </Button>

    </div>
  );

}

export function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

export function Test() {

    
  return (
    <Grid className="p-4" container spacing={2}>
      <Grid size={12} >
      </Grid>
      <Grid size={8}>1</Grid>
      <Grid size={4}>2</Grid>
      <Grid size={4}>3</Grid>
      <Grid size={8}>4</Grid>
      <Grid size={8}>4</Grid>
    </Grid>
  );
}

const labels: { [index: string]: string } = {

  1: 'Useless',

  2: 'Poor',

  3: 'Ok',

  4: 'Good',

  5: 'Excellent',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export  function HoverRating() {
  const [value, setValue] = React.useState<number | null>(2);
  const [hover, setHover] = React.useState(-1);

  return (
    <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
  );
}
const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

export function ListDividers() {
  return (
    <List sx={style} aria-label="Model information">
      <ListItem>
        <ListItemText primary="Model type: Example ML Classifier" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Version: v1.0" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Training data: Historical dataset" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Evaluation metric: Accuracy / F1-score" />
      </ListItem>
    </List>
  );
}