import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Check, X, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LeaveRequest {
  id: number;
  employeeName: string;
  type: 'leave' | 'absence' | 'resignation';
  title: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedAt: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  { id: 1, employeeName: 'Marie Dupont', type: 'leave', title: 'Congés payés', startDate: '2025-11-15', endDate: '2025-11-22', status: 'pending', reason: 'Vacances familiales', submittedAt: '2025-11-10' },
  { id: 2, employeeName: 'Jean Martin', type: 'absence', title: 'Congé maladie', startDate: '2025-11-08', endDate: '2025-11-10', status: 'approved', reason: 'Certificat médical fourni', submittedAt: '2025-11-07' },
  { id: 3, employeeName: 'Sophie Bernard', type: 'leave', title: 'Congés payés', startDate: '2025-12-20', endDate: '2026-01-05', status: 'pending', reason: 'Congés de fin d\'année', submittedAt: '2025-11-12' },
  { id: 4, employeeName: 'Luc Petit', type: 'resignation', title: 'Démission', startDate: '2025-12-31', status: 'pending', reason: 'Nouvelle opportunité professionnelle', submittedAt: '2025-11-13' },
  { id: 5, employeeName: 'Emma Roux', type: 'absence', title: 'Absence justifiée', startDate: '2025-11-20', endDate: '2025-11-20', status: 'approved', reason: 'Rendez-vous médical', submittedAt: '2025-11-18' },
];

interface LeaveManagementProps {
  userRole: 'admin' | 'hr' | 'employee';
}

export function LeaveManagement({ userRole }: LeaveManagementProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter(req =>
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    toast.success('Demande approuvée');
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
    toast.error('Demande refusée');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Approuvée</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Refusée</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'leave':
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">Congé</Badge>;
      case 'absence':
        return <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400">Absence</Badge>;
      case 'resignation':
        return <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400">Démission</Badge>;
      default:
        return null;
    }
  };

  const canManageRequests = userRole === 'admin' || userRole === 'hr';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Gestion des Demandes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{requests.length} demandes au total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
              <p className="text-3xl text-orange-600 mt-2">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approuvées</p>
              <p className="text-3xl text-green-600 mt-2">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Refusées</p>
              <p className="text-3xl text-red-600 mt-2">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Démissions</p>
              <p className="text-3xl text-purple-600 mt-2">
                {requests.filter(r => r.type === 'resignation').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Employé</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">Détails</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Dates</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">Raison</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Statut</th>
                  {canManageRequests && (
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white whitespace-nowrap">{request.employeeName}</td>
                    <td className="py-3 px-4">{getTypeBadge(request.type)}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant="secondary">{request.title}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm">
                      {request.type === 'resignation' 
                        ? new Date(request.startDate).toLocaleDateString('fr-FR')
                        : `${new Date(request.startDate).toLocaleDateString('fr-FR')} - ${new Date(request.endDate!).toLocaleDateString('fr-FR')}`
                      }
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate hidden lg:table-cell">
                      {request.reason}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                    {canManageRequests && (
                      <td className="py-3 px-4">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                              title="Approuver"
                            >
                              <Check className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Refuser"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}