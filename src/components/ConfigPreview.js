import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
} from '@material-ui/core';
import { Image } from '~/components/Image';

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
          const editableImage = imageEditor(object);
          switch(editableObject.getType()) {
            case 'image':
              return (
                <Image
                  key={editableObject.getId()}
                  data={editableImage.getData()}
                  position={editableObject.getPosition()}
                  size={editableObject.getSize()}
                  onFocus={e => onObjectFocus(e, object, false)}
                  onRemove={editableObject.remove}
                  className={activeObjects.includes(object) ? classes.activeObject : ''}
                  {...props}
                />
              );
              break;
            default:
              console.warn('Unkown object type is detected.');
              return;
          }
        })
      }
    </Box>
  );
};

