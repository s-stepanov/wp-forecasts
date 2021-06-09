import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@material-ui/core';
import React, { FC, useContext, useState } from 'react';
import { ChangeEvent } from 'react';
import { CreatePredictionContext } from '../contexts/CreatePredictionContext';
import { PredictionModel } from '../types/prediction';

interface StepContentProps {
  step: number;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
}

enum Source {
  GCS = 'GCS',
  FILE = 'FILE',
}

const useDataSelectionStyles = makeStyles({
  control: {
    minHeight: '50px',
  },
});

const useParametersStyles = makeStyles({
  control: {
    marginBottom: '30px',
  },
});

const DataSelectionStep: FC = () => {
  const [source, setSource] = useState<Source>(Source.GCS);
  const classes = useDataSelectionStyles();
  const { state, dispatch } = useContext(CreatePredictionContext);

  const handleSourceChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setSource(value as Source);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ file: event.target.files?.[0] ?? null });
  };

  const handlePathChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ csvPath: event.target.value });
  };

  return (
    <Box>
      <FormControl component='fieldset'>
        <RadioGroup aria-label='gender' name='gender1' value={source} onChange={handleSourceChange}>
          <FormControlLabel value={Source.GCS} control={<Radio />} label='GCS путь' />
          <FormControlLabel value={Source.FILE} control={<Radio />} label='Файл' />
        </RadioGroup>
      </FormControl>

      <Box className={classes.control}>
        <FormControl fullWidth>
          {source === Source.GCS ? (
            <TextField
              value={state.csvPath}
              onChange={handlePathChange}
              fullWidth
              id='standard-basic'
              label='Введите путь'
            />
          ) : (
            <input onChange={handleFileChange} type='file' />
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

const ParametersStep: FC = () => {
  const { state, dispatch } = useContext(CreatePredictionContext);

  const classes = useParametersStyles();

  const handleModelSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ model: event.target.value as PredictionModel });
  };

  const handleAnalysisNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ analysisName: event.target.value });
  };

  const handleLatitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ latitude: +event.target.value });
  };

  const handleLongitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ longitude: +event.target.value });
  };

  const handleWindFarmChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ windFarm: event.target.value });
  };

  return (
    <>
      <Box>
        <FormControl onChange={handleAnalysisNameChange} className={classes.control} fullWidth>
          <TextField fullWidth label='Название прогноза' />
        </FormControl>
        <FormControl onChange={handleWindFarmChange} className={classes.control} fullWidth>
          <TextField fullWidth label='Название станции' />
        </FormControl>
        <FormControl onChange={handleLatitudeChange} className={classes.control} fullWidth>
          <TextField fullWidth label='Широта станции' />
        </FormControl>
        <FormControl onChange={handleLongitudeChange} className={classes.control} fullWidth>
          <TextField fullWidth label='Долгота станции' />
        </FormControl>
        <FormControl fullWidth className={classes.control}>
          <Select value={state.model} onChange={handleModelSelection}>
            <MenuItem value={PredictionModel.GRADIENT_BOOSTING}>GRADIENT BOOSTING</MenuItem>
            <MenuItem value={PredictionModel.NEURAL_NETWORK}>NEURAL NETWORK</MenuItem>
            <MenuItem value={PredictionModel.RANDOM_FOREST}>RANDOM FOREST</MenuItem>
          </Select>
          <FormHelperText>Выберите Модель прогнозирования</FormHelperText>
        </FormControl>
      </Box>
    </>
  );
};

const CreatePredictionSteps: FC<StepContentProps> = ({
  step,
  onBack,
  onCancel,
  onNext,
  onFinish,
}: StepContentProps) => {
  if (step === 0) {
    return (
      <>
        <DialogTitle id='simple-dialog-title'>Выбор данных для прогноза</DialogTitle>
        <DialogContent>
          <DataSelectionStep></DataSelectionStep>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Отмена</Button>
          <Button onClick={onNext}>Далее</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogTitle id='simple-dialog-title'>Параметры прогноза</DialogTitle>
      <DialogContent>
        <ParametersStep></ParametersStep>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBack}>Назад</Button>
        <Button onClick={onFinish}>Создать</Button>
      </DialogActions>
    </>
  );
};

export default CreatePredictionSteps;
