import { useState, forwardRef, useEffect } from 'react';
import { Stack, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAppSelector, useAppDispatch } from '../../hooks/redux.hooks';
import { useTranslation } from 'react-i18next';
import { clearRejectMsg } from '../../store/slices/boardSlice';
import { clearAuthMsg } from '../../store/slices/authSlice';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarMessage = () => {
  const [open, setOpen] = useState(false);
  const { rejectAuthMsg, successMsg } = useAppSelector((state) => state.auth);
  const { rejectMsg } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (rejectAuthMsg || rejectMsg || successMsg) {
      setOpen(true);
    }
  }, [rejectAuthMsg, rejectMsg, successMsg]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      rejectMsg ? dispatch(clearRejectMsg()) : dispatch(clearAuthMsg());
    }, 100);
  };

  const incomeMessage = rejectAuthMsg || rejectMsg;
  const [code, message] = incomeMessage.split('/');
  let visibleMessage;
  if (incomeMessage) {
    visibleMessage = `${t('ERROR_RESPONSE')} ${code} - ${message}`;
  } else {
    visibleMessage = successMsg;
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={!!successMsg ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {visibleMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SnackbarMessage;
