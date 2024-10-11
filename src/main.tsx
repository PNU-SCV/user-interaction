import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/main.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlaceProvider } from '@/context/PlaceContext';
import { TimeProvider } from '@/context/TimeContext';
import '@fontsource/roboto';
import { RequestOptionsProvider } from '@/context/RequestOptionsContext';
import { SelectedPointsProvider } from '@/context/SelectedPointsContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PlaceProvider>
        <TimeProvider>
          <RequestOptionsProvider>
            <SelectedPointsProvider>
              <RouterProvider router={router} />
            </SelectedPointsProvider>
          </RequestOptionsProvider>
        </TimeProvider>
      </PlaceProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
