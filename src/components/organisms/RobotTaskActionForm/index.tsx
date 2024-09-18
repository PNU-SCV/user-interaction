import { calcTimeSlotByTimeAndIndex, ScheduleTime } from '@components/molecules/ScheduleTimeTable';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

interface IRobotTaskActionForm {
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

  return (
    <Fragment>
      <div>
        {stateDate} {stateTime} {timeSlotStart} ~ {timeSlotEnd}
      </div>
      <Outlet />
    </Fragment>
  );
};
