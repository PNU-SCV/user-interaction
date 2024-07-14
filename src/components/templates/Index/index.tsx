import { SimpleButton } from '@components/atoms/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { ROUTER_PATH } from '@/router';

export const Index = () => {
  const navigate = useNavigate();
  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);

  return (
    <div>
      <p>가용 로봇들</p>
      <SimpleButton
        label="1번 로봇"
        path={ROUTER_PATH.ROBOT}
        id={0}
        directOnClickTemplate={navigateTo}
      />
    </div>
  );
};
