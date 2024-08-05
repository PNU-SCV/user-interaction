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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}` as DateString;
};

const getScheduleOrderWithDate = (): { times: ScheduleTime[]; dates: DateString[] } => {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);

  const isAM = currentDate.getHours() < 12;
  const times: ScheduleTime[] = isAM ? ['AM', 'PM'] : ['PM', 'AM'];
  const dates: DateString[] = isAM
    ? [formatDateToYYYYMMDD(currentDate), formatDateToYYYYMMDD(currentDate)]
    : [formatDateToYYYYMMDD(currentDate), formatDateToYYYYMMDD(nextDate)];

  return { times, dates };
};

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const { times, dates } = getScheduleOrderWithDate();

  return (
    <MainContainer>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <div className={styles['scroll-container']}>
          {times.map((time, idx) => (
            <Fragment key={`${dates[idx]} ${time}`}>
              <ScheduleTimeTable time={time} date={dates[idx]} className={styles['scroll-item']} />
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
