import { Grid } from "@mui/material";
import TopBar from "../shared/topBar/topBar";
import { GridBox } from "../shared/GridBox";
import Label from "./label";
import RequestsChart from "./requestsChart";
import ConfidenceChart from "./confidenceChart";
import FeedbackChart from "./feedbackChart";
import { NumberDisplay } from "../shared/NumberDisplay";

export default function Dashboard() {
  return (
    <Grid className="p-4" container spacing={2}>
      <Grid size={12}>
        <TopBar />
      </Grid>
      <Grid size={1}></Grid>
      <Grid container size={10}>
        <GridBox size={12}>
          <Label />
        </GridBox>
        <GridBox size={8}>
          <RequestsChart />
        </GridBox>
        <GridBox size={4}>
          <FeedbackChart />
        </GridBox>
        <GridBox size={5}>
          <NumberDisplay  {...{ title: "Number retrains", content: `Times`, number: 10 }}/>
        </GridBox>
        <GridBox size={7}>
          <ConfidenceChart />
        </GridBox>
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
}
