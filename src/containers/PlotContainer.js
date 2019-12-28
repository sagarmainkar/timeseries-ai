import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import TSPlot from "../components/plots/TimeSeriesPlot";
import LossPlot from "../components/plots/LossPlot";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2)
  },

  button: {
    marginRight: theme.spacing(1)
  }
}));

const PlotContainer = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            className={classes.button}
            onClick={props.handlePlot}
          >
            Plot
          </Fab>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            className={classes.button}
            onClick={props.handleTrain}
          >
            Train
          </Fab>
        </Grid>

        {props.data.length > 0 ? (
          <Grid item lg={6} md={6} xs={12}>
            <TSPlot datasets={props.data} />
          </Grid>
        ) : null}

        {props.lossData.X.length > 0 ? (
          <Grid item lg={6} md={6} xs={12}>
            <LossPlot data={props.lossData} />
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

export default PlotContainer;
