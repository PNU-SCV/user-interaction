import { Fragment, useCallback } from 'react';
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

const formatDateToYYYYMMDD = (date: Date): DateString => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}` as DateString;
};

const getScheduleOrderWithDate = (): { times: ScheduleTime[]; date: DateString } => {
  const currentDate = new Date();

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
            <Fragment key={`${date} ${time}`}>
              <ScheduleTimeTable time={time} date={date} className={styles['scroll-item']} />
            </Fragment>
          ))}
          <RoutingButtons
            onClickTemplate={navigateTo}
            container="div"
            containerClassName={styles['scroll-item']}
          />
        </div>
      ) : (
        <Outlet />
      )}
    </MainContainer>
  );
};
