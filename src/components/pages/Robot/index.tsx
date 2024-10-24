import { ROUTER_PATH } from '@/router';
import { Navigate, useLocation } from 'react-router-dom';
import { Header } from '@components/molecules/Header';
import { MainContainer } from '@components/atoms/MainContainer';
import React from 'react';
import { Point } from '@/commons/types';
import { RobotTaskActionForm } from '@components/organisms/RobotTaskActionForm';
import { RobotTaskTimeViewer } from '@components/templates/RobotTaskTimeViewer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createQueryKeyWithPlace, fetchRobotsByMap } from '@components/pages/Index';
import { usePlaceContext } from '@/context/PlaceContext';
import { AsyncBoundary } from '@components/atoms/AsyncBoundary';

export interface IRobot {
  id: string;
  label: string;
  pos: Point;
  path: string;
  state: string;
  schedules: {
    cancel: boolean;
    command: number;
    dest: Point[];
    msg: string[];
    target: string;
    waitTime: number;
  }[];
}

export const Robot = () => {
  const location = useLocation();
  const { place } = usePlaceContext();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const { data } = useSuspenseQuery({
    queryKey: createQueryKeyWithPlace(place),
    queryFn: () => fetchRobotsByMap(place),
  });

  return (
    <MainContainer>
      <Header />
      <AsyncBoundary rejectedFallback={<div>에러</div>} pendingFallback={<div>로딩중</div>}>
        {location.pathname === defaultRobotPath ? (
          <RobotTaskTimeViewer data={data} />
        ) : location?.state ? (
          <RobotTaskActionForm {...location.state} />
        ) : (
          <Navigate to={defaultRobotPath} />
        )}
      </AsyncBoundary>
    </MainContainer>
  );
};
