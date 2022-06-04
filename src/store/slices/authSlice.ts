import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import {
  localStorageGetUser,
  localStorageClear,
  localStorageSetUser,
  localStorageSetUserToken,
  localStorageGetUserToken,
} from '../../utils/localStorage';
import { UserInfo } from '../../types/types';
import { BASE_URL } from '../../constants/constants';
import { parseJwt } from '../../utils/parseJWT';

const initialUser: UserInfo = localStorageGetUser() || undefined;
const initialUserToken = localStorageGetUserToken();

const initialState: AuthState = {
  isLoggedIn: !!initialUserToken,
  token: initialUserToken || '',
  pending: false,
  rejectAuthMsg: '',
  id: initialUser?.id || '',
  name: initialUser?.name || '',
  successMsg: '',
};

export const createUser = createAsyncThunk(
  'auth/createAsyncUser',
  async (data: ICreateUser, { rejectWithValue }) => {
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

    return (await response.json()) as ICreateUserResponse;
  }
);

export const createToken = createAsyncThunk<IUserResponse, ICreateToken, { rejectValue: string }>(
  'auth/createToken',
  async (data, { rejectWithValue }) => {
    const respToken = await fetch(`${BASE_URL}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!respToken.ok) {
      const resp = await respToken.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const resp: responseSingIn = await respToken.json();
    const id = parseJwt(resp.token).userId;
    localStorageSetUserToken(resp.token);

    /* get Name */

    const responseName = await fetch(`${BASE_URL}users/${id}`, {
      headers: {
        Authorization: `Bearer ${resp.token}`,
      },
    });
    if (!responseName.ok) {
      const resp = await responseName.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const result: IUserResponse = await responseName.json();
    localStorageSetUser({ id: result.id, name: result.name });
    return result;
  }
);

export const getSingleUser = createAsyncThunk<IUserResponse, string, { rejectValue: string }>(
  'auth/getSingleUser',
  async (id, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}users/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    return (await response.json()) as IUserResponse;
  }
);

export const deleteCurrentUser = createAsyncThunk(
  'auth/deleteUser',
  async (id: string, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
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
    return 'user successful deleted';
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
    const singleUser: IUserResponse = await response.json();
    localStorageSetUser({ id: singleUser.id, name: singleUser.name });
    return singleUser;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLoggedIn = false;
      state.id = '';
      state.name = '';
      state.token = '';
      state.login = '';
      localStorageClear();
    },
    clearAuthMsg: (state) => {
      state.successMsg = '';
      state.rejectAuthMsg = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.id = payload.id;
        state.login = payload.login;
        state.name = payload.name;
        state.pending = false;
      })
      .addCase(getSingleUser.fulfilled, (state, { payload }) => {
        state.id = payload.id;
        state.login = payload.login;
        state.name = payload.name;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.id = payload.id;
        state.login = payload.login;
        state.name = payload.name;
        state.successMsg = 'login successfully update';
        state.pending = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.pending = true;
      })
      .addCase(createToken.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.login = payload.login;
        state.id = payload.id;
        state.isLoggedIn = true;
        state.pending = false;
      })
      .addCase(deleteCurrentUser.fulfilled, (state, { payload }) => {
        state.successMsg = payload;
      })
      .addCase(createToken.pending, (state) => {
        state.pending = true;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.pending = false;
        state.rejectAuthMsg = action.payload;
      });
  },
});

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}

export const { logOut, clearAuthMsg } = authSlice.actions;

export default authSlice.reducer;

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  pending: boolean;
  rejectAuthMsg: string | null;
  id: string;
  login?: string;
  name: string;
  successMsg: string;
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

type responseSingIn = {
  token: string;
};
export interface IUserResponse {
  id: string;
  login: string;
  name: string;
}
