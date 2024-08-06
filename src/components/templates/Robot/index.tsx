import { Fragment, ReactElement, useCallback } from 'react';
import { ROUTER_PATH } from '@/router';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RoutingButtons } from '@components/molecules/RoutingButtons';
import { Header } from '@components/molecules/Header';
import {
  DateString,
  ScheduleTime,
  ScheduleTimeTable,
} from '@components/molecules/ScheduleTimeTable';

import styles from './index.module.css';
import { MainContainer } from '@components/atoms/MainContainer';
import { Flex } from '@components/atoms/Flex';

const formatDateToYYYYMMDD = (date: Date): DateString => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}` as DateString;
};

const getScheduleOrderWithDate = (): { times: ScheduleTime[]; date: DateString } => {
  const currentDate = new Date();
  // TODO: 나중에 명칭 제대로 수정
  const times: ScheduleTime[] = ['Morning', 'Afternoon', 'Night'];
  const date: DateString = formatDateToYYYYMMDD(currentDate);

  return { times, date };
};

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const { times, date } = getScheduleOrderWithDate();

  return (
    <MainContainer>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <div className={styles['scroll-container']}>
          {times.map((time) => (
            <div key={`${date} ${time}`} className={styles['scroll-item']}>
              <ScheduleTimeTable time={time} date={date} />
              <RoutingButtons onClickTemplate={navigateTo} container={Flex} />
            </div>
          ))}
        </div>
      ) : (
        <Outlet />
      )}
    </MainContainer>
  );
};
