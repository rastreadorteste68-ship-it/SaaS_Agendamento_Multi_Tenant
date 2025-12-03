import React, { useState, useEffect } from 'react';
import { MagicLogin } from './components/MagicLogin';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BookingCalendar } from './components/BookingCalendar';
import { NewAppointment } from './components/NewAppointment';
import { User, UserRole, Appointment } from './types';
import { getAppointments } from './services/dataService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Simulate data fetching
  const refreshData = () => {
    if (user && user.companyId) {
      const data = getAppointments(user.companyId);
      // Filter for client specific view
      if (user.role === UserRole.CLIENT) {
        setAppointments(data.filter(a => a.clientId === user.id));
      } else {
        setAppointments(data);
      }
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
      if (user.role === UserRole.CLIENT) {
        setView('new_appointment');
      } else {
        setView('dashboard');
      }
    }
  }, [user]);

  if (!user) {
    return <MagicLogin onLogin={setUser} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)} 
      currentView={view} 
      onChangeView={setView}
    >
      <div className="max-w-6xl mx-auto animate-fade-in">
        {view === 'dashboard' && user.role !== UserRole.CLIENT && (
          <Dashboard companyId={user.companyId!} appointments={appointments} />
        )}
        
        {(view === 'calendar' || view === 'my_calendar') && (
          <BookingCalendar 
            appointments={appointments} 
            userRole={user.role} 
            onRefresh={refreshData} 
          />
        )}

        {view === 'new_appointment' && user.role === UserRole.CLIENT && (
          <NewAppointment 
            companyId={user.companyId!} 
            clientId={user.id} 
            clientName={user.name}
            onSuccess={() => {
              alert("Agendamento solicitado com sucesso! Você receberá uma confirmação em breve.");
              refreshData();
              setView('my_calendar');
            }} 
          />
        )}

        {view === 'settings' && (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">Configurações da Empresa</h2>
            <p className="text-gray-500 mt-2">Área para gerenciar horários, exceções e prestadores.</p>
            <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg inline-block">
              Funcionalidade em desenvolvimento na versão Demo.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;