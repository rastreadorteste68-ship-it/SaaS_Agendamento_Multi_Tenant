import { Appointment, AppointmentStatus, Company, WeeklyAvailability, DailyException, Service, ProviderProfile, TimeSlot } from '../types';

// --- INITIAL MOCK DATA ---

const companies: Company[] = [
  { id: 'c1', name: 'Tech Solutions Ltda', slug: 'tech-solutions', active: true, plan: 'PRO', createdAt: '2024-01-01' },
  { id: 'c2', name: 'Clínica Bem Estar', slug: 'bem-estar', active: true, plan: 'FREE', createdAt: '2024-02-15' },
];

const services: Service[] = [
  { id: 's1', companyId: 'c1', name: 'Consultoria Estratégica', durationMinutes: 60, price: 300 },
  { id: 's2', companyId: 'c1', name: 'Code Review', durationMinutes: 30, price: 150 },
  { id: 's3', companyId: 'c2', name: 'Sessão de Terapia', durationMinutes: 50, price: 200 },
];

let appointments: Appointment[] = [
  {
    id: 'a1',
    companyId: 'c1',
    clientId: '4',
    clientName: 'Maria Cliente',
    providerId: 'p1',
    providerName: 'João Desenvolvedor',
    serviceId: 's1',
    serviceName: 'Consultoria Estratégica',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    status: AppointmentStatus.CONFIRMED,
    meetLink: 'https://meet.google.com/abc-defg-hij'
  }
];

// Default Schedule: Mon-Fri 09:00-17:00
const defaultWeekly: WeeklyAvailability[] = [1, 2, 3, 4, 5].map(d => ({
  dayOfWeek: d,
  isOpen: true,
  slots: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '18:00' }]
}));
[0, 6].forEach(d => defaultWeekly.push({ dayOfWeek: d, isOpen: false, slots: [] }));

// Mock Provider Profiles
const providers: ProviderProfile[] = [
  {
    id: 'p1',
    userId: '3', // João
    companyId: 'c1',
    specialties: ['React', 'Node.js'],
    weeklyAvailability: JSON.parse(JSON.stringify(defaultWeekly)),
    exceptions: []
  }
];

// --- HELPERS ---

// Helper to add minutes to HH:mm string
const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
};

// Check if two time ranges overlap
const isOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
  return start1 < end2 && start2 < end1;
};

// --- EXPORTS ---

export const getCompanies = () => companies;

export const getCompanyStats = (companyId?: string) => {
  // If no companyId (Master Admin), aggregate all
  const targetAppts = companyId 
    ? appointments.filter(a => a.companyId === companyId) 
    : appointments;

  const totalRevenue = targetAppts
    .filter(a => a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CONFIRMED)
    .reduce((acc, curr) => {
      const s = services.find(srv => srv.id === curr.serviceId);
      return acc + (s ? s.price : 0);
    }, 0);

  const pendingRevenue = targetAppts
    .filter(a => a.status === AppointmentStatus.PENDING)
    .reduce((acc, curr) => {
      const s = services.find(srv => srv.id === curr.serviceId);
      return acc + (s ? s.price : 0);
    }, 0);

  return {
    totalRevenue,
    pendingRevenue,
    appointmentsCount: targetAppts.length,
    activeCompanies: companies.filter(c => c.active).length
  };
};

export const getAppointments = (companyId?: string) => {
  return companyId ? appointments.filter(a => a.companyId === companyId) : appointments;
};

export const getServices = (companyId: string) => {
  return services.filter(s => s.companyId === companyId);
};

export const createAppointment = (appt: Partial<Appointment>) => {
  const service = services.find(s => s.id === appt.serviceId);
  const duration = service ? service.durationMinutes : 60;
  
  const newAppt: Appointment = {
    id: Math.random().toString(36).substr(2, 9),
    companyId: appt.companyId!,
    clientId: appt.clientId!,
    clientName: appt.clientName!,
    providerId: appt.providerId || 'p1', // Default to p1 if not specified
    providerName: 'João Desenvolvedor',
    serviceId: appt.serviceId!,
    serviceName: appt.serviceName!,
    date: appt.date!,
    startTime: appt.startTime!,
    endTime: addMinutes(appt.startTime!, duration),
    status: AppointmentStatus.PENDING
  };
  
  appointments = [...appointments, newAppt];
  
  // Trigger Webhook/Notification simulation
  console.log('[WHATSAPP] Novo agendamento criado:', newAppt);
  
  return newAppt;
};

export const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
  appointments = appointments.map(a => a.id === id ? { ...a, status } : a);
};

// --- INTELLIGENT SCHEDULER LOGIC ---

export const getProviderProfile = (userId: string): ProviderProfile | undefined => {
  return providers.find(p => p.userId === userId) || providers[0]; // Fallback for demo
};

export const saveProviderAvailability = (profile: ProviderProfile) => {
  const index = providers.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    providers[index] = profile;
  } else {
    providers.push(profile);
  }
};

export const getAvailableSlots = (companyId: string, dateStr: string, serviceId: string): string[] => {
  const service = services.find(s => s.id === serviceId);
  if (!service) return [];
  const duration = service.durationMinutes;

  // For demo, assume single provider 'p1'. In real app, loop through providers.
  const provider = providers.find(p => p.companyId === companyId) || providers[0];
  const dateObj = new Date(dateStr);
  
  // 1. Check Exceptions
  const exception = provider.exceptions.find(e => e.date === dateStr);
  let activeSlots: TimeSlot[] = [];

  if (exception) {
    if (!exception.isOpen) return []; // Blocked day
    activeSlots = exception.slots;
  } else {
    // 2. Check Weekly
    const dayOfWeek = dateObj.getDay(); // 0-6
    const weekly = provider.weeklyAvailability.find(w => w.dayOfWeek === dayOfWeek);
    if (!weekly || !weekly.isOpen) return []; // Closed day
    activeSlots = weekly.slots;
  }

  // 3. Generate slots based on service duration
  const generatedSlots: string[] = [];
  activeSlots.forEach(slot => {
    let current = slot.start;
    const end = slot.end;

    while (current < end) {
      const slotEnd = addMinutes(current, duration);
      if (slotEnd <= end) {
        generatedSlots.push(current);
      }
      current = addMinutes(current, 30); // Step of 30 mins, or dynamic
    }
  });

  // 4. Filter out existing appointments
  const providerAppts = appointments.filter(a => 
    a.providerId === provider.id && 
    a.date === dateStr &&
    a.status !== AppointmentStatus.CANCELED
  );

  return generatedSlots.filter(startTime => {
    const slotEnd = addMinutes(startTime, duration);
    // Check overlap
    const hasConflict = providerAppts.some(appt => 
      isOverlapping(startTime, slotEnd, appt.startTime, appt.endTime)
    );
    return !hasConflict;
  });
};
