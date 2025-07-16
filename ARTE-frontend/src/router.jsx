import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterPage from '@/pages/auth/RegisterPage';
import CandidatureForm from '@/pages/CandidatureForm';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import MessagerieAdmin from './pages/MessagerieAdmin';
import ValidationFinStage from './pages/ValidationFinStage';
import StagiaireDashboard from './pages/StagiaireDashboard';
import UpdatePassword from './components/auth/UpdatePassword';
import DashboardAdmin from './pages/DashboardAdmin';

const router = createBrowserRouter([
  { path: '/', element: <LoginForm /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/candidature', element: <CandidatureForm /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '*', element: <NotFound /> },
  { path: '/admin/messages', element: <MessagerieAdmin /> },
  { path: '/rh/validation-fin', element: <ValidationFinStage /> },
  { path: '/stagiaire/dashboard', element: <StagiaireDashboard /> },
  { path: '/update-password', element: <UpdatePassword /> },
  { path: '/admin/dashboard', element: <DashboardAdmin /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
