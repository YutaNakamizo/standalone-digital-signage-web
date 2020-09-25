import React, { useState } from 'react';
import {
  Box, Paper, Divider,
  Typography,
  Grid,
  TextField, InputAdornment,
  FormControlLabel, Checkbox,
} from '@material-ui/core';
import { ConfigInspectorTransform as Transform } from '~/components/ConfigInspectorTransform';
import { ConfigInspectorLayerControl as LayerControl } from '~/components/ConfigInspectorLayerControl';
import { ConfigInspectorOperations as Operations } from '~/components/ConfigInspectorOperations';

export const ConfigInspector = (props) => {
  return (
    <>
      <Box margin={2}>
        <Paper>
          <Transform
            {...props}
          />
        </Paper>
      </Box>
      <Box margin={2}>
        <Paper>
          <Operations
            {...props}
          />
        </Paper>
      </Box>
      <Box margin={2}>
        <Paper>
          <LayerControl
            {...props}
          />
        </Paper>
      </Box>
    </>
  );
};

