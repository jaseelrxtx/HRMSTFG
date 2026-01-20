import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CalendarPlus,
  CheckCircle,
  Users,
  FileText,
  Settings,
  BarChart3,
  UsersRound,
  UserCircle,
  History,
  DollarSign,
  Package,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEmployee } from "@/hooks/useEmployee";
import { useIsReportingManager } from "@/hooks/useTeamData";
import { getNavigationItems, APP_NAME } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const iconMap = {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CalendarPlus,
  CheckCircle,
  Users,
  FileText,
  Settings,
  BarChart3,
  UsersRound,
  UserCircle,
  History,
  DollarSign,
  Package,
};

export function AppSidebar() {
  const { role, user } = useAuth();
  const location = useLocation();
  const { data: employee } = useEmployee();
  const { data: isReportingManager } = useIsReportingManager();
  const [activeModule, setActiveModule] = React.useState<"hrms" | "ims" | "payroll" | "task">("hrms");

  // Sync active module with current path on mount/update
  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/ims")) setActiveModule("ims");
    else if (path.startsWith("/payroll")) setActiveModule("payroll");
    else if (path.startsWith("/task-management")) setActiveModule("task");
    else setActiveModule("hrms");
  }, [location.pathname]);

  const navItems = role ? getNavigationItems(role) : [];

  // Add "My Team" link for reporting managers (non-admin/HR)
  const showMyTeam = isReportingManager && role && !["admin", "hr"].includes(role);

  // Define module-specific navigation
  const moduleNavigation = {
    hrms: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { label: "My Profile", path: `/profile/${employee?.id || user?.id}`, icon: "UserCircle" },
      ...navItems.filter(item => item.path !== "/dashboard"), 
      ...(showMyTeam ? [{ label: "My Team", path: "/my-team", icon: "UsersRound" }] : []),
    ],
    ims: [
      { label: "Overview", path: "/ims", icon: "LayoutDashboard" },
      { label: "Inventory", path: "/ims/inventory", icon: "Package" },
      { label: "Assets", path: "/ims/assets", icon: "CheckCircle" }, // Placeholder
    ],
    payroll: [
      { label: "Overview", path: "/payroll", icon: "DollarSign" },
      { label: "Salary Slips", path: "/payroll/slips", icon: "FileText" }, // Placeholder
      { label: "Tax Declaration", path: "/payroll/tax", icon: "FileText" }, // Placeholder
    ],
    task: [
      { label: "Overview", path: "/task-management", icon: "LayoutDashboard" },
      { label: "My Tasks", path: "/task-management/my-tasks", icon: "CheckCircle" }, // Placeholder
      { label: "Projects", path: "/task-management/projects", icon: "Package" }, // Placeholder
    ],
  };

  const currentNavItems = moduleNavigation[activeModule] || moduleNavigation.hrms;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
         <div className="flex flex-col gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">MG</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">{APP_NAME}</span>
            </Link>
            
            {/* Module Switcher - Simple Select for now, can be styled better */}
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                 <button 
                    onClick={() => setActiveModule("hrms")}
                    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${activeModule === 'hrms' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                 >
                    HRMS
                 </button>
                  <button 
                    onClick={() => setActiveModule("ims")}
                    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${activeModule === 'ims' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                 >
                    IMS
                 </button>
                  <button 
                    onClick={() => setActiveModule("payroll")}
                    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${activeModule === 'payroll' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                 >
                    Payroll
                 </button>
                  <button 
                    onClick={() => setActiveModule("task")}
                    className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${activeModule === 'task' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                 >
                    Tasks
                 </button>
            </div>
         </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentNavItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = location.pathname === item.path || 
                  (item.path !== "/dashboard" && item.path !== "/ims" && item.path !== "/payroll" && item.path !== "/task-management" && location.pathname.startsWith(item.path));

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
