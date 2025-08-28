import React from 'react';
import { CheckCircle, User, Shield, Users, Headphones } from 'lucide-react';
import { UserRole, roleLabels } from '@/types/auth';

interface LoginSuccessToastProps {
  user: {
    name: string;
    role: UserRole;
  };
}

export const LoginSuccessToast = ({ user }: LoginSuccessToastProps) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Shield;
      case 'gestao': return Users;
      case 'atendente': return Headphones;
      default: return User;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'text-purple-500';
      case 'gestao': return 'text-blue-500';
      case 'atendente': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const RoleIcon = getRoleIcon(user.role);
  const roleColor = getRoleColor(user.role);

  return (
    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg">
      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <RoleIcon className={`h-4 w-4 ${roleColor}`} />
          <span className="font-semibold text-green-800">
            Login realizado com sucesso!
          </span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Bem-vindo(a), {user.name} • {roleLabels[user.role]}
        </p>
      </div>
    </div>
  );
};
