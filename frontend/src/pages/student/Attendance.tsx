import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StudentAttendance: React.FC = () => {
  // Mock attendance data
  const attendance = {
    today: {
      date: new Date(),
      status: 'present',
      checkIn: '08:15',
      checkOut: '17:30'
    },
    stats: {
      total: 73,
      present: 48,
      absent: 3,
      late: 2,
      remaining: 20
    },
    history: [
      { date: '2025-03-18', status: 'present', checkIn: '08:15', checkOut: '17:30' },
      { date: '2025-03-17', status: 'present', checkIn: '08:00', checkOut: '17:45' },
      { date: '2025-03-16', status: 'absent', justification: 'Rendez-vous médical' },
      { date: '2025-03-15', status: 'present', checkIn: '08:30', checkOut: '17:15', late: true },
      { date: '2025-03-14', status: 'present', checkIn: '08:10', checkOut: '17:30' }
    ]
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Jours effectués
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {attendance.stats.present}
              </p>
              <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                {Math.round((attendance.stats.present / attendance.stats.total) * 100)}% du total
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
                {attendance.stats.absent}
              </p>
              <p className="mt-2 text-sm text-error-600 dark:text-error-400">
                {Math.round((attendance.stats.absent / attendance.stats.total) * 100)}% du total
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
                {attendance.stats.late}
              </p>
              <p className="mt-2 text-sm text-warning-600 dark:text-warning-400">
                {Math.round((attendance.stats.late / attendance.stats.total) * 100)}% du total
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
                {attendance.stats.remaining}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sur {attendance.stats.total} jours
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
                  {attendance.today.date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="mt-1 flex items-center">
                  {getStatusBadge(attendance.today.status)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arrivée</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {attendance.today.checkIn}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Départ</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {attendance.today.checkOut}
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
          {attendance.history.map((day, index) => (
            <div key={index} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  day.status === 'present'
                    ? 'bg-success-100 dark:bg-success-900/20'
                    : 'bg-error-100 dark:bg-error-900/20'
                }`}>
                  {day.status === 'present' ? (
                    <CheckCircle className={`h-5 w-5 ${
                      day.late ? 'text-warning-600' : 'text-success-600'
                    }`} />
                  ) : (
                    <XCircle className="h-5 w-5 text-error-600" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
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
    </div>
  );
};

export default StudentAttendance;