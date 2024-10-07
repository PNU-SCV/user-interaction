import { Fragment, useEffect, useRef, useState } from 'react';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useLocation } from 'react-router-dom';
import { MapStateResp } from '@components/pages/Index';
import { createPortal } from 'react-dom';

export interface IDeliveryCommandMap {
  data: MapStateResp;
  onClickSetOrigin?: (pos: string) => void;
  onClickSetDest?: (pos: string) => void;
  maxH?: string;
}

export const DeliveryCommandMap = ({
  data,
  onClickSetOrigin,
  onClickSetDest,
  maxH,
}: IDeliveryCommandMap) => {
  const location = useLocation();
  const { rects, robots } = data;
  const selectedRobot = robots.filter((robot) => robot.id === location.state.id);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const point = selectedRobot[0].pos;
    if (onClickSetOrigin) {
      onClickSetOrigin(`${point.x},${point.y}`);
    }
  }, []);

  const setOverlayState = (state: string) => {
    if (portalRef.current) {
      const overlay = portalRef.current as HTMLDivElement;

      if (state === 'moving') {
        overlay.style.backgroundColor = 'green';
        overlay.style.zIndex = '99';
        return;
      }

      if (state === 'wait') {
        overlay.style.backgroundColor = 'whitesmoke';
        overlay.style.zIndex = '99';
        return;
      }

      if (state === 'stop') {
        overlay.style.backgroundColor = 'orange';
        overlay.style.zIndex = '99';
        return;
      }

      if (state === 'return') {
        overlay.style.backgroundColor = 'whitesmoke';
        overlay.style.zIndex = '99';
        return;
      }

      if (state === 'idle') {
        overlay.style.zIndex = '-1';
      }
    }
  };

  return (
    <Fragment>
      {createPortal(
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            position: 'absolute',
            zIndex: 9999,
            backdropFilter: 'blur(6px)',
          }}
          ref={portalRef}
          onClick={() => {
            if (portalRef.current) {
              const overlay = portalRef.current as HTMLDivElement;
              overlay.style.zIndex = '-1';
            }
          }}
        ></div>,
        document.body,
      )}
      <SVGBitmap
        rects={rects}
        robots={selectedRobot}
        bitmapMode="COMMANDER"
        maxH={maxH}
        onClickSetDest={onClickSetDest}
        setOverlayState={setOverlayState}
      />
    </Fragment>
  );
};
