import React from 'react';
import { Container as DragContainer, Draggable } from 'react-smooth-dnd';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon,
  Typography,
} from '@material-ui/core';
import DragHandleIcon from "@material-ui/icons/DragHandle";

const useStyle = makeStyles(theme => ({
  item: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ConfigInspectorLayerControl = ({
  objects,
  activeObjects,
  objectEditer,
  imageEditor,
  handleItemMoved,
  ...props
}) => {
  const classes = useStyle();
  return (
    <Box padding={1}>
      <Typography
        variant="subtitle1"
      >
        レイヤー
      </Typography>
      <List dense={true}>
        <DragContainer dragHandleSelector=".item-drag-handle" onDrop={handleItemMoved}>
          {objects.map((object, index) => {
            const { getName } = objectEditer(object);
            return (
              <Draggable key={index}>
                <Divider component="li"/>
                <ListItem className={classes.item}>
                  <ListItemText
                    primary={getName()}
                  />
                  <ListItemSecondaryAction>
                    <DragHandleIcon className="item-drag-handle" />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li"/>
              </Draggable>
            );
          })}
        </DragContainer>
      </List>
    </Box>
  );
};

