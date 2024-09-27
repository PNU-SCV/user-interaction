import { FormEvent, Fragment } from 'react';
import styles from './index.module.css';
import { ThreeDimensionalCard } from '@components/molecules/ThreeDimensionalCards';

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
