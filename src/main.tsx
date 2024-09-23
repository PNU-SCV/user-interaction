import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/main.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlaceProvider } from '@/context/PlaceContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PlaceProvider>
        <RouterProvider router={router} />
      </PlaceProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
