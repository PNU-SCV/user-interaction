import { Fragment, useEffect, useRef, useState } from 'react';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useLocation } from 'react-router-dom';
import { MapStateResp } from '@components/pages/Index';

import axios from 'axios';
import { baseUrl } from '@/router';
import { toast } from 'react-toastify';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDestPoints } from '@/context/DestPointsContext';
import { Point } from '@/commons/types';
import { CountdownModal } from '@components/molecules/CountdownModal';
import styles from './index.module.css';

export interface IDeliveryCommandMap {
  data: MapStateResp;
  maxH?: string;
}

export interface ModalState {
  msg: string;
  waitTime: number;
  open: boolean;
}

const defaultModal = {
  msg: '',
  waitTime: -1,
  open: false,
};

export const DeliveryCommandMap = ({ data, maxH }: IDeliveryCommandMap) => {
  const location = useLocation();
  const { rects, robots } = data;
  const selectedRobot = robots.filter((robot) => robot.id === location.state.id);
  const [modalState, setModalState] = useState<ModalState>(() => defaultModal);
  const { setDestPoints } = useDestPoints();

  const confirmToMoveNext = () => {
    axios
      .post(`http://${baseUrl}:8000/next`, {
        robotId: selectedRobot[0].id,
      })
      .then((r) => {
        if (r.data === 'ok') {
          setModalState(defaultModal);
        }
      });
  };
  const isWebSocketConnectedRef = useRef<boolean>(false);
  const setConnected = () => (isWebSocketConnectedRef.current = true);
  const setDisconnected = () => (isWebSocketConnectedRef.current = false);
  const onmessage = (e) => {
    const msg = e.data;
    if (msg.includes(';')) {
      const [announcement, destStr] = msg.split(';');
      const dest: Point[] = JSON.parse(destStr).map((point) => ({ x: 8 - point.x, y: point.y }));
      setDestPoints(dest);
      toast(announcement);
      return;
    }
    toast(msg);
  };
  useWebSocket(
    `ws://${baseUrl}:8000/user-notification/${location.state.id}`,
    onmessage,
    setConnected,
    setDisconnected,
  );

  // const setOverlayState = (state: string) => setModalState((prev) => (prev !== state ? state : ''));
  const setOverlayState = (state: ModalState) =>
    setModalState((prev) => (prev.msg !== state.msg ? state : defaultModal));

  const openModal = () => setModalState((prev) => ({ ...prev, open: true }));
  const closeModal = () => setModalState((prev) => ({ ...prev, open: false }));
  const decreaseWaitTime = () =>
    setModalState((prev) => ({ ...prev, waitTime: prev.waitTime - 1 }));

  useEffect(() => {
    if (!modalState.open && modalState.msg !== '' && modalState.waitTime > -1) {
      const timer = setInterval(() => {
        setModalState((prev) => ({ ...prev, waitTime: prev.waitTime - 1 }));
      }, 1000);
      if (modalState.waitTime === 0) {
        clearInterval(timer);
        confirmToMoveNext();
      }

      return () => clearInterval(timer);
    }
  }, [modalState]);

  return (
    <Fragment>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {modalState.open ? (
          <CountdownModal
            modalState={modalState}
            decreaseWaitTime={decreaseWaitTime}
            closeModal={closeModal}
            confirmToMoveNext={confirmToMoveNext}
          />
        ) : null}
        {modalState.msg !== '' ? (
          <button className={styles['next--confirm--button']} onClick={openModal}>
            대기중인 도착 확인창 열기
          </button>
        ) : null}
      </div>
      <SVGBitmap
        rects={rects}
        robots={selectedRobot}
        bitmapMode="COMMANDER"
        maxH={maxH}
        setOverlayState={setOverlayState}
      />
    </Fragment>
  );
};
