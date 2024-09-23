import { FormEvent, Fragment, MouseEvent, MutableRefObject, useRef } from 'react';
import {
  ThreeDimensionalCard,
  ThreeDimensionalCards,
} from '@components/molecules/ThreeDimensionalCards';

import styles from './index.module.css';
import { useLocation } from 'react-router-dom';
import { SVGBitmap } from '@components/molecules/SVGBitmap';
import { useQuery } from '@tanstack/react-query';
import { fetchRobotsByMap, placeName } from '@components/pages/Index';
import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import axios from 'axios';

export const tempPlaceList: ThreeDimensionalCard[] = [
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
    address: '201-6514',
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

const myPlace: ThreeDimensionalCard[] = [
  {
    heading: '세미나실',
    address: '8,19',
    desc: '에어컨',
  },
  {
    heading: '세미나실',
    address: '18,19',
    desc: '문',
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
  {
    heading: '소모품',
    address: '진통제',
    desc: '',
  },
];

type Delivery = {
  robotId: string;
  item: string;
  pick: string;
  dest: string;
};

const requestRobotDelivery = async ({ robotId, item, pick, dest }: Delivery) => {
  console.log(robotId, item, pick, dest);
  const response = await axios.post(`http://localhost:8000/delivery`, {
    robotId: robotId,
    item: item,
    pick: pick,
    dest: dest,
  });

  return response.data;
};

export const Delivery = () => {
  const originRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);
  const itemRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['robots', placeName],
    queryFn: () => fetchRobotsByMap(placeName),
  });

  const onClickTemplate =
    (ref: MutableRefObject<HTMLInputElement | null>) => (address: string) => (e: MouseEvent) => {
      e.preventDefault();
      if (ref.current !== null) {
        const input = ref.current as HTMLInputElement;
        input.value = address;
      }
    };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const originInput = originRef.current as HTMLInputElement;
    const destInput = destRef.current as HTMLInputElement;
    const itemInput = itemRef.current as HTMLInputElement;

    const data = await requestRobotDelivery({
      robotId: location.state.id,
      item: itemInput.value,
      pick: originInput.value,
      dest: destInput.value,
    });

    console.log(data);
  };

  // const onClickSetOrigin = (pos: string) => {
  //   if (originRef.current && originRef.current?.value != undefined) {
  //     const originInput = originRef.current as HTMLInputElement;
  //     originInput.value = pos;
  //   }
  // };

  const onClickSetDest = (pos: string) => {
    if (destRef.current && destRef.current?.value != undefined) {
      const destInput = destRef.current as HTMLInputElement;
      destInput.value = pos;
    }
  };

  return (
    <div className={styles['delivery-form-container']}>
      <form className={styles['delivery-form']} onSubmit={onSubmit}>
        <div>
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
        </div>
      </form>
      <ScrollSnapContainer>
        <ScrollSnapItem>
          <div>빠른 물품 수령 장소 목록</div>
          <ThreeDimensionalCards cardList={myPlace} onClickTemplate={onClickTemplate(originRef)} />
          <div>빠른 물품 배송 장소 목록</div>
          <ThreeDimensionalCards cardList={myPlace} onClickTemplate={onClickTemplate(destRef)} />
          <div>빠른 배송 물품 목록</div>
          <ThreeDimensionalCards
            cardList={tempItemList}
            onClickTemplate={onClickTemplate(itemRef)}
          />
        </ScrollSnapItem>
        <ScrollSnapItem>
          {!isError && !isLoading
            ? (() => {
                const { rects, robots } = data;
                const selectedRobot = robots.filter((robot) => robot.id === location.state.id);

                if (originRef.current) {
                  const originInput = originRef.current as HTMLInputElement;
                  const point = selectedRobot[0].pos;
                  originInput.value = `${point.x},${point.y}`;
                }

                return (
                  <SVGBitmap
                    rects={rects}
                    robots={selectedRobot}
                    bitmapMode={'COMMANDER'}
                    onClickSetDest={onClickSetDest}
                  />
                );
              })()
            : null}
        </ScrollSnapItem>
      </ScrollSnapContainer>
    </div>
  );
};
