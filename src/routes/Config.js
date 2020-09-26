import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
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
import { QrCodeIcon } from '~/components/QrCodeIcon';
import { ConfigPreview as Preview } from '~/components/ConfigPreview';
import { ConfigInspector as Inspector } from '~/components/ConfigInspector';
import { ConfigQrEditor as QrEditor } from '~/components/ConfigQrEditor';

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
    type = 'image',
    name,
    data,
    ...props
  }) {
    super({ type, name });
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

const SignageQr = class extends SignageImage {
  constructor({
    type = 'qr',
    name,
    text,
    ...props
  }) {
    super({ type, name });
    this.text = text;
  }
  async init() {
    this.data = await QRCode.toDataURL(this.text);
    await super.init();
    return this;
  }
  export() {
    const reduced = super.export();
    for(let key of [
      'data',
      'originalWidth',
      'originalHeight',
    ]) delete reduced[key];
    for(let key of [
      'text',
    ]) reduced[key] = this[key];
    return reduced;
  }
  static async import(props) {
    const qr = new SignageQr(props);
    for(let key in props) qr[key] = props[key];
    await qr.init();
    return qr;
  }
};

const useStyle = makeStyles(theme => ({
  toolButton: {
    minWidth: 'auto',
    marginRight: theme.spacing(1),
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

  const [ qrDialogIsOpen, setQrDialogIsOpen ] = useState(false);
  const [ qrDialogSource, setQrDialogSource ] = useState(null);

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

  const loadSignage = async id => {
    const signage = JSON.parse(window.localStorage.getItem(`app.ggtk.signage/first-signage`));
    if(!signage) return false;
    const { objects: propsList } = signage;
    const objects = [];
    for(let props of propsList) {
      switch(props.type) {
        case 'image':
          objects.push(SignageImage.import(props));
          break;
        case 'qr':
          objects.push(await SignageQr.import(props));
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
        renderImageObject(image);
      };
      reader.readAsDataURL(file);
    }
  };
  const renderImageObject = image => {
    handleObjectEdit(image).setSize({
      width: image.originalWidth / screenSize.width * 100,
      height: image.originalHeight / screenSize.height * 100,
    });
    setObjects([ ...objects, image ]);
    handleObjectFocused({}, image);
  };

  const handleObjectFocused = (e, object, add) => {
    setActiveObjects([ ...(add ? activeObjects : []), object ]);
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
  const handleObjectMentioned = (e, object) => {
    const editableObject = handleObjectEdit(object);
    switch(editableObject.getType()) {
      case 'qr':
        openQrDialog(object)
        break;
      default:
        break;
    }
  };

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
      ...handleObjectEdit(object),
      getData: () => {
        return object.data;
      },
    };
  };
  const handleQrEdit = object => {
    return {
      ...handleImageEdit(object),
      getText: () => {
        return object.text;
      },
      setText: async text => {
        object.text = text;
        await object.init();
        setActiveObjects([ ...activeObjects ]);
        return object;
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


  const openQrDialog = object => {
    setQrDialogIsOpen(true);
    setQrDialogSource(object ? handleQrEdit(object) : null);
  };

  const closeQrDialog = e => {
    setQrDialogIsOpen(false);
  };

  const createQr = async text => {
    const qr = new SignageQr({ text });
    await qr.init();
    renderImageObject(qr);
    closeQrDialog();
  };

  const modifyQr = (editableQr, text) => {
    editableQr.setText(text);
    closeQrDialog();
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
            <Tooltip title="QR コードを追加">
              <Button
                color="inherit"
                component="span"
                size="small"
                className={classes.toolButton}
                onClick={() => openQrDialog(null)}
              >
                <QrCodeIcon />
              </Button>
            </Tooltip>
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
                    onObjectMentioned={handleObjectMentioned}
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

      <QrEditor
        source={qrDialogSource}
        open={qrDialogIsOpen}
        onCancel={closeQrDialog}
        onSubmit={qrDialogSource === null ? createQr : modifyQr}
      />
    </div>
  );
};

