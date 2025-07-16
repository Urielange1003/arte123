import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importez vos contextes
import { AuthProvider } from './contexts/AuthContext'; // Importez le AuthProvider
import { ThemeProvider } from './contexts/ThemeContext'; // Importez le ThemeProvider

// Importez vos layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Importez vos pages - Public
import HomePage from './pages/public/HomePage';
import ApplicationPage from './pages/public/ApplicationPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'; // Nouvelle route

// Importez vos pages - Student
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentDocuments from './pages/student/Documents';
import StudentAttendance from './pages/student/Attendance';
import StudentMessages from './pages/student/Messages';

// Importez vos pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminStudents from './pages/admin/Students';
import AdminSupervisors from './pages/admin/Supervisors';
import AdminStatistics from './pages/admin/Statistics';
import InternshipDetailsPage from './pages/admin/InternshipDetailsPage';

// Importez vos pages - HR
import HRDashboard from './pages/hr/Dashboard';
import HRDocuments from './pages/hr/Documents';
import HRApplications from './pages/hr/Applications';

// Importez vos pages - Supervisor
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorStudents from './pages/supervisor/Students';
import SupervisorAttendance from './pages/supervisor/Attendance';
import SupervisorMessages from './pages/supervisor/Messages';

// Importez PrivateRoute
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule le chargement initial des données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-red-600 border-blue-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Chargement ARTE...</h2>
        </div>
      </div>
    );
  }

  return (
    // Les fournisseurs de contexte (ThemeProvider, AuthProvider)
    // doivent ENVELOPPER le Router et les Routes.
    <ThemeProvider>
      <AuthProvider> 
        <Router>
          <Routes> 
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="postuler" element={<ApplicationPage />} />
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} /> 
            </Route>

            <Route
              path="/admin/internship/:id"
              element={<PrivateRoute roles={['admin', 'rh']} element={<InternshipDetailsPage />} />}
            />


            <Route path="/etudiant" element={<PrivateRoute roles={['stagiaire']} element={<DashboardLayout role="stagiaire" />} />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profil" element={<StudentProfile />} />
              <Route path="documents" element={<StudentDocuments />} />
              <Route path="presence" element={<StudentAttendance />} />
              <Route path="messages" element={<StudentMessages />} />
            </Route>

           //* Routes Admin - Protégées par PrivateRoute et utilisant DashboardLayout */
            <Route path="/admin" element={<PrivateRoute roles={['admin']} element={<DashboardLayout role="admin" />} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="candidatures" element={<AdminApplications />} />
              <Route path="stagiaires" element={<AdminStudents />} />
              <Route path="encadreurs" element={<AdminSupervisors />} />
              <Route path="statistiques" element={<AdminStatistics />} />
              /* Le détail de stage pourrait aussi être une sous-route ici si toujours sous le layout admin */
              <Route path="internship/:id" element={<InternshipDetailsPage />} /> 
            </Route>

            /* Routes RH - Protégées par PrivateRoute et utilisant DashboardLayout */
            <Route path="/rh" element={<PrivateRoute roles={['rh']} element={<DashboardLayout role="rh" />} />}>
              <Route index element={<HRDashboard />} />
              <Route path="documents" element={<HRDocuments />} />
              <Route path="candidatures" element={<HRApplications />} />
            </Route>

            {/* Routes Encadreur - Protégées par PrivateRoute et utilisant DashboardLayout */}
            <Route path="/encadreur" element={<PrivateRoute roles={['encadreur']} element={<DashboardLayout role="encadreur" />} />}>
              <Route index element={<SupervisorDashboard />} />
              <Route path="stagiaires" element={<SupervisorStudents />} />
              <Route path="presence" element={<SupervisorAttendance />} />
              <Route path="messages" element={<SupervisorMessages />} />
            </Route>

            {/* Route Catch-all pour les pages non trouvées (404) - Toujours la dernière */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                <h1 className="text-3xl font-bold">404 - Page Non Trouvée</h1>
                <p className="mt-2">L'URL que vous avez demandée n'existe pas.</p>
              </div>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;