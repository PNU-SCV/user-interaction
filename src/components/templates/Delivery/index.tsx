import React, { FormEvent, MouseEvent, MutableRefObject, useRef } from 'react';
import {
  ThreeDimensionalCard,
  ThreeDimensionalCards,
} from '@components/molecules/ThreeDimensionalCards';

import styles from './index.module.css';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createQueryKeyWithPlace, fetchRobotsByMap } from '@components/pages/Index';
import { ScrollSnapContainer } from '@components/atoms/ScrollSnapContainer';
import { ScrollSnapItem } from '@components/atoms/ScrollSnapItem';
import axios from 'axios';
import { DeliveryCommandMap } from '@components/organisms/DeliveryCommandMap';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';
import { usePlaceContext } from '@/context/PlaceContext';
import { ScrollSnapOverlay } from '@components/atoms/ScrollSnapOverlay';
import { ScrollSnapWrapper } from '@components/atoms/ScrollSnapWrapper';
import { GlassPanel } from '@components/atoms/GlassPanel';
import { Spacing } from '@components/atoms/Spacing';
import { Flex } from '@components/atoms/Flex';
import Pentagram from '@images/pentagram.svg?react';
import { IconTextBox } from '@components/molecules/IconTextBox';
import Lightbulb from '@images/lightbulb.svg?react';
import { RobotoComment } from '@components/atoms/RobotoComment';
import searchingSpecific from '@images/searchingSpecific.svg';
import table from '@images/tablet.svg';
import { calcTimeSlotByTimeAndIndex } from '@components/molecules/ScheduleTimeTable';
import { RobotFigure } from '@components/molecules/RobotFigure';
import ScheduleNotFound from '@images/scheduleNotFound.svg';
import clock from '@images/clock.svg';
import { scrollToElement } from '@/commons/utils';

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
    heading: '소독세트',
    address: '소모품',
    desc: '',
  },
  {
    heading: '링거액',
    address: '소모품',
    desc: '',
  },
  {
    heading: '거즈',
    address: '소모품',
    desc: '',
  },
  {
    heading: '진통제',
    address: '소모품',
    desc: '',
  },
];

export type DeliveryResp = {
  robotId: string;
  item: string;
  pick: string;
  dest: string;
};

const requestRobotDelivery = async ({ robotId, item, pick, dest }: DeliveryResp) => {
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
  const { place, setPlace } = usePlaceContext();
  const originRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);
  const itemRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData(createQueryKeyWithPlace(place));
  const { data, isLoading, isError } = useQuery({
    queryKey: ['robots', place],
    queryFn: () => fetchRobotsByMap(place),
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

    const container: HTMLElement = document.querySelector(
      `.${scrollContainerStyle['scroll-container']}`,
    );
    const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.${scrollItemStyle['scroll-item']}`,
    );

    scrollToElement(container, scheduleTables[1]);
    console.log(data);
  };

  const onClickSetOrigin = (pos: string) => {
    if (originRef.current && originRef.current?.value != undefined) {
      const originInput = originRef.current as HTMLInputElement;
      originInput.value = pos;
    }
  };

  const onClickSetDest = (pos: string) => {
    if (destRef.current && destRef.current?.value != undefined) {
      const destInput = destRef.current as HTMLInputElement;
      destInput.value = pos;
    }
  };

  const svgSize = 70;

  const { date, time, start, end, id } = location.state;
  const [scheduleStart, scheduleEnd] = [start, end].map((index) =>
    calcTimeSlotByTimeAndIndex(date, index),
  );

  return (
    <ScrollSnapWrapper>
      <ScrollSnapOverlay>
        <GlassPanel>
          <Spacing height={10} />
          <Flex justifyContent="center">
            <Pentagram width={svgSize} height={svgSize} />
            <form className={styles['delivery-form']} onSubmit={onSubmit}>
              <label>
                <span
                  style={{
                    textDecorationColor: '#76c7c0',
                  }}
                >
                  물품 수령 장소
                </span>
                <input ref={originRef} placeholder="직접 선택하기" />
              </label>
              <label>
                <span
                  style={{
                    textDecorationColor: 'lightskyblue',
                  }}
                >
                  물품 배송 장소
                </span>
                <input ref={destRef} placeholder="직접 선택하기" />
              </label>
              <label>
                <span
                  style={{
                    textDecorationColor: 'lightcoral',
                  }}
                >
                  배송 물품
                </span>
                <input ref={itemRef} placeholder="직접 입력하기" />
              </label>
              <button>확인</button>
            </form>
          </Flex>
        </GlassPanel>
      </ScrollSnapOverlay>
      <ScrollSnapContainer>
        <ScrollSnapItem>
          <Spacing height={10} />
          <IconTextBox imgSize={60} src={table} imgAlt="save information" text="선택된 옵션들" />
          {/*<Spacing height={10} />*/}
          <Flex flexDirection="column" alignItems="center">
            {/*<p>선택한 로봇 {id}</p>*/}
            {queryData ? (
              queryData.robots
                ?.filter((robot) => robot.id === id)
                .map((robot) => (
                  <RobotFigure
                    key={robot.id}
                    showSchedule={false}
                    onClickTemplate={() => () => {}}
                    {...robot}
                  />
                ))
            ) : (
              <IconTextBox
                src={ScheduleNotFound}
                imgAlt="robot surprised"
                text={`로봇의 상세 정보를 불러오지 못했어요. (${id})`}
              />
            )}
          </Flex>
          <IconTextBox
            src={clock}
            imgAlt={'clock image'}
            text={`${date} ${time} ${scheduleStart} ~ ${scheduleEnd}`}
            imgSize={60}
          />
          <Spacing height={30} />
          <Flex justifyContent="center">
            <Lightbulb width={svgSize} height={svgSize} />
            <RobotoComment comment="장소 클릭으로 채우기" />
          </Flex>
          <div
            style={{
              textDecoration: 'underline',
              textDecorationColor: '#76c7c0',
              textDecorationThickness: '4px',
              fontSize: '22px',
            }}
          >
            수령 장소
          </div>
          <ThreeDimensionalCards cardList={myPlace} onClickTemplate={onClickTemplate(originRef)} />
          <Spacing />
          <div
            style={{
              textDecoration: 'underline',
              textDecorationColor: 'lightskyblue',
              textDecorationThickness: '4px',
              fontSize: '22px',
            }}
          >
            배송 장소
          </div>
          <ThreeDimensionalCards cardList={myPlace} onClickTemplate={onClickTemplate(destRef)} />
          <Spacing />
          <div
            style={{
              textDecoration: 'underline',
              textDecorationColor: 'lightcoral',
              textDecorationThickness: '4px',
              fontSize: '22px',
            }}
          >
            물품 목록
          </div>
          <ThreeDimensionalCards
            cardList={tempItemList}
            onClickTemplate={onClickTemplate(itemRef)}
          />
        </ScrollSnapItem>
        {!isError && !isLoading && data ? (
          <ScrollSnapItem>
            <IconTextBox
              src={searchingSpecific}
              imgAlt="searching image"
              text="주변 환경 및 경로"
            />
            <DeliveryCommandMap
              data={data}
              onClickSetOrigin={onClickSetOrigin}
              onClickSetDest={onClickSetDest}
            />
          </ScrollSnapItem>
        ) : null}
      </ScrollSnapContainer>
    </ScrollSnapWrapper>
  );
};
