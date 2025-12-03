export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  PROVIDER = 'PROVIDER',
  CLIENT = 'CLIENT',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string; // Null for Master Admin
  avatar?: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: string;
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO Date YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  meetLink?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface WeeklyAvailability {
  dayOfWeek: number; // 0 = Sunday
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface DailyException {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface ProviderProfile {
  id: string;
  userId: string;
  companyId: string;
  specialties: string[];
  weeklyAvailability: WeeklyAvailability[];
  exceptions: DailyException[];
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingRevenue: number;
  appointmentsCount: number;
  activeCompanies?: number; // For Master Admin
}
