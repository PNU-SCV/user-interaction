import styles from './index.module.css';
import { MouseEventHandler, useMemo } from 'react';
import { IRobot } from '@components/templates/Robot';
import { Rect } from '@/commons/types';
import { RobotPositionMsg, useBitmapRobotManager } from '@/hooks/useBitmapRobotManager';
import { useWebSocket } from '@/hooks/useWebSocket';

const colorValid = 'white';
const colorInvalid = 'whitesmoke';

export interface ISVGBitmap {
  rects: Rect[];
  robots: IRobot[];
}

const parseWebSocketMsg = (event): RobotPositionMsg => {
  const msg = event.data;
  const [id, newX, newY] = msg
    .split(',')
    .map((segment, idx) => (idx !== 0 ? parseInt(segment) : segment));

  return { id, newX, newY };
};

export const SVGBitmap = ({ rects, robots }: ISVGBitmap) => {
  /**
   * 미니맵을 통해 로봇을 선택 및 이동시킬 수 있다.
   * 로봇 관련된 건 모두 useBitmapRobotManager 훅에서 관리
   * 다만, 로봇 이동은 여기서 웹소켓으로 요청 (위치 선택, 이벤트 위임 때문에)
   * 특이사항으로 미니맵에서 로봇의 위치는 웹소켓의 onmessage를 통해서만 업데이트됨
   */
  const { robotSVGs, createGoMsg, createStopMsg, selectRobotOnToggle, updateRobotPosition } =
    useBitmapRobotManager(robots);
  const onmessage = (event) => updateRobotPosition(parseWebSocketMsg(event));
  const { isConnected, sendMsg } = useWebSocket(onmessage);

  const sendSelectedRobotToGo = (destX: number, destY: number) => {
    sendMsg(createGoMsg(destX, destY));
  };

  const onClickMap: MouseEventHandler<SVGSVGElement> = (e) => {
    const element = e.target as SVGElement;
    if (element.getAttribute('fill') !== colorValid) {
      const id = element.getAttribute('id');
      if (id) {
        selectRobotOnToggle(id);
      }
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
    <svg
      width="100%"
      viewBox="0 0 50 50"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClickMap}
      style={{ height: '80%' }}
    >
      <rect width="50" height="50" fill={colorInvalid} />
      {roomSVG}
      {robotSVGs}
    </svg>
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
