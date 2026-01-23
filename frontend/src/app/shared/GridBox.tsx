import { Box, Grid } from "@mui/material";

export interface GridBoxProps {
  children: React.ReactNode;
  size?: number;
}

export const GridBox = ({ children, size = 4, ...props }: GridBoxProps) => {
  return (
    <Grid alignItems={"center"} justifyItems={"center"} size={size}>
      <Box
        width={"100%"}
        className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 "
        alignItems={"center"} justifyItems={"center"}
      >
        {children}
      </Box>
    </Grid>
  );
};
