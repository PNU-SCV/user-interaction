import { IRoutingButton } from '@components/atoms/RoutingButton';
import { useNavigate } from 'react-router-dom';
import React, { Fragment, useCallback, useState } from 'react';
import { ROUTER_PATH } from '@/router';
import { Header } from '@components/molecules/Header';
import { IteratingMapper } from '@components/atoms/IteratingMapper';
import { MainContainer } from '@components/atoms/MainContainer';
import { RobotFigure } from '@components/molecules/RobotFigure';
import { IRobot } from '@components/pages/Robot';
import { useQuery } from '@tanstack/react-query';
import { Rect } from '@/commons/types';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';

type MapStateResp = {
  rects: Rect[];
  robots: IRobot[];
};

const fetchRobotsByMap = async (map_name: string): Promise<MapStateResp> => {
  const response = await fetch(`http://localhost:8000/robots/${map_name}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  return await response.json();
};

const placeName = 'PLACE_TEST';

export const Index: React.FC = () => {
  const [place, setPlace] = useState(placeName);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['robots', placeName],
    queryFn: () => fetchRobotsByMap(placeName),
  });

  return (
    <MainContainer>
      <Header />
      <p>{place}의 가용 로봇들</p>
      {!isLoading && !isError ? <PlaceViewer placeData={data} /> : <div></div>}
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
        <IteratingMapper<IRoutingButton>
          items={robots.map((robot) => ({
            ...robot,
            path: ROUTER_PATH.ROBOT + `?id=${robot.id}`,
          }))}
          component={RobotFigure}
          container={Fragment}
          otherItemProps={{ onClickTemplate }}
        />
      </ScrollSnapItem>
      <ScrollSnapItem>
        <SVGBitmap rects={rects} robots={robots} />
      </ScrollSnapItem>
    </ScrollSnapContainer>
  );
};
