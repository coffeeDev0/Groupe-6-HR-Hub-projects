import React, { useEffect, useState } from 'react';
import { taskApi, TaskDTO } from '../api/TaskApi';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';


export function EmployeeTasksPage(){
const stored = localStorage.getItem('user');
const currentUser = stored ? JSON.parse(stored) : null;
const employeeId = currentUser?.userId;


const [tasks, setTasks] = useState<TaskDTO[]>([]);


useEffect(()=>{ if(employeeId) load(); },[employeeId]);


async function load(){
try{
const t = await taskApi.getByEmployee(employeeId);
setTasks(t);
}catch(e){ console.error(e); toast.error('Impossible de charger vos tâches'); }
}


const handleSetDone = async (taskId: string) => {
try{
await taskApi.evaluate(taskId, { comment: 'Terminé par employé' });
toast.success('État mis à jour');
load();
}catch(e){ console.error(e); toast.error('Impossible de mettre à jour'); }
};


return (
<div>
<h1 className="text-2xl">Mes tâches</h1>
<Card>
<CardHeader><CardTitle>Assignées</CardTitle></CardHeader>
<CardContent>
<div className="space-y-3">
{tasks.map(t=> (
<div key={t.taskId} className="p-4 border rounded-lg">
<h3 className="font-semibold">{t.name}</h3>
<p className="text-sm">{t.description}</p>
<div className="mt-2 flex gap-2">
<Button onClick={()=>handleSetDone(t.taskId!)} variant="outline">Marquer terminé</Button>
</div>
</div>
))}
{tasks.length===0 && <p className="text-gray-500">Aucune tâche</p>}
</div>
</CardContent>
</Card>
</div>
);
}
export default EmployeeTasksPage;