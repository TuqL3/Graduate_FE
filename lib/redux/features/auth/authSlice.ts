import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string;
  token: string;
  isRefresh: boolean
}

const initialState: AuthState = {
  user: '',
  token: '',
  isRefresh: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = '';
      state.token = '';
    },
    update: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
    },
    refresh: (state) =>{
      state.isRefresh = !state.isRefresh
    }
  },
});

export const { login, logout, update, refresh } = authSlice.actions;
export default authSlice.reducer;
