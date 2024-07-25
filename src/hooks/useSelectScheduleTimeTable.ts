import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import styles from '@components/molecules/ScheduleTimeTable/index.module.css';

type Schedule = {
  start: number | null;
  end: number | null;
};

const availabilitiesInit = Array.from({ length: 12 * 6 }, (_) => true);

export const useSelectScheduleTimeTable = () => {
  const [schedule, setSchedule] = useState<Schedule>({ start: null, end: null });
  const [availabilities, setAvailabilities] = useState<boolean[]>(availabilitiesInit);
  const mockUseQueryReserved = [
    {
      who: 'tae!',
      start: 0,
      end: 10,
    },
    {
      who: 'won!',
      start: 50,
      end: 53,
    },
  ];

  const getAvailabilityByIndex = useCallback(
    (index: number) => {
      return availabilities[index];
    },
    [availabilities],
  );

  const reservedEdges = useMemo(() => {
    return mockUseQueryReserved.reduce(
      (acc, reservation) => {
        acc.starts.push(reservation.start);
        acc.ends.push(reservation.end);
        return acc;
      },
      { starts: [], ends: [] },
    );
  }, [mockUseQueryReserved]);

  const onClickDelegated = useCallback(
    (event: MouseEvent<HTMLTableSectionElement>) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TD' && target.dataset.availability && target.dataset.index) {
        const newIndex = parseInt(target.dataset.index, 10);
        const { starts, ends } = reservedEdges;
        const checkpoints = [...starts, ...ends];

        setSchedule((prev) => createNewScheduleIfValid(prev, newIndex, checkpoints));
      }
    },
    [reservedEdges],
  );

  const getCellClassNamesUnavailable = useCallback(
    (index: number) => {
      const { starts, ends } = reservedEdges;
      const isStartRow = starts.includes(index) || index % 6 === 0;
      const isEndRow = ends.includes(index) || index % 6 === 5;
      const isEdge = starts.includes(index) || ends.includes(index);

      const reservation = mockUseQueryReserved.find(
        (res) => res.start <= index && res.end >= index,
      );
      const who = reservation ? reservation.who : '';
      const firstLetter = who ? who[0].toLowerCase() : undefined;
      const color = colorMapping[firstLetter];

      const className = `${styles.selective} ${styles.reserved} ${isStartRow ? styles.start : ''} ${isEndRow ? styles.end : ''} ${isEdge ? styles['schedule--edge'] : ''} ${firstLetter ? styles[color] : ''}`;

      return {
        className,
        who,
      };
    },
    [reservedEdges],
  );

  const getCellClassNamesAvailable = useCallback(
    (currentIndex: number) => {
      const isStartRow = currentIndex === schedule.start || currentIndex % 6 === 0;
      const isEndRow = currentIndex === schedule.end || currentIndex % 6 === 5;
      const isBetween =
        schedule.start !== null &&
        schedule.end !== null &&
        currentIndex >= schedule.start &&
        currentIndex <= schedule.end;
      const isScheduleEdge = currentIndex === schedule.start || currentIndex === schedule.end;
      const className = `${styles.selective} ${isBetween ? styles.highlight : ''} ${isStartRow ? styles.start : ''} ${isEndRow ? styles.end : ''} ${isScheduleEdge ? styles['schedule--edge'] : ''}`;

      return {
        className,
        who: isBetween ? 'me!' : undefined,
      };
    },
    [schedule],
  );

  useEffect(() => {
    const newAvailabilities = [...availabilities];
    mockUseQueryReserved.forEach((reservation) => {
      for (let i = reservation.start; i <= reservation.end; i++) {
        newAvailabilities[i] = false;
      }
    });
    setAvailabilities(newAvailabilities);
  }, []);

  return {
    onClickDelegated,
    getCellClassNamesAvailable,
    getCellClassNamesUnavailable,
    getAvailabilityByIndex,
  };
};

//TODO : 스케줄 시간 start end 잡자 마자 요청을 보내서 서버에 시간을 예약 해야할 지 아니면 나중에 submit 버튼을 통해 요청을 보낼 지
const createNewScheduleIfValid = (
  schedule: Schedule,
  newIndex: number,
  checkpoints: number[],
): Schedule => {
  // 스케줄 시작 시점이 아직 안정해 졌다면
  if (schedule.start === null) {
    return { ...schedule, start: newIndex };
  }
  // 스케줄 종료 시점이 아직 안정해 졌다면
  if (schedule.end === null) {
    // 나중에 선택한 시점이 start라고 선언된 시점보다 이를 수 있으니까
    const realStart = Math.min(schedule.start, newIndex);
    const realEnd = Math.max(schedule.start, newIndex);

    const dropBeforeStart = checkpoints.filter((checkpoint) => realStart < checkpoint);
    // 시작 시점과 선택된 종료 시점이 다른 체크 포인트들과 겹치지 않는다면
    if (Math.min(...dropBeforeStart, realEnd) === realEnd) {
      return { start: realStart, end: realEnd };
    }
    // 취소
    return schedule;
  }
  // 시작 시점 선택 취소
  if (schedule.start === newIndex) {
    return { ...schedule, start: null };
  }
  // 종료 시점 선택 취소
  if (schedule.end === newIndex) {
    return { ...schedule, end: null };
  }
  // 새로운 시점이 현재 종료 시점보다 늦는다면
  if (newIndex > schedule.end) {
    return { ...schedule, end: newIndex };
  }
  // 새로운 시점이 현재 시작 시점보다 이르다면
  if (newIndex < schedule.start) {
    return { ...schedule, start: newIndex };
  }

  // 취소
  return schedule;
};

interface ColorMapping {
  [key: string]: string;
}
const colorMapping: ColorMapping = {
  a: 'lightcoral',
  b: 'lightyellow',
  c: 'lightblue',
  d: 'lightgreen',
  e: 'lightgrey',
  f: 'lightsalmon',
  g: 'plum',
  h: 'wheat',
  i: 'lightcyan',
  j: 'lightpink',
  k: 'thistle',
  l: 'lightgoldenrodyellow',
  m: 'lightsteelblue',
  n: 'lightseagreen',
  o: 'palegoldenrod',
  p: 'peachpuff',
  q: 'lavender',
  r: 'mistyrose',
  s: 'lightsteelblue',
  t: 'lightseagreen',
  u: 'paleturquoise',
  v: 'lavenderblush',
  w: 'lightgray',
  x: 'khaki',
  y: 'palegreen',
  z: 'whitesmoke',
};
