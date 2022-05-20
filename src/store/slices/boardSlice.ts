import { createTask, deleteTask, updateTask, updateDragTask } from './taskResucer';
import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { localStorageGetUserToken } from '../../utils/localStorage';
import { BASE_URL } from '../../constants/constants';
import { boardState, IBoard, IBoardPreview } from '../../types/board';
import { createColumn, deleteColumn, updateColumn, updateDrag } from './columnReducer';
import { getAllUsers } from './userReducer';

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

export const getAllBoards = createAsyncThunk<IBoardPreview[], undefined, { rejectValue: string }>(
  'board/getAllBoards',
  async (_, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
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
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
        state.pending = false;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.boards = state.boards.map((el) => {
          return el.id === action.payload.id ? action.payload : el;
        });
        state.pending = false;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((el) => el.id !== action.payload);
        state.pending = false;
      })
      .addCase(getSingleBoard.fulfilled, (state, action) => {
        state.singleBoard = action.payload;
        state.pending = false;
      })
      /* column reducer */
      .addCase(createColumn.fulfilled, (state, action) => {
        state.singleBoard.columns.push(action.payload);
        state.pending = false;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.singleBoard.columns = action.payload;
        state.pending = false;
      })
      .addCase(updateDrag.fulfilled, (state, action) => {
        state.singleBoard.columns = action.payload;
        state.pending = false;
      })
      .addCase(updateColumn.fulfilled, (state) => {
        state.pending = false;
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
        state.pending = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.singleBoard.columns[action.payload.indexColumns].tasks = action.payload.resultTask;
        state.pending = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = action.payload.indexColumns;
        state.singleBoard.columns[idx].tasks = state.singleBoard.columns[idx].tasks?.map((t) =>
          t.id === action.payload.newTask.id ? action.payload.newTask : t
        );
        state.pending = false;
      })
      .addCase(updateDragTask.fulfilled, (state, action) => {
        const indexColumn = state.singleBoard.columns.findIndex(
          (column) => column.id === action.payload.columnId
        );
        state.singleBoard.columns[indexColumn].tasks = action.payload.tasks;
        state.pending = false;
      })
      /* users reducer */
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.pending = false;
        state.usersAll = action.payload;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.pending = false;
        state.rejectMsg = action.payload;
      })
      .addMatcher(isPending, (state) => {
        state.pending = true;
      });
  },
});

export const { clearRejectMsg } = boardSlice.actions;

export default boardSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
function isPending(action: AnyAction) {
  return action.type.endsWith('pending');
}
