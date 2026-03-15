import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      auth: {
        user: null,
        authRequest: false,
        isAuthChecked: false,
        error: null
      },
      feeds: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        profileOrders: [],
        currentOrder: null,
        isLoading: false,
        error: null
      }
    });
  });
});