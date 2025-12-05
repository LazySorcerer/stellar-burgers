import reducer from './feedsSlice';
import { fetchFeed, fetchProfileOrders } from '../thunks/feedsThunk';
import { TOrdersData, TOrder } from '../../utils/types';

const mockFeedData: TOrdersData = {
  orders: [
    {
      _id: 'order1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T12:30:00Z',
      number: 1,
      ingredients: ['ing1', 'ing2']
    }
  ],
  total: 100,
  totalToday: 10
};

const mockProfileOrders: TOrder[] = [
  {
    _id: 'profileOrder1',
    status: 'pending',
    name: 'Profile Order 1',
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-02T12:30:00Z',
    number: 2,
    ingredients: ['ing3', 'ing4']
  }
];

describe('feeds slice', () => {
  const initialState = {
    feed: null,
    ordersAuth: [],
    requestStatus: 'idle' as const
  };

  it('should return initial state', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('fetchFeed actions', () => {
    it('should handle fetchFeed.pending', () => {
      const action = { type: fetchFeed.pending.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        feed: null,
        ordersAuth: [],
        requestStatus: 'loading'
      });
    });

    it('should handle fetchFeed.fulfilled', () => {
      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeedData
      };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        feed: mockFeedData,
        ordersAuth: [],
        requestStatus: 'succeeded'
      });
    });

    it('should handle fetchFeed.rejected', () => {
      const action = { type: fetchFeed.rejected.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        feed: null,
        ordersAuth: [],
        requestStatus: 'failed'
      });
    });
  });

  describe('fetchProfileOrders actions', () => {
    it('should handle fetchProfileOrders.fulfilled', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockProfileOrders
      };
      
      // Начальное состояние
      const stateWithFeed = {
        ...initialState,
        feed: mockFeedData,
        requestStatus: 'succeeded' as const
      };
      
      const result = reducer(stateWithFeed, action);
      
      expect(result).toEqual({
        feed: mockFeedData,
        ordersAuth: mockProfileOrders,
        requestStatus: 'succeeded'
      });
    });

    it('should replace existing profile orders', () => {
      const existingOrders: TOrder[] = [{
        _id: 'oldOrder',
        status: 'done',
        name: 'Old Order',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:30:00Z',
        number: 99,
        ingredients: ['ing99']
      }];
      
      const stateWithExistingOrders = {
        ...initialState,
        ordersAuth: existingOrders
      };
      
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockProfileOrders
      };
      
      const result = reducer(stateWithExistingOrders, action);
      
      expect(result.ordersAuth).toEqual(mockProfileOrders);
      expect(result.ordersAuth).not.toContain(existingOrders[0]);
    });
  });
});