import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../constants/constants';
import { localStorageGetUserToken } from '../../utils/localStorage';

export type IUserResp = {
  id: string;
  name: string;
  login: string;
};

export const getAllUsers = createAsyncThunk<IUserResp[], undefined, { rejectValue: string }>(
  'board/getAllUsers',
  async (_, { rejectWithValue }) => {
    const token = localStorageGetUserToken();
    const response = await fetch(`${BASE_URL}users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }

    const resp: IUserResp[] = await response.json();
    return resp;
  }
);
