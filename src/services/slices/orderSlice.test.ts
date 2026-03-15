import orderReducer, {
  createOrder,
  clearOrder,
  initialState
} from './orderSlice';
import type { TOrder } from '@utils-types';

const testOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: []
};

describe('orderSlice', () => {
  it('должен устанавливать orderRequest в true при createOrder.pending', () => {
    const state = orderReducer(initialState, createOrder.pending('', []));
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orderModalData).toBeNull();
  });

  it('должен записывать заказ и устанавливать orderRequest в false при createOrder.fulfilled', () => {
    const state = orderReducer(
      { ...initialState, orderRequest: true },
      createOrder.fulfilled(testOrder, '', [])
    );
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(testOrder);
  });

  it('должен записывать ошибку и устанавливать orderRequest в false при createOrder.rejected', () => {
    const state = orderReducer(
      { ...initialState, orderRequest: true },
      createOrder.rejected(new Error('Ошибка оформления'), '', [])
    );
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка оформления');
  });

  it('должен очищать данные заказа при clearOrder', () => {
    const stateWithOrder = { ...initialState, orderModalData: testOrder };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
