import React, { useState } from 'react';
import styles from './index.module.css';
import { useRequestOptions } from '@/context/RequestOptionsContext';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';
import { scrollToElement } from '@components/templates/RobotTaskTimeViewer';
import { useSelectedPoints } from '@/context/SelectedPointsContext';

export const RequestOptionsForm: React.FC = () => {
  const {
    waitTime,
    cancelIfUnconfirmed,
    destMsgs,
    disableInputs,
    setWaitTime,
    setCancelIfUnconfirmed,
    setDestMsgs,
    setDisableInputs,
  } = useRequestOptions();
  const { selectedPoints = [] } = useSelectedPoints();

  const scrollToMap = () => {
    const container: HTMLElement = document.querySelector(
      `.${scrollContainerStyle['scroll-container']}`,
    );
    const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.${scrollItemStyle['scroll-item']}`,
    );

    scrollToElement(container, scheduleTables[0]);
  };

  const onClickSave = () => {
    const sendButton: HTMLButtonElement = document.querySelector('#moveButton');
    sendButton.click();

    setTimeout(scrollToMap, 500);
  };

  const setDestMsg = (i: number) => (e) =>
    setDestMsgs((prev) => {
      const copy = [...prev];
      copy[i] = e.target.value;
      return copy;
    });

  return (
    <form className={styles['request--options']}>
      <li>
        <label>
          <span>
            중간 목적지 <b>대기 시간</b>
          </span>
          <input
            type="number"
            onChange={(e) => setWaitTime(parseInt(e.target.value))}
            className={styles['input-style']}
            value={waitTime}
          />
          분
        </label>
      </li>
      <li>
        <div className={styles['checkbox-wrapper-19']}>
          <span>
            중간 목적지 대기중 확인 못받을 시 이동 <b>취소하기</b>
          </span>
          <input
            id="cbtest-19"
            type="checkbox"
            checked={cancelIfUnconfirmed}
            onChange={(e) => setCancelIfUnconfirmed(e.target.checked)}
          />
          <label className={styles['check-box']} htmlFor="cbtest-19"></label>
        </div>
      </li>
      <li>
        <div className={styles['msg--heading']}>
          목적지간 <b>도착 메세지</b> 정하기
        </div>
      </li>
      <div className={styles['msg--container']}>
        {selectedPoints.map((point, idx) => (
          <div key={`${point.x},${point.y}`}>
            <span>{idx + 1 === selectedPoints.length ? '최종' : `${idx + 1}번.`} 도착 지점</span>

            <input
              onChange={setDestMsg(idx)}
              className={styles['input-style']}
              placeholder={'도착시 표시할 메세지'}
              disabled={disableInputs}
            />
          </div>
        ))}
      </div>
      <button className={styles['submit--button']} type={'button'} onClick={onClickSave}>
        저장후 이동시키기
      </button>
    </form>
  );
};
