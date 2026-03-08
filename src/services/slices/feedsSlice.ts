import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';

type TFeedsState = {
  feed: TOrdersData;
  profileOrders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  profileOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message?: string }).message || 'Ошибка загрузки заказов';
  }

  return 'Ошибка загрузки заказов';
};

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feeds/fetchFeeds',
  async () => {
    const data = await getFeedsApi();

    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  }
);

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'feeds/fetchProfileOrders',
  async () => getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk<TOrder | null, number>(
  'feeds/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);

    return data.orders[0] || null;
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.error);
      })

      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.error);
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.error);
      });
  }
});

export const { clearCurrentOrder } = feedsSlice.actions;

export const selectFeed = (state: RootState) => state.feeds.feed;
export const selectFeedOrders = (state: RootState) => state.feeds.feed.orders;
export const selectProfileOrders = (state: RootState) =>
  state.feeds.profileOrders;
export const selectCurrentOrder = (state: RootState) =>
  state.feeds.currentOrder;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
export const selectFeedsError = (state: RootState) => state.feeds.error;

export default feedsSlice.reducer;
