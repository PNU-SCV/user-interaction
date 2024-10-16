import styles from './index.module.css';
import React, { Fragment, ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';

export const MainContainer = ({ children }: { children: ReactElement }) => (
  <Fragment>
    <div className={styles.container}>{children}</div>
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      theme="light"
      closeButton={false}
    />
  </Fragment>
);
