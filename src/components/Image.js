import React from 'react';

export const Image = ({
  data,
  ...props
}) => {
  return (
    <img
      src={data}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
      {...props}
    />
  );
};

