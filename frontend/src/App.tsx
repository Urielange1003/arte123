import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Public
import HomePage from './pages/public/HomePage';
import ApplicationPage from './pages/public/ApplicationPage';
import LoginPage from './pages/auth/LoginPage';

// Pages - Student
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentDocuments from './pages/student/Documents';
import StudentAttendance from './pages/student/Attendance';
import StudentMessages from './pages/student/Messages';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminStudents from './pages/admin/Students';
import AdminSupervisors from './pages/admin/Supervisors';
import AdminStatistics from './pages/admin/Statistics';

// Pages - RH
import RHDashboard from './pages/rh/Dashboard';
import RHDocuments from './pages/rh/Documents';
import RHApplications from './pages/rh/Applications';

// Pages - Supervisor
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorStudents from './pages/supervisor/Students';
import SupervisorAttendance from './pages/supervisor/Attendance';
import SupervisorMessages from './pages/supervisor/Messages';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
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
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="postuler" element={<ApplicationPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/etudiant" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profil" element={<StudentProfile />} />
            <Route path="documents" element={<StudentDocuments />} />
            <Route path="presence" element={<StudentAttendance />} />
            <Route path="messages" element={<StudentMessages />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidatures" element={<AdminApplications />} />
            <Route path="stagiaires" element={<AdminStudents />} />
            <Route path="encadreurs" element={<AdminSupervisors />} />
            <Route path="statistiques" element={<AdminStatistics />} />
          </Route>

          {/* RH Routes */}
          <Route path="/rh" element={<DashboardLayout role="rh" />}>
            <Route index element={<RHDashboard />} />
            <Route path="documents" element={<RHDocuments />} />
            <Route path="candidatures" element={<RHApplications />} />
          </Route>

          {/* Supervisor Routes */}
          <Route path="/encadreur" element={<DashboardLayout role="supervisor" />}>
            <Route index element={<SupervisorDashboard />} />
            <Route path="stagiaires" element={<SupervisorStudents />} />
            <Route path="presence" element={<SupervisorAttendance />} />
            <Route path="messages" element={<SupervisorMessages />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;