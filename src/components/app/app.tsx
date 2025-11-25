import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/thunks/ingredientsThunk';

import { AppHeader } from '@components';
import { ConstructorPage } from '@pages';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  // Загружаем ингредиенты при монтировании
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>
    </div>
  );
};

export default App;
