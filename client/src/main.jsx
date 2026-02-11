// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BoardsPage from './pages/BoardsPage.jsx'
import BoardDetailPage from './pages/BoardDetailPage.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/boards" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'boards',
        element: (
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'boards/:id',
        element: (
          <ProtectedRoute>
            <BoardDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/boards" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  // </StrictMode>,
)