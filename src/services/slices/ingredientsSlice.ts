import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { fetchIngredients } from '../thunks/ingredientsThunk';
import { RootState } from '../store';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type IngredientsState = {
  ingredients: TIngredient[];
  requestStatus: RequestStatus;
};

const initialState: IngredientsState = {
  ingredients: [],
  requestStatus: 'idle'
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.requestStatus = 'loading';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.requestStatus = 'failed';
      });
  }
});

export const ingredientsSelectors = {
  ingredientsSelect: (state: RootState) => state.ingredients.ingredients,
  ingredientsIsLoadingSelect: (state: RootState) =>
    state.ingredients.requestStatus === 'loading',
  ingredientByIdSelect: (state: RootState, id: string) =>
    state.ingredients.ingredients.find((ingredient) => ingredient._id === id)
};

export default ingredientsSlice.reducer;
