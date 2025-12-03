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
}

export interface Company {
  id: string;
  name: string;
  slug: string; // for public link
  active: boolean;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
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
  clientName: string; // Denormalized for display
  providerId: string; // The service provider
  serviceId: string;
  serviceName: string;
  date: string; // ISO Date YYYY-MM-DD
  startTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  meetLink?: string;
}

export interface WeeklyAvailability {
  dayOfWeek: number; // 0 = Sunday
  isOpen: boolean;
  slots: { start: string; end: string }[];
}

export interface DailyException {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  slots: { start: string; end: string }[];
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingRevenue: number;
  appointmentsCount: number;
}