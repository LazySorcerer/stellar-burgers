import reducer, { constructorActions,  } from './constructorSlice';
import { TIngredient, TConstructorState } from '../../utils/types';

// Моковые данные для тестов
const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Флюоресцентная булка',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png'
};

describe('constructor slice', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('addIngredient action', () => {
    it('should add bun to bun field', () => {
      // Mock crypto.randomUUID для предсказуемости теста
      const mockUUID = 'test-uuid-123';
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUID)
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      const action = constructorActions.addIngredient({ ingredient: mockBun });
      const result = reducer(initialState, action);

      expect(result.bun).toEqual({
        ...mockBun,
        id: mockUUID
      });
      expect(result.ingredients).toHaveLength(0);
      expect(crypto.randomUUID).toHaveBeenCalled();
    });

    it('should add non-bun ingredient to ingredients array', () => {
      const mockUUID = 'test-uuid-456';
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUID)
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      const action = constructorActions.addIngredient({ ingredient: mockMain });
      const result = reducer(initialState, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockMain,
        id: mockUUID
      });
    });

    it('should add multiple non-bun ingredients', () => {
      const mockUUID1 = 'test-uuid-1';
      const mockUUID2 = 'test-uuid-2';
      let callCount = 0;
      
      const mockCrypto = {
        randomUUID: jest.fn(() => {
          callCount++;
          return callCount === 1 ? mockUUID1 : mockUUID2;
        })
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = reducer(initialState, 
        constructorActions.addIngredient({ ingredient: mockMain })
      );
      state = reducer(state, 
        constructorActions.addIngredient({ ingredient: mockSauce })
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe(mockUUID1);
      expect(state.ingredients[1].id).toBe(mockUUID2);
      expect(state.ingredients[0].name).toBe(mockMain.name);
      expect(state.ingredients[1].name).toBe(mockSauce.name);
    });
  });

  describe('removeIngredient action', () => {
    it('should remove ingredient by id', () => {
      const mockUUID1 = 'test-uuid-1';
      const mockUUID2 = 'test-uuid-2';
      const mockUUID3 = 'test-uuid-3';
      
      const mockCrypto = {
        randomUUID: jest.fn()
          .mockReturnValueOnce(mockUUID1)
          .mockReturnValueOnce(mockUUID2)
          .mockReturnValueOnce(mockUUID3)
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = reducer(initialState, 
        constructorActions.addIngredient({ ingredient: mockMain })
      );
      state = reducer(state, 
        constructorActions.addIngredient({ ingredient: mockSauce })
      );
      state = reducer(state, 
        constructorActions.addIngredient({ ingredient: mockMain })
      );

      expect(state.ingredients).toHaveLength(3);

      // Удаляем второй элемент
      state = reducer(state, 
        constructorActions.removeIngredient({ id: mockUUID2 })
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe(mockUUID1);
      expect(state.ingredients[1].id).toBe(mockUUID3);
      expect(state.ingredients.some(ing => ing.id === mockUUID2)).toBe(false);
    });

    it('should not modify state if id not found', () => {
      const mockUUID = 'test-uuid-1';
      
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUID)
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = reducer(initialState, 
        constructorActions.addIngredient({ ingredient: mockMain })
      );
      const stateBefore = { ...state };

      state = reducer(state, 
        constructorActions.removeIngredient({ id: 'non-existent-id' })
      );

      expect(state).toEqual(stateBefore);
    });
  });

  describe('moveIngredient action', () => {
    it('should move ingredient from one position to another', () => {
      const mockUUIDs = ['id1', 'id2', 'id3', 'id4'];
      let uuidIndex = 0;
      
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUIDs[uuidIndex++])
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = initialState;
      
      // Добавляем 4 ингредиента
      [mockMain, mockSauce, mockMain, mockSauce].forEach(ingredient => {
        state = reducer(state, 
          constructorActions.addIngredient({ ingredient })
        );
      });

      expect(state.ingredients.map(ing => ing.id)).toEqual(mockUUIDs);

      // Перемещаем элемент с индекса 1 на индекс 3
      state = reducer(state, 
        constructorActions.moveIngredient({ from: 1, to: 3 })
      );

      // Проверяем новый порядок: [id1, id3, id4, id2]
      expect(state.ingredients.map(ing => ing.id)).toEqual([
        mockUUIDs[0], // id1
        mockUUIDs[2], // id3 (был на позиции 2, стал на 1)
        mockUUIDs[3], // id4 (был на позиции 3, стал на 2)
        mockUUIDs[1]  // id2 (был на позиции 1, стал на 3)
      ]);
    });

    it('should handle moving to same position', () => {
      const mockUUIDs = ['id1', 'id2', 'id3'];
      let uuidIndex = 0;
      
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUIDs[uuidIndex++])
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = initialState;
      
      [mockMain, mockSauce, mockMain].forEach(ingredient => {
        state = reducer(state, 
          constructorActions.addIngredient({ ingredient })
        );
      });

      const stateBefore = { ...state };

      // Перемещаем элемент с индекса 1 на индекс 1 (ничего не должно измениться)
      state = reducer(state, 
        constructorActions.moveIngredient({ from: 1, to: 1 })
      );

      expect(state).toEqual(stateBefore);
    });
  });

  describe('clearConstructor action', () => {
    it('should clear bun and ingredients', () => {
      const mockUUID = 'test-uuid';
      
      const mockCrypto = {
        randomUUID: jest.fn(() => mockUUID)
      };
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
      });

      let state = reducer(initialState, 
        constructorActions.addIngredient({ ingredient: mockBun })
      );
      state = reducer(state, 
        constructorActions.addIngredient({ ingredient: mockMain })
      );
      state = reducer(state, 
        constructorActions.addIngredient({ ingredient: mockSauce })
      );

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      state = reducer(state, constructorActions.clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state).toEqual(initialState);
    });
  });
});