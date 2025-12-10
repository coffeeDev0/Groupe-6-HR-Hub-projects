import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";
import { taskApi } from "../api/TaskApi";
import { toast } from "sonner";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Moyenne");

  const handleCreate = async () => {
    if (!name) return toast.error("Nom requis");
    try {
      await taskApi.createTask({ name, description, priority });
      toast.success("Tâche créée !");
      onSave();
      setName(""); setDescription(""); setPriority("Moyenne");
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <Dialog.Title className="text-lg font-semibold">Créer une tâche</Dialog.Title>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Nom de la tâche"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select className="w-full border px-3 py-2 rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleCreate}>Créer</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
