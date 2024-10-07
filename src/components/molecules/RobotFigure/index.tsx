import robotPicture from '@images/robot.svg';
import styles from './index.module.css';
import { IRobot } from '@components/pages/Robot';
import React from 'react';
import { AvailabilityIndicator } from '@components/atoms/AvailabilityIndicator';
import { Flex } from '@components/atoms/Flex';

export interface IRobotFigure extends IRobot {
  onClickTemplate: (path: string, id: string) => () => void;
  showSchedule: boolean;
}

const TIMES = ['Morning', 'Afternoon', 'Night'];
const MORNING = 0;
const AFTERNOON = 1;
const NIGHT = 2;

export const RobotFigure = ({
  id,
  label,
  path,
  onClickTemplate,
  schedules,
  showSchedule = true,
}: IRobotFigure) => {
  const schedulesByTime = [[], [], []];

  schedules.forEach((item) => {
    const time = item.time;
    if (time === TIMES[MORNING]) {
      schedulesByTime[MORNING].push(item);
      return;
    }
    if (time === TIMES[AFTERNOON]) {
      schedulesByTime[AFTERNOON].push(item);
      return;
    }
    if (time === TIMES[NIGHT]) {
      schedulesByTime[NIGHT].push(item);
    }
  });

  const schedulesGroupByTime = schedulesByTime.map((schedules, idx) =>
    schedules.reduce(
      (acc, schedule) => ({
        ...acc,
        workingRate: acc.workingRate + schedule.end - schedule.start + 1,
      }),
      { time: TIMES[idx], workingRate: 0 },
    ),
  );

  return (
    <div style={{ display: 'flex' }}>
      <div className={styles['figure--container']} onClick={onClickTemplate(path, id)}>
        <img src={robotPicture} alt="robot picture" className={styles['figure--image']} />
        <span className={styles['figure--label']}>{label}</span>
      </div>
      {showSchedule ? (
        <Flex>
          {schedulesGroupByTime.map((obj) => (
            <div key={`${id}-${obj.time}`} className={styles['work--rate']}>
              <p>{obj.time}</p>
              <AvailabilityIndicator percentage={obj.workingRate} />
            </div>
          ))}
        </Flex>
      ) : null}
    </div>
  );
};
