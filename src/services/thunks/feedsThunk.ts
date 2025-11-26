import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrdersData, TOrder } from '../../utils/types';

export const fetchFeed = createAsyncThunk(
  'feeds/fetchFeed',
  async () => await getFeedsApi()
);

export const fetchProfileOrders = createAsyncThunk(
  'feeds/fetchProfileOrders',
  async () => (await getOrdersApi()) as TOrder[]
);
