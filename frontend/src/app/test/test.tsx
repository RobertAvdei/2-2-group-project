import { Grid } from "@mui/material";





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