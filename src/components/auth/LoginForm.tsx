import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Shield, Users, Headphones, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, roleLabels } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { LoginSuccessToast } from './LoginSuccessToast';

export const LoginForm = () => {
  const [email, setEmail] = useState('demo@starprint.com');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) return;
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      name: email.split('@')[0].replace(/[^a-zA-Z\s]/g, ''),
      role: role as UserRole
    };
    
    login(email, role as UserRole);
    
    // Mostrar toast de sucesso
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo(a), ${newUser.name}!`,
      duration: 3000,
    });
    
    setIsLoading(false);
  };

  const roleIcons = {
    admin: Shield,
    gestao: Users,
    atendente: Headphones
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MessageSquare className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            StarPrint CRM
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sistema de Atendimento e Gestão
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Perfil de Acesso</Label>
              <Select value={role} onValueChange={value => setRole(value as UserRole)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => {
                  const Icon = roleIcons[key as UserRole];
                  return <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </div>
                      </SelectItem>;
                })}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold" 
              disabled={!email || !password || !role || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-muted/50">
            <p className="text-sm font-semibold text-foreground text-center mb-3">
              💡 Perfis de Demonstração
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Shield className="h-3 w-3 text-purple-500" />
                <span><strong className="text-foreground">Admin:</strong> Acesso completo ao sistema</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Users className="h-3 w-3 text-blue-500" />
                <span><strong className="text-foreground">Gestão:</strong> Relatórios e monitoramento</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Headphones className="h-3 w-3 text-green-500" />
                <span><strong className="text-foreground">Atendente:</strong> Apenas módulo de atendimento</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-muted/50 text-center">
              <p className="text-xs text-muted-foreground">
                <strong>Credenciais:</strong> demo@starprint.com / 123456
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};