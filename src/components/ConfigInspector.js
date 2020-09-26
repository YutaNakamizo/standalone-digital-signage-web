import React, { useState } from 'react';
import {
  Box, Paper, Divider,
  Typography,
  Grid,
  TextField, InputAdornment,
  FormControlLabel, Checkbox,
} from '@material-ui/core';
import { ConfigInspectorTransform as Transform } from '~/components/ConfigInspectorTransform';
import { ConfigInspectorAppearance as Appearance } from '~/components/ConfigInspectorAppearance';
import { ConfigInspectorOperations as Operations } from '~/components/ConfigInspectorOperations';
import { ConfigInspectorLayerControl as LayerControl } from '~/components/ConfigInspectorLayerControl';

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
          <Appearance
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

