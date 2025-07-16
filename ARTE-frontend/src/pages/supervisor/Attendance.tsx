import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface AttendanceRecord {
  id: string;
  student: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent';
  justification?: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface AttendanceHistoryDay {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface Student {
  id: string;
  name: string;
}

const SupervisorAttendance: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [students, setStudents] = useState<Student[]>([]);
  const [todaySummary, setTodaySummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [history, setHistory] = useState<AttendanceHistoryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch students for filter dropdown
  useEffect(() => {
    api.get('/encadreur/stagiaires')
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]));
  }, []);

  // Fetch attendance data
  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/encadreur/attendance/today'),
      api.get(`/encadreur/attendance/records?month=${selectedMonth}${selectedStudent !== 'all' ? `&student=${selectedStudent}` : ''}`),
      api.get(`/encadreur/attendance/summary?month=${selectedMonth}`)
    ])
      .then(([todayRes, recordsRes, historyRes]) => {
        setTodaySummary(todayRes.data);
        setRecords(recordsRes.data);
        setHistory(historyRes.data);
      })
      .catch(() => setError('Erreur lors du chargement des présences.'))
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedStudent]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'late':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      case 'absent':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'late':
        return 'En retard';
      case 'absent':
        return 'Absent';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Suivi de présence
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Filter size={18} />}>
            Filtres
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Présents aujourd'hui</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {todaySummary?.present ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                    {todaySummary && todaySummary.total > 0
                      ? Math.round((todaySummary.present / todaySummary.total) * 100)
                      : 0}% des stagiaires
                  </p>
                </div>
                <div className="bg-success-100 dark:bg-success-900/20 rounded-full p-3">
                  <CheckCircle size={24} className="text-success-600" />
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absents aujourd'hui</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {todaySummary?.absent ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                    {todaySummary && todaySummary.total > 0
                      ? Math.round((todaySummary.absent / todaySummary.total) * 100)
                      : 0}% des stagiaires
                  </p>
                </div>
                <div className="bg-error-100 dark:bg-error-900/20 rounded-full p-3">
                  <XCircle size={24} className="text-error-600" />
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En retard aujourd'hui</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {todaySummary?.late ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-warning-600 dark:text-warning-400">
                    {todaySummary && todaySummary.total > 0
                      ? Math.round((todaySummary.late / todaySummary.total) * 100)
                      : 0}% des stagiaires
                  </p>
                </div>
                <div className="bg-warning-100 dark:bg-warning-900/20 rounded-full p-3">
                  <Clock size={24} className="text-warning-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card variant="default">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Rechercher un stagiaire..."
                  leftIcon={<Search size={18} />}
                  fullWidth
                  // Optionally add search logic here
                />
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
                >
                  <option value="all">Tous les stagiaires</option>
                  {students.map((s) => (
                    <option value={s.id} key={s.id}>{s.name}</option>
                  ))}
                </select>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  leftIcon={<Calendar size={18} />}
                  fullWidth
                />
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stagiaire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Arrivée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Départ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{record.student}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {record.checkIn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {record.checkOut || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                        {record.justification && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {record.justification}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination can be added here if needed */}
          </Card>

          {/* History */}
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Historique de présence
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((day, index) => (
                <div key={index} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {day.total} stagiaires
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-success-50 dark:bg-success-900/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-success-600 dark:text-success-400">
                          <CheckCircle size={20} />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-success-600 dark:text-success-400">
                            {day.present}
                          </p>
                          <p className="text-sm text-success-600 dark:text-success-400">
                            Présents
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-error-50 dark:bg-error-900/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-error-600 dark:text-error-400">
                          <XCircle size={20} />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-error-600 dark:text-error-400">
                            {day.absent}
                          </p>
                          <p className="text-sm text-error-600 dark:text-error-400">
                            Absents
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-warning-50 dark:bg-warning-900/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-warning-600 dark:text-warning-400">
                          <Clock size={20} />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-warning-600 dark:text-warning-400">
                            {day.late}
                          </p>
                          <p className="text-sm text-warning-600 dark:text-warning-400">
                            En retard
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SupervisorAttendance;