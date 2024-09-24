import styles from './index.module.css';

export const ScrollSnapOverlay = ({ children }) => {
  return <div className={styles['container--overlay']}>{children}</div>;
};
