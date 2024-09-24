import { IRoutingButton } from '@components/atoms/RoutingButton';
import { useNavigate } from 'react-router-dom';
import React, { startTransition, useCallback, useRef } from 'react';
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
import { usePlaceContext } from '@/context/PlaceContext';
import { ScrollSnapOverlay } from '@components/atoms/ScrollSnapOverlay';
import { ScrollSnapWrapper } from '@components/atoms/ScrollSnapWrapper';

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

export const createQueryKeyWithPlace = (place: string): string[] => ['robot', place];

export const Index: React.FC = () => {
  const { place, setPlace } = usePlaceContext();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: createQueryKeyWithPlace(place),
    queryFn: () => fetchRobotsByMap(place),
  });
  const resetRef = useRef<{ reset: () => void } | null>(null);

  const handleReset = () => {
    queryClient.invalidateQueries({ queryKey: createQueryKeyWithPlace(place) }).then(() => {
      resetRef.current?.reset();
    });
  };

  return (
    <MainContainer>
      <Header />
      <AsyncBoundary
        ref={resetRef}
        pendingFallback={<div>로딩중</div>}
        rejectedFallback={<button onClick={handleReset}>재시도</button>}
      >
        <PlaceViewer placeData={data} reset={resetRef.current?.reset} />
      </AsyncBoundary>
    </MainContainer>
  );
};

interface IPlaceViewer {
  placeData: MapStateResp;
  reset?: () => void;
}

const options = [
  {
    value: 'PLACE_TEST',
    label: '세미나실',
  },
  {
    value: '201',
    label: '컴공관',
  },
];

const PlaceViewer: React.FC = ({ placeData, reset }: IPlaceViewer) => {
  const navigate = useNavigate();
  const onClickTemplate = useCallback(
    (path) => () => startTransition(() => navigate(path)),
    [navigate],
  );
  const { rects, robots } = placeData;
  const { place, setPlace } = usePlaceContext();
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setPlace(event.target.value);
      if (reset) {
        reset();
      }
    });
  };

  return (
    <ScrollSnapWrapper>
      <ScrollSnapOverlay>
        <div
          style={{
            backdropFilter: 'blur(6px)',
            backgroundColor: 'transparent',
            border: '1px dashed antiquewhite',
          }}
        >
          <div
            style={{
              height: '10vh',
            }}
          >
            <span>선택한 위치 </span>
            <select value={place} onChange={onChange}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ScrollSnapOverlay>
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
    </ScrollSnapWrapper>
  );
};
