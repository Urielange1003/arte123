import { 
  User, Application, Internship, Document, 
  Attendance, Message, Task, Notification,
  DepartmentStats, ApplicationStats, InternshipStats
} from '../types';

// Generate random users for different roles
export const users: User[] = [
  {
    id: 'usr-001',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'stagiaire',
    department: 'Direction des Systèmes d\'Information',
    phone: '+237 612345678'
  },
  {
    id: 'usr-002',
    name: 'Marie Curie',
    email: 'marie.curie@camrail.cm',
    role: 'encadreur',
    department: 'Direction des Systèmes d\'Information',
    phone: '+237 612345679'
  },
  {
    id: 'usr-003',
    name: 'Admin Système',
    email: 'admin@camrail.cm',
    role: 'admin',
    phone: '+237 612345680'
  },
  {
    id: 'usr-004',
    name: 'Responsable RH',
    email: 'rh@camrail.cm',
    role: 'rh',
    department: 'Ressources Humaines',
    phone: '+237 612345681'
  }
];

// Generate applications
export const applications: Application[] = [
  {
    id: 'app-001',
    studentId: 'usr-001',
    fullName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+237 612345678',
    field: 'Informatique',
    school: 'Université de Yaoundé I',
    duration: '3',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    cv: 'uploads/cv-jean-dupont.pdf',
    certificate: 'uploads/cert-jean-dupont.pdf',
    motivation: 'Je souhaite mettre en pratique mes connaissances théoriques et acquérir une expérience professionnelle chez Camrail.',
    status: 'approved',
    createdAt: '2024-12-20T10:30:00Z',
    updatedAt: '2025-01-05T14:20:00Z'
  },
  {
    id: 'app-002',
    fullName: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+237 612345688',
    field: 'Informatique',
    school: 'ENSPY',
    duration: '4',
    startDate: '2025-04-01',
    endDate: '2025-08-01',
    cv: 'uploads/cv-sophie-martin.pdf',
    certificate: 'uploads/cert-sophie-martin.pdf',
    motivation: 'Passionnée par le domaine ferroviaire, je souhaite contribuer aux projets de digitalisation de Camrail.',
    status: 'pending',
    createdAt: '2025-03-18T09:30:00Z',
    updatedAt: '2025-03-18T09:30:00Z'
  },
  {
    id: 'app-003',
    fullName: 'Paul Biya',
    email: 'paul.biya@example.com',
    phone: '+237 612345699',
    field: 'Électromécanique',
    school: 'IUT Douala',
    duration: '6',
    startDate: '2025-05-01',
    endDate: '2025-11-01',
    cv: 'uploads/cv-paul-biya.pdf',
    certificate: 'uploads/cert-paul-biya.pdf',
    motivation: 'Je souhaite approfondir mes connaissances en maintenance ferroviaire et contribuer à l\'optimisation des processus.',
    status: 'interview',
    createdAt: '2025-03-17T11:30:00Z',
    updatedAt: '2025-03-17T15:45:00Z'
  }
];

// Generate internships
export const internships: Internship[] = [
  {
    id: 'int-001',
    applicationId: 'app-001',
    studentId: 'usr-001',
    supervisorId: 'usr-002',
    department: 'Direction des Systèmes d\'Information',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    status: 'active',
    progress: 65,
    daysAttended: 48,
    totalDays: 73,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-03-18T16:30:00Z'
  }
];

// Generate documents
export const documents: Document[] = [
  {
    id: 'doc-001',
    internshipId: 'int-001',
    studentId: 'usr-001',
    type: 'letter',
    title: 'Lettre de stage',
    fileUrl: 'uploads/lettre-stage-jean-dupont.pdf',
    status: 'signed',
    createdAt: '2025-01-10T09:15:00Z',
    updatedAt: '2025-01-12T11:30:00Z'
  },
  {
    id: 'doc-002',
    internshipId: 'int-001',
    studentId: 'usr-001',
    type: 'report',
    title: 'Rapport de mi-stage',
    fileUrl: 'uploads/rapport-mi-stage-jean-dupont.pdf',
    status: 'approved',
    createdAt: '2025-02-28T14:20:00Z',
    updatedAt: '2025-03-02T10:45:00Z'
  }
];

