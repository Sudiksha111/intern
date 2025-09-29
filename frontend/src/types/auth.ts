export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  tenantId: string;
  tenantName: string;
  subscription: 'free' | 'pro';
  noteLimit: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Demo accounts for testing
export const DEMO_ACCOUNTS: Record<string, User> = {
  'admin@company1.com': {
    id: '1',
    email: 'admin@company1.com',
    name: 'Alex Admin',
    role: 'admin',
    tenantId: 'company1',
    tenantName: 'Acme Corp',
    subscription: 'pro',
    noteLimit: 100
  },
  'member@company1.com': {
    id: '2', 
    email: 'member@company1.com',
    name: 'Maya Member',
    role: 'member',
    tenantId: 'company1',
    tenantName: 'Acme Corp',
    subscription: 'free',
    noteLimit: 10
  },
  'admin@company2.com': {
    id: '3',
    email: 'admin@company2.com',
    name: 'Sam Boss',
    role: 'admin',
    tenantId: 'company2',
    tenantName: 'TechFlow Inc',
    subscription: 'free',
    noteLimit: 10
  }
};