import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector(userSelectors.userSelect);
  const isAuthChecked = useSelector(userSelectors.isAuthCheckedSelect);
  const location = useLocation();

  // Пока проверяем авторизацию, не рендерим ничего
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && user) {
    // Перенаправляем на главную или на страницу, откуда пришли
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Если маршрут защищенный, а пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Все проверки пройдены, рендерим children
  return children;
};

export default ProtectedRoute;
