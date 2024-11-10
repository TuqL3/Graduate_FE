import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string;
  token: string;
}

const initialState: AuthState = {
  user: '',
  token: '',
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
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
