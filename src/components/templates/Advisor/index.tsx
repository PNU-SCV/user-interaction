import { Fragment } from 'react';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useQuery } from '@tanstack/react-query';
import { Rect } from '@/commons/types';
import { IRobot } from '@components/templates/Robot';

type MapStateResp = {
  rects: Rect[];
  robots: IRobot[];
};

const fetchRobotsByMap = async (map_name: string): Promise<MapStateResp> => {
  const response = await fetch(`http://localhost:8000/robots/${map_name}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  const data = await response.json();

  return data;
};

export const Advisor = () => {
  const placeName = 'PLACE_TEST';
  const { data, isLoading, isError } = useQuery({
    queryKey: ['robots', placeName],
    queryFn: () => fetchRobotsByMap(placeName),
  });

  if (isLoading || isError) {
    return <div>[FOR TEST ONLY] {placeName} advisor</div>;
  }
  // const rects: Rect[] = [
  //   {
  //     p1: {
  //       x: 23,
  //       y: 0,
  //     },
  //     p2: {
  //       x: 28,
  //       y: 50,
  //     },
  //   },
  //   {
  //     p1: {
  //       x: 8,
  //       y: 18,
  //     },
  //     p2: {
  //       x: 23,
  //       y: 33,
  //     },
  //   },
  // ];
  // const robots = [
  //   {
  //     id: 'scv1',
  //     label: '1번 로봇',
  //     path: ROUTER_PATH.ROBOT + '?id=scv-1',
  //   },
  // ];
  const { rects, robots } = data;

  return (
    <Fragment>
      <div>[FOR TEST ONLY] {placeName} advisor</div>
      <SVGBitmap rects={rects} robots={robots} />
    </Fragment>
  );
};
