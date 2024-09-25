import { CSSProperties, ReactElement, ReactNode, useMemo } from 'react';
import styles from './index.module.css';

export interface IFlex {
  padding?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  flexWrap?: string;
  children: ReactNode;
}

export const Flex = ({
  padding,
  justifyContent,
  alignItems,
  flexDirection,
  children,
  flexWrap,
}: IFlex) => {
  const style = useMemo(
    () =>
      ({
        padding: padding ?? '',
        justifyContent: justifyContent ?? '',
        alignItems: alignItems ?? '',
        flexDirection: flexDirection ?? '',
        flexWrap: flexWrap ?? '',
      }) as CSSProperties,
    [padding, justifyContent, alignItems, flexDirection, flexWrap],
  );

  return (
    <div className={styles.flex} style={style}>
      {children}
    </div>
  );
};
