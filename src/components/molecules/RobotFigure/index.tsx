import robotPicture from '@images/robot.svg';
import styles from './index.module.css';
import { IRobot } from '@components/pages/Robot';

export interface IRobotFigure extends IRobot {
  onClickTemplate: (path: string) => () => void;
}

const MORNING = 0;
const AFTERNOON = 1;
const NIGHT = 2;

export const RobotFigure = ({ id, label, path, onClickTemplate, schedules }: IRobotFigure) => {
  const schedulesByTime = [[], [], []];

  schedules.forEach((item) => {
    const time = item.time;
    if (time === 'Morning') {
      schedulesByTime[MORNING].push(item);
      return;
    }
    if (time === 'Afternoon') {
      schedulesByTime[AFTERNOON].push(item);
      return;
    }
    if (time === 'Night') {
      schedulesByTime[NIGHT].push(item);
    }
  });

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
        {schedulesByTime
          .map((schedules) =>
            schedules.reduce(
              (acc, schedule) => ({
                ...acc,
                workingRate: acc.workingRate + schedule.end - schedule.start + 1,
              }),
              { time: schedules[0].time, workingRate: 0 },
            ),
          )
          .map((obj) => (
            <div key={`${id}-${obj.time}`}>
              {obj.time}: {obj.workingRate}%
            </div>
          ))}
      </div>
    </div>
  );
};
