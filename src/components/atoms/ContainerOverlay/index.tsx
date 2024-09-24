import styles from './index.module.css';

export const ContainerOverlay = ({ children }) => {
  return <div className={styles['container--overlay']}>{children}</div>;
};
