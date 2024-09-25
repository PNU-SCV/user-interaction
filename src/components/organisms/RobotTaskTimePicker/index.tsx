import { Fragment } from 'react';
import {
  DateString,
  ScheduleTime,
  ScheduleTimeTable,
} from '@components/molecules/ScheduleTimeTable';
import { useSelectScheduleTimeTable } from '@/hooks/useSelectScheduleTimeTable';
import { useNavigate } from 'react-router-dom';
import { RoutingButtons } from '@components/molecules/RoutingButtons';
import { Flex } from '@components/atoms/Flex';
import { ROUTER_PATH } from '@/router';
import { Spacing } from '@components/atoms/Spacing';
import Morning from '@images/morning.svg?react';
import Afternoon from '@images/afternoon.svg?react';
import Night from '@images/night.svg?react';

export interface IScheduleReservation {
  time: ScheduleTime;
  date: DateString; // 'MM/DD/YY'
}

export const RobotTaskTimePicker = ({ time, date }: IScheduleReservation) => {
  const robotId = location.search.slice(location.search.search('id=') + 3);
  const { onClickDelegated, getCellPropertiesByIndex, isScheduleNotValid, schedule } =
    useSelectScheduleTimeTable(time, robotId);
  const navigate = useNavigate();

  const navigateTo = (path: ROUTER_PATH) => () => {
    // TODO : popstate 이벤트 감지해서 state 넣어주는 거 보단 이게 낫지 않을까.
    navigate(
      `${location.pathname}?start=${schedule.start}&end=${schedule.end}&time=${time}&id=${robotId}`,
      {
        replace: true,
      },
    );
    navigate(path, { state: { ...schedule, date, time, id: robotId } });
  };

  const svgSize = 70;
  return (
    <Fragment>
      <Spacing />
      <Flex>
        {time === 'Morning' ? <Morning width={svgSize} height={svgSize} /> : null}
        {time === 'Afternoon' ? <Afternoon width={svgSize} height={svgSize} /> : null}
        {time === 'Night' ? <Night width={svgSize} height={svgSize} /> : null}
      </Flex>
      <ScheduleTimeTable
        onClickDelegated={onClickDelegated}
        getCellPropertiesByIndex={getCellPropertiesByIndex}
        time={time}
        date={date}
      />
      <RoutingButtons onClickTemplate={navigateTo} container={Flex} disabled={isScheduleNotValid} />
    </Fragment>
  );
};
