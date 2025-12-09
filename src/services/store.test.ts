import { rootReducer } from './store';

describe('rootReducer', () => {
  it('should return initial state when called with undefined state and unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(undefined, action);
    
    // Проверяем конкретные начальные состояния
    expect(result).toEqual({
      ingredients: {
        ingredients: [],
        requestStatus: 'idle'
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        userCheck: false,
        requestStatus: 'idle'
      },
      order: {
        newOrder: null,
        newOrderRequest: false,
        currentOrder: null,
        currentOrderLoading: false,
        requestStatus: 'idle'
      },
      feeds: {
        feed: null,
        ordersAuth: [],
        requestStatus: 'idle'
      }
    });
  });
});