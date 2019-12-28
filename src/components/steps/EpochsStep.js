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

const EpochsStep = props => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="selectEpochs"
          type="number"
          min={1}
          step={1}
          max={20}
          label="Select Epochs"
          value={props.epochs}
          onChange={e => props.clicked(e.target.value)}
        />
      </div>
    </form>
  );
};

export default EpochsStep;
