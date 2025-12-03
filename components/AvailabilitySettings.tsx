import React, { useState, useEffect } from 'react';
import { ProviderProfile, WeeklyAvailability } from '../types';
import { getProviderProfile, saveProviderAvailability } from '../services/dataService';
import { Calendar, Clock, Save, Plus, Trash2 } from 'lucide-react';

interface Props {
  userId: string;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const AvailabilitySettings: React.FC<Props> = ({ userId }) => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile (in real app, this would be async)
    const p = getProviderProfile(userId);
    if (p) setProfile(JSON.parse(JSON.stringify(p))); // Deep copy to edit
    setLoading(false);
  }, [userId]);

  const handleSave = () => {
    if (profile) {
      saveProviderAvailability(profile);
      alert('Disponibilidade salva com sucesso!');
    }
  };

  const toggleDay = (dayIndex: number) => {
    if (!profile) return;
    const newWeekly = [...profile.weeklyAvailability];
    const day = newWeekly.find(d => d.dayOfWeek === dayIndex);
    if (day) {
      day.isOpen = !day.isOpen;
      if (day.isOpen && day.slots.length === 0) {
        day.slots.push({ start: '09:00', end: '17:00' });
      }
    }
    setProfile({ ...profile, weeklyAvailability: newWeekly });
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    if (!profile) return;
    const newWeekly = [...profile.weeklyAvailability];
    const day = newWeekly.find(d => d.dayOfWeek === dayIndex);
    if (day && day.slots[slotIndex]) {
      day.slots[slotIndex] = { ...day.slots[slotIndex], [field]: value };
      setProfile({ ...profile, weeklyAvailability: newWeekly });
    }
  };

  if (loading || !profile) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-600" />
          Disponibilidade Semanal
        </h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          {DAYS.map((dayName, index) => {
            const dayConfig = profile.weeklyAvailability.find(d => d.dayOfWeek === index);
            if (!dayConfig) return null;

            return (
              <div key={index} className={`flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg border ${dayConfig.isOpen ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center gap-3 w-40 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={dayConfig.isOpen}
                      onChange={() => toggleDay(index)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span className={`font-medium ${dayConfig.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                    {dayName}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {dayConfig.isOpen ? (
                    <>
                      {dayConfig.slots.map((slot, sIndex) => (
                        <div key={sIndex} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(index, sIndex, 'start', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(index, sIndex, 'end', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <button className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Adicionar Intervalo
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic pt-2 block">Fechado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5" /> Exceções por Data
        </h3>
        <p className="text-sm text-yellow-700">
          Precisa fechar em um feriado específico ou abrir em um horário diferente? 
          Adicione exceções no calendário (Funcionalidade visual simplificada nesta demo).
        </p>
      </div>
    </div>
  );
};
