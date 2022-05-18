import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Stack, Typography, Grid } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { getSingleBoard } from '../../store/slices/boardSlice';
import { updateColumn, updateDrag } from '../../store/slices/columnReducer';
import NewColumn from '../NewColumn';
import ModalWindow from '../ModalWindow';
import Column from '../Column';
import { IColumnsResp } from '../../utils/types/board';
import { getAllUsers } from '../../store/slices/userReducer';
import { useTranslation } from 'react-i18next';
import { moveTaskOnServer } from '../../store/slices/taskResucer';
import { ITask } from '../../types/board';
import Page404 from '../pages/Page404';

const SingleBoardPage = () => {
  const [isOpenModalAddNewColumn, setIsOpenModalAddNewColumn] = useState(false);
  const { columns, title } = useAppSelector((state) => state.boards.singleBoard);
  const { rejectMsg } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  // const navigation = useNavigate();
  console.log(rejectMsg);

  useEffect(() => {
    if (boardId) {
      dispatch(getSingleBoard(boardId));
    }
  }, [boardId, dispatch]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { t } = useTranslation();

  const onDragEndTask = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    const indexColumnFrom = columns.findIndex((el) => el.id === source.droppableId) as number;
    const indexColumnTo = columns.findIndex((el) => el.id === destination?.droppableId);

    const moveInColumnUp =
      source.droppableId === destination?.droppableId && source.index < destination?.index;

    const taskCopyColumnFrom = columns[indexColumnFrom]?.tasks?.slice(0);
    const taskCopyColumnTo = columns[indexColumnTo]?.tasks?.slice(0);

    const tasksFrom = taskCopyColumnFrom
      ?.sort((a, b) => a.order - b.order)
      .slice(source.index + 1) as ITask[];

    const tasksTo = taskCopyColumnTo
      ?.sort((a, b) => a.order - b.order)
      .slice((destination?.index || 0) + (moveInColumnUp ? 1 : 0)) as ITask[];

    const task = columns[indexColumnFrom].tasks?.find((el) => el.id === draggableId) as ITask;

    const dataMoveTask = {
      boardId: boardId || '',
      columnIdFrom: source.droppableId,
      columnIdTo: destination?.droppableId || '',
      indexTaskTo: destination?.index || 0,
      task: task,
      tasksFrom: tasksFrom,
      tasksTo: tasksTo || [],
    };

    dispatch(moveTaskOnServer(dataMoveTask));
  };

  const onDragEndColumn = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (boardId && destination) {
      const draggableColumn = columns.find((column) => column.id === draggableId) as IColumnsResp;
      const oldOrder = draggableColumn.order;
      const newOrder = destination.index;
      const numChangedColumns = oldOrder - newOrder;

      dispatch(updateDrag({ columns, draggableColumn, newOrder, oldOrder }));

      await dispatch(
        updateColumn({
          boardId: boardId,
          columnId: draggableColumn.id,
          title: draggableColumn.title,
          order: 1000,
        })
      );
      if (numChangedColumns < 0) {
        for (let i = oldOrder + 1; i <= newOrder; i++) {
          const column = columns.find((column) => column.order === i) as IColumnsResp;
          if (column) {
            await dispatch(
              updateColumn({
                boardId: boardId,
                columnId: column.id,
                title: column.title,
                order: column.order - 1,
              })
            );
          }
        }
      } else if (numChangedColumns > 0) {
        for (let i = oldOrder - 1; i >= newOrder; i--) {
          const column = columns.find((column) => column.order === i) as IColumnsResp;
          if (column) {
            await dispatch(
              updateColumn({
                boardId: boardId,
                columnId: column.id,
                title: column.title,
                order: column.order + 1,
              })
            );
          }
        }
      }

      await dispatch(
        updateColumn({
          boardId: boardId,
          columnId: draggableColumn.id,
          title: draggableColumn.title,
          order: newOrder,
        })
      );
    }
  };

  const getImageNumber = (title: string) => {
    const num = title.slice(0, 2);
    return num[0] === '0' ? num[1] : num;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (destination.droppableId === 'board') {
      onDragEndColumn(result);
    } else {
      onDragEndTask(result);
    }
  };

  if (rejectMsg !== '') {
    return <Page404 from="board" />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 'calc(100vh - 132.5px)',
        p: 0,
        background: `url('${process.env.PUBLIC_URL}/pictures/background${getImageNumber(
          title
        )}.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      <Grid container alignItems="center">
        <Grid item>
          <DashboardRoundedIcon sx={{ color: '#303F9F' }} />
        </Grid>
        <Grid item>
          <Typography align="left" variant="h5" sx={{ fontWeight: 'bold', color: '#303F9F' }}>
            {/* {t('BOARD.BOARD')} {title.slice(2)} */}
            {title.slice(2)}
          </Typography>
        </Grid>
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal">
          {(provided) => {
            return (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0}
                component="ul"
                justifyContent="flex-start"
                alignItems="flex-start"
                // sx={{ overflowX: 'auto', overflowY: 'hidden' }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {[...columns]
                  .sort((a, b) => a.order - b.order)
                  .map((column: IColumnsResp) => (
                    <Column key={column.id} column={column} />
                  ))}
                {provided.placeholder}
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    height: 50,
                    minWidth: 300,
                    backgroundColor: 'rgba(213, 217, 233, .7)',
                    '&:hover': { backgroundColor: 'rgb(213, 217, 233)' },
                    mr: 2,
                  }}
                  onClick={() => setIsOpenModalAddNewColumn(true)}
                >
                  {t('COLUMN.NEW_COLUMN')}
                </Button>
              </Stack>
            );
          }}
        </Droppable>
      </DragDropContext>
      <ModalWindow open={isOpenModalAddNewColumn} onClose={() => setIsOpenModalAddNewColumn(false)}>
        <NewColumn onClose={() => setIsOpenModalAddNewColumn(false)} />
      </ModalWindow>
    </Container>
  );
};

export default SingleBoardPage;
