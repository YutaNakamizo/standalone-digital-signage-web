import React, { useState } from 'react';
import {
  Box, Paper,
  Typography,
  Grid,
  TextField, InputAdornment,
  FormControlLabel, Checkbox,
} from '@material-ui/core';

const TransformTextField = ({
  label,
  step = 0.1,
  value,
  onChange,
  disabled,
  ...props
}) => {
  return (
    <TextField
      label={label}
      size="small"
      type="number"
      fullWidth
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        inputProps: { step },
      }}
      value={value}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export const ConfigInspectorTransform = ({
  objects,
  activeObjects,
  objectEditer,
  imageEditor,
  ...props
}) => {
  const [ staticAspectRatio, setStaticAspectRatio ] = useState(false);

  const { top, left, width, height, rotation } = activeObjects[0] || {};
  const editableObject = objectEditer(activeObjects[0]);

  const xValue = Number.isFinite(left) ? left : '';
  const setXValue = e => {
    const { value } = e.target;
    editableObject.setPosition({ left: value });
  };
  const yValue = Number.isFinite(top) ? top : '';
  const setYValue = e => {
    const { value } = e.target;
    editableObject.setPosition({ top: value });
  };
  const widthValue = Number.isFinite(width) ? width : '';
  const setWidthValue = e => {
    const { value } = e.target;
    const param = { width: value };
    if(staticAspectRatio) param.height = value * editableObject.getAspectRatio();
    editableObject.setSize(param);
  };
  const heightValue = Number.isFinite(height) ? height : '';
  const setHeightValue = e => {
    const { value } = e.target;
    const param = { height: value };
    if(staticAspectRatio) param.width = value / editableObject.getAspectRatio();
    editableObject.setSize(param);
  };
  const rotValue = Number.isFinite(rotation) ? rotation : '';
  const setRotValue = e => {
    const { value } = e.target;
    editableObject.setRotation(value);
  };

  return (
    <Box
      padding={1}
    >
      <Typography
        variant="subtitle1"
      >
        変形
      </Typography>
      <Box mt={1}>
        <Grid container
          justify="space-between"
        >
          <Grid container xs={6} spacing={1}
            direction="column"
            justify="flex-start"
          >
            <Grid item>
              <TransformTextField
                label="X 座標"
                step={0.1}
                value={xValue}
                disabled={!activeObjects[0]}
                onChange={setXValue}
              />
            </Grid>
            <Grid item>
              <TransformTextField
                label="Y 座標"
                step={0.1}
                value={yValue}
                disabled={!activeObjects[0]}
                onChange={setYValue}
              />
            </Grid>
            <Grid item>
              <TransformTextField
                label="回転"
                step={0.1}
                value={rotValue}
                disabled={!activeObjects[0]}
                onChange={setRotValue}
              />
            </Grid>
          </Grid>
          <Grid container xs={6} spacing={1}
            direction="column"
            justify="flex-start"
          >
            <Grid item>
              <TransformTextField
                label="幅"
                step={0.1}
                value={widthValue}
                disabled={!activeObjects[0]}
                onChange={setWidthValue}
              />
            </Grid>
            <Grid item>
              <TransformTextField
                label="高さ"
                step={0.1}
                value={heightValue}
                disabled={!activeObjects[0]}
                onChange={setHeightValue}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={staticAspectRatio}
                    onChange={e => setStaticAspectRatio(e.target.checked)}
                    name="static-aspect-ratio"
                  />
                }
                label="縦横比を固定"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

