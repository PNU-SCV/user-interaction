import styles from './index.module.css';
import { Fragment, MouseEventHandler, useMemo, useRef, useState } from 'react';
import { IRobot } from '@components/pages/Robot';
import { Point, Rect } from '@/commons/types';
import { RobotPositionMsg, useBitmapRobotManager } from '@/hooks/useBitmapRobotManager';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '@/router';
import { createPortal } from 'react-dom';

const colorValid = 'white';
const colorInvalid = '#D5D5D5';
// const colorInvalid = 'black';
export type BITMAP_MODE = 'VIEWER' | 'COMMANDER';

export interface ISVGBitmap {
  rects: Rect[];
  robots: IRobot[];
  bitmapMode?: BITMAP_MODE;
  maxH?: string;
  setOverlayState?: (overlayState: string) => void;
}

const parseWebSocketMsg = (event): RobotPositionMsg => {
  const msg = event.data;
  const [id, status, newX, newY] = msg
    .split(',')
    .map((segment, idx) => (idx !== 0 ? parseInt(segment) : segment));
  console.log('ws msg', msg);
  // return { id, status, newX, newY };
  return { id, newX, newY };
};

export const SVGBitmap = ({
  rects,
  robots,
  bitmapMode = 'VIEWER',
  maxH = '74vh',
  setOverlayState,
}: ISVGBitmap) => {
  const maxCeil = findMaxRoundedToTen(rects);

  /**
   * 미니맵을 통해 로봇을 선택 및 이동시킬 수 있다.
   * 로봇 관련된 건 모두 useBitmapRobotManager 훅에서 관리
   * 다만, 로봇 이동은 여기서 웹소켓으로 요청 (위치 선택, 이벤트 위임 때문에)
   * 특이사항으로 미니맵에서 로봇의 위치는 웹소켓의 onmessage를 통해서만 업데이트됨
   */
  const { robotSVGs, createGoMsg, createStopMsg, selectRobotOnToggle, updateRobotPosition } =
    useBitmapRobotManager(robots, bitmapMode as BITMAP_MODE, maxCeil);
  const isWebSocketConnectedRef = useRef<boolean>(false);
  const setConnected = () => (isWebSocketConnectedRef.current = true);
  const setDisconnected = () => (isWebSocketConnectedRef.current = false);
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);
  const onmessage = (event: MessageEvent) => {
    console.log(event.data);
    const msg = parseWebSocketMsg(event);
    const { status, newX, newY } = msg;

    if (status === 5) {
      console.log('도착!', 8 - newX, newY);
      setSelectedPoints((prev) => [...prev.slice(1, prev.length)]);
    }

    updateRobotPosition({ ...msg, newX: 8 - newX });
  };

  const { sendMsg } = useWebSocket(onmessage, setConnected, setDisconnected);
  const navigate = useNavigate();

  const emergencyStop = () => {
    const isConnected = isWebSocketConnectedRef.current;
    if (isConnected) {
      sendMsg(createStopMsg());
      if (setOverlayState) {
        setOverlayState('stop');
      }
    }
  };

  const onClickMap: MouseEventHandler<SVGSVGElement> = (e) => {
    const element = e.target as SVGElement;
    if (bitmapMode === 'VIEWER') {
      const id = element.getAttribute('id');
      if (id) {
        navigate(ROUTER_PATH.ROBOT + `?id=${id}`, {
          state: {
            id: id,
          },
        });
      }
      return;
    }

    if (element.getAttribute('fill') !== colorValid) {
      const id = element.getAttribute('id');
      if (id) {
        const [v_x, v_y] = id.split(',').map((coord) => parseInt(coord));
        setSelectedPoints((prev) => prev.filter((point) => point.x !== 8 - v_x && point.y !== v_y));
      }

      return;
    }

    const rect = e.target as SVGRectElement;
    const destX = rect.x.animVal.value;
    const destY = rect.y.animVal.value;
    // 좌표 보낼때 x = 8-x
    console.log(8 - destX, destY);
    setSelectedPoints((prev) => [...prev, { x: destX, y: destY }]);
    // sendSelectedRobotToGo(destX, destY);
  };

  const roomSVG = useMemo(() => {
    return createRoomSVG(rects);
  }, [rects]);

  return (
    <div>
      <svg
        // viewBox="0 0 50 50"
        viewBox={`0 0 ${maxCeil} ${maxCeil}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClickMap}
        style={{
          height: '100%',
          maxHeight: maxH,
          boxSizing: 'border-box',
          border: '2px solid #000',
          transform: 'rotate(180deg)',
        }}
      >
        <rect
          style={{
            position: 'relative',
          }}
          width={maxCeil}
          height={maxCeil}
          fill={colorInvalid}
        />
        {roomSVG}
        {robotSVGs}
        {createPointSVGs(selectedPoints, maxCeil)}
      </svg>
      {bitmapMode === 'COMMANDER'
        ? createPortal(
            <Fragment>
              <button
                style={{ position: 'absolute', transform: 'translate(120px, 200px)' }}
                onClick={emergencyStop}
              >
                정지하기
              </button>
              <button
                style={{ position: 'absolute', transform: 'translate(120px, 260px)' }}
                onClick={() => {
                  sendMsg(createGoMsg([{ x: 7, y: 5 }]));
                  // if (setOverlayState) {
                  //   setOverlayState('return');
                  // }
                }}
              >
                데스크로 <br />
                돌아가기
              </button>
              <button
                style={{ position: 'absolute', transform: 'translate(120px, 330px)' }}
                onClick={() => {
                  const msg = createGoMsg(
                    selectedPoints.map((point) => ({ ...point, x: 8 - point.x })),
                  );
                  console.log(msg);
                  sendMsg(msg);
                }}
              >
                로봇 이동시키기
              </button>
            </Fragment>,
            document.body,
          )
        : null}
    </div>
  );
};

const createRoomSVG = (rects: Rect[]) => {
  return rects.map((rect, idx) => (
    <g key={idx}>
      {Array.from({ length: rect.p2.y - rect.p1.y + 1 }, (_, y) =>
        Array.from({ length: rect.p2.x - rect.p1.x + 1 }, (_, x) => (
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

const findMaxRoundedToTen = (rects: Rect[]) => {
  let maxValue = 0;

  rects.forEach((rect) => {
    maxValue = Math.max(maxValue, rect.p1.x, rect.p1.y, rect.p2.x, rect.p2.y);
  });

  return Math.ceil(maxValue / 10) * 10;
};

const createPointSVGs = (selectedPoints, maxCeil) =>
  selectedPoints.map((point, idx) => (
    <g
      key={`${point.x}${idx}`}
      style={{
        transition: 'transform 0.5s',
        transform: `translate(${point.x ?? -2}px, ${point.y ?? -2}px)`,
        cursor: 'pointer',
      }}
    >
      <circle
        id={`${point.x},${point.y}`}
        cx="0.5"
        cy="0.5"
        r={maxCeil * 0.03}
        fill={'dodgerblue'}
        // fill={'#D5D5D5'}
        stroke="#D5D5D5"
        strokeWidth="0.05"
      />
      <text
        x="-0.6"
        y="0.1"
        fontSize={maxCeil * 0.03}
        style={{
          transition: 'fill 0.5s',
          transform: 'rotate(180deg)',
        }}
      >
        {idx + 1}
      </text>
    </g>
  ));
