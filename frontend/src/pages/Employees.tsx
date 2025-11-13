import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { EmployeeModal } from '../components/EmployeeModal';
import { toast } from 'sonner@2.0.3';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

const mockEmployees: Employee[] = [
  { id: 1, firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@entreprise.com', position: 'Développeur Senior', department: 'IT', hireDate: '2020-03-15', status: 'active' },
  { id: 2, firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@entreprise.com', position: 'Chef de Projet', department: 'IT', hireDate: '2019-07-22', status: 'active' },
  { id: 3, firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@entreprise.com', position: 'Responsable RH', department: 'RH', hireDate: '2018-01-10', status: 'active' },
  { id: 4, firstName: 'Luc', lastName: 'Petit', email: 'luc.petit@entreprise.com', position: 'Comptable', department: 'Finance', hireDate: '2021-09-05', status: 'active' },
  { id: 5, firstName: 'Emma', lastName: 'Roux', email: 'emma.roux@entreprise.com', position: 'Designer UX', department: 'Marketing', hireDate: '2022-02-14', status: 'inactive' },
];

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast.success('Employé supprimé avec succès');
  };

  const handleSaveEmployee = (employee: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { ...emp, ...employee } : emp
      ));
      toast.success('Employé modifié avec succès');
    } else {
      const newEmployee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...employee as Employee,
      };
      setEmployees([...employees, newEmployee]);
      toast.success('Employé ajouté avec succès');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Gestion des Employés</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{employees.length} employés au total</p>
        </div>
        <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="size-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email ou département..."
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
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Nom</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Poste</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">Département</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden xl:table-cell">Date d'embauche</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white whitespace-nowrap">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">{employee.email}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white whitespace-nowrap">{employee.position}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <Badge variant="secondary">{employee.department}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap hidden xl:table-cell">
                        {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} 
                          className={employee.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : ''}>
                          {employee.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEmployee(employee.id)}
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
          </div>
        </CardContent>
      </Card>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </div>
  );
}