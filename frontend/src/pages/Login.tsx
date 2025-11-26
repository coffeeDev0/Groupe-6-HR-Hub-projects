import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: (role: "admin" | "hr" | "employee") => void;
  onSignUpClick: () => void;
}

export function Login({ onLogin, onSignUpClick }: LoginProps) {
  const [userMail, setUserMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "hr" | "employee">("employee"); // Gardé comme tu veux
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // AUTHENTIFICATION (ON NE CHANGE PAS TON SERVICE)
      const response = await fetch("http://10.138.94.91:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMail: userMail,
          password: password,
          role: role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Identifiants invalides");
        return;
      }

      const data = await response.json();
      toast.success("Connexion1 réussie !");

      // Stockage du token
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // RÉCUPÉRATION DU USER DANS employer-service
      const userRes = await fetch(
        `http://10.138.94.91:8085/user/email/${userMail}`
      );

      if (!userRes.ok) {
        toast.error("Impossible de récupérer les données utilisateur.");
        console.error(await userRes.text());
        return;
      }

      const userData = await userRes.json();

      // Stockage complet du user dans le navigateur
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("role", userData.role);
      console.log(localStorage.getItem("user"));
      // Le vrai rôle backend

      // La logique actuelle reste la même
      onLogin(role);
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Building2 className="size-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">RHConnect</CardTitle>
            <CardDescription className="mt-2">
              Connectez-vous à votre espace
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@entreprise.com"
                value={userMail}
                onChange={(e) => setUserMail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Ton select rôle reste comme tu veux */}
            <div className="space-y-2">
              <Label htmlFor="role">Je suis</Label>
              <Select
                value={role}
                onValueChange={(value: "admin" | "hr" | "employee") =>
                  setRole(value)
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employé</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}>
              {isLoading ? "Connexion..." : "Connexion"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={onSignUpClick}
                className="text-blue-600 hover:underline dark:text-blue-400">
                S'inscrire
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
