import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'hr' | 'employee') => void;
  onSignUpClick: () => void;
}

export function Login({ onLogin, onSignUpClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'hr' | 'employee'>('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Building2 className="size-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">RHConnect</CardTitle>
            <CardDescription className="mt-2">
              Connectez-vous à votre espace
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Je suis</Label>
              <Select value={role} onValueChange={(value: 'admin' | 'hr' | 'employee') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employé</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Mot de passe oublié ?
              </a>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Connexion
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <button 
                type="button"
                onClick={onSignUpClick}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}