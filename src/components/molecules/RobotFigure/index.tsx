import robotPicture from '@images/robot.svg';
import styles from './index.module.css';
import { IRobot } from '@components/pages/Robot';
import React from 'react';
import { AvailabilityIndicator } from '@components/atoms/AvailabilityIndicator';
import { Flex } from '@components/atoms/Flex';

export interface IRobotFigure extends IRobot {
  onClickTemplate: (path: string) => () => void;
}

const TIMES = ['Morning', 'Afternoon', 'Night'];
const MORNING = 0;
const AFTERNOON = 1;
const NIGHT = 2;

export const RobotFigure = ({ id, label, path, onClickTemplate, schedules }: IRobotFigure) => {
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
      <div className={styles['figure--container']} onClick={onClickTemplate(path)}>
        <img src={robotPicture} alt="robot picture" className={styles['figure--image']} />
        <span className={styles['figure--label']}>{label}</span>
      </div>
      <Flex>
        {schedulesGroupByTime.map((obj) => (
          <div
            key={`${id}-${obj.time}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '5px',
            }}
          >
            <p style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>{obj.time}</p>
            <AvailabilityIndicator percentage={obj.workingRate} />
          </div>
        ))}
      </Flex>
    </div>
  );
};
