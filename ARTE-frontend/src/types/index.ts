// Common Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'hr' | 'supervisor';
  department?: string;
  phone?: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// Student Types
export interface Application {
  id: string;
  studentId?: string;
  fullName: string;
  email: string;
  phone: string;
  field: string;
  school: string;
  duration: string;
  startDate: string;
  endDate: string;
  cv: string;
  certificate: string;
  motivation: string;
  status: 'pending' | 'interview' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Internship {
  id: string;
  applicationId: string;
  studentId: string;
  supervisorId: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  daysAttended: number;
  totalDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  internshipId: string;
  studentId: string;
  type: 'letter' | 'certificate' | 'report' | 'other';
  title: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'signed' | 'sent';
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  internshipId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  justification?: string;
  checkedBy?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export interface DepartmentStats {
  department: string;
  count: number;
  percentage: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  interview: number;
  approved: number;
  rejected: number;
  monthlyChange: number;
}

export interface InternshipStats {
  active: number;
  completed: number;
  cancelled: number;
  monthlyChange: number;
}