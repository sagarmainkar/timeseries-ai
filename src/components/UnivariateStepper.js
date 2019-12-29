import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import DataSelectionStep from "./steps/DataSelectionStep";
import TimeIDStep from "./steps/TimeIDStep";
import DepVarStep from "./steps/DepVariableStep";
import LagsStep from "./steps/LagsStep";
import EpochsStep from "./steps/EpochsStep";
import TimeSeriesData from "../data/TimeSeriesData";
import PlotContainer from "../containers/PlotContainer";
import { split_sequences, train, predict } from "../data/DataUtil";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },

  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

function getSteps() {
  return ["Data", "TimeID", "Forecast Variable", "Lags", "Epochs"];
}

export default function UnivariateStepper() {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [url, setUrl] = React.useState("");
  const [columns, setColumns] = React.useState([]);
  const [timeID, setTimeID] = React.useState("");
  const [depVar, setDepVar] = React.useState("");
  const [lags, setLags] = React.useState(3);
  const [epochs, setEpochs] = React.useState(5);
  const [tsData, setTSData] = React.useState([]);
  const [lossData, setLossData] = React.useState({
    X: [],
    y: [],
    X_label: "Epochs",
    y_label: "Loss"
  });
  const [inTraining, setInTraining] = React.useState(false);

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setUrl("");
    setColumns([]);
    setTimeID("");
    setDepVar("");
    setLags(3);
    setEpochs(5);
    setActiveStep(0);
    setTSData([]);
    setLossData({ X: [], y: [], X_label: "Epochs", y_label: "Loss" });
    setInTraining(false);
  };

  const handleURLChanged = url => {
    const tsdata = new TimeSeriesData();
    tsdata.loadData(url).then(res => {
      const cols = tsdata.getColumns();
      console.log(`Columns Fetched : ${cols}`);
      setUrl(url);
      setColumns(cols);
    });
  };

  const handleTimeIDChanged = timeID => {
    setTimeID(timeID);
  };

  const handleDepVarChanged = depVar => {
    setDepVar(depVar);
  };

  const handleLagsChanged = lags => {
    setLags(parseInt(lags, 10));
  };

  const handleEpochsChanged = epochs => {
    setEpochs(parseInt(epochs, 10));
  };

  const handlePlotTS = () => {
    let tsData = new TimeSeriesData();
    tsData.prepareData(timeID, depVar).then(data => {
      split_sequences(data.y, lags).then(d => {
        const tsdata = [];
        tsdata.push({
          X: data.X,
          y: data.y,
          seq_x: d.seq_x,
          seq_y: d.seq_y,
          X_label: timeID,
          y_label: depVar
        });

        setTSData(tsdata);
      });
    });
  };

  const handleTrain = event => {
    setInTraining(true);
    train(
      lags,
      epochs,
      1,
      timeID,
      depVar,
      tsData[0].seq_x,
      tsData[0].seq_y,
      onEpochEnd
    ).then(model => {
      console.log(`[UnivariateStepper.js] Done Training...`);
      setInTraining(false);
      let timeSeriesData = new TimeSeriesData();
      predict(
        timeSeriesData.getDataFrame(),
        timeID,
        lags,
        1,
        model,
        tsData[0].seq_x
      ).then(predict => {
        console.log(`Predictions: ${predict}`);
        const tsdata = [];
        tsdata.push({ ...tsData }[0]);
        tsdata.push({
          X: tsData[0].X,
          y: predict.predictions,
          X_label: timeID,
          y_label: depVar
        });

        setTSData(tsdata);
      });
    });
  };

  const onEpochEnd = (epoch, logs) => {
    console.log(`Epoch: ${epoch} Loss:${logs.loss}}`);
    let losses = { ...lossData };

    losses.X.push(epoch);
    losses.y.push(logs.loss);

    setLossData(losses);
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <DataSelectionStep clicked={handleURLChanged} url={url} />;
      case 1:
        return (
          <TimeIDStep
            clicked={handleTimeIDChanged}
            columns={columns}
            timeID={timeID}
          />
        );
      case 2:
        return (
          <DepVarStep
            clicked={handleDepVarChanged}
            columns={columns.filter(value => value !== timeID)}
            depVar={depVar}
          />
        );
      case 3:
        return <LagsStep clicked={handleLagsChanged} lags={lags} />;
      case 4:
        return <EpochsStep clicked={handleEpochsChanged} epochs={epochs} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Fab
              variant="extended"
              size="small"
              onClick={handleReset}
              className={classes.button}
            >
              Reset
            </Fab>
            <Divider className={classes.divider} />
            <PlotContainer
              handlePlot={handlePlotTS}
              data={tsData}
              handleTrain={handleTrain}
              lossData={lossData}
              inTraining={inTraining}
            />
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
