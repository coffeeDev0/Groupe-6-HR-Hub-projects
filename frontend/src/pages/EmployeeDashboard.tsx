import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge, FileText, Plus } from "lucide-react";
import { RequestModal } from "../components/RequestModal";
import { StatCard } from "../components/StatCard";
import { toast } from "sonner";
import { taskApi, TaskDTO } from "../api/TaskApi";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import React from "react";

interface Request {
  id: string;
  startDate?: string;
  endDate?: string;
  reason: string;
}

export function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user.email;
  const userId = user.userId;

  const [requests, setRequests] = useState<Request[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);

  // Load demandes
  useEffect(() => {
    if (!email) return;

    async function loadRequests() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/demande/${email}`);
        if (!response.ok) throw new Error("Erreur API");
        const data = await response.json();
        setRequests(
          data.map((d: any) => ({
            id: userId,
            reason: d.raison,
            startDate: d.dateDebut,
            endDate: d.dateFin,
          }))
        );
      } catch {
        toast.error("Impossible de charger vos demandes");
      }
    }

    loadRequests();
  }, [email, userId]);

  // Load tâches
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await taskApi.getEmployeeTasks(userId);
        setTasks(data);
      } catch {
        toast.error("Impossible de charger les tâches");
      }
    }
    loadTasks();
  }, [userId]);

  const handleNewRequest = async (request: Partial<Request>) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/demande/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raison: request.reason,
          dateDebut: request.startDate,
          dateFin: request.endDate,
        }),
      });
      if (!res.ok) throw new Error("Erreur API");
      const created = await res.json();
      const newRequest: Request = {
        id: userId,
        reason: created.raison,
        startDate: created.dateDebut,
        endDate: created.dateFin,
      };
      setRequests((prev) => [newRequest, ...prev]);
      toast.success("Votre demande a été envoyée !");
      setIsModalOpen(false);
    } catch {
      toast.error("Impossible d'envoyer la demande");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Mes demandes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Historique des demandes de congé</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="size-4 mr-2" /> Nouvelle demande
        </Button>
      </div>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>Vos anciennes demandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Aucune demande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="text-gray-900 dark:text-white font-medium">Congé demandé</h3>
                    {request.startDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Du {new Date(request.startDate).toLocaleDateString("fr-FR")} au {new Date(request.endDate!).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Raison : {request.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleNewRequest} />

      {/* Mes Tâches */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ClipboardCheck className="size-5" /> Mes tâches
        </h2>
        <Card className="mt-3">
          <CardContent>
            <StatCard title="Mes Tâches" value={`${tasks.length}`} icon={ClipboardList} color="purple" />
            {tasks.length === 0 ? (
              <p className="text-center py-6 text-gray-500">Aucune tâche assignée.</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((t) => (
                  <li key={t.taskId} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between">
                      <p className="font-semibold">{t.name}</p>
                      <Badge>{t.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{t.description}</p>
                    {t.files.length > 0 && (
                      <div className="mt-2 text-sm text-blue-600 underline cursor-pointer">{t.files.length} fichiers joints</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
