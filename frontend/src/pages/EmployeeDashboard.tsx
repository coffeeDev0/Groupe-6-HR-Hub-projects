import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, CalendarDays, FileText, LogOut as LogOutIcon, Clock } from 'lucide-react';
import { RequestModal } from '../components/RequestModal';
import { toast } from 'sonner@2.0.3';

interface Request {
  id: number;
  type: 'leave' | 'absence' | 'resignation';
  title: string;
  startDate?: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockRequests: Request[] = [
  { 
    id: 1, 
    type: 'leave', 
    title: 'Congés payés',
    startDate: '2025-12-20', 
    endDate: '2026-01-05', 
    reason: 'Vacances de fin d\'année',
    status: 'pending',
    submittedAt: '2025-11-10'
  },
  { 
    id: 2, 
    type: 'absence', 
    title: 'Absence maladie',
    startDate: '2025-11-01', 
    endDate: '2025-11-03', 
    reason: 'Certificat médical fourni',
    status: 'approved',
    submittedAt: '2025-11-01'
  },
  { 
    id: 3, 
    type: 'leave', 
    title: 'RTT',
    startDate: '2025-11-25', 
    endDate: '2025-11-25', 
    reason: 'Jour de récupération',
    status: 'approved',
    submittedAt: '2025-11-05'
  },
];

export function EmployeeDashboard() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewRequest = (request: Partial<Request>) => {
    const newRequest: Request = {
      id: Math.max(...requests.map(r => r.id)) + 1,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      ...request as Request,
    };
    setRequests([newRequest, ...requests]);
    toast.success('Votre demande a été soumise avec succès');
    setIsModalOpen(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <CalendarDays className="size-5 text-blue-600" />;
      case 'absence':
        return <Clock className="size-5 text-orange-600" />;
      case 'resignation':
        return <LogOutIcon className="size-5 text-red-600" />;
      default:
        return <FileText className="size-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'leave': return 'Congé';
      case 'absence': return 'Absence';
      case 'resignation': return 'Démission';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Mes demandes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez vos congés, absences et démissions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-3xl text-orange-600 mt-2">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-950 p-3 rounded-xl">
                <Clock className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approuvées</p>
                <p className="text-3xl text-green-600 mt-2">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-950 p-3 rounded-xl">
                <CalendarDays className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Refusées</p>
                <p className="text-3xl text-red-600 mt-2">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-950 p-3 rounded-xl">
                <FileText className="size-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>
            Toutes vos demandes de congés, absences et démissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Aucune demande pour le moment</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Cliquez sur "Nouvelle demande" pour commencer
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div 
                    key={request.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getTypeIcon(request.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-gray-900 dark:text-white">{request.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(request.type)}
                          </Badge>
                        </div>
                        {request.startDate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {request.type === 'resignation' 
                              ? `Date souhaitée: ${new Date(request.startDate).toLocaleDateString('fr-FR')}`
                              : `${new Date(request.startDate).toLocaleDateString('fr-FR')} - ${new Date(request.endDate!).toLocaleDateString('fr-FR')}`
                            }
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                          {request.reason}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Soumis le {new Date(request.submittedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNewRequest}
      />
    </div>
  );
}
