import { IteratingMapper } from '../../atoms/IteratingMapper';
import { ElementType, Fragment, ReactElement } from 'react';
import { ROBOT_ROUTER_PATH_ARRAY } from '@/router';
import { IRoutingButton, RoutingButton } from '@components/atoms/RoutingButton';

export interface IRoutingButtons {
  onClickTemplate: (path: string) => () => void;
  containerClassName?: string;
  container?: ElementType | ReactElement;
}

export const RoutingButtons = ({
  onClickTemplate,
  container = Fragment,
  containerClassName,
}: IRoutingButtons) => {
  return (
    <IteratingMapper<IRoutingButton>
      container={container as ElementType}
      component={RoutingButton}
      items={ROBOT_ROUTER_PATH_ARRAY}
      otherItemProps={{ onClickTemplate }}
      otherContainerProps={{ className: containerClassName }}
    />
  );
};
