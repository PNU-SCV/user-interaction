import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Robot } from '@components/pages/Robot';
import React from 'react';
import { Index } from '@components/pages/Index';
import { Delivery } from '@components/templates/Delivery';
import { Checkup } from '@components/templates/Checkup';

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
  { id: 2, label: '간단 문진', path: ROUTER_PATH.CHECKUP },
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
          // { path: ROUTER_PATH.DELIVERY, element: <Delivery /> },
          { path: ROUTER_PATH.CHECKUP, element: <Checkup /> },
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
