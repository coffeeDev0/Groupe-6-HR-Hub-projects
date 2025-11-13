import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User, Mail, Phone, Briefcase, Calendar, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const leaveHistory = [
  { id: 1, type: 'Congés payés', startDate: '2025-08-15', endDate: '2025-08-29', status: 'approved' },
  { id: 2, type: 'RTT', startDate: '2025-07-12', endDate: '2025-07-12', status: 'approved' },
  { id: 3, type: 'Congé maladie', startDate: '2025-06-05', endDate: '2025-06-07', status: 'approved' },
  { id: 4, type: 'Congés payés', startDate: '2025-11-15', endDate: '2025-11-22', status: 'pending' },
];

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@entreprise.com',
    phone: '+33 6 12 34 56 78',
    position: 'Développeur Senior',
    department: 'IT',
    hireDate: '2020-03-15',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Validé</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Refusé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white">Mon Profil</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez vos informations personnelles</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="size-4 mr-2" />
            Modifier le profil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="size-24">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl text-gray-900 dark:text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.position}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {profileData.department}
                  </Badge>
                </div>
                <div className="w-full pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="size-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Depuis {new Date(profileData.hireDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Solde de congés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Congés payés</span>
                <span className="text-gray-900 dark:text-white">15 jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">RTT</span>
                <span className="text-gray-900 dark:text-white">8 jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Congés pris</span>
                <span className="text-gray-900 dark:text-white">10 jours</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-blue-600" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Modifiez vos informations' : 'Vos informations personnelles'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    disabled
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-5 text-blue-600" />
                Historique des congés
              </CardTitle>
              <CardDescription>
                Vos demandes de congés récentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date début</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date fin</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((leave) => (
                      <tr key={leave.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{leave.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(leave.startDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
