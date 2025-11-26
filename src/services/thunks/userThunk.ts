import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => await getUserApi()
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) =>
    await loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name }: TRegisterData) =>
    await registerUserApi({ email, password, name })
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);
