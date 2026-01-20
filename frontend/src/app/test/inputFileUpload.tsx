
import {Typography } from "@mui/material"; 
import {Button} from "@mui/material";
import {SvgIcon} from "@mui/material";
import {styled} from "@mui/material"; 
import { useState } from "react";


import * as React from "react";
import { CircularIndeterminate } from "./utils/circularIdeterminate";
import { HoverRating } from "./utils/hoverRating";




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
        sx={{ width: 200 }} 
        startIcon={
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

      <Button  onClick={runPrediction}
      sx={{ width: 200 }} >
        Run Prediction
      </Button>

      {loading && <CircularIndeterminate />}

      <pre
        style={{
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {result}
      </pre>
        <Typography variant="h4" gutterBottom>
         Please rate the accuracy of the predicition
        </Typography>
        <HoverRating />
         <Button sx={{ width: 400 }} >
        Submit Review
        </Button>

    </div>
  );

}
