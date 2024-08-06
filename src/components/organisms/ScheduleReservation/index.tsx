import { Fragment, useCallback } from 'react';
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

export interface IScheduleReservation {
  time: ScheduleTime;
  date: DateString; // 'MM/DD/YY'
}

export const ScheduleReservation = ({ time, date }: IScheduleReservation) => {
  const { onClickDelegated, getCellPropertiesByIndex, isSchedulingAllowed, schedule } =
    useSelectScheduleTimeTable(time);
  const navigate = useNavigate();
  const navigateTo = (path: ROUTER_PATH) => () =>
    navigate(path, { state: { ...schedule, date, time } });

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
        disabled={!isSchedulingAllowed}
      />
    </Fragment>
  );
};
