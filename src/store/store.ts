import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReduser';
import boardsReducer from './reducer/boardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
