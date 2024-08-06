import { CSSProperties, ReactElement, useMemo } from 'react';
import styles from './index.module.css';

export interface IFlex {
  padding?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  children: ReactElement;
}

export const Flex = ({ padding, justifyContent, alignItems, flexDirection, children }: IFlex) => {
  const style = useMemo(
    () =>
      ({
        padding: padding ?? '',
        justifyContent: justifyContent ?? '',
        alignItems: alignItems ?? '',
        flexDirection: flexDirection ?? '',
      }) as CSSProperties,
    [padding, justifyContent, alignItems, flexDirection],
  );

  return (
    <div className={styles.flex} style={style}>
      {children}
    </div>
  );
};
