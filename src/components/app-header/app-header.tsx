import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';

// export const AppHeader: FC = () => <AppHeaderUI userName='' />;
export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector(userSelectors.userSelect);

  return <AppHeaderUI userName={user?.name || ''} />;
};
