import React, { useState } from 'react';
import { sendMagicCode, verifyMagicCode } from '../services/authService';
import { User } from '../types';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const MagicLogin: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendMagicCode(email);
      setStep('CODE');
    } catch (err) {
      setError('Erro ao enviar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await verifyMagicCode(email, code);
      if (user) {
        onLogin(user);
      } else {
        setError('Código inválido. Tente 123456');
      }
    } catch (err) {
      setError('Erro na verificação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SaaS Agendamento</h1>
          <p className="text-gray-500 text-sm mt-2">Acesse sua conta via Magic Link</p>
        </div>

        {step === 'EMAIL' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="nome@empresa.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enviar Código'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4">
              Enviamos um código para <strong>{email}</strong>. <br />
              (Dica Demo: use 123456)
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de 6 dígitos</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-center text-2xl tracking-widest py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="000000"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Entrar no Sistema'}
              {!loading && <CheckCircle className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              Voltar / Corrigir E-mail
            </button>
          </form>
        )}
      </div>
    </div>
  );
};