import { ROUTER_PATH } from '@/router';
import { Navigate, useLocation } from 'react-router-dom';
import { Header } from '@components/molecules/Header';
import { MainContainer } from '@components/atoms/MainContainer';
import React from 'react';
import { Point } from '@/commons/types';
import { RobotTaskActionForm } from '@components/organisms/RobotTaskActionForm';
import { RobotTaskTimeViewer } from '@components/templates/RobotTaskTimeViewer';

export interface IRobot {
  id: string;
  label: string;
  pos: Point;
  path: string;
  state: string;
  idle: number;
}

export const Robot = () => {
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return (
    <MainContainer>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <RobotTaskTimeViewer />
      ) : location?.state ? (
        <RobotTaskActionForm {...location.state} />
      ) : (
        <Navigate to={defaultRobotPath} />
      )}
    </MainContainer>
  );
};
