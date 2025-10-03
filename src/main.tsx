import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AppLayout } from '@/components/layout/AppLayout';
import { PlaylistPage } from '@/pages/PlaylistPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { AdminUploadPage } from '@/pages/AdminUploadPage';
import { SearchPage } from '@/pages/SearchPage';
import { Toaster } from '@/components/ui/sonner';
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "playlist/:id", element: <PlaylistPage /> },
      { path: "library", element: <LibraryPage /> },
      { path: "admin/upload", element: <AdminUploadPage /> },
      { path: "search", element: <SearchPage /> },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid #FF00FF',
            color: '#00FFFF',
            fontFamily: '"Press Start 2P", system-ui, sans-serif',
            fontSize: '0.75rem',
          },
        }}
      />
    </ErrorBoundary>
  </StrictMode>,
)