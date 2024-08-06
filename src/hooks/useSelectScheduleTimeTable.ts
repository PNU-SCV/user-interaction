import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import styles from '@components/molecules/ScheduleTimeTable/index.module.css';
import { ScheduleTime } from '@components/molecules/ScheduleTimeTable';

type Schedule = {
  start: number | null;
  end: number | null;
};

const availabilitiesInit = Array.from({ length: 12 * 6 }, (_) => true);

export const useSelectScheduleTimeTable = (time: ScheduleTime) => {
  const [schedule, setSchedule] = useState<Schedule>({ start: null, end: null });
  const [availabilities, setAvailabilities] = useState<boolean[]>(availabilitiesInit);
  const mockUseQueryReserved = [
    {
      who: 'tae!',
      start: 0,
      end: 10,
      time: 'Morning',
    },
    {
      who: 'heon!',
      start: 45,
      end: 47,
      time: 'Morning',
    },
    {
      who: 'seok!',
      start: 13,
      end: 23,
      time: 'Afternoon',
    },
    {
      who: 'won!',
      start: 42,
      end: 47,
      time: 'Afternoon',
    },
  ];

  const getAvailabilityByIndex = useCallback(
    (index: number) => {
      return availabilities[index];
    },
    [availabilities],
  );

  const reservedEdges = useMemo(() => {
    return mockUseQueryReserved
      .filter((reserved) => reserved.time === time)
      .reduce(
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
      if (
        target.tagName === 'TD' &&
        target.dataset.availability === 'true' &&
        target.dataset.index
      ) {
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

      const reservation = mockUseQueryReserved
        .filter((reserved) => reserved.time === time)
        .find((res) => res.start <= index && res.end >= index);
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
    mockUseQueryReserved
      .filter((reserved) => reserved.time === time)
      .forEach((reservation) => {
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

const calcStartEnd = (p1: number, p2: number) => {
  return {
    realStart: Math.min(p1, p2),
    realEnd: Math.max(p1, p2),
  };
};

const createNewScheduleIfValid = (
  schedule: Schedule,
  newIndex: number,
  checkpoints: number[],
): Schedule => {
  const isSelectedRangeAllAvailable = (realStart, realEnd) => {
    const dropBeforeStart = checkpoints.filter((checkpoint) => realStart < checkpoint);
    return Math.min(...dropBeforeStart, realEnd) === realEnd;
  };

  // 시작 시점 선택 취소
  if (schedule.start === newIndex) {
    return { ...schedule, start: null };
  }
  // 종료 시점 선택 취소
  if (schedule.end === newIndex) {
    return { ...schedule, end: null };
  }
  // 스케줄 시작 시점이 아직 안정해 졌다면
  if (schedule.start === null) {
    if (schedule.end === null) {
      return { ...schedule, start: newIndex };
    }
    const { realStart, realEnd } = calcStartEnd(schedule.end, newIndex);

    if (isSelectedRangeAllAvailable(realStart, realEnd)) {
      return { start: realStart, end: realEnd };
    }
    return schedule;
  }
  // 스케줄 종료 시점이 아직 안정해 졌다면
  if (schedule.end === null) {
    if (schedule.start === newIndex) {
      return schedule;
    }
    const { realStart, realEnd } = calcStartEnd(schedule.start, newIndex);

    if (isSelectedRangeAllAvailable(realStart, realEnd)) {
      return { start: realStart, end: realEnd };
    }
    return schedule;
  }
  // 새로운 시점이 현재 종료 시점보다 늦는다면
  if (newIndex > schedule.end) {
    const { realStart, realEnd } = calcStartEnd(schedule.start, newIndex);

    if (isSelectedRangeAllAvailable(realStart, realEnd)) {
      return { start: realStart, end: realEnd };
    }
    return schedule;
  }
  // 새로운 시점이 현재 시작 시점보다 이르다면
  if (newIndex < schedule.start) {
    const { realStart, realEnd } = calcStartEnd(newIndex, schedule.end);

    if (isSelectedRangeAllAvailable(realStart, realEnd)) {
      return { start: realStart, end: realEnd };
    }
    return schedule;
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
