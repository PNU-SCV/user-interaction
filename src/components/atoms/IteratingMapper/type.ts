import type { ElementType } from 'react';

export interface ItemProps {
  id: number | string;
}

export type IteratingItemProps<T extends ItemProps> = {
  items: T[];
  component: ElementType;
};

export type IteratingLayoutProps<T extends ItemProps> = IteratingItemProps<T> & {
  container: ElementType;
};

export type ItemsIteratorProps<T extends ItemProps> = IteratingLayoutProps<T> & {
  otherContainerProps?: object;
  otherItemProps?: object;
};
