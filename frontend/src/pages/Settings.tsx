import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { RoleModal } from '../components/RoleModal';
import { toast } from 'sonner@2.0.3';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  { id: 1, name: 'Admin Principal', email: 'admin@entreprise.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Sophie Bernard', email: 'sophie.bernard@entreprise.com', role: 'hr', status: 'active' },
  { id: 3, name: 'Marie Dupont', email: 'marie.dupont@entreprise.com', role: 'employee', status: 'active' },
  { id: 4, name: 'Jean Martin', email: 'jean.martin@entreprise.com', role: 'employee', status: 'active' },
];

export function Settings() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success('Utilisateur supprimé avec succès');
  };

  const handleSaveUser = (user: Partial<User>) => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...user } : u
      ));
      toast.success('Utilisateur modifié avec succès');
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...user as User,
      };
      setUsers([...users, newUser]);
      toast.success('Utilisateur ajouté avec succès');
    }
    setIsModalOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">Administrateur</Badge>;
      case 'hr':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">RH</Badge>;
      case 'employee':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Employé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestion des utilisateurs et des rôles</p>
        </div>
        <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-xl">
                <Shield className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Administrateurs</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-xl">
                <Shield className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ressources Humaines</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'hr').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                <Shield className="size-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employés</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'employee').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les accès et les permissions des utilisateurs
          </CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Rôle</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Statut</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : ''}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}
