import React from 'react';
import { User, UserRole } from '../types';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, PlusCircle, Clock, Building } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ user, onLogout, currentView, onChangeView, children }) => {
  const NavItem = ({ view, icon: Icon, label }: any) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Agendamentos<span className="text-primary-600">.ai</span></h1>
          <div className="mt-4 flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
             <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {user.role === UserRole.CLIENT ? (
             <>
               <NavItem view="new_appointment" icon={PlusCircle} label="Novo Agendamento" />
               <NavItem view="my_calendar" icon={Calendar} label="Meus Agendamentos" />
             </>
          ) : user.role === UserRole.MASTER_ADMIN ? (
            <>
              <NavItem view="dashboard" icon={LayoutDashboard} label="Visão Geral" />
              <NavItem view="companies" icon={Building} label="Empresas" />
              <NavItem view="finance" icon={Users} label="Financeiro Global" />
              <NavItem view="settings" icon={Settings} label="Config. Sistema" />
            </>
          ) : (
            // Company Admin or Provider
            <>
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="calendar" icon={Calendar} label="Agenda Completa" />
              <NavItem view="availability" icon={Clock} label="Disponibilidade" />
              {user.role === UserRole.COMPANY_ADMIN && (
                <NavItem view="settings" icon={Settings} label="Config. Empresa" />
              )}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-auto h-screen">
         {children}
      </main>
    </div>
  );
};
