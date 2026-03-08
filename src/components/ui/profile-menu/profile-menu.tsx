import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './profile-menu.module.css';
import { NavLink } from 'react-router-dom';
import { ProfileMenuUIProps } from './type';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'text text_type_main-medium text_color_inactive pt-4 pb-4',
    styles.link,
    { [styles.link_active]: isActive }
  );

export const ProfileMenuUI: FC<ProfileMenuUIProps> = ({
  pathname,
  handleLogout
}) => (
  <>
    <NavLink to={'/profile'} className={navLinkClass} end>
      Профиль
    </NavLink>
    <NavLink to={'/profile/orders'} className={navLinkClass}>
      История заказов
    </NavLink>
    <button
      className={`text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.button}`}
      onClick={handleLogout}
    >
      Выход
    </button>
    <p className='pt-20 text text_type_main-default text_color_inactive'>
      {pathname === '/profile'
        ? 'В этом разделе вы можете изменить свои персональные данные'
        : 'В этом разделе вы можете просмотреть свою историю заказов'}
    </p>
  </>
);
