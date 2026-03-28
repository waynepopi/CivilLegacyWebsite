import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Master' | 'Leader' | 'Member';

export interface User {
  id: string;
  username: string;
  role: Role;
  permissions: {
    canEditContent: boolean;
    canManageMembers: boolean;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface AppState {
  users: User[];
  services: Service[];
  team: TeamMember[];
  branches: Branch[];
}

interface AppContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  // User Management
  addUser: (user: User) => void;
  updateUserPermissions: (userId: string, permissions: User['permissions']) => void;
  // Services
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  // Team
  updateTeamMember: (member: TeamMember) => void;
  // Branches
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
}

const initialData: AppState = {
  users: [
    { id: '1', username: 'DeV', role: 'Master', permissions: { canEditContent: true, canManageMembers: true } },
    { id: '2', username: 'Leader', role: 'Leader', permissions: { canEditContent: false, canManageMembers: true } },
    { id: '3', username: 'Member', role: 'Member', permissions: { canEditContent: false, canManageMembers: false } },
  ],
  services: [
    { id: '1', name: 'Premium Service', description: 'Top tier service', price: 99.99 },
    { id: '2', name: 'Basic Service', description: 'Standard service', price: 49.99 },
  ],
  team: [
    { id: '1', name: 'Alice Smith', role: 'Developer', bio: 'Frontend expert', imageUrl: 'https://i.pravatar.cc/150?u=alice' },
    { id: '2', name: 'Bob Jones', role: 'Designer', bio: 'UI/UX specialist', imageUrl: 'https://i.pravatar.cc/150?u=bob' },
  ],
  branches: [
    { id: '1', name: 'HQ', address: '123 Main St, Tech City', phone: '555-0100' },
    { id: '2', name: 'Downtown', address: '456 Center Ave, Tech City', phone: '555-0200' },
  ]
};

export const AppDataContext = createContext<AppContextType | null>(null);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialData);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const addUser = (user: User) => updateState({ users: [...state.users, user] });
  const updateUserPermissions = (userId: string, permissions: User['permissions']) => {
    updateState({
      users: state.users.map(u => u.id === userId ? { ...u, permissions } : u)
    });
  };

  const addService = (service: Service) => updateState({ services: [...state.services, service] });
  const updateService = (service: Service) => updateState({ services: state.services.map(s => s.id === service.id ? service : s) });
  const deleteService = (id: string) => updateState({ services: state.services.filter(s => s.id !== id) });

  const updateTeamMember = (member: TeamMember) => updateState({ team: state.team.map(t => t.id === member.id ? member : t) });

  const addBranch = (branch: Branch) => updateState({ branches: [...state.branches, branch] });
  const updateBranch = (branch: Branch) => updateState({ branches: state.branches.map(b => b.id === branch.id ? branch : b) });
  const deleteBranch = (id: string) => updateState({ branches: state.branches.filter(b => b.id !== id) });

  return (
    <AppDataContext.Provider value={{
      state, updateState,
      addUser, updateUserPermissions,
      addService, updateService, deleteService,
      updateTeamMember,
      addBranch, updateBranch, deleteBranch
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
};
