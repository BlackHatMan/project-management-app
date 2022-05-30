import { Dialog } from '@mui/material';
import React from 'react';

type IModalWindowData = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalWindow: React.FC<IModalWindowData> = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
};

export default ModalWindow;
