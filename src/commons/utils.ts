import {
  DateString,
  isScheduleTime,
  ScheduleTime,
  scheduleTimes,
} from '@components/molecules/ScheduleTimeTable';
import { ROUTER_PATH } from '@/router';
import scrollContainerStyle from '@components/atoms/ScrollSnapContainer/index.module.css';
import scrollItemStyle from '@components/atoms/ScrollSnapItem/index.module.css';

export const formatDateToMMDDYY = (date: Date): DateString => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}` as DateString;
};

export const hasUserAlreadySelectedTime = (time: string | null): time is ScheduleTime => {
  const defaultRobotPath = '/' + ROUTER_PATH.ROBOT;

  return time !== null && isScheduleTime(time) && location.pathname === defaultRobotPath;
};

export const getElementsByScheduleTime = (time: ScheduleTime) => {
  const container: HTMLElement = document.querySelector(
    `.${scrollContainerStyle['scroll-container']}`,
  );
  const scheduleTables: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.${scrollItemStyle['scroll-item']}`,
  );
  const selectedTable: HTMLElement = scheduleTables[scheduleTimes.indexOf(time)];

  return { container, selectedTable };
};

export const getScrollPosition = (container: HTMLElement, element: HTMLElement): number => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return elementRect.top - containerRect.top + container.scrollTop;
};

export const scrollToElement = (container: HTMLElement, selectedTable: HTMLElement) => {
  container.scrollTo({
    top: getScrollPosition(container, selectedTable),
    behavior: 'smooth',
  });
};
