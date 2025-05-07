 import React from 'react';
import { Button } from '@mui/material';

const CustomSaveButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      sx={{
        color: 'white',
       background: '#1a73e8',
        ...props.sx, 
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomSaveButton