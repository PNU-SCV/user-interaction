import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import styles from './index.module.css';
import { Flex } from '@components/atoms/Flex';

export const CountdownModal = ({ modalState, decreaseWaitTime, closeModal, confirmToMoveNext }) => {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const handleRequestClose = () => {
    setShowCloseConfirmation(true);
  };

  const confirmNextAndCloseAll = () => {
    setShowCloseConfirmation(false);
    confirmToMoveNext();
  };

  const cancelClose = () => {
    setShowCloseConfirmation(false);
  };

  useEffect(() => {
    if (modalState.waitTime > 0) {
      const timer = setInterval(() => {
        decreaseWaitTime();
      }, 1000);

      if (modalState.waitTime === 0) {
        clearInterval(timer);
        confirmNextAndCloseAll();
      }

      return () => clearInterval(timer);
    }
  }, [confirmToMoveNext, modalState]);

  return (
    <Modal
      isOpen={modalState.msg !== ''}
      style={customModalStyles}
      onRequestClose={handleRequestClose}
      contentLabel={modalState.msg}
      ariaHideApp={false}
      preventScroll={true}
    >
      <div className={styles['countdown__modal']}>
        <div>
          대기 종료까지 남은 시간: <span>{formatTime(modalState.waitTime)}</span>
        </div>
        <div>{modalState.msg}</div>
        <button onClick={confirmNextAndCloseAll}>확인</button>
        {showCloseConfirmation && (
          <div className={styles['close-confirmation']}>
            <p>확인 창을 닫으시겠습니까?</p>
            <Flex justifyContent={'center'}>
              <button onClick={closeModal}>예</button>
              <button onClick={cancelClose}>아니오</button>
            </Flex>
          </div>
        )}
      </div>
      <div
        style={{
          height: '40px',
          fontSize: '18px',
          lineHeight: '40px',
          textAlign: 'center',
          color: 'gray',
        }}
      >
        ↓확인을 누르지 않아도 아래의 버튼을 사용할 수 있어요!
      </div>
    </Modal>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: ' rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100vh',
    zIndex: '10',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  content: {
    width: '85%',
    height: '60%',
    zIndex: '150',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'white',
    justifyContent: 'center',
    overflow: 'auto',
  },
};
