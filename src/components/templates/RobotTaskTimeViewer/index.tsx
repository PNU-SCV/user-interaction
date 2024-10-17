import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ItemProps } from '@components/atoms/IteratingMapper/type';
import { DateString, ScheduleTime } from '@components/molecules/ScheduleTimeTable';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import React from 'react';
import { ScrollSnapWrapper } from '@components/atoms/ScrollSnapWrapper';
import { ScrollSnapOverlay } from '@components/atoms/ScrollSnapOverlay';
import { useLocation } from 'react-router-dom';
import { RobotFigure } from '@components/molecules/RobotFigure';
import { GlassPanel } from '@components/atoms/GlassPanel';
import { Flex } from '@components/atoms/Flex';
import { RobotoComment } from '@components/atoms/RobotoComment';
import { IconTextBox } from '@components/molecules/IconTextBox';
import { DeliveryCommandMap } from '@components/organisms/DeliveryCommandMap';

import checking from '@images/checking.svg';
import searching from '@images/searching.svg';
import { RequestOptionsForm } from '@components/molecules/RequestOptionsForm';
import { MapStateResp } from '@/commons/types';
import { useConnectionCnt } from '@/context/ConnectionCntContext';
import { formatDateToMMDDYY } from '@/commons/utils';

interface IScheduleTime extends ItemProps {
  time: ScheduleTime;
}

const iScheduleTimes: IScheduleTime[] = [
  {
    time: 'Morning',
    id: 'Morning',
  },
  {
    time: 'Afternoon',
    id: 'Afternoon',
  },
  {
    time: 'Night',
    id: 'Night',
  },
];

interface IRobotTaskTimeViewer {
  data: MapStateResp;
}

export const RobotTaskTimeViewer = ({ data }: IRobotTaskTimeViewer) => {
  const date: DateString = formatDateToMMDDYY(new Date());
  const location = useLocation();

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const time = searchParams.get('time');
  //   if (hasUserAlreadySelectedTime(time)) {
  //     const { container, selectedTable } = getElementsByScheduleTime(time);
  //
  //     scrollToElement(container, selectedTable);
  //   }
  // });

  const selectedRobot = data.robots.filter(
    (robot) => robot.id === location.search.slice(location.search.search('id=') + 3),
  );

  const selectedRobotId = location.search.slice(location.search.search('id=') + 3);

  const { activeConnections } = useConnectionCnt();
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
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            {selectedRobot.map((robot) => (
              <RobotFigure key={robot.id} onClickTemplate={() => () => {}} {...robot} />
            ))}
          </Flex>
        </GlassPanel>
      </ScrollSnapOverlay>
      <div style={{ zIndex: 999999, position: 'fixed' }}></div>
      <ScrollSnapContainer>
        <ScrollSnapItem>
          <div style={{ height: '20px' }} />
          <IconTextBox
            src={searching}
            imgAlt="searching image"
            text="미니맵을 통해 목적지를 선택하고 로봇을 이동시켜요!"
          />
          <DeliveryCommandMap data={data} maxH={'50vh'} />
          <div
            style={{
              height: '40px',
              fontSize: '20px',
              lineHeight: '40px',
              position: 'relative',
            }}
          >
            ↓아래에서 이동하기 추가 옵션을 설정할 수 있어요
            {/*<svg*/}
            {/*  style={{*/}
            {/*    position: 'absolute',*/}
            {/*    left: 0,*/}
            {/*    // transform: 'translateY(90px)',*/}
            {/*    transform: 'translateY(calc(40vh - 310px))',*/}
            {/*  }}*/}
            {/*  width="100%"*/}
            {/*  height={70}*/}
            {/*  xmlns="http://www.w3.org/2000/svg"*/}
            {/*>*/}
            {/*  <path*/}
            {/*    d="M0 35 Q 25 50, 43 15 Q 25 10, 30 35 Q 40 60, 20, 40 T 1024 35"*/}
            {/*    stroke="black"*/}
            {/*    strokeWidth="2"*/}
            {/*    strokeDasharray="10, 4"*/}
            {/*    fill="transparent"*/}
            {/*  />*/}
            {/*</svg>*/}
          </div>
        </ScrollSnapItem>
        <ScrollSnapItem>
          <div style={{ height: '20px' }} />
          <IconTextBox
            src={checking}
            imgAlt={'checking image'}
            text={'이동 시킬 때 세부 옵션을 설정해요!'}
          />
          <RequestOptionsForm />
        </ScrollSnapItem>
        {/*{scheduleTimes.map((time) => (*/}
        {/*  <ScrollSnapItem key={`${date} ${time}`}>*/}
        {/*    <RobotTaskTimePicker time={time} date={date} />*/}
        {/*  </ScrollSnapItem>*/}
        {/*))}*/}
      </ScrollSnapContainer>
      {/*<IteratingMapper<IScheduleTime>*/}
      {/*  container={ScrollSnapContainer}*/}
      {/*  items={iScheduleTimes}*/}
      {/*  otherItemProps={{*/}
      {/*    date: date,*/}
      {/*  }}*/}
      {/*  component={({ time, date }) => {*/}
      {/*    return (*/}
      {/*      <ScrollSnapItem key={`${date} ${time}`}>*/}
      {/*        <RobotTaskTimePicker time={time} date={date} />*/}
      {/*      </ScrollSnapItem>*/}
      {/*    );*/}
      {/*  }}*/}
      {/*/>*/}
    </ScrollSnapWrapper>
  );
};
