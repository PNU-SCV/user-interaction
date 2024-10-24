import React from 'react';
import styles from './index.module.css';

interface ISelect {
  options: SelectOption[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
  onClick?: (event: React.MouseEvent) => void;
}

type SelectOption = {
  value: string;
  label: string;
};

export const Select = ({ options, onChange, defaultValue = '', onClick = () => {} }: ISelect) => (
  <select value={defaultValue} onChange={onChange} className={styles.select} onClick={onClick}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
