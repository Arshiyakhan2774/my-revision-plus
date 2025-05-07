
import React from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';

const SuccessMsg = ({ message, open, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <SnackbarContent
        sx={{
          background: 'green',
          color: 'white',
          textAlign: 'center',
          borderRadius: '8px',
        }}
        message={message}
      />
    </Snackbar>
  );
};



export default SuccessMsg