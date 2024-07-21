import { IRoutingButton, RoutingButton } from '@components/atoms/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { Fragment, useCallback } from 'react';
import { ROUTER_PATH } from '@/router';
import { Header } from '@components/molecules/Header';
import { IteratingMapper } from '@components/atoms/IteratingMapper';

export const Index = () => {
  const navigate = useNavigate();
  const onClickTemplate = useCallback((path) => () => navigate(path), [navigate]);

  const AVAILABLE_ROBOTS = [
    {
      id: 'scv-1',
      label: '1번 로봇',
      path: ROUTER_PATH.ROBOT + '?id=scv-1',
    },
    {
      id: 'scv-2',
      label: '2번 로봇',
      path: ROUTER_PATH.ROBOT + '?id=scv-2',
    },
    {
      id: 'scv-3',
      label: '3번 로봇',
      path: ROUTER_PATH.ROBOT + '?id=scv-3',
    },
  ];

  return (
    <div>
      <Header />
      <p>가용 로봇들</p>
      <IteratingMapper<IRoutingButton>
        items={AVAILABLE_ROBOTS}
        component={RoutingButton}
        container={Fragment}
        otherItemProps={{ onClickTemplate }}
      />
    </div>
  );
};
