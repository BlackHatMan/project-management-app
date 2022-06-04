import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { Button, Container, Stack, useMediaQuery } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { clearSingleBoard } from '../../store/slices/boardSlice';
import { updateColumn, updateDrag } from '../../store/slices/columnReducer';
import { logOut } from '../../store/slices/authReduser';
import { updateDragTask, updDragTask, moveTaskOnServer } from '../../store/slices/taskResucer';
import NewColumn from '../NewColumn';
import ModalWindow from '../ModalWindow';
import Column from '../Column';
import Toolbar from '../Toolbar';
import { ITask } from '../../types/board';
import { IColumnsResp } from '../../utils/types/board';

export type IFilters = {
  searchText: string;
  usersId: string[];
};

const SingleBoardPage = () => {
  const [isOpenModalAddNewColumn, setIsOpenModalAddNewColumn] = useState(false);
  const {
    rejectMsg,
    singleBoard: { columns, title, id: boardId },
  } = useAppSelector((state) => state.boards);
  const [filters, setFilters] = useState<IFilters>({ searchText: '', usersId: [] });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const usersIdCreatedTasks: string[] = [];

  columns.forEach((column) => {
    column?.tasks?.forEach((task) => {
      if (!usersIdCreatedTasks.includes(task.userId)) {
        usersIdCreatedTasks.push(task.userId);
      }
    });
  });

  useEffect(() => {
    return () => {
      dispatch(clearSingleBoard());
    };
  }, [dispatch]);

  useEffect(() => {
    if (rejectMsg) {
      const [code] = rejectMsg.split('/');
      if (code) {
        if (+code === 401) {
          dispatch(logOut());
          navigate('/signin', { replace: true });
        } else {
          navigate('/not-found-board', { replace: true });
        }
      }
    }
  }, [rejectMsg, dispatch, navigate]);

  const onDragEndTask = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    const idxColFrom = columns.findIndex((el) => el.id === source.droppableId) as number;
    const idxColDestination = columns.findIndex((el) => el.id === destination?.droppableId);
    const draggableTask = columns[idxColFrom].tasks?.find((el) => el.id === draggableId) as ITask;
    const idColumnDestination = columns[idxColDestination].id;

    const copyTasksFrom = columns[idxColFrom]?.tasks?.slice(0);
    let copyTasksDestination = columns[idxColDestination]?.tasks?.slice(0);

    const moveInColumnUp =
      source.droppableId === destination?.droppableId && source.index < destination?.index;

    const tasksFrom = copyTasksFrom
      ?.sort((a, b) => a.order - b.order)
      .slice(source.index + 1) as ITask[];

    const tasksTo = copyTasksDestination
      ?.sort((a, b) => a.order - b.order)
      .slice((destination?.index || 0) + (moveInColumnUp ? 1 : 0)) as ITask[];

    const dataMoveTask = {
      boardId: boardId || '',
      columnIdFrom: source.droppableId,
      idColumnDestination,
      columnIdTo: destination?.droppableId || '',
      indexTaskTo: destination?.index || 0,
      task: draggableTask,
      tasksFrom: tasksFrom,
      tasksTo: tasksTo || [],
    };

    const updDragTask: updDragTask = {
      draggableTask,
      tasks: copyTasksFrom || [],
      oldOrder: draggableTask.order,
      newOrder: destination?.index || 0,
      columnId: columns[idxColFrom].id,
    };

    if (idxColFrom === idxColDestination) {
      dispatch(updateDragTask(updDragTask));
    } else if (idxColFrom !== idxColDestination) {
      copyTasksDestination = copyTasksDestination ? copyTasksDestination : [];

      const updDestinationTask: updDragTask = {
        draggableTask,
        tasks: copyTasksDestination,
        oldOrder: copyTasksDestination?.length + 1 || 0,
        newOrder: destination?.index || 0,
        columnId: columns[idxColDestination].id,
      };
      const updOldColumn: updDragTask = {
        draggableTask,
        tasks: copyTasksFrom || [],
        oldOrder: draggableTask.order,
        newOrder: 100,
        columnId: columns[idxColFrom].id,
      };
      dispatch(updateDragTask(updOldColumn));
      dispatch(updateDragTask(updDestinationTask));
    }
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

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 'calc(100vh - 127px)',
        p: 0,
        pt: 'calc(71px)',
        background: `url('/project-management-app/pictures/background${getImageNumber(
          title
        )}.webp')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflowX: 'auto',
        overflowY: 'auto',
        '@media only screen and (max-width: 900px)': {
          pt: 'calc(148px)',
          height: 'calc(100vh - 183px)',
        },
        '@media only screen and (max-width: 600px)': {
          pt: 0,
        },
        '@media only screen and (max-width: 450px)': {
          '&::-webkit-scrollbar': {
            width: '0',
            backgroundColor: '#f1f1f1',
          },
        },
        '&::-webkit-scrollbar': {
          height: '.7rem',
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
      <Toolbar
        filters={filters}
        setFilters={setFilters}
        usersIdCreatedTasks={usersIdCreatedTasks}
      ></Toolbar>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction={matches ? 'vertical' : 'horizontal'}>
          {(provided) => {
            return (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0}
                component="ul"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                  '@media only screen and (max-width: 600px)': {
                    alignItems: 'center',
                    gap: '10px',
                  },
                }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {[...columns]
                  .sort((a, b) => a.order - b.order)
                  .map((column: IColumnsResp) => (
                    <Column key={column.id} column={column} filters={filters} />
                  ))}
                {provided.placeholder}
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    height: 50,
                    width: '100%',
                    maxWidth: '400px',
                    minWidth: '170px',
                    padding: 2,
                    ml: 2,
                    mr: 2,
                    backgroundColor: 'rgba(213, 217, 233, .7)',
                    '&:hover': { backgroundColor: 'rgb(213, 217, 233)' },
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
