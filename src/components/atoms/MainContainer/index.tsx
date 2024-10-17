import styles from './index.module.css';
import React, { Fragment, ReactElement, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { usePlaceContext } from '@/context/PlaceContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Point } from '@/commons/types';
import { useRobotTasks } from '@/context/RobotTasksContext';
import { baseUrl } from '@/commons/constants';
import { useConnectionCnt } from '@/context/ConnectionCntContext';

export const MainContainer = ({ children }: { children: ReactElement }) => {
  const { place } = usePlaceContext();
  const { setRobotTasks } = useRobotTasks();
  const { setActiveConnections } = useConnectionCnt();
  const isWebSocketConnectedRef = useRef<boolean>(false);
  const setConnected = () => (isWebSocketConnectedRef.current = true);
  const setDisconnected = () => (isWebSocketConnectedRef.current = false);
  const onmessage = (e) => {
    const msg = e.data;
    if (msg.includes('$')) {
      const [givenPlace, cnt] = msg.split('$');
      if (place === givenPlace) {
        setActiveConnections(cnt);
      }
      return;
    }

    if (msg.includes('@')) {
      const tasks = JSON.parse(msg.slice(1));
      setRobotTasks(tasks);
      return;
    }
    const [robotId, dests_str] = msg.split(';');
    const dests: Point[] = JSON.parse(dests_str);
    setRobotTasks((prev) => {
      const copy = { ...prev };
      copy[robotId] = dests;
      return copy;
    });
  };
  useWebSocket(`ws://${baseUrl}:8000/tasks/${place}`, onmessage, setConnected, setDisconnected);
  return (
    <Fragment>
      <div className={styles.container}>{children}</div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        theme="light"
        closeButton={false}
      />
    </Fragment>
  );
};
