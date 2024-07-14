import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import '@/App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
// import { NavigateContextProvider } from '@/context/navigateContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<NavigateContextProvider>*/}
    <RouterProvider router={router} />
    {/*</NavigateContextProvider>*/}
  </React.StrictMode>,
);
