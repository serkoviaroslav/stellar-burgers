import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from './burgerConstructorSlice';
import type { TConstructorIngredient } from '@utils-types';

const testBun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'uid-bun-1',
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
};

const testIngredient: TConstructorIngredient = {
  _id: 'main-1',
  id: 'uid-main-1',
  name: 'Говяжий метеорит',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: '',
  image_large: '',
  image_mobile: ''
};

const testIngredient2: TConstructorIngredient = {
  _id: 'sauce-1',
  id: 'uid-sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerConstructorSlice', () => {
  describe('addIngredient', () => {
    it('должен добавлять булку в конструктор', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(testBun)
      );
      expect(state.bun).toEqual(testBun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавлять начинку в конструктор', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(testIngredient)
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(testIngredient);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [testIngredient, testIngredient2]
      };
      const state = burgerConstructorReducer(
        stateWithIngredient,
        removeIngredient('uid-main-1')
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('uid-sauce-1');
    });
  });

  describe('moveIngredient', () => {
    it('должен менять порядок ингредиентов', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [testIngredient, testIngredient2]
      };
      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );
      expect(state.ingredients[0].id).toBe('uid-sauce-1');
      expect(state.ingredients[1].id).toBe('uid-main-1');
    });

    it('не должен менять порядок при одинаковых индексах', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [testIngredient, testIngredient2]
      };
      const state = burgerConstructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 0 })
      );
      expect(state.ingredients[0].id).toBe('uid-main-1');
      expect(state.ingredients[1].id).toBe('uid-sauce-1');
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      const stateWithItems = {
        bun: testBun,
        ingredients: [testIngredient]
      };
      const state = burgerConstructorReducer(
        stateWithItems,
        clearConstructor()
      );
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
