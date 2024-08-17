import { ROUTER_PATH } from '@/router';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from '@components/molecules/Header';
import {
  calcTimeSlotByTimeAndIndex,
  DateString,
  isScheduleTime,
  ScheduleTime,
  scheduleTimes,
} from '@components/molecules/ScheduleTimeTable';

import styles from './index.module.css';
import { MainContainer } from '@components/atoms/MainContainer';
import { ScheduleReservation } from '@components/organisms/ScheduleReservation';
import { Fragment, useEffect } from 'react';

const formatDateToMMDDYY = (date: Date): DateString => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}` as DateString;
};

const getElementsByScheduleTime = (time: ScheduleTime) => {
  const container: HTMLElement = document.querySelector(`.${styles['scroll-container']}`);
  const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.${styles['scroll-item']}`,
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

export const Robot = () => {
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const date: DateString = formatDateToMMDDYY(new Date());
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
        <div className={styles['scroll-container']}>
          {scheduleTimes.map((time) => (
            <div key={`${date} ${time}`} className={styles['scroll-item']}>
              <ScheduleReservation time={time} date={date} />
            </div>
          ))}
        </div>
      ) : location?.state ? (
        (() => {
          const { date: stateDate, time: stateTime, start = null, end = null } = location.state;
          const [timeSlotStart, timeSlotEnd] = [start, end].map((index) =>
            calcTimeSlotByTimeAndIndex(stateTime, index),
          );

          return (
            <Fragment>
              <div>
                {stateDate} {stateTime} {timeSlotStart} ~ {timeSlotEnd}
              </div>
              <Outlet />
            </Fragment>
          );
        })()
      ) : (
        <Navigate to={defaultRobotPath} />
      )}
    </MainContainer>
  );
};
