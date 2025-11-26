import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FileText, Plus } from "lucide-react";
import { RequestModal } from "../components/RequestModal";
import { toast } from "sonner";

interface Request {
  id: string; // ID de l'utilisateur seulement
  startDate?: string;
  endDate?: string;
  reason: string;
}

export function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("Informations", user);
  const email = user.email;
  const userId = user.userId;

  const [requests, setRequests] = useState<Request[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // 🔥 Récupérer les demandes via email
  // ============================================
  useEffect(() => {
    if (!email) return;

    async function loadRequests() {
      try {
        const response = await fetch(`http://localhost:8084/demande/${email}`);
        if (!response.ok) throw new Error("Erreur API");

        const data = await response.json();

        setRequests(
          data.map((d: any) => ({
            id: userId, // ❗ Toujours l'id utilisateur
            reason: d.raison,
            startDate: d.dateDebut,
            endDate: d.dateFin,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger vos demandes");
      }
    }

    loadRequests();
  }, [email, userId]);

  // ============================================
  // 🔥 Envoyer une demande via l'ID utilisateur
  // ============================================
  const handleNewRequest = async (request: Partial<Request>) => {
    try {
      console.log(email);
      const res = await fetch(`http://localhost:8084/demande/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raison: request.reason,
          dateDebut: request.startDate,
          dateFin: request.endDate,
        }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const created = await res.json();

      const newRequest: Request = {
        id: userId, // ❗ Encore : id = userId
        reason: created.raison,
        startDate: created.dateDebut,
        endDate: created.dateFin,
      };

      setRequests((prev) => [newRequest, ...prev]);
      toast.success("Votre demande a été envoyée !");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Impossible d'envoyer la demande");
    }
  };

  // ============================================
  // 🔥 UI (simplifiée car plus de status, type, etc.)
  // ============================================
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">
            Mes demandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historique des demandes de congé
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
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
                <p className="text-gray-600 dark:text-gray-400">
                  Aucune demande pour le moment
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Cliquez sur « Nouvelle demande »
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="text-gray-900 dark:text-white font-medium">
                      Congé demandé
                    </h3>

                    {request.startDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Du{" "}
                        {new Date(request.startDate).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        au{" "}
                        {new Date(request.endDate!).toLocaleDateString("fr-FR")}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mt-1">
                      Raison : {request.reason}
                    </p>
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
