import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authReduser';
import boardsReducer from './slices/boardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
