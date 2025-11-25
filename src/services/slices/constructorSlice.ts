import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { RootState } from '../store';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<{ ingredient: TConstructorIngredient }>
      ) => {
        const { ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: ({ ingredient }: { ingredient: TIngredient }) => {
        const uuid = crypto.randomUUID();
        return {
          payload: {
            ingredient: {
              ...ingredient,
              id: uuid
            } as TConstructorIngredient
          }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<{ id: string }>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload.id
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [movedIngredient] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedIngredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const constructorActions = constructorSlice.actions;

export const constructorSelectors = {
  constructorBurgerElement: (state: RootState) => state.burgerConstructor,
  constructorBurgerIsBun: (state: RootState) => state.burgerConstructor.bun,
  constructorBurgerIsIngredients: (state: RootState) =>
    state.burgerConstructor.ingredients
};

export default constructorSlice.reducer;
