import React, { ReactNode } from 'react';
import styles from './index.module.css';

export const GlassPanel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className={styles.panel}>{children}</div>
);
