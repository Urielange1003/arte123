import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importez vos contextes
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Importez vos layouts
import MainLayout from './layouts/MainLayout'; // Layout pour les pages publiques avec en-tête/pied de page
import AuthLayout from './layouts/AuthLayout'; // Layout pour les pages d'auth (login/register)
import DashboardLayout from './layouts/DashboardLayout'; // Layout pour les tableaux de bord

// Importez vos pages - Public
import HomePage from './pages/public/HomePage';
import ApplicationPage from './pages/public/ApplicationPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; // Page à créer pour accès refusé

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

// Importez vos pages - Supervisor (Encadreur)
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorStudents from './pages/supervisor/Students';
import SupervisorAttendance from './pages/supervisor/Attendance';
import SupervisorMessages from './pages/supervisor/Messages';

// Importez PrivateRoute
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule le chargement initial des données (peut être supprimé ou lié à AuthProvider.isLoadingAuth)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Affiche un écran de chargement global de l'application
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
    // Les fournisseurs de contexte (ThemeProvider, AuthProvider) doivent ENVELOPPER le Router et les Routes.
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes publiques avec MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} /> {/* Route par défaut pour / */}
              <Route path="postuler" element={<ApplicationPage />} />
            </Route>

            {/* Routes d'authentification avec AuthLayout */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Page d'accès non autorisé */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Redirection par défaut (si l'utilisateur arrive sur une URL inconnue ou non authentifié) */}
            {/* Cette route doit être avant les routes protégées spécifiques si elle doit catch tout */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />


            {/*
             * GROUPES DE ROUTES PROTÉGÉES PAR PrivateRoute (vérifie l'authentification)
             * Ensuite, elles sont imbriquées dans DashboardLayout pour le layout spécifique au tableau de bord.
             * PrivateRoute rendra <Outlet />, DashboardLayout rendra <Outlet />.
             */}

            {/* Routes Étudiant (Stagiaire) */}
            <Route path="/etudiant" element={<PrivateRoute roles={['student']} />}>
              <Route element={<DashboardLayout role="student" />}>
                <Route index element={<StudentDashboard />} />
                <Route path="profil" element={<StudentProfile />} />
                <Route path="documents" element={<StudentDocuments />} />
                <Route path="presence" element={<StudentAttendance />} />
                <Route path="messages" element={<StudentMessages />} />
              </Route>
            </Route>

            {/* Routes Admin */}
            <Route path="/admin" element={<PrivateRoute roles={['admin']} />}>
              <Route element={<DashboardLayout role="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="candidatures" element={<AdminApplications />} />
                <Route path="stagiaires" element={<AdminStudents />} />
                <Route path="encadreurs" element={<AdminSupervisors />} />
                <Route path="statistiques" element={<AdminStatistics />} />
                {/* Le détail de stage sous admin peut être une sous-route ici */}
                <Route path="internship/:id" element={<InternshipDetailsPage />} />
              </Route>
            </Route>

            {/* Routes RH */}
            <Route path="/rh" element={<PrivateRoute roles={['hr']} />}>
              <Route element={<DashboardLayout role="hr" />}>
                <Route index element={<HRDashboard />} />
                <Route path="documents" element={<HRDocuments />} />
                <Route path="candidatures" element={<HRApplications />} />
              </Route>
            </Route>

            {/* Routes Encadreur (Supervisor) */}
            <Route path="/encadreur" element={<PrivateRoute roles={['supervisor']} />}>
              <Route element={<DashboardLayout role="supervisor" />}>
                <Route index element={<SupervisorDashboard />} />
                <Route path="stagiaires" element={<SupervisorStudents />} />
                <Route path="presence" element={<SupervisorAttendance />} />
                <Route path="messages" element={<SupervisorMessages />} />
              </Route>
            </Route>

            {/* Route Catch-all pour les pages non trouvées (404) - Toujours la dernière */}
            {/* Attention : La redirection par défaut '/' vers '/auth/login' gère déjà beaucoup de cas.
               Ceci est pour les routes qui ne correspondent à rien du tout. */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                <h1 className="text-4xl font-bold mb-4">404 - Page Non Trouvée</h1>
                <p className="text-lg">Désolé, l'URL que vous avez demandée n'existe pas.</p>
                <Link to="/" className="mt-6 text-blue-600 dark:text-blue-400 hover:underline">
                  Retour à l'accueil
                </Link>
              </div>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;