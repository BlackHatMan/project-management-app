import { Container, Button, Backdrop, CircularProgress } from '@mui/material';
import BoardPreview from '../components/BoardPreview';
import { useEffect, useState } from 'react';
import ModalWindow from '../components/ModalWindow';
import FormCreateBoard from '../components/FormCreateBoard';
import { useAppSelector, useAppDispatch } from '../hooks/redux.hooks';
import { getAllBoards, deleteBoard, createBoard } from '../store/reducer/boardSlice';
import { useTranslation } from 'react-i18next';

const BoardsRoute = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const { boards, pending } = useAppSelector((state) => state.boards);
  const { t } = useTranslation();

  const handleOnClose = () => {
    setOpenModal(false);
  };

  const handlerDelete = (id: string) => {
    dispatch(deleteBoard(id));
  };

  const handlerCreateBoard = (title: string) => {
    dispatch(createBoard(title));
  };

  useEffect(() => {
    if (boards.length === 0) dispatch(getAllBoards());
  }, [boards.length, dispatch]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: 'calc(100vh - 170px)',
        mb: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        '@media only screen and (max-width: 1200px)': {
          justifyContent: 'center',
        },
        '@media only screen and (max-width: 900px)': {
          height: 'calc(100vh - 199px)',
        },
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: 5,
        p: 3,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '.7rem',
        },
        '&::-webkit-scrollbar-thumb ': {
          backgroundColor: '#c8c8c8',
          borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb:hover ': {
          backgroundColor: '#a8a8a8',
        },
      }}
    >
      {boards.map((item) => (
        <BoardPreview board={item} key={item.id} handlerDelete={handlerDelete} />
      ))}
      <Button
        variant="outlined"
        size="large"
        sx={{ height: 50, width: '100%', maxWidth: '21rem' }}
        onClick={() => setOpenModal(true)}
      >
        {t('BOARD.NEW_BOARD')}
      </Button>
      <ModalWindow open={openModal} onClose={handleOnClose}>
        <FormCreateBoard onClose={handleOnClose} handlerCreateBoard={handlerCreateBoard} />
      </ModalWindow>
      <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={pending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default BoardsRoute;
