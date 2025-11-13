import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { LeaveManagement } from './pages/LeaveManagement';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'signup' | 'dashboard' | 'employees' | 'leaves' | 'reports' | 'settings' | 'profile' | 'employee-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userRole, setUserRole] = useState<'admin' | 'hr' | 'employee'>('employee');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (role: 'admin' | 'hr' | 'employee') => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === 'employee') {
      setCurrentPage('employee-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('employee');
    setCurrentPage('login');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!isAuthenticated) {
    return (
      <div className={theme}>
        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin} 
            onSignUpClick={() => setCurrentPage('signup')}
          />
        )}
        {currentPage === 'signup' && (
          <SignUp 
            onSuccess={() => setCurrentPage('login')}
            onLoginClick={() => setCurrentPage('login')}
          />
        )}
        <Toaster />
      </div>
    );
  }

  // Interface Employé
  if (userRole === 'employee') {
    return (
      <div className={theme}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar 
            onLogout={handleLogout} 
            onThemeToggle={toggleTheme}
            theme={theme}
            userRole={userRole}
            onProfileClick={() => setCurrentPage('profile')}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="pt-16">
            <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
              {currentPage === 'employee-dashboard' && <EmployeeDashboard />}
              {currentPage === 'profile' && <Profile />}
            </main>
          </div>
          <Toaster />
        </div>
      </div>
    );
  }

  // Interface Admin/RH
  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar 
          onLogout={handleLogout} 
          onThemeToggle={toggleTheme}
          theme={theme}
          userRole={userRole}
          onProfileClick={() => setCurrentPage('profile')}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex">
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={(page) => {
              setCurrentPage(page);
              setIsSidebarOpen(false);
            }}
            userRole={userRole}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-6 lg:p-8">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'employees' && <Employees />}
            {currentPage === 'leaves' && <LeaveManagement userRole={userRole} />}
            {currentPage === 'reports' && <Reports />}
            {currentPage === 'settings' && <Settings />}
            {currentPage === 'profile' && <Profile />}
          </main>
        </div>
        <Toaster />
      </div>
    </div>
  );
}