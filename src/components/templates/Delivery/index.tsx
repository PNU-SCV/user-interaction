import { Navigate, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { ROUTER_PATH } from '@/router';

export const Delivery = () => {
  const location = useLocation();
  if (!location?.state) {
    return <Navigate to={ROUTER_PATH.ROOT} />;
  }

  const { date, time, start, end } = location.state;

  return (
    <Fragment>
      <div>delivery</div>
      <div>
        {date} {time} {start} {end}
      </div>
    </Fragment>
  );
};
