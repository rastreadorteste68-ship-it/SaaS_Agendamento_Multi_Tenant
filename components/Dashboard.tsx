import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Appointment, AppointmentStatus, UserRole } from '../types';
import { DollarSign, Calendar, Clock, AlertCircle, Building2, Users } from 'lucide-react';
import { getCompanyStats, getCompanies } from '../services/dataService';

interface Props {
  userRole: UserRole;
  companyId?: string;
  appointments: Appointment[];
}

export const Dashboard: React.FC<Props> = ({ userRole, companyId, appointments }) => {
  const stats = useMemo(() => getCompanyStats(companyId), [companyId, appointments]);
  const companies = getCompanies();

  const chartData = [
    { name: 'Seg', total: 400 },
    { name: 'Ter', total: 300 },
    { name: 'Qua', total: 600 },
    { name: 'Qui', total: 200 },
    { name: 'Sex', total: 500 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {userRole === UserRole.MASTER_ADMIN ? 'Visão Geral (Master)' : 'Dashboard da Empresa'}
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Receita Total" 
          value={`R$ ${stats.totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        {userRole === UserRole.MASTER_ADMIN ? (
           <StatCard 
             title="Empresas Ativas" 
             value={stats.activeCompanies} 
             icon={Building2} 
             color="bg-purple-500" 
           />
        ) : (
          <StatCard 
            title="Agendamentos" 
            value={stats.appointmentsCount} 
            icon={Calendar} 
            color="bg-blue-500" 
          />
        )}
        <StatCard 
          title="Pendente" 
          value={`R$ ${stats.pendingRevenue.toFixed(2)}`} 
          icon={Clock} 
          color="bg-yellow-500" 
        />
        {userRole === UserRole.MASTER_ADMIN ? (
          <StatCard 
            title="Total Usuários" 
            value="1,240" 
            icon={Users} 
            color="bg-indigo-500" 
          />
        ) : (
          <StatCard 
            title="Cancelados" 
            value={appointments.filter(a => a.status === AppointmentStatus.CANCELED).length} 
            icon={AlertCircle} 
            color="bg-red-500" 
          />
        )}
      </div>

      {/* Master Admin Table of Companies */}
      {userRole === UserRole.MASTER_ADMIN && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Empresas Cadastradas</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-gray-100 text-gray-500 text-sm">
                   <th className="pb-3 font-medium">Empresa</th>
                   <th className="pb-3 font-medium">Plano</th>
                   <th className="pb-3 font-medium">Status</th>
                   <th className="pb-3 font-medium">Cadastrado em</th>
                   <th className="pb-3 font-medium text-right">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {companies.map(c => (
                   <tr key={c.id} className="text-sm">
                     <td className="py-3 font-medium text-gray-900">{c.name}</td>
                     <td className="py-3">
                       <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">{c.plan}</span>
                     </td>
                     <td className="py-3">
                        <span className={`flex items-center gap-1 ${c.active ? 'text-green-600' : 'text-red-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${c.active ? 'bg-green-600' : 'bg-red-500'}`} />
                          {c.active ? 'Ativo' : 'Inativo'}
                        </span>
                     </td>
                     <td className="py-3 text-gray-500">{c.createdAt}</td>
                     <td className="py-3 text-right">
                       <button className="text-primary-600 hover:underline">Gerenciar</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Charts & Recent - Shared */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fluxo de Caixa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recentes</h3>
          <div className="space-y-4">
            {appointments.slice(0, 5).map(appt => (
              <div key={appt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
                  {appt.clientName.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">{appt.clientName}</p>
                  <p className="text-xs text-gray-500">{appt.date} • {appt.startTime}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {appt.status === 'CONFIRMED' ? 'OK' : 'Pendente'}
                </span>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum agendamento.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
