import { FormEvent, Fragment, MouseEvent, MutableRefObject, useRef } from 'react';
import {
  ThreeDimensionalCard,
  ThreeDimensionalCards,
} from '@components/molecules/ThreeDimensionalCards';

import styles from './index.module.css';

const tempPlaceList: ThreeDimensionalCard[] = [
  {
    heading: '과도',
    address: '201-6518',
    desc: '도서관',
  },
  {
    heading: '강의실 A',
    address: '201-6515',
    desc: '모서리 강의실',
  },
  {
    heading: '강의실 B',
    address: '201-6516',
    desc: '',
  },
  {
    heading: '회의실',
    address: '201-6518',
    desc: '',
  },
  {
    heading: '화장실A',
    address: '201-5-TA',
    desc: '도서관 화장실',
  },
  {
    heading: '화장실B',
    address: '201-5-TB',
    desc: '회의실 화장실',
  },
];

const tempItemList: ThreeDimensionalCard[] = [
  {
    heading: '소모품',
    address: '소독세트',
    desc: '',
  },
  {
    heading: '소모품',
    address: '링거액',
    desc: '',
  },
  {
    heading: '소모품',
    address: '거즈',
    desc: '',
  },
];

export const Delivery = () => {
  const originRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);
  const itemRef = useRef<HTMLInputElement | null>(null);

  const onClickTemplate =
    (ref: MutableRefObject<HTMLInputElement | null>) => (address: string) => (e: MouseEvent) => {
      e.preventDefault();
      if (ref.current !== null) {
        const input = ref.current as HTMLInputElement;
        input.value = address;
      }
    };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <Fragment>
      <h2>물품 배달</h2>
      <div>빠른 물품 수령 장소 목록</div>
      <ThreeDimensionalCards
        cardList={tempPlaceList}
        onClickTemplate={onClickTemplate(originRef)}
      />
      <div>빠른 물품 배송 장소 목록</div>
      <ThreeDimensionalCards cardList={tempPlaceList} onClickTemplate={onClickTemplate(destRef)} />
      <div>빠른 배송 물품 목록</div>
      <ThreeDimensionalCards cardList={tempItemList} onClickTemplate={onClickTemplate(itemRef)} />
      <form className={styles['delivery-form']} onSubmit={onSubmit}>
        <label>
          물품 배송 장소:
          <input ref={originRef} placeholder="직접 선택하기" />
        </label>
        <label>
          물품 수령 장소:
          <input ref={destRef} placeholder="직접 선택하기" />
        </label>
        <label>
          배송 물품:
          <input ref={itemRef} placeholder="직접 입력하기" />
        </label>
        <button>확인</button>
      </form>
    </Fragment>
  );
};