// Generate attendance records
export const attendances: Attendance[] = [
  {
    id: 'att-001',
    internshipId: 'int-001',
    studentId: 'usr-001',
    date: '2025-03-18',
    status: 'present',
    checkedBy: 'usr-002'
  },
  {
    id: 'att-002',
    internshipId: 'int-001',
    studentId: 'usr-001',
    date: '2025-03-17',
    status: 'present',
    checkedBy: 'usr-002'
  },
  {
    id: 'att-003',
    internshipId: 'int-001',
    studentId: 'usr-001',
    date: '2025-03-16',
    status: 'absent',
    justification: 'Rendez-vous médical',
    checkedBy: 'usr-002'
  }
];

// Generate messages
export const messages: Message[] = [
  {
    id: 'msg-001',
    senderId: 'usr-002',
    receiverId: 'usr-001',
    content: 'Bonjour Jean, pourriez-vous m\'envoyer le rapport de progression que vous avez commencé la semaine dernière ?',
    read: false,
    createdAt: '2025-03-18T10:42:00Z'
  },
  {
    id: 'msg-002',
    senderId: 'usr-004',
    receiverId: 'usr-001',
    content: 'Votre attestation de stage sera disponible à partir du 16 avril. N\'oubliez pas de soumettre votre rapport final avant cette date.',
    read: false,
    createdAt: '2025-03-17T15:30:00Z'
  },
  {
    id: 'msg-003',
    senderId: 'usr-001',
    receiverId: 'usr-002',
    content: 'Bonjour Mme Curie, je voulais vous informer que je serai absent ce jeudi pour un rendez-vous médical. Je vous fournirai un justificatif à mon retour.',
    read: true,
    createdAt: '2025-03-15T17:15:00Z'
  }
];

// Generate tasks
export const tasks: Task[] = [
  {
    id: 'task-001',
    title: 'Rapport de mi-stage',
    description: 'Soumettre le rapport de mi-stage avant la fin du mois',
    assignedTo: 'usr-001',
    assignedBy: 'usr-002',
    dueDate: '2025-02-28',
    status: 'completed',
    priority: 'high',
    createdAt: '2025-02-15T09:00:00Z',
    updatedAt: '2025-02-28T14:20:00Z'
  },
  {
    id: 'task-002',
    title: 'Rapport final',
    description: 'Soumettre le rapport final de stage',
    assignedTo: 'usr-001',
    assignedBy: 'usr-002',
    dueDate: '2025-04-10',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-03-15T11:00:00Z',
    updatedAt: '2025-03-15T11:00:00Z'
  },
  {
    id: 'task-003',
    title: 'Présentation finale',
    description: 'Préparer et effectuer une présentation de 20 minutes sur les travaux réalisés pendant le stage',
    assignedTo: 'usr-001',
    assignedBy: 'usr-002',
    dueDate: '2025-04-14',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-03-15T11:05:00Z',
    updatedAt: '2025-03-15T11:05:00Z'
  }
];

// Generate notifications
export const notifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'usr-001',
    title: 'Nouveau message',
    message: 'Vous avez reçu un nouveau message de Marie Curie',
    read: false,
    createdAt: '2025-03-18T10:42:00Z',
    type: 'info'
  },
  {
    id: 'notif-002',
    userId: 'usr-001',
    title: 'Échéance proche',
    message: 'Rapport final à soumettre dans 3 semaines',
    read: false,
    createdAt: '2025-03-17T08:00:00Z',
    type: 'warning'
  }
];

// Statistics
export const departmentStats: DepartmentStats[] = [
  { department: 'Informatique', count: 23, percentage: 41.1 },
  { department: 'Génie Civil', count: 14, percentage: 25 },
  { department: 'Ressources Humaines', count: 8, percentage: 14.3 },
  { department: 'Logistique', count: 11, percentage: 19.6 }
];

export const applicationStats: ApplicationStats = {
  total: 124,
  pending: 28,
  interview: 15,
  approved: 65,
  rejected: 16,
  monthlyChange: 18
};

export const internshipStats: InternshipStats = {
  active: 56,
  completed: 40,
  cancelled: 8,
  monthlyChange: 12
};