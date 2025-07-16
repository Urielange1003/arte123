import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface AttendanceToday {
  date: string;
  status: 'present' | 'absent';
  checkIn?: string;
  checkOut?: string;
  late?: boolean;
  justification?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  remaining: number;
}

interface AttendanceHistoryItem {
  date: string;
  status: 'present' | 'absent';
  checkIn?: string;
  checkOut?: string;
  late?: boolean;
  justification?: string;
}

const StudentAttendance: React.FC = () => {
  const [today, setToday] = useState<AttendanceToday | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [history, setHistory] = useState<AttendanceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/stagiaire/attendance/today'),
      api.get('/stagiaire/attendance/stats'),
      api.get('/stagiaire/attendance/history')
    ])
      .then(([todayRes, statsRes, historyRes]) => {
        setToday(todayRes.data);
        setStats(statsRes.data);
        setHistory(historyRes.data);
      })
      .catch(() => setError('Erreur lors du chargement des présences.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string, late?: boolean) => {
    if (status === 'present') {
      if (late) {
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400">
            En retard
          </span>
        );
      }
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400">
          Présent
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400">
        Absent
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Jours effectués
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats?.present ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                    {stats && stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% du total
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Absences
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats?.absent ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                    {stats && stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}% du total
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Retards
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats?.late ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-warning-600 dark:text-warning-400">
                    {stats && stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}% du total
                  </p>
                </div>
                <div className="bg-warning-100 dark:bg-warning-900/20 rounded-full p-3">
                  <Clock size={24} className="text-warning-600" />
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Jours restants
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats?.remaining ?? 0}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sur {stats?.total ?? 0} jours
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
                  <Calendar size={24} className="text-agl-blue" />
                </div>
              </div>
            </Card>
          </div>

          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Aujourd'hui
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-success-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {today &&
                        new Date(today.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </p>
                    <div className="mt-1 flex items-center">
                      {today && getStatusBadge(today.status, today.late)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Arrivée</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {today?.checkIn || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Départ</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {today?.checkOut || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Historique de présence
              </h2>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((day, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        day.status === 'present'
                          ? 'bg-success-100 dark:bg-success-900/20'
                          : 'bg-error-100 dark:bg-error-900/20'
                      }`}
                    >
                      {day.status === 'present' ? (
                        <CheckCircle
                          className={`h-5 w-5 ${
                            day.late ? 'text-warning-600' : 'text-success-600'
                          }`}
                        />
                      ) : (
                        <XCircle className="h-5 w-5 text-error-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      {day.status === 'absent' && day.justification && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Justification : {day.justification}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(day.status, day.late)}
                    {day.status === 'present' && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {day.checkIn} - {day.checkOut}
                      </div>
                    )}
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

export default StudentAttendance;