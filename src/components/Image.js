import React from 'react';

export const Image = ({
  data,
  position,
  size,
  className,
  onRemove,
  ...props
}) => {
  return (
    <div
      className={`SignageObject SignageImage ${className}`}
      tabIndex={0}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        width: `${size.width}%`,
        height: `${size.height}%`,
      }}
      onKeyDown={e => {
        switch(e.key) {
          case 'Backspace':
          case 'NumpadBackspace':
          case 'Delete':
            onRemove();
            break;
          default:
            break;
        }
      }}
      {...props}
    >
      <img
        src={data}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

