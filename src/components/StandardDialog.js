import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent, DialogContentText,
  DialogActions, Button,
  Typography,
} from '@material-ui/core';

export const StandardDialog = ({
  open,
  title,
  description,
  submitLabel = '決定',
  onCancel,
  onSubmit,
  disableCancel,
  disableSubmit,
  children,
  ...props
}) => {
  return (
    <Dialog
      open={open}
      disableBackdropClick
      onClose={onCancel}
      {...props}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onCancel}
          disabled={disableCancel}
        >
          キャンセル
        </Button>
        <Button
          color="primary"
          onClick={onSubmit}
          disabled={disableSubmit}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

