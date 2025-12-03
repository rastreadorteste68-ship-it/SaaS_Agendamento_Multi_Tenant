import { User, UserRole } from '../types';

// Mock users database
const MOCK_USERS: User[] = [
  { id: '1', name: 'Master Admin', email: 'admin@saas.com', role: UserRole.MASTER_ADMIN },
  { id: '2', name: 'Empresa Alpha', email: 'alpha@company.com', role: UserRole.COMPANY_ADMIN, companyId: 'c1' },
  { id: '3', name: 'João Prestador', email: 'joao@company.com', role: UserRole.PROVIDER, companyId: 'c1' },
  { id: '4', name: 'Maria Cliente', email: 'maria@gmail.com', role: UserRole.CLIENT, companyId: 'c1' },
];

export const sendMagicCode = async (email: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`[MAGIC LINK] Code sent to ${email}. For demo purposes, use code: 123456`);
  return true;
};

export const verifyMagicCode = async (email: string, code: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  if (code === '123456') {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) return user;
    
    // Auto-register client if not found
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: UserRole.CLIENT,
      companyId: 'c1' // Defaulting to first company for demo
    };
  }
  return null;
};