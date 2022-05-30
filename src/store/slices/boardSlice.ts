import { createTask, deleteTask, updateTask, updateDragTask } from './taskResucer';
import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { localStorageGetUserToken } from '../../utils/localStorage';
import { BASE_URL } from '../../constants/constants';
import { boardState, IBoard, IBoardPreview } from '../../types/board';
import { createColumn, deleteColumn, updateDrag, updateTitleColumn } from './columnReducer';
import { getAllUsers } from './userReducer';
import { logOut } from './authSlice';

const initialSingleBoard: IBoard = {
  id: '',
  title: '',
  columns: [],
};

const initialState: boardState = {
  boards: [],
  rejectMsg: '',
  pending: false,
  singleBoard: initialSingleBoard,
  usersAll: [],
};

export const getAllBoards = createAsyncThunk<IBoardPreview[], undefined>(
  'board/getAllBoards',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      if (response.status === 401) dispatch(logOut());
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    return await response.json();
  }
);

export const createBoard = createAsyncThunk<IBoardPreview, string, { rejectValue: string }>(
  'board/createBoard',
  async (title, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: title }),
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }

    return await response.json();
  }
);

export const updateBoard = createAsyncThunk<IBoardPreview, IBoardPreview, { rejectValue: string }>(
  'board/updateBoard',
  async (data, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: data.title }),
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }

    return await response.json();
  }
);

export const deleteBoard = createAsyncThunk<string, string, { rejectValue: string }>(
  'board/deleteBoard',
  async (id, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    return id;
  }
);

export const getSingleBoard = createAsyncThunk<IBoard, string, { rejectValue: string }>(
  'board/getSingleBoard',
  async (id, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const data: IBoard = await response.json();
    data.columns.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });

    return data;
  }
);

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearRejectMsg: (state) => {
      state.rejectMsg = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
        state.pending = false;
      })
      .addCase(getAllBoards.pending, (state) => {
        state.pending = true;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
        state.pending = false;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.boards = state.boards.map((el) => {
          return el.id === action.payload.id ? action.payload : el;
        });
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((el) => el.id !== action.payload);
      })
      .addCase(getSingleBoard.fulfilled, (state, action) => {
        state.singleBoard = action.payload;
        state.pending = false;
      })
      .addCase(getSingleBoard.pending, (state) => {
        state.pending = true;
      })
      /* column reducer */
      .addCase(createColumn.fulfilled, (state, action) => {
        state.singleBoard.columns.push(action.payload);
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.singleBoard.columns = action.payload;
      })
      .addCase(updateDrag.fulfilled, (state, action) => {
        state.singleBoard.columns = action.payload;
      })
      .addCase(updateTitleColumn.fulfilled, (state, action) => {
        state.singleBoard.columns = state.singleBoard.columns.map((column) => {
          return column.id === action.payload.id
            ? { ...column, title: action.payload.title }
            : column;
        });
      })
      /* tasks reducer */
      .addCase(createTask.fulfilled, (state, action) => {
        const { columnId, ...newTask } = Object.assign({}, action.payload);
        const indexColumn = state.singleBoard.columns.findIndex((column) => column.id === columnId);

        if (state.singleBoard.columns[indexColumn].tasks) {
          state.singleBoard.columns[indexColumn].tasks?.push(newTask);
        } else {
          state.singleBoard.columns[indexColumn].tasks = [newTask];
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.singleBoard.columns[action.payload.indexColumns].tasks = action.payload.resultTask;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = action.payload.indexColumns;
        state.singleBoard.columns[idx].tasks = state.singleBoard.columns[idx].tasks?.map((t) =>
          t.id === action.payload.newTask.id ? action.payload.newTask : t
        );
      })
      .addCase(updateDragTask.fulfilled, (state, action) => {
        const indexColumn = state.singleBoard.columns.findIndex(
          (column) => column.id === action.payload.columnId
        );
        state.singleBoard.columns[indexColumn].tasks = action.payload.tasks;
      })
      /* users reducer */
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.pending = false;
        state.usersAll = action.payload;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.pending = false;
        state.rejectMsg = action.payload;
      });
  },
});

export const { clearRejectMsg } = boardSlice.actions;

export default boardSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
