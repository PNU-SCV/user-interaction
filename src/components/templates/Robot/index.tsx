import { Fragment, useCallback } from 'react';
import { ROUTER_PATH } from '@/router';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RoutingButtons } from '@components/molecules/RoutingButtons';
import { Header } from '@components/molecules/Header';
import { ScheduleTime, ScheduleTimeTable } from '@components/molecules/ScheduleTimeTable';

import styles from './index.module.css';

const getScheduleOrder = () => {
  const currentHour = new Date().getHours();
  return currentHour < 12 ? ['AM', 'PM'] : ['PM', 'AM'];
};

export const Robot = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);
  const location = useLocation();
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;
  const [firstSchedule, secondSchedule]: ScheduleTime[] = getScheduleOrder();

  return (
    <Fragment>
      <Header />
      {location.pathname === defaultRobotPath ? (
        <div className={styles['scroll-container']}>
          <ScheduleTimeTable time={firstSchedule} className={styles['scroll-item']} />
          <ScheduleTimeTable time={secondSchedule} className={styles['scroll-item']} />
          <RoutingButtons
            onClickTemplate={navigateTo}
            container="div"
            containerClassName={styles['scroll-item']}
          />
        </div>
      ) : (
        <Outlet />
      )}
    </Fragment>
  );
};
