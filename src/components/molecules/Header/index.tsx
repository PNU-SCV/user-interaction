import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import ForwardIcon from '@images/forwardArrow.svg?react';
import BackwardIcon from '@images/backwardArrow.svg?react';
import { Flex } from '@components/atoms/Flex';

export const Header = () => {
  const navigate = useNavigate();
  const navigateBack = useCallback(() => navigate(-1), []);
  const navigateForward = useCallback(() => navigate(1), []);

  const disableBackButton = window.history.state?.idx <= 0;
  const disableForwardButton = window.history.state?.idx >= window.history.length - 1;

  return (
    <header
      style={{
        // backgroundColor: 'lightskyblue',
        display: 'flex',
        overflow: 'hidden',
        height: '10vh',
        alignItems: 'center',
      }}
    >
      <button
        style={{
          padding: 0,
          height: 'max-content',
        }}
        disabled={disableBackButton}
        onClick={navigateBack}
      >
        <BackwardIcon
          width={'50px'}
          height={'50px'}
          style={{
            opacity: disableBackButton ? 0.5 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
      </button>
      <button
        style={{
          padding: 0,
          height: 'max-content',
        }}
        disabled={disableForwardButton}
        onClick={navigateForward}
      >
        <ForwardIcon
          width={'50px'}
          height={'50px'}
          style={{
            opacity: disableForwardButton ? 0.5 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
      </button>
      <Flex justifyContent={'center'}>
        <p
          style={{
            fontSize: '32px',
            fontFamily: 'Roboto',
            fontWeight: 700,
          }}
        >
          스마트 케어 5
        </p>
      </Flex>
    </header>
  );
};
