import styles from './index.module.css';
import { useSelectScheduleTimeTable } from '@/hooks/useSelectScheduleTimeTable';

const hours = Array.from({ length: 12 }, (_, i) => i);
const minutes = Array.from({ length: 6 }, (_, i) => i * 10);
const timeSlots = hours.map((hour) =>
  minutes.map((minute) => `${hour}:${minute.toString().padStart(2, '0')}`),
);

type ScheduleTime = 'AM' | 'PM';
type DateString = `${number}-${number}-${number}`;

export interface IScheduleTimeTable {
  time: ScheduleTime;
  date?: DateString; // 'YYYY-MM-DD'
}

export const ScheduleTimeTable = ({ time }: IScheduleTimeTable) => {
  const {
    onClickDelegated,
    getCellClassNamesAvailable,
    getCellClassNamesUnAvailable,
    getAvailabilityByIndex,
  } = useSelectScheduleTimeTable();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{time}</th>
        </tr>
      </thead>
      <tbody onClick={onClickDelegated}>
        {timeSlots.map((hourSlot, hourIndex) => (
          <tr key={hourIndex}>
            <td className={styles.hour}>{hourIndex}</td>
            {hourSlot.map((time, minuteIndex) => {
              const index = hourIndex * 6 + minuteIndex;
              const availability = getAvailabilityByIndex(index);
              const className = availability
                ? `${getCellClassNamesAvailable(index)}`
                : `${getCellClassNamesUnAvailable(index)}`;

              return (
                <td
                  className={className}
                  key={index}
                  data-index={index}
                  data-availability={availability}
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
