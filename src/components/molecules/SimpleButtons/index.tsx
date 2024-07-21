import { IteratingMapper } from '../../atoms/IteratingMapper';
import { Fragment } from 'react';
import { ROBOT_ROUTER_PATH_ARRAY } from '@/router';
import { IRoutingButton, RoutingButton } from '@components/atoms/SimpleButton';

export interface ISimpleButtons {
  onClickTemplate: (path: string) => () => void;
}

export const SimpleButtons = ({ onClickTemplate }: ISimpleButtons) => {
  return (
    <IteratingMapper<IRoutingButton>
      container={Fragment}
      component={RoutingButton}
      items={ROBOT_ROUTER_PATH_ARRAY}
      otherItemProps={{ onClickTemplate }}
    />
  );
};
