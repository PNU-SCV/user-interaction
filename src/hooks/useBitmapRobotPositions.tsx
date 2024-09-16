import { Point, Rect } from '@/commons/types';
import { useReducer, useState } from 'react';
import { IRobot } from '@components/templates/Robot';

interface RobotPositionState {
  [key: string]: Point;
}

interface RobotPositionAction {
  type: 'UPDATE_POSITION';
  payload: {
    id: string;
    newX: number;
    newY: number;
  };
}

export const useBitmapRobotPositions = (rects: Rect[], robots: IRobot[], colorValid) => {
  const [robotPositions, dispatch] = useReducer(
    robotPositionReducer,
    robots,
    initialRobotPositions,
  );
  const [selectedRobotId, setSelectedRobotId] = useState<string>(robots[0].id);

  const moveSelectedRobotTo = (newX: number, newY: number) =>
    dispatch({
      type: 'UPDATE_POSITION',
      payload: { id: selectedRobotId, newX, newY },
    });

  const svgRobots = robots.map((robot) => (
    <circle
      key={robot.id}
      cx={robotPositions[robot.id].x + 0.5}
      cy={robotPositions[robot.id].y + 0.5}
      style={{ transition: 'cx 0.5s, cy 0.5s' }}
      r="0.5"
      fill={selectedRobotId === robot.id ? 'red' : 'black'}
      // onMouseEnter={() => setSelectedRobotId(robot.id)}
    />
  ));

  return [moveSelectedRobotTo, svgRobots];
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
  robots.reduce((acc, robot, idx) => {
    acc[robot.id] = { x: 24, y: idx };
    return acc;
  }, {});
