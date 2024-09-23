import { useEffect } from 'react';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useLocation } from 'react-router-dom';
import { MapStateResp } from '@components/pages/Index';

export interface IDeliveryCommandMap {
  data: MapStateResp;
  onClickSetOrigin: (pos: string) => void;
  onClickSetDest: (pos: string) => void;
}

export const DeliveryCommandMap = ({
  data,
  onClickSetOrigin,
  onClickSetDest,
}: IDeliveryCommandMap) => {
  const location = useLocation();
  const { rects, robots } = data;
  const selectedRobot = robots.filter((robot) => robot.id === location.state.id);

  useEffect(() => {
    const point = selectedRobot[0].pos;
    onClickSetOrigin(`${point.x},${point.y}`);
  }, []);

  return (
    <SVGBitmap
      rects={rects}
      robots={selectedRobot}
      bitmapMode="COMMANDER"
      onClickSetDest={onClickSetDest}
    />
  );
};
