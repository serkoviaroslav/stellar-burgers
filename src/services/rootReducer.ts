import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice';
import feedsReducer from './slices/feedsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  auth: authReducer,
  feeds: feedsReducer
});
