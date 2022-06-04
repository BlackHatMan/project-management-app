import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import dataPictures from '../../dataPictures';
import { useTranslation } from 'react-i18next';

interface IFormInput {
  title: string;
}

const FormCreateBoard: FC<{ onClose: () => void; handlerCreateBoard: (title: string) => void }> = ({
  onClose,
  handlerCreateBoard,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { t } = useTranslation();

  const [changedImg, setChangedImg] = useState(0);
  const onSubmit = (data: IFormInput) => {
    const titleWithBoardNumber = `${String(changedImg).padStart(2, '0')}${data.title}`;

    handlerCreateBoard(titleWithBoardNumber);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{t('BOARD.CREATE')}</DialogTitle>
      <DialogContent>
        <ImageList
          sx={{ width: '100%', maxWidth: '500px', height: 400, gap: 5 }}
          cols={4}
          rowHeight={130}
        >
          {dataPictures.map((item, i) => (
            <ImageListItem
              key={item}
              onClick={() => setChangedImg(i)}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  img: {
                    borderRadius: 3,
                  },
                },
              }}
            >
              <img
                src={item}
                alt="background"
                loading="lazy"
                style={
                  changedImg === i
                    ? {
                        borderRadius: 10,
                        borderColor: 'primary.main',
                        opacity: 0.5,
                      }
                    : {}
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label={t('BOARD.NAME')}
          type="text"
          fullWidth
          variant="standard"
          {...register('title', {
            required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
            minLength: {
              value: 3,
              message: `${t('FORM.NAME_LIMIT')}`,
            },
            maxLength: {
              value: 20,
              message: 'max length 20 letters',
            },
          })}
        />
        <Typography variant="body1" sx={{ color: 'red' }}>
          {errors?.title && errors?.title?.message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ '&:hover': { color: 'primary.contrastText' } }}>
          {t('CANCEL_BTN')}
        </Button>
        <Button type="submit" sx={{ '&:hover': { color: 'primary.contrastText' } }}>
          {t('BOARD.CREATE_BTN')}
        </Button>
      </DialogActions>
    </form>
  );
};

export { FormCreateBoard };
