import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';


export function TaskCreateModal({ isOpen, onClose, onSave }: { isOpen:boolean; onClose:()=>void; onSave:(p:any)=>void; }){
const [form, setForm] = useState({ name:'', description:'', priority:'medium', dateStart:'', dateEnd:'' });


const submit = (e:any)=>{ e.preventDefault(); onSave(form); };


return (
<Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="max-w-lg">
<DialogHeader>
<DialogTitle>Créer une tâche</DialogTitle>
</DialogHeader>
<form onSubmit={submit} className="space-y-4">
<div>
<Label>Nom</Label>
<Input value={form.name} onChange={(e:any)=>setForm({...form,name:e.target.value})} required />
</div>
<div>
<Label>Description</Label>
<Input value={form.description} onChange={(e:any)=>setForm({...form,description:e.target.value})} />
</div>
<div className="flex gap-2">
<Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
<Button type="submit">Créer</Button>
</div>
</form>
</DialogContent>
</Dialog>
);
}

export default TaskCreateModal;