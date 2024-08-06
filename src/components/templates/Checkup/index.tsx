import { Navigate, useLocation } from 'react-router-dom';
import { ROUTER_PATH } from '@/router';
import { Fragment } from 'react';

export const Checkup = () => {
  const location = useLocation();
  if (!location?.state) {
    return <Navigate to={ROUTER_PATH.ROOT} />;
  }

  const { date, time, start, end } = location.state;

  return (
    <Fragment>
      <div>checkup</div>
      <div>
        {date} {time} {start} {end}
      </div>
    </Fragment>
  );
};
