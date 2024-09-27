import styles from './index.module.css';
import { MouseEventHandler, useMemo, useRef } from 'react';
import { IRobot } from '@components/pages/Robot';
import { Rect } from '@/commons/types';
import { RobotPositionMsg, useBitmapRobotManager } from '@/hooks/useBitmapRobotManager';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '@/router';
import { createPortal } from 'react-dom';

const colorValid = 'white';
const colorInvalid = 'whitesmoke';
// const colorInvalid = 'black';
export type BITMAP_MODE = 'VIEWER' | 'COMMANDER';

export interface ISVGBitmap {
  rects: Rect[];
  robots: IRobot[];
  bitmapMode?: BITMAP_MODE;
  onClickSetDest?: (pos: string) => void;
}

const parseWebSocketMsg = (event): RobotPositionMsg => {
  const msg = event.data;
  const [id, newX, newY] = msg
    .split(',')
    .map((segment, idx) => (idx !== 0 ? parseInt(segment) : segment));
  console.log('ws msg', msg);
  return { id, newX, newY };
};

export const SVGBitmap = ({
  rects,
  robots,
  bitmapMode = 'VIEWER',
  onClickSetDest = (pos: string) => {},
}: ISVGBitmap) => {
  /**
   * 미니맵을 통해 로봇을 선택 및 이동시킬 수 있다.
   * 로봇 관련된 건 모두 useBitmapRobotManager 훅에서 관리
   * 다만, 로봇 이동은 여기서 웹소켓으로 요청 (위치 선택, 이벤트 위임 때문에)
   * 특이사항으로 미니맵에서 로봇의 위치는 웹소켓의 onmessage를 통해서만 업데이트됨
   */
  const { robotSVGs, createGoMsg, createStopMsg, selectRobotOnToggle, updateRobotPosition } =
    useBitmapRobotManager(robots, bitmapMode as BITMAP_MODE);
  const isWebSocketConnectedRef = useRef<boolean>(false);
  const setConnected = () => (isWebSocketConnectedRef.current = true);
  const setDisconnected = () => (isWebSocketConnectedRef.current = false);
  const onmessage = (event: MessageEvent) => updateRobotPosition(parseWebSocketMsg(event));
  const { sendMsg } = useWebSocket(onmessage, setConnected, setDisconnected);
  const navigate = useNavigate();

  const sendSelectedRobotToGo = (destX: number, destY: number) => {
    if (onClickSetDest) {
      onClickSetDest(`${destX},${destY}`);
    }
  };

  const emergencyStop = () => {
    const isConnected = isWebSocketConnectedRef.current;
    if (isConnected) {
      sendMsg(createStopMsg());
    }
  };

  const onClickMap: MouseEventHandler<SVGSVGElement> = (e) => {
    const element = e.target as SVGElement;
    if (bitmapMode === 'VIEWER') {
      const id = element.getAttribute('id');
      if (id) {
        navigate(ROUTER_PATH.ROBOT + `?id=${id}`);
      }
      return;
    }

    if (element.getAttribute('fill') !== colorValid) {
      return;
    }

    const rect = e.target as SVGRectElement;
    const destX = rect.x.animVal.value;
    const destY = rect.y.animVal.value;
    sendSelectedRobotToGo(destX, destY);
  };

  const roomSVG = useMemo(() => {
    return createRoomSVG(rects);
  }, [rects]);

  return (
    <div>
      <svg
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClickMap}
        style={{
          height: '100%',
          maxHeight: '74vh',
          boxSizing: 'border-box',
          border: '2px solid #000',
        }}
      >
        <rect width="50" height="50" fill={colorInvalid} />
        {roomSVG}
        {robotSVGs}
      </svg>
      {bitmapMode === 'COMMANDER'
        ? createPortal(
            <button
              style={{ position: 'absolute', transform: 'translateX(50%)' }}
              onClick={emergencyStop}
            >
              정지
            </button>,
            document.body,
          )
        : null}
    </div>
  );
};

const createRoomSVG = (rects: Rect[]) => {
  return rects.map((rect, idx) => (
    <g key={idx}>
      {Array.from({ length: rect.p2.y - rect.p1.y }, (_, y) =>
        Array.from({ length: rect.p2.x - rect.p1.x }, (_, x) => (
          <rect
            key={`${x} ${y}`}
            x={rect.p1.x + x}
            y={rect.p1.y + y}
            width="1"
            height="1"
            fill={colorValid}
            className={styles.pointing}
          />
        )),
      )}
    </g>
  ));
};
