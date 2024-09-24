import { calcTimeSlotByTimeAndIndex, ScheduleTime } from '@components/molecules/ScheduleTimeTable';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTimeContext } from '@/context/TimeContext';

export interface IRobotTaskActionForm {
  start: number;
  end: number;
  date: string;
  time: ScheduleTime;
}

export const RobotTaskActionForm = ({
  date: stateDate,
  time: stateTime,
  start = null,
  end = null,
}: IRobotTaskActionForm) => {
  const [timeSlotStart, timeSlotEnd] = [start, end].map((index) =>
    calcTimeSlotByTimeAndIndex(stateTime, index),
  );

  const { setSelectedTime } = useTimeContext();

  setSelectedTime({
    time: stateTime,
    date: stateDate,
    start: timeSlotStart,
    end: timeSlotEnd,
  });

  return (
    // <div>
    //   {stateDate} {stateTime} {timeSlotStart} ~ {timeSlotEnd}
    // </div>
    <Outlet />
  );
};
