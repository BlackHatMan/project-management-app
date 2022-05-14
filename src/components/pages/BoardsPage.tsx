import { Container, Button, Backdrop, CircularProgress } from '@mui/material';
import BoardPreview from '../BoardPreview';
import { useEffect, useState } from 'react';
import ModalWindow from '../ModalWindow';
import FormCreateBoard from '../FormCreateBoard';
import { useAppSelector, useAppDispatch } from '../../hooks/redux.hooks';
import { getAllBoards, deleteAsyncBoard, createBoard } from '../../store/slices/boardSlice';

const BoardsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const { boards, pending } = useAppSelector((state) => state.boards);

  const handleOnClose = () => {
    setOpenModal(false);
  };

  const handlerDelete = (id: string) => {
    dispatch(deleteAsyncBoard(id));
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
        mb: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: 5,
        p: 4,
        height: 'calc(100vh - 149px)',
        overflowY: 'auto',
      }}
    >
      {boards.map((item) => (
        <BoardPreview board={item} key={item.id} handlerDelete={handlerDelete} />
      ))}
      <Button
        variant="outlined"
        size="large"
        sx={{ height: 50, minWidth: 450 }}
        onClick={() => setOpenModal(true)}
      >
        + Create new board
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

export default BoardsPage;
