import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  user: string;
}

const initialState: CounterState = {
  user: '',
};

const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = '';
    },
  },
});

export const { addUser, removeUser } = counterSlice.actions;
export default counterSlice.reducer;
