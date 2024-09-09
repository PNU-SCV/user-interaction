import { Fragment } from 'react';
import { Rect, SVGBitmap } from '@components/molecules/SVGBitmap';
import { ROUTER_PATH } from '@/router';

export const Advisor = () => {
  const placeName = 'PLACE_TEST';
  const rects: Rect[] = [
    {
      p1: {
        x: 23,
        y: 0,
      },
      p2: {
        x: 28,
        y: 50,
      },
    },
    {
      p1: {
        x: 8,
        y: 18,
      },
      p2: {
        x: 23,
        y: 33,
      },
    },
  ];
  const robots = [
    {
      // id: 'scv-1',
      id: 'scv1',
      label: '1번 로봇',
      path: ROUTER_PATH.ROBOT + '?id=scv-1',
    },
    {
      id: 'scv2',
      label: '2번 로봇',
      path: ROUTER_PATH.ROBOT + '?id=scv2',
    },
  ];
  return (
    <Fragment>
      <div>[FOR TEST ONLY] {placeName} advisor</div>
      <SVGBitmap rects={rects} robots={robots} />
    </Fragment>
  );
};
