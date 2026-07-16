import { useEffect, useState } from 'react';
import type { User } from '@/types';

const AUTH_KEY = 'maintenance_app_auth';
const USERS_KEY = 'maintenance_app_users';

export function useLocalAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      let users = localStorage.getItem(USERS_KEY);
      
      if (!users) {
        const preRegisteredTecnicos: User[] = [
          {
            id: 'tech_jefferson',
            name: 'Jefferson',
            email: 'jefferson@prefeitura.gov.br',
            role: 'tecnico',
            userType: 'tecnico',
            createdAt: Date.now(),
          },
          {
            id: 'tech_gustavo',
            name: 'Gustavo',
            email: 'gustavo@prefeitura.gov.br',
            role: 'tecnico',
            userType: 'tecnico',
            createdAt: Date.now(),
          },
          {
            id: 'tech_marcelo',
            name: 'Marcelo',
            email: 'marcelo@prefeitura.gov.br',
            role: 'chefe',
            userType: 'tecnico',
            createdAt: Date.now(),
          },
        ];
        
        localStorage.setItem(USERS_KEY, JSON.stringify(preRegisteredTecnicos));
        
        preRegisteredTecnicos.forEach(tech => {
          const credentials = {
            userId: tech.id,
            email: tech.email,
            password: '1234567890',
          };
          localStorage.setItem(`cred_${tech.id}`, JSON.stringify(credentials));
        });
        
        setAllUsers(preRegisteredTecnicos);
      } else {
        setAllUsers(JSON.parse(users));
      }
      
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = (name: string, email: string, password: string) => {
    const newUser: User = {
      id: `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: 'tecnico',
      userType: 'tecnico',
      createdAt: Date.now(),
    };

    try {
      const users = [...allUsers, newUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setAllUsers(users);

      const credentials = {
        userId: newUser.id,
        email,
        password,
      };
      localStorage.setItem(`cred_${newUser.id}`, JSON.stringify(credentials));

      return newUser;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  };

  const login = (email: string, password: string) => {
    try {
      const user = allUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const credentials = localStorage.getItem(`cred_${user.id}`);
      if (!credentials) {
        throw new Error('Credenciais não encontradas');
      }

      const cred = JSON.parse(credentials);
      if (cred.password !== password) {
        throw new Error('Senha incorreta');
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const createGuestUser = (name?: string) => {
    const guestUser: User = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      userType: 'usuario',
      role: 'admin',
      createdAt: Date.now(),
    };

    try {
      const users = [...allUsers, guestUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setAllUsers(users);
      localStorage.setItem(AUTH_KEY, JSON.stringify(guestUser));
      setCurrentUser(guestUser);
      return guestUser;
    } catch (error) {
      console.error('Erro ao criar usuário convidado:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    currentUser,
    isLoading,
    allUsers,
    register,
    login,
    createGuestUser,
    logout,
    isAuthenticated: !!currentUser,
    isTecnico: currentUser?.userType === 'tecnico',
  };
}
