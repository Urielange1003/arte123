// Common Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'stagiaire' | 'admin' | 'rh' | 'encadreur';
  email_verified_at?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  access_token: string;
  user: User;
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
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  field_of_study: string;
  school: string;
  duration: string;
  start_date: string;
  end_date: string;
  cv_path: string;
  motivation_letter_path: string;
  status: 'pending' | 'interview' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
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