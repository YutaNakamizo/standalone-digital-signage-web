import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar,
  Typography,
  Tooltip,
  Button,
  Box, Paper,
  Container,
} from '@material-ui/core';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import { ConfigPreview as Preview } from '~/components/ConfigPreview';
import { ConfigInspector as Inspector } from '~/components/ConfigInspector';

const SignageObject = class {
  constructor({
    type,
    name,
    top,
    right,
    bottom,
    left,
    width,
    height,
    ...props
  }) {
    this.id = uuidv4();
    this.type = type || 'unknown';
    this.name = name || `${this.type}-${this.id}`;
    this.top = top || 0;
    this.right = right || undefined;
    this.bottom = bottom || undefined;
    this.left = left || 0;
    this.width = width || 100;
    this.height = height || 100;
    this.rotation = 0;
  }
  export() {
    const reduced = {};
    for(let key of [
      'id',
      'type',
      'name',
      'top',
      'right',
      'bottom',
      'left',
      'width',
      'height',
      'rotation',
    ]) reduced[key] = this[key];
    return reduced;
  }
  static import(props) {
    const object = new SignageObject(props);
    for(let key in props) object[key] = props[key];
    return object;
  }
};

const SignageImage = class extends SignageObject {
  constructor({
    name,
    data,
    ...props
  }) {
    super({
      type: 'image',
      name,
    });
    this.data = data;
  }
  init() {
    return new Promise(resolve => {
      const image = new Image();
      image.src = this.data;
      image.onload = () => {
        this.originalWidth = image.naturalWidth;
        this.originalHeight = image.naturalHeight;
        resolve(this);
      };
    });
  }
  export() {
    const reduced = super.export();
    for(let key of [
      'data',
      'originalWidth',
      'originalHeight',
    ]) reduced[key] = this[key];
    return reduced;
  }
  static import(props) {
    const image = new SignageImage(props);
    for(let key in props) image[key] = props[key];
    return image;
  }
};

const useStyle = makeStyles(theme => ({
  toolButton: {
    minWidth: 'auto',
  },
  previewContainerFrame: {
    padding: theme.spacing(3),
    backgroundColor: '#555',
  },
  previewContainer: {
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      display: 'block',
      width: '100%',
      paddingTop: ({ screenSize }) => (screenSize ? (screenSize.height / screenSize?.width * 100) : 56.25) + '%',
    },
  },
  inspectorContainer: {
    width: 400,
  },
}));

