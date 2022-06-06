import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { IFileAttached, ITask } from '../../types/board';
import React from 'react';
import { useForm } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import ConformModal from '../ConformModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { deleteTask, updateTask } from '../../store/reducer/taskResucer';
import { localStorageGetUser } from '../../utils/localStorage';
import { useTranslation } from 'react-i18next';
type IFormTaskData = {
  title: string;
  description: string;
  done: boolean;
  files: IFileAttached;
};

type IFormInputFile = {
  file?: File;
  filename: string;
  fileSize: number;
};

type IPropsTaskFull = {
  onClose: () => void;
  task: ITask;
};

const TaskFull = ({ onClose, task }: IPropsTaskFull) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormTaskData>();
  const dispatch = useAppDispatch();

  const [downloadFiles, setDownloadFiles] = React.useState<IFileAttached[]>(task.files || []);
  const [isOpenConformModal, setIsOpenConformModal] = React.useState(false);
  const { id, columns } = useAppSelector((state) => state.boards.singleBoard);
  const { t } = useTranslation();
  const { usersAll } = useAppSelector((state) => state.boards);

  const currentUser =
    usersAll?.find((user) => user.id === task.userId)?.name || `${t('FILTER.UNKNOWN_USER')}`;

  const onSubmit = (data: IFormTaskData) => {
    const userId = localStorageGetUser()?.id;
    const indexColumns = columns.findIndex((item) => item.tasks?.find((t) => t.id === task.id));

    const newTask = {
      id: task.id,
      order: task.order,
      title: data.title,
      description: data.description,
      userId: userId,
      boardId: id,
      columnId: columns[indexColumns].id || '',
    };

    dispatch(updateTask({ newTask, indexColumns }));
    onClose();
  };

  const onDelete = async () => {
    const indexColumns = columns.findIndex((item) => item.tasks?.find((t) => t.id === task.id));

    const data = {
      tasks: columns[indexColumns]?.tasks || [],
      boardId: id,
      taskId: task.id,
      columnId: columns[indexColumns].id || '',
      indexColumns: indexColumns || 0,
    };

    dispatch(deleteTask(data));
    onClose();
  };

  const handleDeleteFile = (name: string) => {
    const newDownloadFiles = downloadFiles.filter((item) => item.filename !== name);
    setDownloadFiles(newDownloadFiles);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const newFile: IFormInputFile = {
        file: files[0],
        filename: files[0].name,
        fileSize: files[0].size,
      };
      setDownloadFiles([...downloadFiles, newFile]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: '100%', maxWidth: '500px' }}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            '@media only screen and (max-width: 450px)': {
              flexDirection: 'column',
            },
          }}
        >
          {t('TASK.EDIT')}
          <Typography
            variant="body1"
            sx={{
              m: 0,
              px: 1,
            }}
          >
            {t('TASK.CREATE_BY')} <span style={{ color: 'blue' }}>{currentUser}</span>
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <TextField
            autoFocus
            defaultValue={task.title}
            margin="dense"
            id="title"
            label={t('TITLE')}
            type="text"
            fullWidth
            variant="outlined"
            error={Boolean(errors.title)}
            helperText={errors.title ? errors.title.message : ''}
            {...register('title', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
            })}
          />
          <TextField
            defaultValue={task.description}
            margin="dense"
            id="description"
            label={t('DESCR')}
            type="text"
            fullWidth
            variant="outlined"
            multiline={true}
            rows={4}
            error={Boolean(errors.description)}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
            })}
          />
          {downloadFiles.length > 0 && (
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('TASK.FILENAME')}</TableCell>
                    <TableCell align="right">{t('TASK.SIZE')}</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {downloadFiles.map((item) => (
                    <TableRow
                      key={item.filename}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.filename}
                      </TableCell>
                      <TableCell align="right">{item.fileSize}</TableCell>
                      <TableCell align="right">
                        {
                          <Tooltip title="Delete file">
                            <IconButton
                              aria-label="delete file"
                              color="primary"
                              size="large"
                              sx={{
                                p: 0,
                              }}
                              onClick={() => handleDeleteFile(item.filename)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Divider />
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            {t('TASK.ADD_FILE')}
            <input
              type="file"
              hidden
              {...register('files', { required: false })}
              onChange={handleUploadFile}
            />
          </Button>
        </DialogContent>
        <DialogActions
          sx={{
            '@media only screen and (max-width: 450px)': {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Button onClick={() => setIsOpenConformModal(true)} sx={{ color: 'red' }}>
            {t('TASK.DELETE')}
          </Button>
          <Button onClick={onClose} sx={{ '&:hover': { color: 'primary.contrastText' } }}>
            {t('CANCEL_BTN')}
          </Button>
          <Button type="submit" sx={{ '&:hover': { color: 'primary.contrastText' } }}>
            {t('UPDATE_BTN')}
          </Button>
        </DialogActions>
        <ConformModal
          isOpen={isOpenConformModal}
          close={() => setIsOpenConformModal(false)}
          func={onDelete}
        />
      </Box>
    </form>
  );
};

export default TaskFull;
