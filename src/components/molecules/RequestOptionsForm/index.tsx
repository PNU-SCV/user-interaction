import React, { useState } from 'react';
import styles from './index.module.css';
import { useRequestOptions } from '@/context/RequestOptionsContext';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';
import { useSelectedPoints } from '@/context/SelectedPointsContext';
import { scrollToElement } from '@/commons/utils';
import { Select } from '@components/atoms/Select';

const selectOptions = {
  object: [
    { label: '물건', value: '' },
    { label: '거즈', value: '거즈 ' },
    { label: '물병', value: '물병 ' },
    { label: '담요', value: '담요 ' },
    { label: '살균세트', value: '살균세트 ' },
  ],
  amount: [
    { label: '개수', value: '' },
    { label: '1개', value: '1개 ' },
    { label: '2개', value: '2개 ' },
    { label: '3개', value: '3개 ' },
    { label: '4개', value: '4개 ' },
    { label: '5개', value: '5개 ' },
    { label: '6개', value: '6개 ' },
    { label: '7개', value: '7개 ' },
    { label: '8개', value: '8개 ' },
    { label: '9개', value: '9개 ' },
    { label: '10개', value: '10개 ' },
  ],
  append: [
    { label: '행동', value: '' },
    { label: '주세요!', value: '주세요! ' },
    { label: '수령하셨나요?', value: '수령하셨나요? ' },
  ],
};

const SelectAppend: React.FC<{
  options: { label: string; value: string }[];
  idx: number;
  handleSelectChange: (idx: number, value: string) => void;
}> = ({ options, idx, handleSelectChange }) => (
  <Select
    options={options}
    onChange={(e) => {
      handleSelectChange(idx, e.target.value);
      e.target.value = '';
    }}
    onClick={(e) => e.stopPropagation()}
  />
);

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
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);
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

  const setDestMsg =
    (i: number) =>
    (value = '') =>
      setDestMsgs((prev) => {
        const copy = [...prev];
        if (copy[i]) {
          copy[i] += value;
          return copy;
        }
        copy[i] = value;
        return copy;
      });

  const handleInputChange = (i, value) => {
    const findMyInput = setDestMsg(i);
    findMyInput(value);
  };

  const handleSelectChange = (i, value) => {
    if (value !== '') {
      handleInputChange(i, value);
    }
  };

  const handleInputClick = (index, e) => {
    e.stopPropagation();
    setFocusedInputIndex(index);
  };

  const handleInputBlur = () => {
    setFocusedInputIndex(null);
  };

  return (
    <form className={styles['request--options']} onClick={handleInputBlur}>
      <li>
        <label>
          <span>
            목적지 별 <b>대기 시간</b>
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
            목적지에서 대기중 확인 못받을 시 이동 <b>취소하기</b>
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
      <div className={styles['msg--container']} onScroll={handleInputBlur}>
        {selectedPoints.map((point, idx) => (
          <div key={`${point.x},${point.y}`}>
            <span>{idx + 1 === selectedPoints.length ? '최종' : `${idx + 1}번.`} 도착 지점</span>
            <input
              value={destMsgs[idx] || ''}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onClick={(e) => handleInputClick(idx, e)}
              className={styles['input-style']}
              placeholder={'도착시 표시할 메세지'}
              disabled={disableInputs}
            />
            {focusedInputIndex === idx && (
              <div className={styles['select-container']}>
                {Object.keys(selectOptions).map((key) => (
                  <SelectAppend
                    key={key}
                    options={selectOptions[key as keyof typeof selectOptions]}
                    idx={idx}
                    handleSelectChange={handleSelectChange}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {selectedPoints.length === 0 ? (
          <div className={styles['msg--container--empty']}>목적지를 선택해 주세요</div>
        ) : null}
      </div>
      <button className={styles['submit--button']} type={'button'} onClick={onClickSave}>
        저장후 이동시키기
      </button>
    </form>
  );
};
