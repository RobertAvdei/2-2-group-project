import { Grid, Typography } from "@mui/material";
import NavTabs from "./tabs";

export default function TopBar() {
  return (
    <Grid container spacing={2}>
      <Grid size={1}></Grid>
      <Grid size={10}>
        <Typography variant="h3" gutterBottom>
          ML Model Serving System
        </Typography>
        <NavTabs />
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
}
