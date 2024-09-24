import robotPicture from '@images/robot.svg';
import styles from './index.module.css';
import { IRobot } from '@components/pages/Robot';
import React from 'react';

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
      <div
        className={styles['figure--container']}
        style={{
          width: '50px',
          height: '50px',
        }}
        onClick={onClickTemplate(path)}
      >
        <img
          src={robotPicture}
          alt="robot picture"
          width={'50px'}
          height={'50px'}
          className={styles['figure--image']}
        />
        <span className={styles['figure--label']} style={{ fontSize: '10px' }}>
          {label}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        {schedulesGroupByTime.map((obj) => (
          <div key={`${id}-${obj.time}`} style={{ display: 'flex', alignItems: 'center' }}>
            <p>{obj.time}</p>
            <AvailabilityIndicator percentage={obj.workingRate} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AvailabilityIndicator: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div
      style={{
        width: '30px',
        height: '10px',
        border: '2px solid #000',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: '#eee',
        margin: '0 2px',
      }}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: '#76c7c0',
          width: `${100 - percentage}%`,
          borderRadius: '6px 0 0 6px',
          transition: 'width 0.5s ease',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        {100 - percentage}%
      </div>
    </div>
  );
};