export const Config = ({
  screenSize,
  ...props
}) => {
  const [ activeObjects, setActiveObjects ] = useState([]);
  const [ objects, setObjects ] = useState([]);

  const saveSignage = () => {
    const signage = {
      lastUpdatedTime: new Date().getTime(),
      objects: [],
    };
    for(let object of objects) {
      signage.objects.push(object.export());
    }
    window.localStorage.setItem('app.ggtk.signage/first-signage', JSON.stringify(signage));
    console.log(`Saved! [${signage['lastUpdatedTime']}]`);
  };

  const loadSignage = id => {
    const signage = JSON.parse(window.localStorage.getItem(`app.ggtk.signage/first-signage`));
    const { objects: propsList } = signage;
    const objects = [];
    for(let props of propsList) {
      switch(props.type) {
        case 'image':
          objects.push(SignageImage.import(props));
          break;
        default:
          objects.push(SignageObject.import(props));
          break;
      }
    }
    setObjects(objects);
  };

  useEffect(() => {
    loadSignage();
  }, []);



  const imageInput = React.createRef();

  const handleImageInput = e => {
    const { files } = e.target;
    for(let file of files) {
      const reader = new FileReader();
      reader.onload = async () => {
        const data = reader.result;
        const image = await new SignageImage({ data }).init();
        handleObjectEdit(image).setSize({
          width: image.originalWidth / screenSize.width * 100,
          height: image.originalHeight / screenSize.height * 100,
        });
        setObjects([ ...objects, image ]);
        handleObjectFocused({}, image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleObjectFocused = (e, object) => {
    setActiveObjects([ ...activeObjects, object ]);
  };
  const handleObjectBlurred = (e, object) => {
    const blurred = [ ...activeObjects ];
    const index = blurred.indexOf(object);
    if(index < 0) return;
    blurred.splice(index, 1);
    setActiveObjects(blurred);
  };
  const handleBlurred = e => {
    setActiveObjects([]);
  }

  const handleObjectEdit = object => {
    return {
      getType: () => {
        return object.type;
      },
      getId: () => {
        return object.id;
      },
      getName: () => {
        return object.name;
      },
      getPosition: () => {
        return {
          top: object.top,
          right: object.right,
          bottom: object.bottom,
          left: object.left,
        };
      },
      getSize: () => {
        return {
          width: object.width,
          height: object.height,
        };
      },
      getAspectRatio: () => {
        return object.height / object.width;
      },
      getRotation: () => {
        return object.rotation;
      },
      setName: name => {
        if(name.trim() === '') throw new Error('empty-name');
        object.name = name;
        setActiveObjects([ ...activeObjects ]);
        return object;
      },
      setPosition: ({ top, right, bottom, left }) => {
        top = Number(top);
        right = Number(right);
        bottom = Number(bottom);
        left = Number(left);
        if(Number.isFinite(top)) object.top = Number.isFinite(bottom) ? undefined : top;
        if(Number.isFinite(right)) object.right = Number.isFinite(left) ? undefined : right;
        if(Number.isFinite(bottom)) object.bottom = Number.isFinite(top) ? undefined : bottom;
        if(Number.isFinite(left)) object.left = Number.isFinite(right) ? undefined : left;
        setActiveObjects([ ...activeObjects ]);
        return object;
      },
      setSize: ({ width, height }) => {
        width = Number(width);
        height = Number(height);
        if(Number.isFinite(width)) object.width = width;
        if(Number.isFinite(height)) object.height = height;
        setActiveObjects([ ...activeObjects ]);
        return object;
      },
      setRotation: rot => {
        rot = Number(rot);
        if(Number.isFinite(rot)) object.rotation = rot;
        setActiveObjects([ ...activeObjects ]);
        return object;
      },
      remove: () => {
        const removed = [ ...objects ];
        const index = removed.indexOf(object);
        if(index < 0) return object;
        removed.splice(index, 1);
        setObjects(removed);
        handleObjectBlurred({}, object);
        return object;
      },
    };
  };
  const handleImageEdit = object => {
    return {
      getData: () => {
        return object.data;
      },
    };
  };

  const moveObjectOrder = ({ removedIndex, addedIndex }) => {
    console.log(removedIndex, addedIndex)
    const ordered = [ ...objects ];
    const [ target ] = ordered.splice(removedIndex, 1);
    ordered.splice(addedIndex, 0, target);
    console.log(objects.map(object => object.id).join('\n'))
    console.log(ordered.map(object => object.id).join('\n'))
    setObjects(ordered);
  };


  const classes = useStyle({ screenSize });
  return (
    <div className="Config">
      <AppBar
        position="sticky"
        color="inherit"
      >
        <Container maxWidth="lg">
          <Toolbar variant="dense">
            <Typography
              variant="h6"
              component="h1"
            >
              作成
            </Typography>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={saveSignage}
              style={{ marginLeft: 'auto' }}
            >
              保存
            </Button>
          </Toolbar>
          <Toolbar variant="dense">
            <input
              id="new-images"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageInput}
            />
            <label htmlFor="new-images">
              <Tooltip title="画像を追加">
                <Button
                  color="inherit"
                  component="span"
                  size="small"
                  className={classes.toolButton}
                >
                  <InsertPhotoOutlinedIcon />
                </Button>
              </Tooltip>
            </label>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        <Box display="flex">
          <Box mt={2} flexGrow={1}>
            <Container maxWidth="md">
              <Paper className={classes.previewContainerFrame}>
                <Paper className={classes.previewContainer} elevation={0}>
                  <Preview
                    objects={objects}
                    activeObjects={activeObjects}
                    objectEditer={handleObjectEdit}
                    imageEditor={handleImageEdit}
                    onObjectFocus={handleObjectFocused}
                    onBlur={handleBlurred}
                  />
                 </Paper>
              </Paper>
            </Container>
          </Box>
  
          <Box className={classes.inspectorContainer}>
            <Inspector
              objects={objects}
              activeObjects={activeObjects}
              objectEditer={handleObjectEdit}
              imageEditor={handleImageEdit}
              handleItemMoved={moveObjectOrder}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

