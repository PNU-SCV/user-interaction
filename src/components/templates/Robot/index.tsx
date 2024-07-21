import { Fragment, useCallback } from 'react';
import { ROUTER_PATH } from '@/router';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RoutingButtons } from '@components/molecules/RoutingButtons';
import { Header } from '@components/molecules/Header';
import { ScheduleTimeTable } from '@components/molecules/ScheduleTimeTable';

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return (
    <Fragment>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <Fragment>
          <ScheduleTimeTable time="AM" />
          <RoutingButtons onClickTemplate={navigateTo} />
        </Fragment>
      ) : (
        <Outlet />
      )}
    </Fragment>
  );
};
