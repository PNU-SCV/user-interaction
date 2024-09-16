import styles from './index.module.css';
import { MouseEventHandler, useMemo } from 'react';
import { IRobot } from '@components/templates/Robot';
import { Rect } from '@/commons/types';
import { useBitmapRobotPositions } from '@/hooks/useBitmapRobotPositions';

const colorValid = 'white';
const colorInvalid = 'whitesmoke';

export interface ISVGBitmap {
  rects: Rect[];
  robots: IRobot[];
}

export const SVGBitmap = ({ rects, robots }: ISVGBitmap) => {
  const [moveSelectedRobotTo, svgRobots] = useBitmapRobotPositions(rects, robots, colorValid);

  const onClick: MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = e.target as SVGRectElement;
    if (rect.getAttribute('fill') !== colorValid) {
      return;
    }
    const posX = rect.x.animVal.value;
    const posY = rect.y.animVal.value;

    moveSelectedRobotTo(posX, posY);
  };

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
            />
          )),
        )}
      </g>
    ));
  }, [rects]);

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
