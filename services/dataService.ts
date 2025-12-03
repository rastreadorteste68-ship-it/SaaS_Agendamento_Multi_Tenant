import { Appointment, AppointmentStatus, Company, WeeklyAvailability, DailyException, Service } from '../types';

// Initial Mock Data
let appointments: Appointment[] = [
  {
    id: 'a1',
    companyId: 'c1',
    clientId: '4',
    clientName: 'Maria Cliente',
    providerId: '3',
    serviceId: 's1',
    serviceName: 'Consultoria Estratégica',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    status: AppointmentStatus.CONFIRMED,
    meetLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'a2',
    companyId: 'c1',
    clientId: '99',
    clientName: 'Roberto Silva',
    providerId: '3',
    serviceId: 's2',
    serviceName: 'Mentoria Técnica',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    status: AppointmentStatus.PENDING,
  }
];

const companies: Company[] = [
  { id: 'c1', name: 'Tech Solutions Ltda', slug: 'tech-solutions', active: true, plan: 'PRO' },
  { id: 'c2', name: 'Clínica Bem Estar', slug: 'bem-estar', active: true, plan: 'FREE' },
];

const services: Service[] = [
  { id: 's1', companyId: 'c1', name: 'Consultoria Estratégica', durationMinutes: 60, price: 250 },
  { id: 's2', companyId: 'c1', name: 'Mentoria Técnica', durationMinutes: 30, price: 100 },
];

// Mock Availability (Default 9-5 M-F)
const defaultAvailability: WeeklyAvailability[] = [1, 2, 3, 4, 5].map(day => ({
  dayOfWeek: day,
  isOpen: true,
  slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }]
}));
[0, 6].forEach(day => defaultAvailability.push({ dayOfWeek: day, isOpen: false, slots: [] }));

export const getCompanyStats = (companyId: string) => {
  const companyAppts = appointments.filter(a => a.companyId === companyId);
  const revenue = companyAppts
    .filter(a => a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CONFIRMED)
    .reduce((acc, curr) => {
        const s = services.find(srv => srv.id === curr.serviceId);
        return acc + (s ? s.price : 0);
    }, 0);

  return {
    totalRevenue: revenue,
    pendingRevenue: companyAppts.filter(a => a.status === AppointmentStatus.PENDING).length * 100, // Est
    appointmentsCount: companyAppts.length
  };
};

export const getAppointments = (companyId: string) => {
  return appointments.filter(a => a.companyId === companyId);
};

export const getServices = (companyId: string) => {
  return services.filter(s => s.companyId === companyId);
};

export const createAppointment = (appt: Omit<Appointment, 'id'>) => {
  const newAppt = { ...appt, id: Math.random().toString(36).substr(2, 9) };
  appointments = [...appointments, newAppt];
  return newAppt;
};

export const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
  appointments = appointments.map(a => a.id === id ? { ...a, status } : a);
};

export const getMockAvailability = () => defaultAvailability;