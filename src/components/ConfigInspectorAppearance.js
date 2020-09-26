import React from 'react';
import {
  Box, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon,
  Typography,
} from '@material-ui/core';

export const ConfigInspectorAppearance = ({
  objects,
  activeObjects,
  objectEditer,
  imageEditor,
  ...props
}) => {
  return (
    <Box padding={1}>
      <Typography
        variant="subtitle1"
      >
        アピアランス
      </Typography>
    </Box>
  );
};

