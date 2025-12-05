import reducer from './ingredientsSlice';
import { fetchIngredients } from '../thunks/ingredientsThunk';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    requestStatus: 'idle' as const
  };

  it('should return initial state', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('async actions handling', () => {
    it('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        ingredients: [],
        requestStatus: 'loading'
      });
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        ingredients: mockIngredients,
        requestStatus: 'succeeded'
      });
    });

    it('should handle fetchIngredients.rejected', () => {
      const action = { type: fetchIngredients.rejected.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        ingredients: [],
        requestStatus: 'failed'
      });
    });
  });
});