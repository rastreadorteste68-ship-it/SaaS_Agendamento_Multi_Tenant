import React, { useState, useEffect } from 'react';
import { Service, AppointmentStatus } from '../types';
import { createAppointment, getServices, getAvailableSlots } from '../services/dataService';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';

interface Props {
  companyId: string;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

export const NewAppointment: React.FC<Props> = ({ companyId, clientId, clientName, onSuccess }) => {
  const services = getServices(companyId);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (selectedService && date) {
      setLoadingSlots(true);
      // Simulate network delay for realism
      setTimeout(() => {
        const slots = getAvailableSlots(companyId, date, selectedService.id);
        setAvailableSlots(slots);
        setLoadingSlots(false);
      }, 400);
    } else {
      setAvailableSlots([]);
    }
  }, [date, selectedService, companyId]);

  const handleSubmit = () => {
    if (!selectedService || !date || !time) return;

    createAppointment({
      companyId,
      clientId,
      clientName,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date,
      startTime: time,
      status: AppointmentStatus.PENDING
    });

    onSuccess();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto overflow-hidden animate-fade-in">
      <div className="bg-primary-600 p-6 text-white">
        <h2 className="text-xl font-bold">Novo Agendamento</h2>
        <p className="text-primary-100 text-sm">Passo {step} de 3</p>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Escolha um serviço</h3>
            {services.map(s => (
              <div 
                key={s.id}
                onClick={() => { setSelectedService(s); setStep(2); }}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.durationMinutes} min</p>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-gray-700">R$ {s.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline">Voltar</button>
            <h3 className="font-semibold text-gray-800">Escolha data e horário</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={(e) => { setDate(e.target.value); setTime(''); }}
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                />
              </div>
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horários Disponíveis</label>
                {loadingSlots ? (
                  <div className="text-gray-400 text-sm animate-pulse">Calculando disponibilidade...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map(t => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`py-2 px-3 rounded-md text-sm font-medium border transition ${
                          time === t 
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105' 
                          : 'border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-gray-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : (
                   <div className="bg-orange-50 text-orange-700 p-3 rounded-md flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Sem horários livres nesta data.
                   </div>
                )}
              </div>
            )}

            <button
              disabled={!date || !time}
              onClick={() => setStep(3)}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 mt-4 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 3 && selectedService && (
           <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirme seu agendamento</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-left max-w-sm mx-auto mb-6 space-y-2 text-sm border border-gray-100">
                <p><span className="font-semibold text-gray-600">Serviço:</span> {selectedService.name}</p>
                <p><span className="font-semibold text-gray-600">Data:</span> {date}</p>
                <p><span className="font-semibold text-gray-600">Horário:</span> {time}</p>
                <p><span className="font-semibold text-gray-600">Profissional:</span> João (Demo)</p>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">Total:</span> 
                    <span className="font-bold text-green-600">R$ {selectedService.price}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Voltar</button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition"
                >
                  Confirmar Agendamento
                </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
