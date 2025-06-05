import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import CandidatureForm from './pages/CandidatureForm';
import DashboardAdmin from './pages/DashboardAdmin';
import RapportStage from './pages/RapportStage';
import EncadreurValidation from './pages/EncadreurValidation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidature" element={<CandidatureForm />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/rapport" element={<RapportStage />} />
        <Route path="/encadreur/validation" element={<EncadreurValidation />} />
      </Routes>
    </Router>
  );
}

export default App;
