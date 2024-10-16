import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlaceProvider } from '@/context/PlaceContext';
import { TimeProvider } from '@/context/TimeContext';
import '@fontsource/roboto';
import { RequestOptionsProvider } from '@/context/RequestOptionsContext';
import { SelectedPointsProvider } from '@/context/SelectedPointsContext';
import 'react-toastify/dist/ReactToastify.css';
import '@/main.css';
import { DestPointsProvider } from '@/context/DestPointsContext';
import { UniqueIdProvider } from '@/context/UUIDContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniqueIdProvider>
      <QueryClientProvider client={queryClient}>
        <PlaceProvider>
          <TimeProvider>
            <RequestOptionsProvider>
              <SelectedPointsProvider>
                <DestPointsProvider>
                  <RouterProvider router={router} />
                </DestPointsProvider>
              </SelectedPointsProvider>
            </RequestOptionsProvider>
          </TimeProvider>
        </PlaceProvider>
      </QueryClientProvider>
    </UniqueIdProvider>
  </React.StrictMode>,
);
