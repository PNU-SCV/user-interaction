import { ROUTER_PATH } from '@/router';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@components/molecules/Header';
import { DateString, ScheduleTime } from '@components/molecules/ScheduleTimeTable';

import styles from './index.module.css';
import { MainContainer } from '@components/atoms/MainContainer';
import { ScheduleReservation } from '@components/organisms/ScheduleReservation';

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
              <ScheduleReservation time={time} date={date} />
            </div>
          ))}
        </div>
      ) : (
        <Outlet />
      )}
    </MainContainer>
  );
};
