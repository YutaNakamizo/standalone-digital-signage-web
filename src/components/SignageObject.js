import React from 'react';
import { Image } from '~/components/Image';

export const SignageObject = ({
  object,
  objectEditer,
  imageEditor,
  onFocus,
  onMentioned,
  className,
  ...props
}) => {
  const editableObject = objectEditer(object);
  const editableImage = imageEditor(object);

  const typeClassName = {
    'image': 'SignageImage',
    'qr': 'SignageQr',
  }[editableObject.getType()] || '';

  const position = editableObject.getPosition();
  const size = editableObject.getSize()


  return (
    <div
      className={`SignageObject ${typeClassName} ${className}`}
      tabIndex={0}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        width: `${size.width}%`,
        height: `${size.height}%`,
      }}
      onClick={onFocus}
      onDoubleClick={onMentioned}
      onKeyDown={e => {
        switch(e.key) {
          case 'Backspace':
          case 'NumpadBackspace':
          case 'Delete':
            editableObject.remove()
            break;
          default:
            break;
        }
      }}
      {...props}
    >
      {function() {
        switch(editableObject.getType()) {
          case 'image':
          case 'qr':
            return (
              <Image
                data={editableImage.getData()}
                {...props}
              />
            );
            break;
          default:
            console.warn('Unkown object type is detected.');
            return;
        }
      }()}
    </div>

  );
};

