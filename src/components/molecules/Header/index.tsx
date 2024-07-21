import { RoutingButton } from '@components/atoms/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const navigateBack = useCallback(() => navigate(-1), []);
  const navigateForward = useCallback(() => navigate(1), []);

  const disableBackButton = window.history.state?.idx <= 0;
  const disableForwardButton = window.history.state?.idx >= window.history.length - 1;

  return (
    <header style={{ backgroundColor: 'lightskyblue', display: 'flex' }}>
      <RoutingButton
        label="⬅️"
        id="history.-1"
        disabled={disableBackButton}
        onClick={navigateBack}
      />
      <RoutingButton
        label="➡️"
        id="history.1"
        disabled={disableForwardButton}
        onClick={navigateForward}
      />
    </header>
  );
};
