import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';

export function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusText = () => {
    if (isSyncing) return 'Sincronizando...';
    if (!isOnline) return 'Offline';
    return 'Online';
  };

  const getStatusColor = () => {
    if (isSyncing) return 'bg-yellow-500';
    if (!isOnline) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (isSyncing) return <Cloud className="w-4 h-4 animate-spin" />;
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${getStatusColor()} bg-opacity-20 border border-current`}>
      <div className={`${getStatusColor()} rounded-full w-2 h-2`} />
      <span className="text-xs font-medium">{getStatusText()}</span>
      <div className={getStatusColor() + ' text-white'}>
        {getStatusIcon()}
      </div>
    </div>
  );
}
