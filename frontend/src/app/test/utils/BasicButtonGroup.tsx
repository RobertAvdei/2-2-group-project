'use client'

import {Box} from "@mui/material";
import {Button} from "@mui/material";
import {ButtonGroup} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';




import * as React from "react";

export default function BasicButtonGroup() {
  return (
    <ButtonGroup variant="outlined" aria-label="Basic button group">
      <Button startIcon={<ThumbUpIcon />}> </Button>
      <Button startIcon={<ThumbDownIcon />}> </Button>
      
    </ButtonGroup>
  );
}

