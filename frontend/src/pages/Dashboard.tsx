import { StatCard } from '../components/StatCard';
import { Users, UserCheck, UserX, CalendarDays, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const attendanceData = [
  { name: 'Lun', présents: 145, absents: 5 },
  { name: 'Mar', présents: 148, absents: 2 },
  { name: 'Mer', présents: 142, absents: 8 },
  { name: 'Jeu', présents: 147, absents: 3 },
  { name: 'Ven', présents: 140, absents: 10 },
];

const departmentData = [
  { name: 'IT', value: 45, color: '#3b82f6' },
  { name: 'RH', value: 18, color: '#10b981' },
  { name: 'Finance', value: 32, color: '#f59e0b' },
  { name: 'Marketing', value: 28, color: '#8b5cf6' },
  { name: 'Ventes', value: 27, color: '#ef4444' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de la gestion RH</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Employés"
          value="150"
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Présents Aujourd'hui"
          value="142"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="En Congé"
          value="8"
          icon={CalendarDays}
          color="orange"
        />
        <StatCard
          title="Absents"
          value="3"
          icon={UserX}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Présence de la semaine</CardTitle>
            <CardDescription>Suivi quotidien des présences et absences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="présents" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absents" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par département</CardTitle>
            <CardDescription>Distribution des employés par service</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            Activités récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Nouvelle demande de congé', user: 'Marie Dupont', time: 'Il y a 5 min', type: 'warning' },
              { action: 'Employé ajouté', user: 'Jean Martin', time: 'Il y a 1h', type: 'success' },
              { action: 'Congé validé', user: 'Sophie Bernard', time: 'Il y a 2h', type: 'success' },
              { action: 'Absence signalée', user: 'Luc Petit', time: 'Il y a 3h', type: 'error' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`size-2 rounded-full flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white truncate">{activity.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{activity.user}</p>
                </div>
                <span className="text-sm text-gray-500 flex-shrink-0 hidden sm:block">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}