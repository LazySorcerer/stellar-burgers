import { rootReducer } from './store';

describe('rootReducer', () => {
  it('should return initial state when called with undefined state and unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(undefined, action);
    
    // Проверяем структуру начального состояния
    expect(result).toEqual({
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      user: expect.any(Object),
      order: expect.any(Object),
      feeds: expect.any(Object)
    });

    // Проверяем конкретные начальные состояния
    expect(result.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
    
    // Можно добавить проверки для других слайсов
    expect(result.ingredients).toEqual(expect.objectContaining({
      ingredients: [],
      requestStatus: 'idle'
    }));
  });
});