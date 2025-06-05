import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';
import App from './App.jsx';

function LoadingFallback() {
  return <div className="text-center p-4">Chargement...</div>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
    <App />
  </StrictMode>,
);

