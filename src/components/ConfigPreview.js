import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
} from '@material-ui/core';
import { SignageObject } from '~/components/SignageObject';

const useStyle = makeStyles(theme => ({
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& > *': {
      position: 'absolute',
    },
  },
  activeObject: {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '-2px',
  },
}));

export const ConfigPreview = ({
  objects,
  activeObjects,
  objectEditer,
  imageEditor,
  onObjectFocus,
  onObjectMentioned,
  onBlur,
  ...props
}) => {
  const classes = useStyle();
  return (
    <Box className={classes.preview}>
      <div
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        onClick={onBlur}
      />
      {
        objects.map(object => {
          const editableObject = objectEditer(object);
          return (
            <SignageObject
              key={editableObject.getId()}
              object={object}
              objectEditer={objectEditer}
              imageEditor={imageEditor}
              className={activeObjects.includes(object) ? classes.activeObject : ''}
              onFocus={e => onObjectFocus(e, object, false)}
              onMentioned={e => onObjectMentioned(e, object)}
            />
          );
        })
      }
    </Box>
  );
};

