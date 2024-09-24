import React, { ReactNode } from 'react';
import styles from './index.module.css';
export const ScrollSnapWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles['container--wrapper']}>{children}</div>;
};
