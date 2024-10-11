import robotPicture from '@images/robot.svg';
import styles from './index.module.css';
import { IRobot } from '@components/pages/Robot';
import React from 'react';
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
  state,
  showSchedule = true,
}: IRobotFigure) => {
  const schedulesByTime = [[], [], []];

  console.log(schedules);

  // schedules.forEach((item) => {
  //   const time = item.time;
  //   if (time === TIMES[MORNING]) {
  //     schedulesByTime[MORNING].push(item);
  //     return;
  //   }
  //   if (time === TIMES[AFTERNOON]) {
  //     schedulesByTime[AFTERNOON].push(item);
  //     return;
  //   }
  //   if (time === TIMES[NIGHT]) {
  //     schedulesByTime[NIGHT].push(item);
  //   }
  // });

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
      {/*<Flex>*/}
      <div style={{ marginTop: '10px', fontSize: '20px' }}>
        예상 대기 시간: {schedules.length * 15}분
      </div>
      {/*<div className={styles['robot--state']}>*/}
      {/*  현재 상태: {state === 'idle' ? '\n즉시 사용 가능' : '\n운행중'}*/}
      {/*</div>*/}
      {/*{showSchedule*/}
      {/*  ? schedulesGroupByTime.map((obj) => (*/}
      {/*      <div key={`${id}-${obj.time}`} className={styles['work--rate']}>*/}
      {/*        <p>{obj.time}</p>*/}
      {/*        <AvailabilityIndicator percentage={obj.workingRate} />*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  : null}*/}
      {/*</Flex>*/}
    </div>
  );
};
