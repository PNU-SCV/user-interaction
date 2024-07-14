import { useCallback } from 'react';
import { ROUTER_PATH } from './router';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SimpleButtons } from '@components/molecules/SimpleButtons';

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return location.pathname === defaultRobotPath ? (
    <SimpleButtons onClickTemplate={navigateTo} />
  ) : (
    <Outlet />
  );
};
