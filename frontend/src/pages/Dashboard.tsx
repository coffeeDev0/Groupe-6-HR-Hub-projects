// src/pages/RhDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { StatCard } from "../components/StatCard";
import { Users, CalendarDays, UserX } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";
import { demandeApi, DemandeDTO } from "../api/demandeApi";

const attendanceData = [
  { name: "Lun", présents: 145, absents: 5 },
  { name: "Mar", présents: 148, absents: 2 },
  { name: "Mer", présents: 142, absents: 8 },
  { name: "Jeu", présents: 147, absents: 3 },
  { name: "Ven", présents: 140, absents: 10 },
];

const departmentData = [
  { name: "IT", value: 45, color: "#3b82f6" },
  { name: "RH", value: 18, color: "#10b981" },
  { name: "Finance", value: 32, color: "#f59e0b" },
  { name: "Marketing", value: 28, color: "#8b5cf6" },
  { name: "Ventes", value: 27, color: "#ef4444" },
];

export function RhDashboard() {
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;

  const rhId = currentUser?.userId;
  
  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [conges, setConge] = useState<DemandeDTO[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rhId) {
      toast.error("Session invalide. Reconnectez-vous.");
      window.location.href = "/login";
      return;
    }
    loadEmployees();
  }, [rhId]);

  async function loadEmployees() {
    setLoading(true);
    try {
      const data = await userApi.getRhEmployers(rhId);
      setEmployees(data);
    } catch (err) {
      toast.error("Impossible de charger les employés");
    } finally {
      setLoading(false);
    }
  }

   async function loadConges() {
    setLoading(true);
    try {
      const data = await demandeApi.getAll();
      setConge(data);
    } catch (err) {
      toast.error("Impossible de charger les demandes de congés");
    } finally {
      setLoading(false);
    }
  }


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((u) => {
      const name = `${u.userPrenom ?? ""} ${u.userName ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.profession ?? "").toLowerCase().includes(q)
      );
    });
  }, [employees, query]);

  const handleStatusChange = async (u: UserDTO, status: string) => {
    try {
      await userApi.updateRhStatus(u.userId!, status);
      toast.success("Statut mis à jour");

      setEmployees((prev) =>
        prev.map((p) =>
          p.userId === u.userId ? { ...p, status } : p
        )
      );
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (u: UserDTO) => {
    if (!confirm(`Supprimer définitivement ${u.email} ?`)) return;

    try {
      await userApi.deleteUserByEmail(u.email!);
      toast.success("Utilisateur supprimé");

      setEmployees((prev) => prev.filter((p) => p.email !== u.email));
    } catch (err) {
      toast.error("Impossible de supprimer cet utilisateur");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl">
          Bienvenue {currentUser?.userPrenom} 
        </h1>
        <p className="text-gray-600 mt-1">Vous êtes connecté en tant que responsable RH</p>
      </div>

      <div>

        <h1 className="text-2xl md:text-3xl">Tableau de bord RH</h1>
        <p className="text-gray-600 mt-1">Gestion de vos employés</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Employés" value={`${employees.length}`} icon={Users} color="blue" />
        <StatCard title="En Congé" value={`${conges.length}`} icon={CalendarDays} color="orange" />
        <StatCard title="Absents" value="-" icon={UserX} color="red" />
      </div>

      {/* FILTRE */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Liste des employés</h2>
          <p className="text-sm text-gray-600">{employees.length} personnes</p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU */}
      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Profession</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{u.userPrenom} {u.userName}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.profession ?? "-"}</td>

                  {/* STATUT */}
                  <td className="py-3 px-4">
                    <select
                      value={u.status ?? "active"}
                      onChange={(e) => handleStatusChange(u, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </td>

                  {/* DELETE */}
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(u)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Aucun employé trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export default RhDashboard;
