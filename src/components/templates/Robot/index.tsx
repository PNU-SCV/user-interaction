import { Fragment, useCallback } from 'react';
import { ROUTER_PATH } from '@/router';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SimpleButtons } from '@components/molecules/SimpleButtons';
import { Header } from '@components/molecules/Header';

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return (
    <Fragment>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <SimpleButtons onClickTemplate={navigateTo} />
      ) : (
        <Outlet />
      )}
    </Fragment>
  );
};
