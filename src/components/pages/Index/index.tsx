import React, { useRef } from 'react';
import { Header } from '@components/molecules/Header';
import { MainContainer } from '@components/atoms/MainContainer';
import { IRobot } from '@components/pages/Robot';
import { useQueryClient } from '@tanstack/react-query';
import { Rect } from '@/commons/types';
import { AsyncBoundary } from '@components/atoms/AsyncBoundary';
import { usePlaceContext } from '@/context/PlaceContext';
import { IndexViewer } from '@components/templates/IndexViewer';
import { baseUrl } from '@/router';
import { Simulate } from 'react-dom/test-utils';
import reset = Simulate.reset;

export type MapStateResp = {
  rects: Rect[];
  robots: IRobot[];
};

export const fetchRobotsByMap = async (map_name: string): Promise<MapStateResp> => {
  const response = await fetch(`http://${baseUrl}:8000/robots/${map_name}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  return await response.json();
};

export const createQueryKeyWithPlace = (place: string): string[] => ['robot', place];

export const Index: React.FC = () => {
  const { place, setPlace } = usePlaceContext();
  const queryClient = useQueryClient();
  const resetRef = useRef<{ reset: () => void } | null>(null);

  const handleReset = () => {
    // queryClient.invalidateQueries({ queryKey: createQueryKeyWithPlace(place) }).then(() => {
    //   resetRef.current?.reset();
    // });
    resetRef.current?.reset();
  };

  return (
    <MainContainer>
      <Header />
      <AsyncBoundary
        ref={resetRef}
        pendingFallback={<div>로딩중</div>}
        rejectedFallback={
          <button onTouchEnd={handleReset} onClick={handleReset}>
            재시도
          </button>
        }
      >
        <IndexViewer reset={resetRef.current?.reset} />
      </AsyncBoundary>
    </MainContainer>
  );
};
