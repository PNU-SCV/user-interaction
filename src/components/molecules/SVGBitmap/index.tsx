import styles from './index.module.css';
import { MouseEventHandler, useMemo, useRef, useState } from 'react';
import { IRobot } from '@components/pages/Robot';
import { Point, Rect } from '@/commons/types';
import { RobotPositionMsg, useBitmapRobotManager } from '@/hooks/useBitmapRobotManager';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '@/router';

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
  return { id, status, newX, newY };
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
    const msg = parseWebSocketMsg(event);
    const { status, newX, newY } = msg;

    updateRobotPosition({ ...msg, newX: 8 - newX });
    setTimeout(() => {
      if (status === 5 || status === 6) {
        console.log('도착!', 8 - newX, newY);
        setSelectedPoints((prev) => [...prev.slice(1, prev.length)]);
        if (setOverlayState) {
          setOverlayState(status === 5 ? '다음 장소로 이동해도 될까요?' : '');
        }
      }
    }, 600);
  };

  const { sendMsg } = useWebSocket(onmessage, setConnected, setDisconnected);
  const navigate = useNavigate();

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
    setSelectedPoints((prev) => {
      if (prev.some((point) => point.x === destX && point.y === destY)) {
        console.log('duplicate');
        return prev;
      }
      return [...prev, { x: destX, y: destY }];
    });
  };

  const roomSVG = useMemo(() => {
    return createRoomSVG(rects);
  }, [rects]);

  const sendStop = () => {
    const isConnected = isWebSocketConnectedRef.current;
    if (isConnected) {
      sendMsg(createStopMsg());
      if (setOverlayState) {
        setOverlayState('');
      }
    }
  };

  const returnToDesk = () => {
    sendMsg(createGoMsg([{ x: 7, y: 5 }]));
  };

  const sendDestinations = () => {
    const msg = createGoMsg(selectedPoints.map((point) => ({ ...point, x: 8 - point.x })));
    sendMsg(msg);
  };

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
          // transform: 'rotate(180deg)',
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
      {bitmapMode === 'COMMANDER' ? (
        <div
          style={{
            position: 'absolute',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'transparent',
            border: '2px solid #000',
            width: '100%',
            padding: '4px',
            transform: 'translate(-32px, 15px)',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <button onClick={sendStop}>정지하기</button>
          <button onClick={sendDestinations}>로봇 이동시키기</button>
          <button onClick={returnToDesk}>데스크로 돌아가기</button>
        </div>
      ) : null}
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
      color={'white'}
    >
      <circle
        id={`${point.x},${point.y}`}
        cx="0.5"
        cy="0.5"
        r={maxCeil * 0.03}
        fill={'#76c7c0'}
        stroke="#D5D5D5"
        strokeWidth="0.05"
      />
      <text
        x="0.42"
        y="0.6"
        fontSize={maxCeil * 0.03}
        fill={'white'}
        style={{
          transition: 'fill 0.5s',
        }}
      >
        {idx + 1}
      </text>
    </g>
  ));
