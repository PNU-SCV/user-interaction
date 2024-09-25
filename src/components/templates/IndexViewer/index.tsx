import React, { useCallback } from 'react';
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
  const onClickTemplate = useCallback((path) => () => navigate(path), [navigate]);
  const { rects, robots } = data;
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
          <Flex flexDirection={'column'} alignItems={'center'}>
            <RobotoComment comment="선택한 위치" />
            <select
              value={place}
              onChange={onChange}
              style={{
                border: '2px solid #000',
                width: '200px',
                height: '30px',
                fontSize: '20px',
              }}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Flex>
        </GlassPanel>
      </ScrollSnapOverlay>
      <ScrollSnapContainer>
        <ScrollSnapItem>
          <Flex justifyContent={'center'}>
            <img width={'50px'} src={checking} alt={'checking tablet'} />
            <RobotoComment comment="주변 로봇들 자세히 보기" />
          </Flex>
          <Spacing />
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
          <Flex justifyContent={'center'}>
            <img width={'50px'} src={searching} alt="searching motion" />
            <RobotoComment comment="주변 로봇 탐색" />
          </Flex>
          <SVGBitmap rects={rects} robots={robots} />
        </ScrollSnapItem>
      </ScrollSnapContainer>
    </ScrollSnapWrapper>
  );
};
