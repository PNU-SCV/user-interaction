import styles from './index.module.css';
import { MouseEvent } from 'react';

export type ThreeDimensionalCard = {
  heading: string;
  address: string;
  desc: string;
};

export interface IThreeDimensionalCards {
  cardList: ThreeDimensionalCard[];
  onClickTemplate?: (address: string) => (e: MouseEvent) => void;
}

export const ThreeDimensionalCards = ({ cardList, onClickTemplate }: IThreeDimensionalCards) => {
  return (
    <div className={styles.list}>
      {cardList.slice(0, 7).map((item, idx) => (
        <div
          key={idx}
          className={styles.item}
          onClick={onClickTemplate ? onClickTemplate(item.address) : undefined}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '2px solid black',
              textWrap: 'balance',
              padding: '5px',
            }}
          >
            <h5>{item.desc}</h5>
            {item.heading}
            {/*<div>{item.address}</div>*/}
          </div>
        </div>
      ))}
    </div>
  );
};
