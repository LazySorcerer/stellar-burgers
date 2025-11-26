import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
// import { constructorSelectors } from '../../services/slices/constructorSlice';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const ingredients = useSelector(ingredientsSelectors.ingredientsSelect);
  // const constructorItems = useSelector(constructorSelectors.constructorBurgerElement);

  // Функция для подсчета количества каждого ингредиента
  // const getIngredientCount = (ingredientId: string, ingredientType: string) => {
  //   let count = 0;

  //   // Для булок не показываем счетчик
  //   if (ingredientType === 'bun') {
  //     return constructorItems.bun && constructorItems.bun._id === ingredientId ? 0 : 0;
  //   }

  //   // Считаем начинки и соусы
  //   count += constructorItems.ingredients.filter(
  //     (item) => item._id === ingredientId
  //   ).length;

  //   return count;
  // };

  // Фильтруем ингредиенты по типам
  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');
  // const buns = [];
  // const mains = [];
  // const sauces = [];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //return null;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      // ingredientsCounters={getIngredientCount}
    />
  );
};
