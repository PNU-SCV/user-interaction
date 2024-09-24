import styles from './index.module.css';
import React, { ReactNode } from 'react';

export const ScrollSnapOverlay: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles['container--overlay']}>{children}</div>;
};
