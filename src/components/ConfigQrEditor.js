import React, { useState, useEffect } from 'react';
import {
  TextField,
} from '@material-ui/core';
import { StandardDialog } from '~/components/StandardDialog';

export const ConfigQrEditor = ({
  source,
  onCancel,
  onSubmit,
  ...props
}) => {
  const [ isNew, setIsNew ] = useState(false);

  const [ text, setText ] = useState('');
  const [ isValid, setIsValid ] = useState(false);

  useEffect(() => {
    const _isNew = (source === null);
    setIsNew(_isNew);
    setText(_isNew ? '' : source.getText());
  }, [ source ]);

  const handleTextChanged = e => {
    const { value } = e.target;
    const isValid = value.trim() !== '';
    setText(value);
    setIsValid(isValid);
  };

  const handleKeyPressed = e => {
    switch(e.key) {
      case 'Enter':
        isNew ? onSubmit(text) : onSubmit(source, text);
        break;
      default:
        break;
    }
  };

  return (
    <StandardDialog
      title={isNew ? 'QR コードを作成' : 'QR コードを編集'}
      submitLabel={isNew ? '作成' : '保存'}
      onCancel={onCancel}
      onSubmit={isNew ? () => onSubmit(text) : () => onSubmit(source, text)}
      maxWidth="sm"
      fullWidth
      disableSubmit={!isValid}
      {...props}
    >
      <TextField
        label="テキスト / URL"
        fullWidth
        value={text}
        onChange={handleTextChanged}
        onKeyPress={handleKeyPressed}
      />
    </StandardDialog>
  );
};

