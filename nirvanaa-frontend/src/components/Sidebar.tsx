import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Calendar, Users, LogOut } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role: string;
}

export function Sidebar({ className, role }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  
  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
  };

  return (
    <div className={cn("pb-12 w-64 border-r bg-sidebar h-screen fixed left-0 top-0 overflow-y-auto", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
            Auchitya
          </h2>
          <div className="space-y-1">
            <Link to={`/dashboard/${role.toLowerCase()}`}>
                <Button variant={pathname === `/dashboard/${role.toLowerCase()}` ? "secondary" : "ghost"} className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
            </Link>
            
            <Link to="/dashboard/calendar">
                <Button variant={pathname === "/dashboard/calendar" ? "secondary" : "ghost"} className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                </Button>
            </Link>
            
            <Link to="/dashboard/documents">
                <Button variant={pathname === "/dashboard/documents" ? "secondary" : "ghost"} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                </Button>
            </Link>
            
            <Link to="/dashboard/contacts">
                <Button variant={pathname === "/dashboard/contacts" ? "secondary" : "ghost"} className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Contacts
                </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 w-full px-3">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
      </div>
    </div>
  );
}
