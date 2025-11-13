import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { FileDown, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const reportData = [
  { employee: 'Marie Dupont', department: 'IT', leaveDays: 15, absences: 2, status: 'Actif' },
  { employee: 'Jean Martin', department: 'IT', leaveDays: 10, absences: 1, status: 'Actif' },
  { employee: 'Sophie Bernard', department: 'RH', leaveDays: 20, absences: 0, status: 'Actif' },
  { employee: 'Luc Petit', department: 'Finance', leaveDays: 12, absences: 3, status: 'Actif' },
  { employee: 'Emma Roux', department: 'Marketing', leaveDays: 8, absences: 1, status: 'Inactif' },
];

export function Reports() {
  const [reportType, setReportType] = useState('leaves');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');

  const handleExportPDF = () => {
    toast.success('Export PDF en cours...');
  };

  const handleExportCSV = () => {
    toast.success('Export CSV en cours...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900 dark:text-white">Rapports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Générez et exportez vos rapports RH</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-blue-600" />
            Paramètres du rapport
          </CardTitle>
          <CardDescription>
            Sélectionnez les critères pour générer votre rapport
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaves">Congés</SelectItem>
                  <SelectItem value="absences">Absences</SelectItem>
                  <SelectItem value="employees">Employés</SelectItem>
                  <SelectItem value="attendance">Présence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
              <FileDown className="size-4 mr-2" />
              Exporter PDF
            </Button>
            <Button onClick={handleExportCSV} variant="outline">
              <FileDown className="size-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu des données</CardTitle>
          <CardDescription>
            Période : {new Date(startDate).toLocaleDateString('fr-FR')} - {new Date(endDate).toLocaleDateString('fr-FR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Employé</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Département</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Jours de congé</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Absences</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.employee}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{row.department}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.leaveDays}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.absences}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'Actif' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {reportData.length} résultats
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Précédent</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total congés pris</p>
              <p className="text-3xl text-blue-600 mt-2">65 jours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total absences</p>
              <p className="text-3xl text-orange-600 mt-2">7 jours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Taux de présence</p>
              <p className="text-3xl text-green-600 mt-2">95.2%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
