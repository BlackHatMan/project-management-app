import { Avatar, ListItem, Paper, styled, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ModalWindow from '../ModalWindow';
import TaskFull from '../TaskFull';
import React from 'react';
import { ITask } from '../../types/board';
import { useAppSelector } from '../../hooks/redux.hooks';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }: { task: ITask; index: number }) => {
  const [isOpenModalTaskFull, setIsOpenModalTaskFull] = React.useState(false);
  const { usersAll } = useAppSelector((state) => state.boards);

  const currentUser = usersAll?.find((user) => user.id === task.userId)?.name || '';

  const TitleTask = styled(Paper)(({ theme }) => ({
    ...theme.typography.h6,
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
    color: theme.palette.text.primary,
    height: 60,
    width: '100%',
    lineHeight: '60px',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '0.6rem',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&:hover': {
      boxShadow: '3px 3px 5px #5a5050',
      '& .MuiSvgIcon-root': {
        opacity: '1',
      },
    },
  }));

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string) {
    const curName = name ? name : 'd';
    return {
      sx: {
        bgcolor: stringToColor(curName),
      },
      children: `${
        curName.split(' ').length > 1
          ? curName.split(' ')[0][0] + curName.split(' ')[1][0]
          : curName[0]
      }`,
    };
  }

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <ListItem
            sx={{
              width: '100%',
              m: 0,
              p: 0,
            }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TitleTask onClick={() => setIsOpenModalTaskFull(true)} sx={{ gap: 1 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
              <EditIcon
                sx={{
                  opacity: '0',
                }}
              />
              <Avatar {...stringAvatar(currentUser)} />
            </TitleTask>
          </ListItem>
        )}
      </Draggable>
      <ModalWindow open={isOpenModalTaskFull} onClose={() => setIsOpenModalTaskFull(false)}>
        <TaskFull onClose={() => setIsOpenModalTaskFull(false)} task={task} />
      </ModalWindow>
    </>
  );
};

export default Task;
