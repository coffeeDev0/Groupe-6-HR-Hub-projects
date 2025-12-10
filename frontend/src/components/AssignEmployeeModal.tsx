import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";
import { taskApi } from "../api/TaskApi";
import { toast } from "sonner";
import { UserDTO } from "../api/userApi";

interface AssignEmployeeModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AssignEmployeeModal({ task, isOpen, onClose, onSave }: AssignEmployeeModalProps) {
  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user`);
        const data = await res.json();
        setEmployees(data);
        setSelectedIds(task.employees.map((e: any) => e.userId));
      } catch {
        toast.error("Impossible de charger les employés");
      }
    }
    if (isOpen) loadEmployees();
  }, [isOpen, task]);

  const handleSave = async () => {
    try {
      await taskApi.assignEmployees(task.taskId, selectedIds);
      toast.success("Employés assignés !");
      onSave();
    } catch {
      toast.error("Erreur lors de l'assignation");
    }
  };

  const toggleEmployee = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <Dialog.Title className="text-lg font-semibold">Assigner des employés</Dialog.Title>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
          {employees.map((e) => (
            <label key={e.userId} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(e.userId)}
                onChange={() => toggleEmployee(e.userId)}
              />
              {e.userPrenom} {e.userName} ({e.email})
            </label>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
