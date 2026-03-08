import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TLoginData,
  type TRegisterData
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  authRequest: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  authRequest: false,
  isAuthChecked: false,
  error: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

const getErrorMessage = (err: unknown) => {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as { message?: string }).message;
    if (msg) {
      return msg;
    }
  }

  return 'Ошибка авторизации';
};

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'auth/registerUser',
  async (form) => {
    const data = await registerUserApi(form);

    saveTokens(data.accessToken, data.refreshToken);

    return data.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'auth/loginUser',
  async (form) => {
    const data = await loginUserApi(form);

    saveTokens(data.accessToken, data.refreshToken);

    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk<TUser | null>(
  'auth/checkUserAuth',
  async () => {
    const isAuth = Boolean(
      getCookie('accessToken') || localStorage.getItem('refreshToken')
    );

    if (!isAuth) {
      return null;
    }

    try {
      const data = await getUserApi();

      if (data?.success) {
        return data.user;
      }

      clearTokens();

      return null;
    } catch {
      clearTokens();

      return null;
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'auth/updateUser',
  async (payload) => {
    const data = await updateUserApi(payload);

    if (data?.success) {
      return data.user;
    }

    throw data;
  }
);

export const logoutUser = createAsyncThunk<void>(
  'auth/logoutUser',
  async () => {
    try {
      await logoutApi();
    } finally {
      clearTokens();
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.authRequest = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authRequest = false;
        state.error = getErrorMessage(action.error);
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.authRequest = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authRequest = false;
        state.error = getErrorMessage(action.error);
        state.isAuthChecked = true;
      })

      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.authRequest = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.authRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.authRequest = false;
        state.error = getErrorMessage(action.error);
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { clearAuthError } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthRequest = (state: RootState) => state.auth.authRequest;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;

export default authSlice.reducer;
