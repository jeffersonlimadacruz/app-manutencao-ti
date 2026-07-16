import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { Lock, Users } from 'lucide-react';

export default function AccessChoice() {
  const { createGuestUser } = useLocalAuth();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleGuestAccess = async () => {
    setIsLoading(true);
    try {
      await createGuestUser(userName || 'Usuário');
      // Aguardar um pouco para garantir que o estado foi salvo
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Erro ao criar acesso de convidado:', error);
      setIsLoading(false);
    }
  };

  const handleTecnicoClick = () => {
    navigate('/login-tecnico');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚙️</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Manutenção TI</h1>
          </div>
          <p className="text-slate-400 text-lg">Escolha como deseja acessar o sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Técnico */}
          <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Técnico</CardTitle>
                  <CardDescription className="text-slate-400">Gerenciar sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">
                Acesso completo ao sistema. Gerencie chamados, equipamentos, manutenção e receba notificações.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Ver todos os chamados</li>
                <li>✓ Atualizar status</li>
                <li>✓ Deletar chamados</li>
                <li>✓ Receber notificações</li>
              </ul>
              <Button
                onClick={handleTecnicoClick}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                Entrar como Técnico
              </Button>
            </CardContent>
          </Card>

          {/* Usuário Normal */}
          <Card className="bg-slate-800 border-slate-700 hover:border-green-500 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Usuário</CardTitle>
                  <CardDescription className="text-slate-400">Criar chamados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">
                Acesso rápido para criar chamados de suporte. Acompanhe o status de seus chamados.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Criar chamados</li>
                <li>✓ Ver seus chamados</li>
                <li>✓ Adicionar comentários</li>
                <li>✓ Sem necessidade de login</li>
              </ul>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Seu nome (opcional)</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 mb-3"
                />
              </div>

              <Button
                onClick={handleGuestAccess}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Carregando...' : 'Continuar como Usuário'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Todos os dados são salvos localmente no seu navegador</p>
          <p>Funciona offline e sincroniza quando conecta à internet</p>
        </div>
      </div>
    </div>
  );
}
