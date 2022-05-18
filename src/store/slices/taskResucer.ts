import { createAsyncThunk } from '@reduxjs/toolkit';
import { ITask, ITaskResponse } from '../../types/board';
import { BASE_URL } from '../../constants/constants';
import { localStorageGetUser, localStorageGetUserToken } from '../../utils/localStorage';

export const createTask = createAsyncThunk<ITaskResponse, ITaskResponse, { rejectValue: string }>(
  'board/createTask',
  async (data, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(
      `${BASE_URL}boards/${data.boardId}/columns/${data.columnId}/tasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          order: data.order,
          description: data.description,
          userId: data.userId,
        }),
      }
    );

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(
        `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
      );
    }
    return await response.json();
  }
);

export const deleteTask = createAsyncThunk<
  responseDeleteTask,
  IDataDeleteTask,
  { rejectValue: string }
>('board/deleteTask', async (data, { rejectWithValue }) => {
  const { indexColumns, tasks } = data;
  const token = localStorageGetUserToken();

  const response = await fetch(
    `${BASE_URL}boards/${data.boardId}/columns/${data.columnId}/tasks/${data.taskId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(
      `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
    );
  }
  const orderDeleteTask = tasks.find((task) => task.id === data.taskId)?.order || 0;
  const TasksWithoutDelete = tasks.filter((el) => el.id !== data.taskId);
  const taskForDecrease = TasksWithoutDelete.filter((el) => el.order > orderDeleteTask);
  const restTask = TasksWithoutDelete.filter((el) => el.order < orderDeleteTask);
  decreaseOrdersOnServer(taskForDecrease, data.boardId, data.columnId);
  const result = decreaseOrderOnState(taskForDecrease, restTask);
  return { indexColumns, resultTask: result };
});

export const moveTaskOnServer = async (data: IDataMoveTask) => {
  const { boardId, columnIdFrom, columnIdTo, indexTaskTo, task, tasksFrom, tasksTo } = data;
  if (columnIdFrom === columnIdTo) {
    if (tasksFrom.length > tasksTo.length) {
      const taskForDecrease = tasksFrom.filter(
        (el) => el.order > task.order && el.order <= indexTaskTo
      );
      decreaseOrdersOnServer(taskForDecrease, boardId, columnIdFrom);
    } else {
      const taskForIncrease = tasksTo.filter(
        (el) => el.order < task.order && el.order >= indexTaskTo
      );
      increaseOrdersOnServer(taskForIncrease, boardId, columnIdFrom);
    }
  } else {
    await increaseOrdersOnServer(tasksTo, boardId, columnIdTo);
  }
};

export const updateTask = createAsyncThunk<updateTaskResponse, updateTask, { rejectValue: string }>(
  'board/updateTask',
  async (data, { rejectWithValue }) => {
    const { id, columnId, boardId, userId, title, order, description } = data.newTask;
    const token = localStorageGetUserToken();

    const response = await fetch(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        order,
        description,
        userId,
        boardId,
        columnId,
      }),
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(
        `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
      );
    }
    const updatedTask = await response.json();
    return { newTask: updatedTask, indexColumns: data.indexColumns };
  }
);

export const updateDragTask = createAsyncThunk<updDragTaskResponse, updDragTask>(
  'board/updateDragTask',
  async (data) => {
    if (data.oldOrder - data.newOrder < 0) {
      /* перетаскиваем сверху вниз*/
      const filtered = data.tasks.filter((el) => el.id !== data.draggableTask.id);
      const updatedTasks = filtered.map((el) =>
        el.order <= data.newOrder && el.order > data.oldOrder ? { ...el, order: el.order - 1 } : el
      );
      const taskWichDrag = Object.assign({}, data.draggableTask, { order: data.newOrder });
      updatedTasks.push(taskWichDrag);
      return { columnId: data.columnId, tasks: updatedTasks };
    } else if (data.oldOrder - data.newOrder > 0) {
      /* перетаскиваем снизу вверх */
      const filtered = data.tasks.filter((el) => el.id !== data.draggableTask.id);
      const updatedTasks = filtered.map((el) =>
        el.order >= data.newOrder && el.order < data.oldOrder ? { ...el, order: el.order + 1 } : el
      );
      const taskWichDrag = Object.assign({}, data.draggableTask, { order: data.newOrder });
      updatedTasks.push(taskWichDrag);
      return { columnId: data.columnId, tasks: updatedTasks };
    } else {
      return { columnId: data.columnId, tasks: data.tasks };
    }
  }
);

const decreaseOrderOnState = (decreaseTask: ITask[], restTasks: ITask[]) => {
  const decrease = decreaseTask.map((task) => {
    return {
      ...task,
      order: task.order - 1,
    };
  });
  return [...restTasks, ...decrease];
};

const decreaseOrdersOnServer = async (tasks: ITask[], boardId: string, columnId: string) => {
  const token = localStorageGetUserToken();
  const userId = localStorageGetUser()?.id;
  const resultPromise = tasks.map((item) => {
    return fetch(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: item.title,
        order: item.order - 1,
        description: item.description,
        userId: userId,
        boardId: boardId,
        columnId: columnId,
      }),
    });
  });
  const results = await Promise.all(resultPromise.map((el) => el.then((resp) => resp.json())));
  return results;
};

const increaseOrdersOnServer = async (tasks: ITask[], boardId: string, columnId: string) => {
  const token = localStorageGetUserToken();
  const userId = localStorageGetUser()?.id;
  const resultPromise = tasks.map((item) => {
    return fetch(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: item.title,
        order: item.order + 1,
        description: item.description,
        userId: userId,
        boardId: boardId,
        columnId: columnId,
      }),
    });
  });
  const results = await Promise.all(resultPromise.map((el) => el.then((resp) => resp.json())));
  return results;
};

export const createOnDragTask = async (data: ITaskResponse) => {
  const token = localStorageGetUserToken();
  const response = await fetch(`${BASE_URL}boards/${data.boardId}/columns/${data.columnId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: data.title,
      order: data.order,
      description: data.description,
      userId: data.userId,
    }),
  });
  const newTask: ITaskResponse = await response.json();
  return newTask;
};
export const updateDraggableTask = async (data: ITaskResponse) => {
  const token = localStorageGetUserToken();
  const response = await fetch(
    `${BASE_URL}boards/${data.boardId}/columns/${data.columnId}/tasks/${data.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.title,
        order: data.order,
        description: data.description,
        userId: data.userId,
        boardId: data.boardId,
        columnId: data.columnId,
      }),
    }
  );
  const updatedTask: ITaskResponse = await response.json();
  return updatedTask;
};

type IDataMoveTask = {
  boardId: string;
  columnIdFrom: string;
  idColumnDestination: string;
  columnIdTo: string;
  indexTaskTo: number;
  task: ITask;
  tasksFrom: ITask[];
  tasksTo: ITask[];
};

export type IDataDeleteTask = {
  tasks: ITask[];
  boardId: string;
  columnId: string;
  taskId: string;
  indexColumns: number;
};

type responseDeleteTask = {
  resultTask: ITask[];
  indexColumns: number;
};

export type updDragTask = {
  draggableTask: ITask;
  tasks: ITask[];
  oldOrder: number;
  newOrder: number;
  columnId: string;
};
type updDragTaskResponse = {
  tasks: ITask[];
  columnId: string;
};

type updateTask = {
  newTask: ITaskResponse;
  indexColumns: number;
};

type updateTaskResponse = {
  newTask: ITask;
  indexColumns: number;
};
