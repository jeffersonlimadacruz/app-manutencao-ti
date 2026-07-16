import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Auth() {
  const { login, register } = useLocalAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        await register(name, email, password);
        setSuccess('Conta criada com sucesso! Faça login para continuar.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚙️</span>
            </div>
            <span className="text-xl font-bold text-white">Manutenção TI</span>
          </div>
          <CardTitle className="text-white">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {isLogin
              ? 'Acesse o sistema de manutenção'
              : 'Crie sua conta para começar'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-400">{success}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {isLogin
                  ? 'Não tem conta? Criar agora'
                  : 'Já tem conta? Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              💡 <strong>Dica:</strong> Crie uma conta e compartilhe a senha com seus colegas técnicos. Todos verão os mesmos dados!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
