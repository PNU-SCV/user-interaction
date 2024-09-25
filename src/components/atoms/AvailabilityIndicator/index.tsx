import React from 'react';
import styles from './index.module.css';

export const AvailabilityIndicator: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className={styles['indicator--container']}>
      <div
        className={styles['indicator--inner']}
        style={{
          width: `${100 - percentage}%`,
        }}
      ></div>
      <div className={styles['indicator--label']}>{100 - percentage}%</div>
    </div>
  );
};
