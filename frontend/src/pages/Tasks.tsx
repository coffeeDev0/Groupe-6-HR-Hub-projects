import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { taskApi, TaskDTO } from "../api/taskApi";
import { PlusCircle } from "lucide-react";
import { TaskModel } from "../components/TaskModal"; 
import { AssignEmployeeModal } from "../components/AssignEmployeeModal"; // modal assignation

export interface TasksPageProps {
  userId: string;
  role: "admin" | "hr" | "employee";
}

export function TasksPage({ userId, role }: TasksPageProps) {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);

  useEffect(() => {
    loadTasks();
  }, [userId, role]);

  async function loadTasks() {
    try {
      let data: TaskDTO[] = [];
      if (role === "employee") data = await taskApi.getEmployeeTasks(userId);
      else if (role === "hr") data = await taskApi.getRhTasks(userId);
      else if (role === "admin") data = await taskApi.getAllTasks();
      setTasks(data);
    } catch {
      toast.error("Impossible de charger les tâches");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tâches</h1>
        {role === "hr" && (
          <Button onClick={() => setIsTaskModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="size-4 mr-2" /> Nouvelle tâche
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des tâches</CardTitle>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Aucune tâche.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li key={t.taskId} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-sm text-gray-600">{t.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Employés assignés : {t.employees.length}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="badge">{t.status}</span>
                      {role === "hr" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTask(t);
                            setIsAssignModalOpen(true);
                          }}
                        >
                          Assigner
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* MODALS */}
      {role === "hr" && (
        <>
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={() => {
              setIsTaskModalOpen(false);
              loadTasks();
            }}
          />

          {selectedTask && (
            <AssignEmployeeModal
              task={selectedTask}
              isOpen={isAssignModalOpen}
              onClose={() => setIsAssignModalOpen(false)}
              onSave={() => {
                setIsAssignModalOpen(false);
                setSelectedTask(null);
                loadTasks();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
