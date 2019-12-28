import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 300
    }
  }
}));

const urls = [
  {
    name: "Apple Stock",
    value:
      "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv"
  },
  {
    name: "Air Passengers",
    value:
      "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
  },
  {
    name: "Sunspots",
    value:
      "https://raw.githubusercontent.com/jbrownlee/Datasets/master/monthly-sunspots.csv"
  },
  {
    name: "Female Births",
    value:
      "https://raw.githubusercontent.com/jbrownlee/Datasets/master/daily-total-female-births.csv"
  }
];
const DataSelectionStep = props => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="selectedURL"
          select
          label="Select the Data"
          value={props.url}
          onChange={e => props.clicked(e.target.value)}
        >
          {urls.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
};

export default DataSelectionStep;
