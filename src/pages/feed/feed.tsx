import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/thunks/feedsThunk';
import { feedsSelectors } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  // const orders: TOrder[] = [];
  const dispatch = useDispatch();
  const feed = useSelector(feedsSelectors.feedSelect);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (!feed) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feed.orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
