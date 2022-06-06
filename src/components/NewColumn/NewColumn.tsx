import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useTranslation } from 'react-i18next';
import { createColumn } from '../../store/reducer/columnReducer';

type formData = {
  title: string;
};

const NewColumn = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const { t } = useTranslation();
  const { columns } = useAppSelector((state) => state.boards.singleBoard);
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  const onSubmit = ({ title }: formData) => {
    if (boardId) {
      dispatch(createColumn({ boardId: boardId, title, order: columns.length }));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <DialogTitle>{t('COLUMN.CREATE_COLUMN_HEADER')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('TITLE')}
            fullWidth={true}
            sx={{ mt: 2 }}
            variant="outlined"
            error={errors.title ? true : false}
            helperText={errors.title ? errors.title.message : ''}
            {...register('title', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ '&:hover': { color: 'primary.contrastText' } }}>
            {t('CANCEL_BTN')}
          </Button>
          <Button type="submit" sx={{ '&:hover': { color: 'primary.contrastText' } }}>
            {t('COLUMN.CREATE_COLUMN_BTN')}
          </Button>
        </DialogActions>
      </Box>
    </form>
  );
};

export default NewColumn;
