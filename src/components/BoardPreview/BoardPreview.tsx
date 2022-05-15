import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FC } from 'react';
import dataPictures from '../../dataPictures';
import { useNavigate } from 'react-router-dom';
import { updateBoard } from '../../store/slices/boardSlice';
import ConformModal from '../ConformModal';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/redux.hooks';
import { IBoardPreview } from '../../types/board';

const BoardPreview: FC<{ board: IBoardPreview; handlerDelete: (id: string) => void }> = ({
  board,
  handlerDelete,
}) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [isOpenConformModal, setIsOpenConformModal] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputChangeName>();

  const changeNameColumn = async (e: IFormInputChangeName) => {
    const newTitle = board.title.slice(0, 2) + e.title;
    dispatch(updateBoard({ title: newTitle, id: board.id }));
    setIsEdit(false);
  };

  return (
    <Card sx={{ width: '21rem', maxWidth: '21rem', height: '15rem', border: 2 }}>
      <CardMedia
        onClick={() => navigate(`/boards/${board.id}`)}
        component="img"
        height="170"
        image={dataPictures[+board.title?.slice(0, 2)]}
        alt="background"
        sx={{ pt: 2, pl: 2, pr: 2, pb: 0 }}
      />
      <CardContent
        sx={{
          pt: 2,
          pl: 3,
          pr: 2,
          pb: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          height: '75px',
        }}
      >
        {isEdit ? (
          <form onSubmit={handleSubmit(changeNameColumn)}>
            <Box
              sx={{
                width: '300px',
                display: 'flex',
                justifyContent: 'space-between',
                height: '33px',
                border: '1px solid gray',
                borderRadius: 2,
              }}
            >
              <TextField
                defaultValue={board.title.slice(2)}
                variant="standard"
                error={errors.title ? true : false}
                helperText={errors.title ? errors.title.message : ''}
                sx={{
                  cursor: 'default',
                  color: 'black',
                  width: '75%',
                  background: 'white',
                  borderRadius: 1,
                  pl: 1,
                }}
                {...register('title', {
                  required: { value: true, message: 'this field is required' },
                })}
              />
              <Box>
                <Tooltip title="Change name">
                  <IconButton
                    aria-label="change name"
                    color="primary"
                    size="large"
                    sx={{
                      p: 0.5,
                    }}
                    type="submit"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    aria-label="cancel"
                    color="primary"
                    size="large"
                    sx={{
                      p: 0.5,
                    }}
                    onClick={() => setIsEdit(false)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </form>
        ) : (
          <Typography
            align="left"
            noWrap={true}
            sx={{
              width: '100%',
              fontSize: '1.5rem',
            }}
            onClick={() => setIsEdit(true)}
          >
            {board.title.slice(2)}
          </Typography>
        )}
        <Tooltip title="Delete board">
          <IconButton aria-label="delete" onClick={() => setIsOpenConformModal(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardContent>
      <ConformModal
        isOpen={isOpenConformModal}
        close={() => setIsOpenConformModal(false)}
        func={() => handlerDelete(board.id)}
      />
    </Card>
  );
};

type IFormInputChangeName = {
  title: string;
};

export default BoardPreview;
