import authReducer, {
  loginUser,
  checkUserAuth,
  logoutUser,
  initialState
} from './authSlice';
import type { TUser } from '@utils-types';

const testUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('authSlice', () => {
  it('должен устанавливать authRequest в true при loginUser.pending', () => {
    const state = authReducer(
      initialState,
      loginUser.pending('', { email: '', password: '' })
    );
    expect(state.authRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать пользователя при loginUser.fulfilled', () => {
    const state = authReducer(
      { ...initialState, authRequest: true },
      loginUser.fulfilled(testUser, '', { email: '', password: '' })
    );
    expect(state.authRequest).toBe(false);
    expect(state.user).toEqual(testUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен записывать ошибку при loginUser.rejected', () => {
    const state = authReducer(
      { ...initialState, authRequest: true },
      loginUser.rejected(new Error('Неверный пароль'), '', {
        email: '',
        password: ''
      })
    );
    expect(state.authRequest).toBe(false);
    expect(state.error).toBe('Неверный пароль');
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен устанавливать isAuthChecked в true при checkUserAuth.fulfilled', () => {
    const state = authReducer(
      initialState,
      checkUserAuth.fulfilled(testUser, '')
    );
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(testUser);
  });

  it('должен очищать пользователя при logoutUser.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: testUser,
      isAuthChecked: true
    };
    const state = authReducer(
      stateWithUser,
      logoutUser.fulfilled(undefined, '')
    );
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });
});
