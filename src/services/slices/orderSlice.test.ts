import reducer, { orderActions } from './orderSlice';
import { createOrder, fetchOrderByNumber } from '../thunks/orderThunk';
import { TOrder } from '../../utils/types';

const mockNewOrder: TOrder = {
  _id: 'order123',
  status: 'created',
  name: 'Space Burger',
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
  number: 12345,
  ingredients: ['bun1', 'main1', 'sauce1']
};

const mockCurrentOrder: TOrder = {
  _id: 'order456',
  status: 'done',
  name: 'Completed Burger',
  createdAt: '2024-01-02T12:00:00Z',
  updatedAt: '2024-01-02T12:30:00Z',
  number: 67890,
  ingredients: ['bun2', 'main2']
};

describe('order slice', () => {
  const initialState = {
    newOrder: null,
    newOrderRequest: false,
    currentOrder: null,
    currentOrderLoading: false,
    requestStatus: 'idle' as const
  };

  it('should return initial state', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('should handle clearNewOrder', () => {
      const stateWithOrder = {
        ...initialState,
        newOrder: mockNewOrder,
        requestStatus: 'succeeded' as const
      };
      
      const result = reducer(stateWithOrder, orderActions.clearNewOrder());
      
      expect(result.newOrder).toBeNull();
      expect(result.requestStatus).toBe('succeeded'); // Другие поля не меняются
    });

    it('should handle clearCurrentOrder', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockCurrentOrder,
        currentOrderLoading: false
      };
      
      const result = reducer(stateWithOrder, orderActions.clearCurrentOrder());
      
      expect(result.currentOrder).toBeNull();
      expect(result.currentOrderLoading).toBe(false);
    });
  });

  describe('createOrder actions', () => {
    it('should handle createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        newOrder: null,
        newOrderRequest: true,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'loading'
      });
    });

    it('should handle createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockNewOrder
      };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        newOrder: mockNewOrder,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'succeeded'
      });
    });

    it('should handle createOrder.rejected', () => {
      const pendingState = {
        ...initialState,
        newOrderRequest: true,
        requestStatus: 'loading' as const
      };
      
      const action = { type: createOrder.rejected.type };
      const result = reducer(pendingState, action);
      
      expect(result).toEqual({
        newOrder: null,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'failed'
      });
    });
  });

  describe('fetchOrderByNumber actions', () => {
    it('should handle fetchOrderByNumber.pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        newOrder: null,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: true,
        requestStatus: 'idle'
      });
    });

    it('should handle fetchOrderByNumber.fulfilled', () => {
      const pendingState = {
        ...initialState,
        currentOrderLoading: true
      };
      
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockCurrentOrder
      };
      const result = reducer(pendingState, action);
      
      expect(result).toEqual({
        newOrder: null,
        newOrderRequest: false,
        currentOrder: mockCurrentOrder,
        currentOrderLoading: false,
        requestStatus: 'idle'
      });
    });

    it('should handle fetchOrderByNumber.rejected', () => {
      const pendingState = {
        ...initialState,
        currentOrderLoading: true
      };
      
      const action = { type: fetchOrderByNumber.rejected.type };
      const result = reducer(pendingState, action);
      
      expect(result).toEqual({
        newOrder: null,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'idle'
      });
    });
  });
});