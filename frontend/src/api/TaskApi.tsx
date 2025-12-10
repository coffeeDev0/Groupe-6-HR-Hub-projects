// File: src/api/taskApi.ts
export interface FileDTO {
fileId: string;
name: string;
url: string;
tacheId: string;
employeId?: string;
fileSize?: number;
contentType?: string;
extension?: string;
}


export interface TaskDTO {
taskId: string;
name: string;
description?: string;
priority?: 'low' | 'medium' | 'high' | string;
status?: 'todo' | 'in_progress' | 'done' | 'cancelled' | string;
dateStart?: string;
dateEnd?: string;
rhId?: string;
files?: FileDTO[];
assignees?: string[]; // employee ids
}


const BASE = "http://10.189.5.91:8086"; // ajuster si nécessaire


function authHeaders(contentType?: string | null) {
const token = localStorage.getItem('authToken');
const headers: Record<string,string> = {};
if (contentType) headers['Content-Type'] = contentType;
if (token) headers['Authorization'] = `Bearer ${token}`;
return headers;
}


export const taskApi = {
async getAll(): Promise<TaskDTO[]> {
const res = await fetch(`${BASE}/task/all`, { method: 'GET', headers: authHeaders(null) });
if (!res.ok) throw new Error('GET /task/all failed');
return res.json();
},


async getByRh(rhId: string): Promise<TaskDTO[]> {
const res = await fetch(`${BASE}/task/rh/${rhId}`, { method: 'GET', headers: authHeaders(null) });
if (!res.ok) throw new Error('GET /task/rh failed');
return res.json();
},


async getByEmployee(employeeId: string): Promise<TaskDTO[]> {
const res = await fetch(`${BASE}/task/employee/${employeeId}`, { method: 'GET', headers: authHeaders(null) });
if (!res.ok) throw new Error('GET /task/employee failed');
return res.json();
},


async create(payload: Partial<TaskDTO>) {
const res = await fetch(`${BASE}/task/add`, {
method: 'POST',
headers: authHeaders('application/json'),
body: JSON.stringify(payload),
});
if (!res.ok) throw new Error('POST /task/add failed');
return res.json();
},


async assign(taskId: string, employeeIds: string[]) {
const res = await fetch(`${BASE}/task/assign/${taskId}`, {
method: 'POST',
headers: authHeaders('application/json'),
body: JSON.stringify({ employeeIds }),
});
if (!res.ok) throw new Error('POST /task/assign failed');
return res.json();
},


};