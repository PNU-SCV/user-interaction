import { Point } from '@/commons/types';
import { useReducer, useState } from 'react';
import { IRobot } from '@components/pages/Robot';

interface RobotPositionState {
  [key: string]: Point;
}

export type RobotPositionMsg = {
  id: string;
  newX: number;
  newY: number;
};

interface RobotPositionAction {
  type: 'UPDATE_POSITION';
  payload: RobotPositionMsg;
}

const MOVE_COMMAND = {
  STOP: 0,
  GO: 1,
};

export const useBitmapRobotManager = (robots: IRobot[]) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [robotPositions, dispatch] = useReducer(
    robotPositionReducer,
    robots,
    initialRobotPositions,
  );

  const createGoMsg = (destX, destY) =>
    JSON.stringify({
      command: MOVE_COMMAND.GO,
      target: selectedRobotId,
      dest: `${destX},${destY}`,
    });

  const createStopMsg = () =>
    JSON.stringify({
      command: MOVE_COMMAND.STOP,
      target: selectedRobotId,
    });

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
        transform: `translate(${robotPositions[robot.id].x}px, ${robotPositions[robot.id].y}px)`,
      }}
    >
      <circle
        id={robot.id}
        cx="0.5"
        cy="0.5"
        r="0.5"
        fill={selectedRobotId === robot.id ? 'red' : 'black'}
        style={{
          transition: 'fill 0.5s', // Smooth transition for fill color
          cursor: 'pointer',
        }}
      />
      <text
        x="1"
        y="0.75"
        fontSize="1px"
        style={{
          transition: 'fill 0.5s', // Optional: smooth transition for text color if needed
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

const initialRobotPositions = (robots) =>
  robots.reduce((acc, robot) => {
    acc[robot.id] = robot.pos;
    return acc;
  }, {});
