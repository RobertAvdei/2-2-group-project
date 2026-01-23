import { Divider, List, ListItem, ListItemText } from "@mui/material";


const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  //backgroundColor: 'background.paper',
};


export default function ModelInfo() {
  return (
    <List sx={style} aria-label="Model information">
      <ListItem>
        <ListItemText primary="Model type: Easy OCR" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Version: v1.0" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Training data: Generated Data" />
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText primary="Evaluation metric: Accuracy " />
      </ListItem>
    </List>
  );
}