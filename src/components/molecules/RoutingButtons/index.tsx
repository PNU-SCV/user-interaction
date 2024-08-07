import { IteratingMapper } from '../../atoms/IteratingMapper';
import { ElementType } from 'react';
import { ROBOT_ROUTER_PATH_ARRAY } from '@/router';
import { IRoutingButton, RoutingButton } from '@components/atoms/RoutingButton';

export interface IRoutingButtons {
  onClickTemplate: (path: string) => () => void;
  containerClassName?: string;
  container: ElementType;
  disabled?: boolean;
}

export const RoutingButtons = ({
  onClickTemplate,
  container,
  containerClassName,
  disabled,
}: IRoutingButtons) => {
  return (
    <IteratingMapper<IRoutingButton>
      container={container}
      component={RoutingButton}
      items={ROBOT_ROUTER_PATH_ARRAY.slice(1)}
      otherItemProps={{ onClickTemplate, disabled }}
      otherContainerProps={{ className: containerClassName, flexWrap: 'wrap' }}
    />
  );
};
