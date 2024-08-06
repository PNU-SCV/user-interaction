import { IteratingMapper } from '../../atoms/IteratingMapper';
import { ElementType, Fragment, ReactElement } from 'react';
import { ROBOT_ROUTER_PATH_ARRAY } from '@/router';
import { IRoutingButton, RoutingButton } from '@components/atoms/RoutingButton';

export interface IRoutingButtons {
  onClickTemplate: (path: string) => () => void;
  containerClassName?: string;
  container: ElementType;
}

export const RoutingButtons = ({
  onClickTemplate,
  container,
  containerClassName,
}: IRoutingButtons) => {
  return (
    <IteratingMapper<IRoutingButton>
      container={container}
      component={RoutingButton}
      items={ROBOT_ROUTER_PATH_ARRAY.slice(1)}
      otherItemProps={{ onClickTemplate }}
      otherContainerProps={{ className: containerClassName }}
    />
  );
};
