import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const DEFAULT_API_URL = 'https://norma.education-services.ru/api';
const URL = process.env.BURGER_API_URL || DEFAULT_API_URL;

const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    return Promise.reject({
      message: text || `HTTP ${res.status}`
    });
  }
};

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = await parseJson<T>(res);

  if (res.ok) {
    return data;
  }

  return Promise.reject(data);
};

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }

      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);

      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);

    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message?: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();

      if (options.headers) {
        (options.headers as Record<string, string>).authorization =
          refreshData.accessToken;
      }

      const res = await fetch(url, options);

      return await checkResponse<T>(res);
    }

    return Promise.reject(err);
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store'
    }
  })
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data.success) {
        return data.data;
      }

      return Promise.reject(data);
    });

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store'
    }
  })
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data.success) {
        return data;
      }

      return Promise.reject(data);
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data.success) {
      return data.orders;
    }

    return Promise.reject(data);
  });

type TOwner = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  owner: TOwner;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TNewOrderResponse = TServerResponse<{
  order: TNewOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((responseData) => {
    if (responseData.success) {
      return responseData;
    }

    return Promise.reject(responseData);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((responseData) => {
      if (responseData.success) {
        return responseData;
      }

      return Promise.reject(responseData);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((responseData) => {
      if (responseData.success) {
        return responseData;
      }

      return Promise.reject(responseData);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<Record<string, never>>>(res))
    .then((responseData) => {
      if (responseData.success) {
        return responseData;
      }

      return Promise.reject(responseData);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<Record<string, never>>>(res))
    .then((responseData) => {
      if (responseData.success) {
        return responseData;
      }

      return Promise.reject(responseData);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<Record<string, never>>>(res));
