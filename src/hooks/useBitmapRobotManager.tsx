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

  // TODO: 한 번만 layout하고 transform 속성을 이용해서 이동만 시키고 싶은데, 얼마를 이동 시켜야 할 지를 모르겠음
  const robotSVGs = robots.map((robot) => (
    <circle
      key={robot.id}
      id={robot.id}
      cx={robotPositions[robot.id].x + 0.5}
      cy={robotPositions[robot.id].y + 0.5}
      style={{
        transition: 'cx 0.5s, cy 0.5s',
        cursor: 'pointer',
      }}
      r="0.5"
      fill={selectedRobotId === robot.id ? 'red' : 'black'}
    />
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
