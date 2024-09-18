import styles from './index.module.css';

export const ScrollSnapItem = ({ children }) => {
  return <div className={styles['scroll-item']}>{children}</div>;
};
