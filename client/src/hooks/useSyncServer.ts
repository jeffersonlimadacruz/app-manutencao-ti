import { useEffect, useState } from 'react';
import type { AppState } from '@/types';

const API_BASE = 'https://api.manus.space/maintenance'; // Será substituído ao fazer deploy

export function useSyncServer() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sincronizar dados com servidor
  const syncToServer = async (state: AppState, userId: string) => {
    if (!navigator.onLine) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          data: state,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao sincronizar: ${response.statusText}`);
      }

      setLastSync(Date.now());
    } catch (error) {
      console.error('Erro ao sincronizar com servidor:', error);
      setSyncError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSyncing(false);
    }
  };

  // Carregar dados do servidor
  const loadFromServer = async (userId: string): Promise<AppState | null> => {
    if (!navigator.onLine) return null;

    try {
      const response = await fetch(`${API_BASE}/load?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao carregar dados do servidor:', error);
      return null;
    }
  };

  // Sincronizar periodicamente quando online
  useEffect(() => {
    const handleOnline = () => {
      console.log('Voltou online - sincronizando...');
      // Aqui você pode chamar syncToServer
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return {
    isSyncing,
    lastSync,
    syncError,
    syncToServer,
    loadFromServer,
  };
}
