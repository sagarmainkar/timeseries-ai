import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import LossPlot from "../components/plots/LossPlot";
import TSPlot from "../components/plots/TimeSeriesPlot";
import { split_sequences, train, predict } from "../data/DataUtil";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2)
  },
  details: {
    alignItems: "center"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  column: {
    flexBasis: "33.33%"
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  }
}));

const TrainContainer = props => {
  const classes = useStyles();
  const [lags, setLags] = React.useState(6);
  const [epochs, setEpochs] = React.useState(5);
  const [trained, setTrained] = React.useState(false);
  const [predicted, setPredicted] = React.useState(false);
  const [model, setModel] = React.useState(null);
  const [splitSeqX, setSplitSeqX] = React.useState([]);
  const [splitSeqY, setSplitSeqY] = React.useState([]);

  const [lossData, setLossData] = React.useState({
    X: [],
    y: [],
    X_label: "Epochs",
    y_label: "Loss"
  });

  const [predictions, setPredictions] = React.useState([]);

  const resetLossData = () => {
    setLossData({
      X: [],
      y: [],
      X_label: "Epochs",
      y_label: "Loss"
    });
    setTrained(false);
  };
  const handleLagsChanged = lags => {
    resetLossData();
    setLags(parseInt(lags, 10));
  };

  const handleEpochsChanged = epochs => {
    resetLossData();
    setEpochs(parseInt(epochs, 10));
  };

  const onEpochEnd = (epoch, logs) => {
    console.log(`Epoch: ${epoch} Loss:${logs.loss}}`);
    let losses = { ...lossData };

    losses.X.push(epoch);
    losses.y.push(logs.loss);

    setLossData(losses);
  };

  const handleTrain = event => {
    const tsdata = props.tsdata;
    const timeID = props.timeID;
    const depVar = props.depVar;

    split_sequences(tsdata.y, lags).then(d => {
      const split_seq_X = d.seq_x;
      const split_seq_y = d.seq_y;

      train(
        lags,
        epochs,
        1,
        timeID,
        depVar,
        split_seq_X,
        split_seq_y,
        onEpochEnd
      ).then(model => {
        console.log(`[UnivariateStepper.js] Done Training...`);
        setSplitSeqX(split_seq_X);
        setSplitSeqY(split_seq_y);
        setTrained(true);
        setModel(model);
      });
    });
  };

  const handlePredict = event => {
    const timeID = props.timeID;
    const depVar = props.depVar;

    predict(timeID, lags, 1, model, splitSeqX).then(predict => {
      console.log(`Predictions: ${predict}`);
      const tsdata = [];
      tsdata.push(props.tsdata);
      tsdata.push({
        X: props.tsdata.X,
        y: predict.predictions,
        X_label: timeID,
        y_label: depVar
      });
      setPredictions(tsdata);
      setPredicted(true);
    });
  };
  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={!predicted}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>Train Model</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              Enter settings to train the model
            </Typography>
          </div>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.details}>
          <Grid container>
            <Grid item lg={4} md={4} xs={12}>
              <TextField
                id="selectLags"
                type="number"
                min={1}
                step={1}
                max={10}
                label="Select Lags"
                value={lags}
                onChange={e => handleLagsChanged(e.target.value)}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              <TextField
                id="selectEpochs"
                type="number"
                min={1}
                step={1}
                max={20}
                label="Select Epochs"
                value={epochs}
                onChange={e => handleEpochsChanged(e.target.value)}
              />
            </Grid>
            {lossData.X.length > 0 ? (
              <Grid item lg={12} md={12} xs={12}>
                <LossPlot data={lossData} />
              </Grid>
            ) : null}

          </Grid>
        </ExpansionPanelDetails>
        {!predicted ?
          (<ExpansionPanelActions>
            {!trained ? (
              <Fab
                variant="extended"
                size="small"
                color="primary"
                className={classes.button}
                onClick={handleTrain}
              >
                Train
            </Fab>
            ) : null}
            {trained ? (
              <Fab
                variant="extended"
                size="small"
                color="primary"
                className={classes.button}
                onClick={handlePredict}
              >
                Predict
            </Fab>
            ) : null}
          </ExpansionPanelActions>) : null}
      </ExpansionPanel>
      {predicted ? (
        <ExpansionPanel expanded={predicted}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <div className={classes.column}>
              <Typography className={classes.heading}>Forecasts</Typography>
            </div>
            <div className={classes.column}>
              <Typography className={classes.secondaryHeading}>
                Plot of Actual and Forecasts
            </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Grid container>
              {predictions.length > 0 ? (
                <Grid item lg={12} md={12} xs={12}>
                  <TSPlot datasets={predictions} />
                </Grid>
              ) : null}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ) : null}
    </div>
  );
};

export default TrainContainer;
