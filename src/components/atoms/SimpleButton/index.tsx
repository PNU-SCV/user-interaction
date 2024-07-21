import styles from './index.module.css';
import { ItemProps } from '@components/atoms/IteratingMapper/type';

export interface IRoutingButton extends ItemProps {
  label: string;
  path?: string;
  onClickTemplate?: (path: string) => () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export const RoutingButton = ({
  label,
  onClickTemplate,
  onClick,
  path = '',
  disabled = false,
}: IRoutingButton) => {
  if (onClick) {
    return (
      <div className={styles.card}>
        <div className="card">
          <button disabled={disabled} onClick={onClick}>
            {label}
          </button>
        </div>
      </div>
    );
  }

  if (onClickTemplate) {
    return (
      <div className={styles.card}>
        <div className="card">
          <button disabled={disabled} onClick={onClickTemplate(path as string)}>
            {label}
          </button>
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
