import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LoginTecnico() {
  const { login, register, allUsers } = useLocalAuth();
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
      <div className="w-full max-w-md">
        <Button
          onClick={() => (window.location.href = '/')}
          variant="ghost"
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔐</span>
              </div>
              <span className="text-xl font-bold text-white">Técnico</span>
            </div>
            <CardTitle className="text-white">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isLogin
                ? 'Acesso exclusivo para técnicos'
                : 'Crie sua conta de técnico'}
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

            {isLogin && allUsers.filter(u => u.userType === 'tecnico').length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-3 font-semibold">👥 Técnicos Pré-Cadastrados:</p>
                <div className="space-y-2">
                  {allUsers
                    .filter(u => u.userType === 'tecnico')
                    .map(u => (
                      <div key={u.id} className="p-2 bg-slate-700/30 rounded text-xs">
                        <p className="text-slate-300 font-medium">
                          {u.name} {u.role === 'chefe' ? '👨‍💼' : ''}
                        </p>
                        <p className="text-slate-500">{u.email}</p>
                        <p className="text-slate-600 text-xs mt-1">Senha: 1234567890</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
