import styles from './index.module.css';

export const ScrollSnapContainer = ({ children }) => {
  return <div className={styles['scroll-container']}>{children}</div>;
};
