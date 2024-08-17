import { FormEvent, Fragment } from 'react';
import styles from './index.module.css';
import { tempPlaceList } from '@components/templates/Delivery';

type HealthCheckListItem = {
  label: string;
  required: boolean;
};

const tempCheckList: HealthCheckListItem[] = [
  { label: '혈압', required: true },
  { label: '체온', required: true },
  { label: '심박수', required: true },
  { label: '호흡수', required: true },
  { label: '수면시간', required: false },
  { label: '특이사항 여부', required: false },
];

export const Checkup = () => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <Fragment>
      <div>간단문진 및 순찰</div>
      <form className={styles['checkup--form']} onSubmit={onSubmit}>
        <fieldset className={styles['checkup--fieldset']}>
          <legend>일일 문진 사항들 [선택]</legend>
          {tempCheckList.map((item) => (
            <Fragment key={item.label}>
              <label>
                <input type="checkbox" defaultChecked={item.required} />
                {item.label}
              </label>
            </Fragment>
          ))}
        </fieldset>
        <fieldset className={styles['checkup--fieldset']}>
          <legend>문진 범위 [선택]</legend>
          {tempPlaceList.slice(0, 7).map((place) => (
            <Fragment key={place.address}>
              <label>
                <input type="checkbox" />
                {place.heading}
              </label>
            </Fragment>
          ))}
        </fieldset>
        <button>확인</button>
      </form>
    </Fragment>
  );
};
