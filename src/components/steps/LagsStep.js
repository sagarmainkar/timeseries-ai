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

const LagsStep = props => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="selectLags"
          type="number"
          min={1}
          step={1}
          max={10}
          label="Select Lags"
          value={props.lags}
          onChange={e => props.clicked(e.target.value)}
        />
      </div>
    </form>
  );
};

export default LagsStep;
