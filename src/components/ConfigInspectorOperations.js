import React from 'react';
import {
  Box, Typography,
  Grid,
  Button,
} from '@material-ui/core';

export const ConfigInspectorOperations = ({
  activeObjects,
  objectEditer,
  onRemove,
  ...props
}) => {
  const editableObject = objectEditer(activeObjects[0]);

  return (
    <Box padding={1}>
      <Typography
        variant="subtitle1"
      >
        クイック操作
      </Typography>
      <Box mt={1}>
        <Grid container
          justify="space-between"
        >
          <Grid item xs>
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              disabled={!activeObjects[0]}
              fullWidth
              onClick={() => {
                editableObject.remove();
              }}
            >
              削除
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

