import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { constructorSelectors } from '../../services/slices/constructorSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSelectors } from '../../services/slices/userSlice';
import { orderSelectors, orderActions } from '../../services/slices/orderSlice';
import { createOrder } from '../../services/thunks/orderThunk';
import { useEffect } from 'react';
import { constructorActions } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  // const constructorItems = {
  //   bun: {
  //     price: 0
  //   },
  //   ingredients: []
  // };
  const constructorItems = useSelector(
    constructorSelectors.constructorBurgerElement
  );
  // TODO: позже добавить orderRequest и orderModalData из стора
  // debugger;

  const orderRequest = useSelector(orderSelectors.newOrderRequestSelect);
  const orderModalData = useSelector(orderSelectors.newOrderSelect);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(userSelectors.userSelect);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    // Собираем массив ID ингредиентов: булка + начинки + булка
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(orderActions.clearNewOrder());
  };

  // Очистка конструктора после успешного создания заказа
  useEffect(() => {
    if (orderModalData) {
      dispatch(constructorActions.clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) || 0), // ← добавил проверку на существование ingredients
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
