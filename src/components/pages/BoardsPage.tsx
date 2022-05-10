import { Container, Button } from '@mui/material';
import BoardPreview from '../BoardPreview';
import { useEffect, useState } from 'react';
import ModalWindow from '../ModalWindow';
import FormCreateBoard from '../FormCreateBoard';
import { useAppSelector, useAppDispatch } from '../../hooks/redux.hooks';
import { getAllBoards, deleteAsyncBoard, createBoard } from '../../store/slice/boardSlice';

const BoardsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boards);

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
    dispatch(getAllBoards());
    console.log('get all boards');
  }, [dispatch]);

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: '1rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5, p: 5 }}
    >
      {boards.map((item, index) => (
        <BoardPreview board={item} key={item.id} index={index} handlerDelete={handlerDelete} />
      ))}
      <Button variant="contained" onClick={() => setOpenModal(true)}>
        +
      </Button>
      <ModalWindow open={openModal} onClose={handleOnClose}>
        <FormCreateBoard onClose={handleOnClose} handlerCreateBoard={handlerCreateBoard} />
      </ModalWindow>
    </Container>
  );
};

export default BoardsPage;
