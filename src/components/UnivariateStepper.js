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
import TrainContainer from "../containers/TrainContainer";

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
  return ["Data", "TimeID", "Forecast Variable"];
}

export default function UnivariateStepper() {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [url, setUrl] = React.useState("");
  const [columns, setColumns] = React.useState([]);
  const [timeID, setTimeID] = React.useState("");
  const [depVar, setDepVar] = React.useState("");
  const [tsData, setTSData] = React.useState([]);

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => {
      //hnadleFinish
      if (prevActiveStep === steps.length - 1) {
        let tsData = new TimeSeriesData();
        tsData.prepareData(timeID, depVar).then(data => {
          const tsdata = [];
          tsdata.push({
            X: data.X,
            y: data.y,
            X_label: timeID,
            y_label: depVar
          });

          setTSData(tsdata);
        });
      }
      return prevActiveStep + 1;
    });
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setUrl("");
    setColumns([]);
    setTimeID("");
    setDepVar("");
    setActiveStep(0);
    setTSData([]);
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
            <PlotContainer data={tsData} />
            <TrainContainer
              tsdata={tsData[0]}
              timeID={timeID}
              depVar={depVar}
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
