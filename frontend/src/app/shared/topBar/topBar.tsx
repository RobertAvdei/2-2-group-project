import { Box, Typography } from "@mui/material";
import NavTabs from "./tabs";

export default function TopBar() {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        ML Model Serving System
      </Typography>
      <NavTabs />
    </Box>
  );
}
