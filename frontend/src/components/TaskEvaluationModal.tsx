import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';


export function TaskEvaluationModal({ isOpen, onClose, task, onEvaluate }: { isOpen:boolean; onClose:()=>void; task:any; onEvaluate:(taskId:string, payload:any)=>void }){
const [comment, setComment] = useState('');
const [score, setScore] = useState<number|undefined>(undefined);


const submit = ()=>{ if(!task) return; onEvaluate(task.taskId, { comment, score }); };


return (
<Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="max-w-lg">
<DialogHeader>
<DialogTitle>Évaluer la tâche</DialogTitle>
</DialogHeader>
<div className="space-y-3">
<Input placeholder="Commentaire" value={comment} onChange={(e:any)=>setComment(e.target.value)} />
<Input placeholder="Score (0-100)" value={score as any} onChange={(e:any)=>setScore(Number(e.target.value))} />
<div className="flex justify-end gap-2">
<Button variant="outline" onClick={onClose}>Annuler</Button>
<Button onClick={submit}>Envoyer</Button>
</div>
</div>
</DialogContent>
</Dialog>
);
}

export default TaskEvaluationModal;