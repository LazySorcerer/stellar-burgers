import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { createOrder, fetchOrderByNumber } from '../thunks/orderThunk';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type OrderState = {
  // Для создания нового заказа
  newOrder: TOrder | null;
  newOrderRequest: boolean;

  // Для просмотра заказа по ID
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;

  requestStatus: RequestStatus;
};

const initialState: OrderState = {
  newOrder: null,
  newOrderRequest: false,
  currentOrder: null,
  currentOrderLoading: false,
  requestStatus: 'idle'
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.newOrderRequest = true;
        state.requestStatus = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.newOrderRequest = false;
        state.requestStatus = 'succeeded';
        state.newOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.newOrderRequest = false;
        state.requestStatus = 'failed';
      })
      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.currentOrderLoading = false;
      });
  }
});

export const orderActions = orderSlice.actions;

export const orderSelectors = {
  newOrderSelect: (state: { order: OrderState }) => state.order.newOrder,
  newOrderRequestSelect: (state: { order: OrderState }) =>
    state.order.newOrderRequest,
  currentOrderSelect: (state: { order: OrderState }) =>
    state.order.currentOrder,
  currentOrderLoadingSelect: (state: { order: OrderState }) =>
    state.order.currentOrderLoading,
  orderIsLoadingSelect: (state: { order: OrderState }) =>
    state.order.requestStatus === 'loading'
};

export default orderSlice.reducer;
