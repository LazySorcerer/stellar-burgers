import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  fetchUser,
  loginUser,
  registerUser,
  updateUser
} from '../thunks/userThunk';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type UserState = {
  user: TUser | null;
  userCheck: boolean;
  requestStatus: RequestStatus;
};

const initialState: UserState = {
  user: null,
  userCheck: false,
  requestStatus: 'idle'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserCheck: (state, action: PayloadAction<boolean>) => {
      state.userCheck = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
      state.userCheck = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.requestStatus = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.user = action.payload.user;
        state.userCheck = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.requestStatus = 'failed';
        state.userCheck = true;
      })
      // loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const userActions = userSlice.actions;

export const userSelectors = {
  userSelect: (state: { user: UserState }) => state.user.user,
  isAuthCheckedSelect: (state: { user: UserState }) => state.user.userCheck,
  userIsLoadingSelect: (state: { user: UserState }) =>
    state.user.requestStatus === 'loading'
};

export default userSlice.reducer;
