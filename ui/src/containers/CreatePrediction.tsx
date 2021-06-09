import { Dialog, makeStyles, Step, StepLabel, Stepper } from '@material-ui/core';
import React, { FC } from 'react';
import CreatePredictionSteps from '../components/CreatePredictionSteps';
import theme from '../shared/theme';

interface CreatePredictionProps {
  open: boolean;
  handleClose: () => void;
  handleCreate: () => void;
}

const useStyles = makeStyles({
  rootPaper: {
    minWidth: '500px',
  },
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

function getSteps() {
  return ['Выбор данных', 'Параметры прогноза'];
}

const CreatePrediction: FC<CreatePredictionProps> = ({ open, handleClose, handleCreate }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      classes={{ paper: classes.rootPaper }}
      onClose={handleClose}
      aria-labelledby='simple-dialog-title'
      open={open}
    >
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          <CreatePredictionSteps
            step={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleClose}
            onFinish={handleCreate}
          ></CreatePredictionSteps>
        </div>
      </div>
    </Dialog>
  );
};

export default CreatePrediction;
