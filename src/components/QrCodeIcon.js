import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Icon,
} from '@material-ui/core';
import { ReactComponent as QrCode } from '~/static/images/qr-code.svg';

const useStyle = makeStyles(theme => ({
  root: {
    boxSizing: 'border-box',
    width: 24,
    height: 24,
    padding: 3,
  },
  image: {
    display: 'block',
    width: '18px',
    height: '18px',
  },
}));

export const QrCodeIcon = (props) => {
  const classes = useStyle();
  return (
    <Icon
      className={classes.root}
      {...props}
    >
      <QrCode
        className={classes.image}
      />
    </Icon>
  );
};

