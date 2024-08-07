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

export interface IScheduleReservation {
  time: ScheduleTime;
  date: DateString; // 'MM/DD/YY'
}

export const ScheduleReservation = ({ time, date }: IScheduleReservation) => {
  const { onClickDelegated, getCellPropertiesByIndex, isScheduleNotFulfilled, schedule } =
    useSelectScheduleTimeTable(time);
  const navigate = useNavigate();
  const navigateTo = (path: ROUTER_PATH) => () => {
    // NOTE: 이동한 페이지에서 뒤로가기 했을 때, 선택했던 스케줄 기억하고 있으면 좋겠어서 url로 넘겼는데 navigate 두 번 하는게 맞는지.
    navigate(`${location.pathname}?start=${schedule.start}&end=${schedule.end}`, { replace: true });
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
