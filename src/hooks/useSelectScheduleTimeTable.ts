import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@components/molecules/ScheduleTimeTable/index.module.css';
import { ScheduleTime } from '@components/molecules/ScheduleTimeTable';
import { useQuery } from '@tanstack/react-query';

export type Schedule = {
  start: number | null;
  end: number | null;
};

export type CellAvailabilityResult = {
  className: string;
  who: string | undefined;
};

export type ScheduleDetail = {
  who: string;
  time: ScheduleTime;
  task: string;
} & Schedule;

type ScheduleResp = {
  schedules: ScheduleDetail[];
};

const fetchRobotScheduleById = async (robotId: string): Promise<ScheduleResp> => {
  const response = await fetch(`http://localhost:8000/schedule/${robotId}`);

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다');
  }

  return await response.json();
};

export const useSelectScheduleTimeTable = (time: ScheduleTime, robotId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [`schedule-${robotId}`],
    queryFn: () => fetchRobotScheduleById(robotId),
  });
  const [reservedSchedules, setReservedSchedules] = useState<ScheduleDetail[]>(
    data?.schedules ?? [],
  );
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>(getInitialSchedule(time));
  // TODO: useState로 관리하면 아래 useMemo에서 setState하면 infinite recursion 뜨는데 와이??
  const availabilitiesRef = useRef<boolean[]>(availabilitiesInit());
  const isScheduleNotValid = selectedSchedule.start === null || selectedSchedule.end === null;

  useEffect(() => {
    if (!isLoading && !isError && data?.schedules) {
      const queryData = data.schedules;
      queryData
        .filter((schedule) => schedule.time === time)
        .forEach((reservation) =>
          Array.from({ length: reservation.end - reservation.start + 1 }, (_, index) => {
            availabilitiesRef.current[reservation.start + index] = false;
          }),
        );
      setReservedSchedules(queryData);
    }
  }, [selectedSchedule, data, isLoading, isError]);

  const reservedEdges = useMemo(() => {
    return reservedSchedules
      .filter((reserved) => reserved.time === time)
      .reduce(
        (acc, reservation) => {
          acc.starts.push(reservation.start);
          acc.ends.push(reservation.end);

          Array.from({ length: reservation.end - reservation.start + 1 }, (_, index) => {
            availabilitiesRef.current[reservation.start + index] = false;
          });

          return acc;
        },
        { starts: [], ends: [] },
      );
  }, [reservedSchedules]);

  const onClickDelegated: (event: MouseEvent<HTMLTableSectionElement>) => void = useCallback(
    (event: MouseEvent<HTMLTableSectionElement>) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'TD' &&
        target.dataset.index &&
        availabilitiesRef.current[parseInt(target.dataset.index)]
      ) {
        const newIndex = parseInt(target.dataset.index);
        const { starts, ends } = reservedEdges;
        const checkpoints = [...starts, ...ends];

        setSelectedSchedule((prev) => createNewScheduleIfValid(prev, newIndex, checkpoints));
      }
    },
    [reservedEdges],
  );

  const getCellClassNamesUnavailable: (index: number) => CellAvailabilityResult = useCallback(
    (index: number) => {
      const { starts, ends } = reservedEdges;
      const isStartRow = starts.includes(index) || index % 6 === 0;
      const isEndRow = ends.includes(index) || index % 6 === 5;
      const isEdge = starts.includes(index) || ends.includes(index);

      const reservation = reservedSchedules
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

  const getCellClassNamesAvailable = (currentIndex: number): CellAvailabilityResult => {
    const isStartRow = currentIndex === selectedSchedule.start || currentIndex % 6 === 0;
    const isEndRow = currentIndex === selectedSchedule.end || currentIndex % 6 === 5;
    const isBetween =
      selectedSchedule.start !== null &&
      selectedSchedule.end !== null &&
      currentIndex >= selectedSchedule.start &&
      currentIndex <= selectedSchedule.end;
    const isScheduleEdge =
      currentIndex === selectedSchedule.start || currentIndex === selectedSchedule.end;
    const className = `${styles.selective} ${isBetween ? styles.highlight : ''} ${isStartRow ? styles.start : ''} ${isEndRow ? styles.end : ''} ${isScheduleEdge ? styles['schedule--edge'] : ''}`;

    return {
      className,
      who: isBetween ? 'me!' : undefined,
    };
  };

  const getCellPropertiesByIndex = (index: number): CellAvailabilityResult => {
    return availabilitiesRef.current[index]
      ? getCellClassNamesAvailable(index)
      : getCellClassNamesUnavailable(index);
  };

  return {
    onClickDelegated,
    getCellPropertiesByIndex,
    isScheduleNotValid,
    schedule: selectedSchedule,
  };
};

const availabilitiesInit = () => {
  return Array.from({ length: 8 * 6 }, (_) => true);
};

const parseParam = (param: string | null): number | null => {
  return param === null ? null : parseInt(param);
};

const getInitialSchedule = (time: ScheduleTime) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('time') === time) {
    return {
      start: parseParam(searchParams.get('start')),
      end: parseParam(searchParams.get('end')),
    };
  }
  return {
    start: null,
    end: null,
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
