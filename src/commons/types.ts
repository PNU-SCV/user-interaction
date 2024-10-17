import { IRobot } from '@components/pages/Robot';

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  p1: Point;
  p2: Point;
};

export type MapStateResp = {
  rects: Rect[];
  robots: IRobot[];
};
