import styles from './index.module.css';
import { ReactElement } from 'react';

export const MainContainer = ({ children }: { children: ReactElement }) => (
  <div className={styles.container}>{children}</div>
);
