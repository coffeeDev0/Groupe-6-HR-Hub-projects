import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StatCard } from "../components/StatCard";
import { Users, CalendarDays, UserX, Plus, Search, Trash2, ClipboardList, PlusCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";
import { demandeApi, DemandeDTO } from "../api/demandeApi";
import { RoleModal } from "../components/RoleModal";
import { taskApi, TaskDTO } from "../api/TaskApi";
import { TaskModal } from "../components/TaskModal";
import { AssignEmployeeModal } from "../components/AssignEmployeeModal";

export function RhDashboard() {
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;
  const rhId = currentUser?.userId;

  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [conges, setConge] = useState<DemandeDTO[]>([]);
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!rhId) return;
    loadEmployees();
    loadConges();
    loadTasks();
  }, [rhId]);

  async function loadEmployees() {
    try {
      const data = await userApi.getRhEmployers(rhId);
      setEmployees(data);
    } catch { toast.error("Impossible de charger les employés"); }
  }

  async function loadConges() {
    try {
      const data = await demandeApi.getRhRequest(rhId);
      setConge(data);
    } catch { toast.error("Impossible de charger les congés"); }
  }

  async function loadTasks() {
    try {
      const data = await taskApi.getRhTasks(rhId);
      setTasks(data);
    } catch { toast.error("Impossible de charger les tâches"); }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((u) => {
      const name = `${u.userPrenom ?? ""} ${u.userName ?? ""}`.toLowerCase();
      return name.includes(q) || (u.email ?? "").toLowerCase().includes(q) || (u.profession ?? "").toLowerCase().includes(q);
    });
  }, [employees, query]);

  const handleAddEmployee = async (employeePayload: Partial<UserDTO>) => {
    try {
      const addedEmployee = await userApi.addEmployer({ ...employeePayload, rhId });
      toast.success(`Employé ${addedEmployee.userName} ajouté !`);
      setIsModalOpen(false);
      loadEmployees();
    } catch { toast.error("Impossible d'ajouter l'employé"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl">Bienvenue {currentUser?.userPrenom}</h1>
        <p className="text-gray-600 mt-1">Vous êtes connecté en tant que responsable RH</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Employés" value={`${employees.length}`} icon={Users} color="blue" />
        <StatCard title="En Congé" value={`${conges.length}`} icon={CalendarDays} color="orange" />
        <StatCard title="Absents" value="-" icon={UserX} color="red" />
        <StatCard title="Tâches créées" value={`${tasks.length}`} icon={ClipboardList} color="purple" />
      </div>

      {/* Employés */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Liste des employés</h2>
          <p className="text-sm text-gray-600">{employees.length} personnes</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-10" placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4 mr-2" /> Ajouter un employé
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>Nom</th><th>Email</th><th>Profession</th><th>Statut</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td>{u.userPrenom} {u.userName}</td>
                  <td>{u.email}</td>
                  <td>{u.profession ?? "-"}</td>
                  <td><Badge>{u.status ?? "Actif"}</Badge></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <RoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} rhs={currentUser ? [{ id: currentUser.userId, name: currentUser.userPrenom + ' ' + currentUser.userName }] : []} onSave={handleAddEmployee} user={null} />

      {/* Tâches */}
      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tâches créées</h2>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsTaskModalOpen(true)}>
          <PlusCircle className="size-4 mr-2" /> Nouvelle tâche
        </Button>
      </div>
      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="py-4 text-gray-500 text-center">Aucune tâche créée.</p>
          ) : (
            <ul className="space-y-3 mt-3">
              {tasks.map((t) => (
                <li key={t.taskId} className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-600">{t.description} — {t.priority}</p>
                  </div>
                  <div>
                    <Badge>{t.status}</Badge>
                    <Button className="ml-2" onClick={() => { setSelectedTask(t); setIsAssignModalOpen(true); }}>Assigner</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={loadTasks} />
      {selectedTask && <AssignEmployeeModal task={selectedTask} isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={() => { loadTasks(); setIsAssignModalOpen(false); }} />}
    </div>
  );
}

export default RhDashboard;
