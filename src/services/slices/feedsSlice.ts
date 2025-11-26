import { createSlice } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '../../utils/types';
import { fetchFeed, fetchProfileOrders } from '../thunks/feedsThunk';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type FeedsState = {
  feed: TOrdersData | null;
  ordersAuth: TOrder[];
  requestStatus: RequestStatus;
};

const initialState: FeedsState = {
  feed: null,
  ordersAuth: [],
  requestStatus: 'idle'
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFeed
      .addCase(fetchFeed.pending, (state) => {
        state.requestStatus = 'loading';
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.requestStatus = 'failed';
      })
      // fetchProfileOrders
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.ordersAuth = action.payload;
      });
  }
});

export const feedsSelectors = {
  feedSelect: (state: { feeds: FeedsState }) => state.feeds.feed,
  feedOrdersSelect: (state: { feeds: FeedsState }) => state.feeds.ordersAuth,
  feedIsLoadingSelect: (state: { feeds: FeedsState }) =>
    state.feeds.requestStatus === 'loading'
};

export default feedsSlice.reducer;
