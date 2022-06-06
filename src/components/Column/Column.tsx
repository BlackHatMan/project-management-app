import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModalWindow from '../ModalWindow';
import FormNewTask from '../FormNewTask';
import { useForm } from 'react-hook-form';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import ConformModal from '../ConformModal';
import { useAppDispatch } from '../../hooks/redux.hooks';
import { IColumn } from '../../types/board';
import { deleteColumn, updateTitleColumn } from '../../store/reducer/columnReducer';
import Task from '../Task';
import { useTranslation } from 'react-i18next';
import { IFilters } from '../../Routes/BoardRoute';

type IFormInputChangeName = {
  title: string;
};

const Column = ({ column, filters }: { column: IColumn; filters: IFilters }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModalAddNewTask, setisOpenModalAddNewTask] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputChangeName>();
  const { t } = useTranslation();

  const [isOpenConformModal, setIsOpenConformModal] = React.useState(false);
  const { boardId } = useParams();
  const dispatch = useAppDispatch();

  const handleDeleteColumn = async () => {
    if (boardId) {
      dispatch(deleteColumn({ boardId: boardId, columnId: column.id, order: column.order }));
    }
  };

  const changeNameColumn = async (e: IFormInputChangeName) => {
    if (boardId) {
      dispatch(
        updateTitleColumn({ boardId, columnId: column.id, order: column.order, title: e.title })
      );
    }
    setIsEdit(false);
  };

  return (
    <Draggable draggableId={column.id} index={column.order}>
      {(provided) => (
        <Stack
          spacing={0}
          sx={{
            width: '400px',
            minWidth: '400px',
            maxWidth: '400px',
            border: '1px solid Gray',
            borderRadius: 2,
            py: 1,
            ml: 2,
            mr: 2,
            backgroundColor: 'rgba(213, 217, 233, .7)',
            '@media only screen and (max-width: 450px)': {
              width: '100%',
              minWidth: '250px',
              maxWidth: '400px',
              ml: 0,
              mr: 0,
              p: 1,
            },
            maxHeight: 'calc(100vh - 230px)',
          }}
          component="li"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Box
            sx={{
              width: '100%',
              py: 0.8,
              px: 1.7,
              display: 'flex',
              justifyContent: 'space-between',
            }}
            {...provided.dragHandleProps}
          >
            {isEdit ? (
              <form onSubmit={handleSubmit(changeNameColumn)}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                  }}
                >
                  <TextField
                    defaultValue={column.title}
                    variant="standard"
                    autoFocus
                    error={errors.title ? true : false}
                    helperText={errors.title ? errors.title.message : ''}
                    sx={{
                      cursor: 'default',
                      width: '70%',
                      pl: 1,
                      input: {
                        color: 'gray',
                        fontWeight: 700,
                        fontSize: '1.3rem',
                      },
                    }}
                    {...register('title', {
                      required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
                    })}
                  />
                  <Box alignSelf="center">
                    <Tooltip title={t('BOARD.CHANGE_NAME')}>
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
                    <Tooltip title={t('CANCEL_BTN')}>
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
                  color: 'gray',
                  width: '70%',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'primary.contrastText',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => setIsEdit(true)}
              >
                {column.title}
              </Typography>
            )}
            <Box sx={{ display: 'flex' }}>
              <Tooltip title={t('TASK.ADD_BTN')}>
                <IconButton
                  aria-label="add new task"
                  color="primary"
                  size="large"
                  sx={{
                    p: 0,
                    pr: 1,
                  }}
                  onClick={() => setisOpenModalAddNewTask(true)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('COLUMN.DELETE_BTN')}>
                <IconButton
                  aria-label="delete column"
                  color="primary"
                  size="large"
                  sx={{
                    p: 0,
                  }}
                  onClick={() => setIsOpenConformModal(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Droppable droppableId={column.id} type="QUOTE">
            {(dropProvided) => {
              return (
                <Stack
                  spacing={0}
                  component="ul"
                  sx={{
                    mt: 0,
                    pl: 1.8,
                    pr: 1,
                    paddingRight: '.8rem',
                    overflowY: 'auto',
                    overflowX: 'hidden',
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
                    minHeight: '1vh',
                    '@media only screen and (max-width: 450px)': {
                      pr: 0,
                      '&::-webkit-scrollbar': {
                        width: '0',
                        backgroundColor: '#f1f1f1',
                      },
                    },
                  }}
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  {column.tasks &&
                    [...column.tasks]
                      .sort((a, b) => a.order - b.order)
                      .filter(
                        (task) =>
                          (filters.searchText === '' ||
                            task.title.includes(filters.searchText) ||
                            task.description.includes(filters.searchText)) &&
                          (filters.usersId.length === 0 ||
                            filters.usersId.includes(task.userId) ||
                            (filters.usersId.includes('deleted') && task.userId == null))
                      )
                      .map((task, index) => <Task key={task.id} task={task} index={index} />)}
                  {dropProvided.placeholder}
                </Stack>
              );
            }}
          </Droppable>
          <ModalWindow open={isOpenModalAddNewTask} onClose={() => setisOpenModalAddNewTask(false)}>
            <FormNewTask columnId={column.id} onClose={() => setisOpenModalAddNewTask(false)} />
          </ModalWindow>
          <ConformModal
            isOpen={isOpenConformModal}
            close={() => setIsOpenConformModal(false)}
            func={handleDeleteColumn}
          />
        </Stack>
      )}
    </Draggable>
  );
};

export default Column;
