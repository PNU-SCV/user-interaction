import styles from './index.module.css';
import { ItemProps } from '@components/atoms/IteratingMapper/type';

export interface ISimpleButton extends ItemProps {
  label: string;
  path: string;
  onClickTemplate?: (path: string) => () => void;
  directOnClickTemplate?: (path: string) => () => void;
}

export const SimpleButton = ({
  label,
  path,
  onClickTemplate,
  directOnClickTemplate,
}: ISimpleButton) => {
  if (directOnClickTemplate) {
    return (
      <div className={styles.card}>
        <div className="card">
          <button onClick={directOnClickTemplate(path)}>{label}</button>
        </div>
      </div>
    );
  }

  if (onClickTemplate) {
    return (
      <div className={styles.card}>
        <div className="card">
          <button onClick={onClickTemplate(path)}>{label}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className="card">
        <button disabled={true}>{label}</button>
      </div>
    </div>
  );
};
