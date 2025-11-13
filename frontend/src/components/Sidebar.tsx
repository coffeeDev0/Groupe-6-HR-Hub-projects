import { LayoutDashboard, Users, CalendarDays, FileText, Settings, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

type Page = 'dashboard' | 'employees' | 'leaves' | 'reports' | 'settings' | 'profile';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: 'admin' | 'hr' | 'employee';
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, userRole, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'hr', 'employee'] },
    { id: 'employees' as Page, label: 'Employés', icon: Users, roles: ['admin', 'hr'] },
    { id: 'leaves' as Page, label: 'Congés & Absences', icon: CalendarDays, roles: ['admin', 'hr', 'employee'] },
    { id: 'reports' as Page, label: 'Rapports', icon: FileText, roles: ['admin', 'hr'] },
    { id: 'settings' as Page, label: 'Paramètres', icon: Settings, roles: ['admin', 'hr'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-40 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-gray-900 dark:text-white">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}