import { ROUTER_PATH } from '@/router';
import { Navigate, useLocation } from 'react-router-dom';
import { Header } from '@components/molecules/Header';
import {
  isScheduleTime,
  ScheduleTime,
  scheduleTimes,
} from '@components/molecules/ScheduleTimeTable';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';
import { MainContainer } from '@components/atoms/MainContainer';
import React, { useEffect } from 'react';
import { Point } from '@/commons/types';
import { RobotTaskActionForm } from '@components/organisms/RobotTaskActionForm';
import { RobotTaskTimeViewer } from '@components/templates/RobotTaskTimeViewer';

const getElementsByScheduleTime = (time: ScheduleTime) => {
  const container: HTMLElement = document.querySelector(
    `.${scrollContainerStyle['scroll-container']}`,
  );
  const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.${scrollItemStyle['scroll-item']}`,
  );
  const selectedTable: HTMLElement = scheduleTables[scheduleTimes.indexOf(time)];

  return { container, selectedTable };
};

const getScrollPosition = (container: HTMLElement, element: HTMLElement): number => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return elementRect.top - containerRect.top + container.scrollTop;
};

const scrollToElement = (container: HTMLElement, selectedTable: HTMLElement) => {
  container.scrollTo({
    top: getScrollPosition(container, selectedTable),
    behavior: 'smooth',
  });
};

export interface IRobot {
  id: string;
  label: string;
  pos: Point;
  path: string;
}

export const Robot = () => {
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const hasUserAlreadySelectedTime = (time: string | null): time is ScheduleTime => {
    return time !== null && isScheduleTime(time) && location.pathname === defaultRobotPath;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const time = searchParams.get('time');
    if (hasUserAlreadySelectedTime(time)) {
      const { container, selectedTable } = getElementsByScheduleTime(time);

      scrollToElement(container, selectedTable);
    }
  });

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
