import { Box, Button, DialogActions, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ConformForm = ({ choose }: { choose: (arg: boolean) => void }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <DialogTitle>{t('TASK.CONFIRM_DEL')}</DialogTitle>
      <DialogActions>
        <Button onClick={() => choose(false)} sx={{ '&:hover': { color: 'primary.contrastText' } }}>
          {t('CANCEL_BTN')}
        </Button>
        <Button onClick={() => choose(true)} sx={{ '&:hover': { color: 'primary.contrastText' } }}>
          {t('TASK.YES')}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ConformForm;
