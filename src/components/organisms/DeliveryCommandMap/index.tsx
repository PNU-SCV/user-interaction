import { Fragment, useState } from 'react';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useLocation } from 'react-router-dom';
import { MapStateResp } from '@components/pages/Index';

import Modal from 'react-modal';
import ReactModal from 'react-modal';
import axios from 'axios';

export interface IDeliveryCommandMap {
  data: MapStateResp;
  maxH?: string;
}

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
    width: '800px',
    height: '400px',
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

export const DeliveryCommandMap = ({ data, maxH }: IDeliveryCommandMap) => {
  const location = useLocation();
  const { rects, robots } = data;
  const selectedRobot = robots.filter((robot) => robot.id === location.state.id);
  const [modalState, setModalState] = useState('');

  const confirmToMoveNext = () => {
    axios
      .post('http://localhost:8000/next', {
        robotId: selectedRobot[0].id,
      })
      .then((r) => {
        if (r.data === 'ok') {
          setModalState('');
        }
      });
  };

  return (
    <Fragment>
      <Modal
        isOpen={modalState !== ''}
        style={customModalStyles}
        shouldCloseOnOverlayClick={false}
        contentLabel={modalState}
        ariaHideApp={false}
      >
        <div>{modalState}</div>
        <button type={'button'} onClick={confirmToMoveNext}>
          확인
        </button>
      </Modal>
      <SVGBitmap
        rects={rects}
        robots={selectedRobot}
        bitmapMode="COMMANDER"
        maxH={maxH}
        setOverlayState={(state: string) => setModalState(state)}
      />
    </Fragment>
  );
};
