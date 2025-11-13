import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Request {
  type: 'leave' | 'absence' | 'resignation';
  title: string;
  startDate?: string;
  endDate?: string;
  reason: string;
}

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: Partial<Request>) => void;
}

export function RequestModal({ isOpen, onClose, onSave }: RequestModalProps) {
  const [requestType, setRequestType] = useState<'leave' | 'absence' | 'resignation'>('leave');
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleTypeChange = (type: 'leave' | 'absence' | 'resignation') => {
    setRequestType(type);
    setFormData({ ...formData, title: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: requestType,
      ...formData,
    });
    setFormData({ title: '', startDate: '', endDate: '', reason: '' });
    setRequestType('leave');
  };

  const getTypeOptions = () => {
    switch (requestType) {
      case 'leave':
        return [
          { value: 'Congés payés', label: 'Congés payés' },
          { value: 'RTT', label: 'RTT' },
          { value: 'Congé sans solde', label: 'Congé sans solde' },
          { value: 'Congé parental', label: 'Congé parental' },
        ];
      case 'absence':
        return [
          { value: 'Absence maladie', label: 'Absence maladie' },
          { value: 'Absence justifiée', label: 'Absence justifiée' },
          { value: 'Absence exceptionnelle', label: 'Absence exceptionnelle' },
        ];
      case 'resignation':
        return [
          { value: 'Démission', label: 'Démission' },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande</DialogTitle>
          <DialogDescription>
            Choisissez le type de demande et remplissez les informations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestType">Type de demande</Label>
            <Select value={requestType} onValueChange={(value: 'leave' | 'absence' | 'resignation') => handleTypeChange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leave">Congé</SelectItem>
                <SelectItem value="absence">Absence</SelectItem>
                <SelectItem value="resignation">Démission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {requestType === 'leave' ? 'Type de congé' : requestType === 'absence' ? 'Type d\'absence' : 'Type'}
            </Label>
            <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {getTypeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {requestType === 'resignation' ? (
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de départ souhaitée</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">
              {requestType === 'resignation' ? 'Motif de la démission' : 'Raison / Justification'}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                requestType === 'resignation' 
                  ? 'Expliquez brièvement les raisons de votre démission...'
                  : requestType === 'absence'
                  ? 'Joindre un certificat si nécessaire...'
                  : 'Décrivez la raison de votre demande...'
              }
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={4}
            />
          </div>

          {requestType === 'resignation' && (
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                ⚠️ <strong>Attention :</strong> Une demande de démission est une décision importante. 
                Assurez-vous d'avoir bien réfléchi avant de soumettre cette demande.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Soumettre la demande
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
