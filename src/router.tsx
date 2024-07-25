import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Robot } from '@components/templates/Robot';
import React from 'react';
import { Index } from '@components/templates/Index';

export const ROUTER_PATH = Object.freeze({
  ROOT: '/',
  ROBOT: 'robot',
  PROMOTION: 'promotion',
  DELIVERY: 'delivery',
  ADVISOR: 'advisor',
  CHECKUP: 'checkup',
  SANITIZE: 'sanitize',
  NOT_FOUND: '*',
});

export const ROBOT_ROUTER_PATH_ARRAY = [
  { id: 0, label: '전광판', path: ROUTER_PATH.PROMOTION },
  { id: 1, label: '물품 배달', path: ROUTER_PATH.DELIVERY },
  { id: 2, label: '업무 보조', path: ROUTER_PATH.ADVISOR },
  { id: 3, label: '간단 문진', path: ROUTER_PATH.CHECKUP },
  { id: 4, label: '소독', path: ROUTER_PATH.SANITIZE },
];

const PrivateRoute = (): React.ReactElement => {
  const auth = true;
  return auth ? <Outlet /> : <Navigate to={ROUTER_PATH.ROOT} />;
};

export const router = createBrowserRouter([
  { index: true, path: ROUTER_PATH.ROOT, element: <Index /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTER_PATH.ROBOT,
        element: <Robot />,
        children: [
          { path: ROUTER_PATH.PROMOTION, element: <div>promotion</div> },
          { path: ROUTER_PATH.DELIVERY, element: <div>delivery</div> },
          { path: ROUTER_PATH.CHECKUP, element: <div>checkup</div> },
          { path: ROUTER_PATH.ADVISOR, element: <div>advisor</div> },
          { path: ROUTER_PATH.SANITIZE, element: <div>sanitize</div> },
          { path: '*', element: <div>404 ??</div> },
        ],
      },
    ],
  },
  // {
  //   path: '*',
  //   element: <Navigate to={ROUTER_PATH.ROOT} />,
  // },
]);