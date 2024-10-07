import { Point } from '@/commons/types';
import { useEffect, useReducer, useState } from 'react';
import { IRobot } from '@components/pages/Robot';
import { BITMAP_MODE } from '@components/molecules/SVGBitmap';

interface RobotPositionState {
  [key: string]: Point;
}

export type RobotPositionMsg = {
  id: string;
  newX: number;
  newY: number;
  // status: number;
};

interface RobotPositionAction {
  type: 'UPDATE_POSITION' | 'INITIALIZE';
  payload: RobotPositionMsg | RobotPositionState;
}

const MOVE_COMMAND = {
  STOP: 0,
  GO: 1,
};

export const useBitmapRobotManager = (
  robots: IRobot[],
  bitmapMode: BITMAP_MODE,
  maxCeil: number,
) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(() =>
    bitmapMode === 'VIEWER' ? '' : robots[0].id,
  );
  const [robotPositions, dispatch] = useReducer(robotPositionReducer, {}, () =>
    initialRobotPositions(robots),
  );

  useEffect(() => {
    dispatch({ type: 'INITIALIZE', payload: initialRobotPositions(robots) });
  }, [robots]);

  // const createGoMsg = (destX, destY) => {
  const createGoMsg = (selectedPoints) => {
    return JSON.stringify({
      command: MOVE_COMMAND.GO,
      target: selectedRobotId,
      // dest: `${destX},${destY}`,
      dest: selectedPoints,
    });
  };

  const createStopMsg = () => {
    return JSON.stringify({
      command: MOVE_COMMAND.STOP,
      target: selectedRobotId,
    });
  };

  const updateRobotPosition = (robotPosMsg: RobotPositionMsg) =>
    dispatch({
      type: 'UPDATE_POSITION',
      payload: robotPosMsg,
    });

  const selectRobotOnToggle = (robotId: string) =>
    setSelectedRobotId((prev) => (prev === robotId ? '' : robotId));

  // TODO: reflow를 줄이기 위해 화면에서 transform 속성을 이용해서 움직이게 하기 위해 이거 robotSVGs를 useRef로 들고 있다가 updateRobotPosition에서는 style의 transform을 바꿔주는 구조로 추후 변경
  const robotSVGs = robots.map((robot) => (
    <g
      key={robot.id}
      style={{
        transition: 'transform 0.5s', // Ensure the entire group transitions smoothly
        transform: `translate(${robotPositions[robot.id]?.x ?? -2}px, ${robotPositions[robot.id]?.y ?? -2}px)`,
      }}
    >
      <circle
        id={robot.id}
        cx="0.5"
        cy="0.5"
        // r="0.5"
        r={maxCeil * 0.03}
        fill={bitmapMode === 'VIEWER' ? '#76c7c0' : selectedRobotId === robot.id ? 'red' : 'black'}
        style={{
          transition: 'fill 0.5s', // Smooth transition for fill color
          cursor: 'pointer',
        }}
        stroke="#000"
        strokeWidth="0.1"
      />
      <text
        // x="1"
        x="-1.1"
        // y="0.75"
        y="0.1"
        fontSize={maxCeil * 0.03}
        style={{
          transition: 'fill 0.5s',
          transform: 'rotate(180deg)',
        }}
      >
        {robot.label}
      </text>
    </g>
  ));

  return { robotSVGs, createGoMsg, createStopMsg, selectRobotOnToggle, updateRobotPosition };
};

const robotPositionReducer = (
  state: RobotPositionState,
  action: RobotPositionAction,
): RobotPositionState => {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload as RobotPositionState;
    case 'UPDATE_POSITION':
      return {
        ...state,
        [action.payload.id]: {
          x: action.payload.newX,
          y: action.payload.newY,
        },
      };
    default:
      return state;
  }
};

const initialRobotPositions = (robots) => {
  return robots.reduce((acc, robot) => {
    acc[robot.id] = robot.pos;
    return acc;
  }, {});
};
