import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ItemProps } from '@components/atoms/IteratingMapper/type';
import {
  DateString,
  isScheduleTime,
  ScheduleTime,
  scheduleTimes,
} from '@components/molecules/ScheduleTimeTable';
import { IteratingMapper } from '@components/atoms/IteratingMapper';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import { RobotTaskTimePicker } from '@components/organisms/RobotTaskTimePicker';
import { useEffect } from 'react';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';
import { ROUTER_PATH } from '@/router';
import { ScrollSnapWrapper } from '@components/atoms/ScrollSnapWrapper';
import { ScrollSnapOverlay } from '@components/atoms/ScrollSnapOverlay';
import { useLocation } from 'react-router-dom';
import { RobotFigure } from '@components/molecules/RobotFigure';
import { useQueryClient } from '@tanstack/react-query';
import { usePlaceContext } from '@/context/PlaceContext';
import { createQueryKeyWithPlace } from '@components/pages/Index';

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

export const RobotTaskTimeViewer = () => {
  const date: DateString = formatDateToMMDDYY(new Date());
  const location = useLocation();
  const queryClient = useQueryClient();
  const { place } = usePlaceContext();
  const queryData = queryClient.getQueryData(createQueryKeyWithPlace(place));

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const time = searchParams.get('time');
    if (hasUserAlreadySelectedTime(time)) {
      const { container, selectedTable } = getElementsByScheduleTime(time);

      scrollToElement(container, selectedTable);
    }
  });

  return (
    <ScrollSnapWrapper>
      <ScrollSnapOverlay>
        <div
          style={{
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          선택한 로봇 {location.search.slice(location.search.search('id=') + 3)}
          {queryData
            ? queryData.robots
                ?.filter(
                  (robot) => robot.id === location.search.slice(location.search.search('id=') + 3),
                )
                .map((robot) => (
                  <RobotFigure key={robot.id} onClickTemplate={() => () => {}} {...robot} />
                ))
            : null}
        </div>
      </ScrollSnapOverlay>
      {/*// TODO: 동작은 똑같은데 아래의 코드 가독성이 너무 안좋다. 그렇다고 IteratingMapper를 만들어 놓고 안쓰기엔 아까움*/}
      {/*// <ScrollSnapContainer>*/}
      {/*//   {scheduleTimes.map((time) => (*/}
      {/*//     <ScrollSnapItem key={`${date} ${time}`}>*/}
      {/*//       <RobotTaskTimePicker time={time} date={date} />*/}
      {/*//     </ScrollSnapItem>*/}
      {/*//   ))}*/}
      {/*// </ScrollSnapContainer>*/}
      <IteratingMapper<IScheduleTime>
        container={ScrollSnapContainer}
        items={iScheduleTimes}
        otherItemProps={{
          date: date,
        }}
        component={({ time, date }) => {
          return (
            <ScrollSnapItem key={`${date} ${time}`}>
              <RobotTaskTimePicker time={time} date={date} />
            </ScrollSnapItem>
          );
        }}
      />
    </ScrollSnapWrapper>
  );
};

const formatDateToMMDDYY = (date: Date): DateString => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}` as DateString;
};

const hasUserAlreadySelectedTime = (time: string | null): time is ScheduleTime => {
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return time !== null && isScheduleTime(time) && location.pathname === defaultRobotPath;
};

const getElementsByScheduleTime = (time: ScheduleTime) => {
  const container: HTMLElement = document.querySelector(
    `.${scrollContainerStyle['scroll-container']}`,
  );
  const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.${scrollItemStyle['scroll-item']}`,
  );
  const selectedTable: HTMLElement = scheduleTables[scheduleTimes.indexOf(time)];

  return { container, selectedTable };
};

const getScrollPosition = (container: HTMLElement, element: HTMLElement): number => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return elementRect.top - containerRect.top + container.scrollTop;
};

export const scrollToElement = (container: HTMLElement, selectedTable: HTMLElement) => {
  container.scrollTo({
    top: getScrollPosition(container, selectedTable),
    behavior: 'smooth',
  });
};
