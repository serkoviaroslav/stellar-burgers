import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  clearCurrentOrder,
  fetchOrderByNumber,
  selectCurrentOrder,
  selectFeedOrders,
  selectProfileOrders
} from '../../services/slices/feedsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const ingredients = useSelector(selectIngredients);
  const currentOrder = useSelector(selectCurrentOrder);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);

  const orderNumber = Number(number);

  useEffect(() => {
    if (!Number.isNaN(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderNumber]);

  const orderData =
    currentOrder ||
    profileOrders.find((item) => item.number === orderNumber) ||
    feedOrders.find((item) => item.number === orderNumber) ||
    null;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
