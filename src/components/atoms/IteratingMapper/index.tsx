import { ItemProps, ItemsIteratorProps } from './type';
import { ReactElement } from 'react';

export const IteratingMapper = <T extends ItemProps>({
  items,
  component: Component,
  container: Container,
  otherContainerProps = {},
  otherItemProps = {},
}: ItemsIteratorProps<T>): ReactElement => {
  return (
    <Container {...otherContainerProps}>
      {items.map(({ id, ...props }) => (
        <Component key={id} id={id} {...props} {...otherItemProps} />
      ))}
    </Container>
  );
};
