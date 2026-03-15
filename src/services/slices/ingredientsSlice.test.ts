import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import type { TIngredient } from '@utils-types';

const testIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredientsSlice', () => {
  it('должен устанавливать isLoading в true при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать ингредиенты и устанавливать isLoading в false при fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(testIngredients, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(testIngredients);
  });

  it('должен записывать ошибку и устанавливать isLoading в false при fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(new Error('Ошибка'), '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
