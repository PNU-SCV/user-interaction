import styles from './index.module.css';
import { useSelectScheduleTimeTable } from '@/hooks/useSelectScheduleTimeTable';

const hours = Array.from({ length: 8 }, (_, i) => i);
const minutes = Array.from({ length: 6 }, (_, i) => i * 10);
const timeSlots = (time: ScheduleTime) => {
  const baseHour = time === 'Morning' ? 0 : time === 'Afternoon' ? 8 : 16;

  return hours.map((hour) =>
    minutes.map((minute) => `${baseHour + hour}:${minute.toString().padStart(2, '0')}`),
  );
};

export type ScheduleTime = 'Morning' | 'Afternoon' | 'Night';
export type DateString = `${number}-${number}-${number}`;

export interface IScheduleTimeTable {
  time: ScheduleTime;
  date: DateString; // 'MM-DD'
  className?: string;
}

export const ScheduleTimeTable = ({ time, date, className = '' }: IScheduleTimeTable) => {
  const {
    onClickDelegated,
    getCellClassNamesAvailable,
    getCellClassNamesUnavailable,
    getAvailabilityByIndex,
    showConfirm,
  } = useSelectScheduleTimeTable(time);

  return (
    <table className={`${styles.table} ${className}`}>
      <thead>
        <tr>
          <th>{date}</th>
          <th>{time}</th>
        </tr>
      </thead>
      <tbody onClick={onClickDelegated}>
        {timeSlots(time).map((hourSlot, hourIndex) => (
          <tr key={hourIndex}>
            {/*TODO: 지운게 더 괜찮은지*/}
            {/*<td className={styles.hour}>{hourIndex}</td>*/}
            {hourSlot.map((time, minuteIndex) => {
              const index = hourIndex * 6 + minuteIndex;
              const availability = getAvailabilityByIndex(index);
              const { className, who } = availability
                ? getCellClassNamesAvailable(index)
                : getCellClassNamesUnavailable(index);

              return (
                <td
                  className={className}
                  key={index}
                  data-index={index}
                  data-availability={availability}
                  data-who={who}
                >
                  {time}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
