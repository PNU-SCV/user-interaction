import { Fragment, useState } from 'react';
import {
  DateString,
  ScheduleTime,
  ScheduleTimeTable,
} from '@components/molecules/ScheduleTimeTable';
import { Schedule, useSelectScheduleTimeTable } from '@/hooks/useSelectScheduleTimeTable';
import { useNavigate } from 'react-router-dom';
import { RoutingButtons } from '@components/molecules/RoutingButtons';
import { Flex } from '@components/atoms/Flex';
import { ROUTER_PATH } from '@/router';
import { useQuery } from '@tanstack/react-query';

export interface IScheduleReservation {
  time: ScheduleTime;
  date: DateString; // 'MM/DD/YY'
}

export type ScheduleDetail = {
  who: string;
  time: ScheduleTime;
  task: string;
} & Schedule;

type ScheduleResp = {
  schedules: ScheduleDetail[];
};

const fetchRobotScheduleById = async (robotId: string): Promise<ScheduleResp> => {
  const response = await fetch(`http://localhost:8000/schedule/${robotId}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  return await response.json();
};

export const RobotTaskTimePicker = ({ time, date }: IScheduleReservation) => {
  const [robotId, setRobotId] = useState(location.search.slice(location.search.search('id=') + 3));
  const { data, isLoading, isError } = useQuery({
    queryKey: [`schedule-${robotId}`],
    queryFn: () => fetchRobotScheduleById(robotId),
  });

  const { onClickDelegated, getCellPropertiesByIndex, isScheduleNotFulfilled, schedule } =
    useSelectScheduleTimeTable(time, !isLoading && !isError ? data.schedules : []);
  const navigate = useNavigate();
  const navigateTo = (path: ROUTER_PATH) => () => {
    // TODO : popstate 이벤트 감지해서 state 넣어주는 거 보단 이게 낫지 않을까.
    navigate(`${location.pathname}?start=${schedule.start}&end=${schedule.end}&time=${time}`, {
      replace: true,
    });
    navigate(path, { state: { ...schedule, date, time } });
  };

  return (
    <Fragment>
      <ScheduleTimeTable
        onClickDelegated={onClickDelegated}
        getCellPropertiesByIndex={getCellPropertiesByIndex}
        time={time}
        date={date}
      />
      <RoutingButtons
        onClickTemplate={navigateTo}
        container={Flex}
        disabled={isScheduleNotFulfilled}
      />
    </Fragment>
  );
};
