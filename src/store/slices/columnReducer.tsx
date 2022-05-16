import { createAsyncThunk } from '@reduxjs/toolkit';
import { boardState, IColumn } from '../../types/board';
import { BASE_URL } from '../../constants/baseUrl';
import { localStorageGetUserToken } from '../../utils/localStorage';

type createColumn = {
  boardId: string;
  title: string;
  order: number;
};
type updateColumn = {
  boardId: string;
  columnId: string;
  title: string;
  order: number;
};

type responseCreateColumn = {
  id: string;
  title: string;
  order: number;
};

type deleteColumn = {
  boardId: string;
  columnId: string;
  order: number;
};

/* export const getAllColumns = createAsyncThunk<
  responseCreateColumn,
  string,
  { rejectValue: string }
>('column/getAllColumns', async (boardId, { rejectWithValue }) => {
  const token = localStorageGetUserToken();
  const response = await fetch(`${BASE_URL}boards/${boardId}/columns`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(
      `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
    );
  }
  return await response.json();
}); */

export const createColumn = createAsyncThunk<
  responseCreateColumn,
  createColumn,
  { rejectValue: string }
>('column/createColumn', async (data, { rejectWithValue }) => {
  const token = localStorageGetUserToken();
  const response = await fetch(`${BASE_URL}boards/${data.boardId}/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: data.title, order: data.order }),
  });

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(
      `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
    );
  }
  return await response.json();
});

export const updateColumn = createAsyncThunk<undefined, updateColumn, { rejectValue: string }>(
  'column/updateColumn',
  async (data, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards/${data.boardId}/columns/${data.columnId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: data.title, order: data.order }),
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(
        `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
      );
    }
  }
);

type updDragColumn = {
  draggableColumn: IColumn;
  oldOrder: number;
  newOrder: number;
  columns: IColumn[];
};
export const updateDrag = createAsyncThunk<IColumn[], updDragColumn>(
  'column/updateDrag',
  async (data) => {
    if (data.oldOrder - data.newOrder < 0) {
      const filtered = data.columns.filter((el) => el.id !== data.draggableColumn.id);
      const updatedColumns = filtered.map((el) =>
        el.order <= data.newOrder && el.order > data.oldOrder ? { ...el, order: el.order - 1 } : el
      );
      const columnWichDrag = Object.assign({}, data.draggableColumn, { order: data.newOrder });
      updatedColumns.push(columnWichDrag);
      return updatedColumns;
    } else if (data.oldOrder - data.newOrder > 0) {
      const filtered = data.columns.filter((el) => el.id !== data.draggableColumn.id);
      const updatedColumns = filtered.map((el) =>
        el.order >= data.newOrder && el.order < data.oldOrder ? { ...el, order: el.order + 1 } : el
      );
      const columnWichDrag = Object.assign({}, data.draggableColumn, { order: data.newOrder });
      updatedColumns.push(columnWichDrag);
      return updatedColumns;
    } else {
      return data.columns;
    }
  }
);

export const deleteColumn = createAsyncThunk<
  IColumn[],
  deleteColumn,
  { rejectValue: string; state: { boards: boardState } }
>('column/deleteColumn', async (data, { rejectWithValue, getState }) => {
  const token = localStorageGetUserToken();
  const columns = getState().boards.singleBoard.columns;
  // const filtered: IColumn[] = columns.filter((el) => el.id !== data.columnId);
  const columnForUpdate = columns.filter((el) => el.order > data.order);
  const columnWithoutUpdate = columns.filter((el) => el.order < data.order);

  const response = await fetch(`${BASE_URL}boards/${data.boardId}/columns/${data.columnId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(
      `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
    );
  }

  columnLoop(data.boardId, columnForUpdate, token, rejectWithValue, columnWithoutUpdate.length);
  const updater = magics(columnForUpdate, columnWithoutUpdate.length);
  const result = [...columnWithoutUpdate, ...updater];
  return result;
});

const magics = (arr: Array<IColumn>, order: number) => {
  return arr.map((el, i) => {
    return Object.assign({}, el, { order: order + 1 + i });
  });
};

const columnLoop = async (
  boardId: string,
  columns: IColumn[],
  token: string,
  rejectWithValue: (value: string) => void,
  length: number
) => {
  let i = 0;
  const acc = [] as IColumn[];
  for await (const item of columns) {
    i++;
    const response = await fetch(`${BASE_URL}boards/${boardId}/columns/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: item.title, order: length + i }),
    });
    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(
        `bad server response, error code: ${resp?.statusCode} message: ${resp?.message}`
      );
    }
    const data = await response.json();
    acc.push(data);
  }
  return acc;
};
