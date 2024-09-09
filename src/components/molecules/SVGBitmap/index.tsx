import styles from './index.module.css';
import { MouseEventHandler, useMemo, useReducer, useState } from 'react';
import { IRobot } from '@components/templates/Robot';

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  p1: Point;
  p2: Point;
};

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

const colorValid = 'white';
const colorInvalid = 'whitesmoke';

export interface ISVGBitmap {
  rects: Rect[];
  robots: IRobot[];
}

const initialRobotPositions = (robots) =>
  robots.reduce((acc, robot, idx) => {
    acc[robot.id] = { x: 24, y: idx };
    return acc;
  }, {});

export const SVGBitmap = ({ rects, robots }: ISVGBitmap) => {
  const [robotPositions, dispatch] = useReducer(
    robotPositionReducer,
    robots,
    initialRobotPositions,
  );
  const [selectedRobotId, setSelectedRobotId] = useState<string>(robots[0].id);

  const svgRects = useMemo(() => {
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
              // stroke={colorValid}
            />
          )),
        )}
      </g>
    ));
  }, [rects]);

  const svgRobots = robots.map((robot) => (
    <circle
      key={robot.id}
      cx={robotPositions[robot.id].x + 0.5}
      cy={robotPositions[robot.id].y + 0.5}
      style={{ transition: 'cx 0.5s, cy 0.5s' }}
      r="0.5"
      fill={selectedRobotId === robot.id ? 'red' : 'black'}
      onMouseEnter={() => setSelectedRobotId(robot.id)}
    />
  ));

  const moveSelectedRobotTo = (newX: number, newY: number) =>
    dispatch({
      type: 'UPDATE_POSITION',
      payload: { id: selectedRobotId, newX, newY },
    });

  const onClick: MouseEventHandler<SVGSVGElement> = async (e) => {
    const rect = e.target as SVGRectElement;
    if (rect.getAttribute('fill') !== colorValid) {
      return;
    }

    const posX = rect.x.animVal.value;
    const posY = rect.y.animVal.value;

    moveSelectedRobotTo(posX, posY);

    console.log('hm', rect.x.animVal.value, rect.y.animVal.value);

    // try {
    //   console.log(test);
    //
    //   const response = await fetch('http://localhost:8000/go/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       dest: `${posX},${posY}`,
    //       robotId: selectedRobotId,
    //     }),
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (e) {
    //   setRobotPosition({
    //     x: 25,
    //     y: 25,
    //   });
    // }
  };

  return (
    <svg
      width="100%"
      viewBox="0 0 50 50"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ height: '80%' }}
    >
      <rect width="50" height="50" fill={colorInvalid} />
      {/*<rect width="50" height="50" fill="black" />*/}
      {svgRects}
      {svgRobots}
    </svg>
  );
};
