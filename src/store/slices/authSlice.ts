import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  localStorageGetUser,
  localStorageClear,
  localStorageSetUser,
  localStorageSetUserToken,
  localStorageGetUserToken,
} from '../../utils/localStorage';
import { UserInfo } from '../../types/types';
import { UserResponse } from '../../types/auth';
import { BASE_URL } from '../../constants/constants';
import { parseJwt } from '../../utils/parseJWT';

const initialUser: UserInfo = localStorageGetUser() || undefined;
const initialUserToken = localStorageGetUserToken();

const initialState: AuthState = {
  isLoggedIn: !!initialUserToken,
  token: initialUserToken || '',
  pending: false,
  rejectMsg: '',
  id: initialUser?.id || '',
  name: initialUser?.name || '',
};

export const createUser = createAsyncThunk(
  'auth/createAsyncUser',
  async (data: ICreateUser, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resp = await response.json();
        return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
      }
      const result: ICreateUserResponse = await response.json();
      dispatch(setUser(result));
      dispatch(createToken({ login: data.login, password: data.password }));
    } catch (err) {
      const msg = (err as Error).message;
      return rejectWithValue(msg);
    }
  }
);

export const createToken = createAsyncThunk(
  'auth/createToken',
  async (data: ICreateToken, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resp = await response.json();
        return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
      }

      const result: ICreateTokenResponse = await response.json();
      dispatch(setToken(result));
      dispatch(getSingleUser({ id: parseJwt(result.token).userId as string, token: result.token }));
      localStorageSetUserToken(result.token);
    } catch (err) {
      const msg = (err as Error).message;
      return rejectWithValue(msg);
    }
  }
);

export const getSingleUser = createAsyncThunk(
  'auth/getSingleUser',
  async (data: ISingleUser, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}users/${data.id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!response.ok) {
        const resp = await response.json();
        return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
      }
      const singleUser: UserResponse = await response.json();
      dispatch(setUser(singleUser));
      localStorageSetUser({ id: singleUser.id, name: singleUser.name });
    } catch (err) {
      const msg = (err as Error).message;
      return rejectWithValue(msg);
    }
  }
);

export const deleteCurrentUser = createAsyncThunk(
  'auth/deleteUser',
  async (id: string, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    try {
      const singleUserResponse = await fetch(`${BASE_URL}users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!singleUserResponse.ok) {
        const resp = await singleUserResponse.json();
        return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
      }
    } catch (err) {
      const msg = (err as Error).message;
      return rejectWithValue(msg);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: ICreateUser, { dispatch, rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const user = localStorageGetUser();

    const response = await fetch(`${BASE_URL}users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const resp = await response.json();
      if (response.status === 401) dispatch(logOut());
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const singleUser: UserResponse = await response.json();
    dispatch(setUser(singleUser));
    localStorageSetUser({ id: singleUser.id, name: singleUser.name });
  }
);

const pending = (state: AuthState) => {
  state.pending = true;
  state.rejectMsg = '';
};
const reject = (state: AuthState, action: PayloadAction<string>) => {
  state.pending = false;
  state.rejectMsg = action.payload;
};
const fulfilled = (state: AuthState) => {
  state.pending = false;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ICreateUserResponse>) => {
      state.id = action.payload.id;
      state.login = action.payload.login;
      state.name = action.payload.name;
      state.pending = false;
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.id = '';
      state.name = '';
      state.token = '';
      localStorageClear();
    },
    setToken: (state, action: PayloadAction<ICreateTokenResponse>) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    clearRejectMsg: (state) => {
      state.rejectMsg = '';
    },
  },
  extraReducers: {
    [createUser.pending.type]: pending,
    [createUser.rejected.type]: reject,
    [createUser.fulfilled.type]: fulfilled,
    [createToken.pending.type]: pending,
    [createToken.rejected.type]: reject,
    [getSingleUser.fulfilled.type]: fulfilled,
    [getSingleUser.pending.type]: pending,
    [getSingleUser.rejected.type]: reject,
    [getSingleUser.fulfilled.type]: fulfilled,
    [updateUser.pending.type]: pending,
  },
});

export const { setUser, logOut, setToken, clearRejectMsg } = authSlice.actions;

export default authSlice.reducer;

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  pending: boolean;
  rejectMsg: string | null;
  id: string;
  login?: string;
  name: string;
}

type ICreateUser = {
  login: string;
  password: string;
  name: string;
};
type ICreateToken = {
  login: string;
  password: string;
};

type ICreateUserResponse = {
  id: string;
  name: string;
  login: string;
};
type ICreateTokenResponse = {
  token: string;
};

type ISingleUser = {
  id: string;
  token: string;
};
