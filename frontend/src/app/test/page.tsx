import { Grid, Typography } from "@mui/material";



export default function Test() {

    
  return (
    <Grid className="p-4" container spacing={2}>
      <Grid size={12} >
        <Typography variant="h3" gutterBottom>
          ML Model Serving System
        </Typography>
      </Grid>
      <Grid size={8}>1</Grid>
      <Grid size={4}>2</Grid>
      <Grid size={4}>3</Grid>
      <Grid size={8}>4</Grid>
    </Grid>
  );
}
