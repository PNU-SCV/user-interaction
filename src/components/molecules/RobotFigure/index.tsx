import robotPicture from '@images/robot.svg';
import styles from './index.module.css';

export interface IRobotFigure {
  id: string;
  label: string;
  path: string;
  onClickTemplate: (path: string) => () => void;
}

export const RobotFigure = ({ id, label, path, onClickTemplate }: IRobotFigure) => {
  return (
    <div
      className={styles['figure--container']}
      style={{
        width: '50px',
        height: '50px',
        margin: '5px auto',
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
        {id === 'scv-3' ? '일하는중' : label}
      </span>
    </div>
  );
};
