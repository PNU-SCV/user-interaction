import { IRoutingButton } from '@components/atoms/RoutingButton';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useRef } from 'react';
import { ROUTER_PATH } from '@/router';
import { Header } from '@components/molecules/Header';
import { IteratingMapper } from '@components/atoms/IteratingMapper';
import { MainContainer } from '@components/atoms/MainContainer';
import { RobotFigure } from '@components/molecules/RobotFigure';
import { IRobot } from '@components/pages/Robot';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Rect } from '@/commons/types';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import { AsyncBoundary } from '@components/atoms/AsyncBoundary';
import { Flex } from '@components/atoms/Flex';
import { usePlace } from '@/context/PlaceContext';

export type MapStateResp = {
  rects: Rect[];
  robots: IRobot[];
};

export const fetchRobotsByMap = async (map_name: string): Promise<MapStateResp> => {
  const response = await fetch(`http://localhost:8000/robots/${map_name}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  return await response.json();
};

export const Index: React.FC = () => {
  const { place, setPlace } = usePlace();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: ['robots', place],
    queryFn: () => fetchRobotsByMap(place),
  });
  const resetRef = useRef<{ reset: () => void } | null>(null);

  const handleReset = () => {
    queryClient.invalidateQueries({ queryKey: ['robots', place] }).then(() => {
      resetRef.current?.reset();
    });
  };

  return (
    <MainContainer>
      <Header />
      {/*<p>{placeName}의 가용 로봇들</p>*/}
      <AsyncBoundary
        ref={resetRef}
        pendingFallback={<div>로딩중</div>}
        rejectedFallback={<button onClick={handleReset}>재시도</button>}
      >
        <PlaceViewer placeData={data} />
      </AsyncBoundary>
    </MainContainer>
  );
};

interface IPlaceViewer {
  placeData: MapStateResp;
}

const PlaceViewer: React.FC = ({ placeData }: IPlaceViewer) => {
  const navigate = useNavigate();
  const onClickTemplate = useCallback((path) => () => navigate(path), [navigate]);
  const { rects, robots } = placeData;

  return (
    <ScrollSnapContainer>
      <ScrollSnapItem>
        <p>주변 로봇들 자세히 보기</p>
        <IteratingMapper<IRoutingButton>
          items={robots.map((robot) => ({
            ...robot,
            path: ROUTER_PATH.ROBOT + `?id=${robot.id}`,
          }))}
          component={RobotFigure}
          container={Flex}
          otherItemProps={{ onClickTemplate }}
          otherContainerProps={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        />
      </ScrollSnapItem>
      <ScrollSnapItem>
        <p>주변 로봇들 간편히 보기</p>
        <SVGBitmap rects={rects} robots={robots} />
      </ScrollSnapItem>
    </ScrollSnapContainer>
  );
};
