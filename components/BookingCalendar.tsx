import React, { useState } from 'react';
import { Appointment, AppointmentStatus, UserRole, User } from '../types';
import { updateAppointmentStatus } from '../services/dataService';
import { Calendar as CalendarIcon, Clock, Check, X, Video, MessageCircle } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  userRole: UserRole;
  onRefresh: () => void;
}

export const BookingCalendar: React.FC<Props> = ({ appointments, userRole, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status);
    onRefresh();
    
    // Simulate WhatsApp Notification trigger
    if (status === AppointmentStatus.CONFIRMED) {
        console.log(`[WHATSAPP API] Sending confirmation to client of appointment ${id}`);
    }
  };

  const filtered = appointments.filter(a => filterStatus === 'ALL' || a.status === filterStatus);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'bg-green-100 text-green-800 border-green-200';
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AppointmentStatus.CANCELED: return 'bg-red-100 text-red-800 border-red-200';
      case AppointmentStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-600" />
          Agenda
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filterStatus === status 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.map(appt => (
          <div key={appt.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {appt.date} às {appt.startTime}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{appt.serviceName}</h3>
              <p className="text-gray-600">Cliente: {appt.clientName}</p>
              {appt.meetLink && (
                <a href={appt.meetLink} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline flex items-center gap-1 mt-1">
                  <Video className="w-3 h-3" /> Link da Reunião
                </a>
              )}
            </div>

            {/* Actions for Admin/Provider */}
            {(userRole === UserRole.COMPANY_ADMIN || userRole === UserRole.PROVIDER) && (
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => alert(`Abrindo WhatsApp para ${appt.clientName}...`)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Contato WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                {appt.status === AppointmentStatus.PENDING && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(appt.id, AppointmentStatus.CONFIRMED)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Check className="w-4 h-4" /> Aceitar
                    </button>
                    <button 
                      onClick={() => handleStatusChange(appt.id, AppointmentStatus.CANCELED)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                    >
                      <X className="w-4 h-4" /> Recusar
                    </button>
                  </>
                )}
                 {appt.status === AppointmentStatus.CONFIRMED && (
                    <button 
                      onClick={() => handleStatusChange(appt.id, AppointmentStatus.CANCELED)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                 )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            Nenhum agendamento encontrado com este status.
          </div>
        )}
      </div>
    </div>
  );
};