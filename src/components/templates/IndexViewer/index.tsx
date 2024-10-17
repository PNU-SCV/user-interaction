import React, { useCallback, useMemo } from 'react';
import { usePlaceContext } from '@/context/PlaceContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ScrollSnapWrapper } from '@components/atoms/ScrollSnapWrapper';
import { ScrollSnapOverlay } from '@components/atoms/ScrollSnapOverlay';
import { GlassPanel } from '@components/atoms/GlassPanel';
import { Flex } from '@components/atoms/Flex';
import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import checking from '@images/checking.svg';
import { Spacing } from '@components/atoms/Spacing';
import { IteratingMapper } from '@components/atoms/IteratingMapper';
import { IRoutingButton } from '@components/atoms/RoutingButton';
import { ROUTER_PATH } from '@/router';
import { RobotFigure } from '@components/molecules/RobotFigure';
import searching from '@images/searching.svg';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { createQueryKeyWithPlace, fetchRobotsByMap } from '@components/pages/Index';
import { RobotoComment } from '@components/atoms/RobotoComment';
import { Select } from '@components/atoms/Select';
import { IconTextBox } from '@components/molecules/IconTextBox';
import { useConnectionCnt } from '@/context/ConnectionCntContext';

interface IPlaceViewer {
  reset?: () => void;
}

const options = [
  {
    value: 'PLACE_TEST',
    label: '세미나실',
  },
  {
    value: '201',
    label: '복도',
  },
];

export const IndexViewer: React.FC = ({ reset }: IPlaceViewer) => {
  const { place, setPlace } = usePlaceContext();
  const { data } = useSuspenseQuery({
    queryKey: createQueryKeyWithPlace(place),
    queryFn: () => fetchRobotsByMap(place),
  });
  const navigate = useNavigate();
  const { activeConnections } = useConnectionCnt();
  const onClickTemplate = useCallback(
    (path, id) => () => navigate(path, { state: { id: id } }),
    [navigate],
  );
  const { rects, robots } = data;
  const robotsWithPaths = robots.map((robot) => ({
    ...robot,
    path: ROUTER_PATH.ROBOT + `?id=${robot.id}`,
  }));

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlace(event.target.value);
    if (reset) {
      reset();
    }
  };

  return (
    <ScrollSnapWrapper>
      <ScrollSnapOverlay>
        <GlassPanel>
          <div
            style={{
              position: 'absolute',
              transform: 'translate(90%, calc(-100% - 4px))',
              fontSize: '15px',
            }}
          >
            현재 {activeConnections - 1}명이 같은 위치에서 조회하는중!
          </div>
          <Flex flexDirection="column" alignItems="center">
            <RobotoComment comment={`선택한 위치`} />
            <Spacing height={10} />
            <Select options={options} onChange={onChange} defaultValue={place} />
          </Flex>
        </GlassPanel>
      </ScrollSnapOverlay>
      <ScrollSnapContainer>
        <ScrollSnapItem>
          <IconTextBox src={searching} imgAlt="searching motion" text="주변 로봇 탐색" />
          <SVGBitmap rects={rects} robots={robots} maxH={'55vh'} />
          <div
            style={{
              height: '40px',
              fontSize: '20px',
              lineHeight: '40px',
            }}
          >
            미니맵에서 원하는 로봇을 선택해보세요!
          </div>
        </ScrollSnapItem>
        <ScrollSnapItem>
          <IconTextBox src={checking} text="주변 로봇들 자세히 보기" imgAlt="checking tablet" />
          <Spacing />
          <IteratingMapper<IRoutingButton>
            items={robotsWithPaths}
            component={RobotFigure}
            container={Flex}
            otherItemProps={{ onClickTemplate }}
            otherContainerProps={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          />
        </ScrollSnapItem>
      </ScrollSnapContainer>
    </ScrollSnapWrapper>
  );
};
