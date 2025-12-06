import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Scale, Settings, User } from "lucide-react";

export function DashboardHeader() {
  const [stats, setStats] = useState({
    totalCases: 0,
    readyCases: 0,
    highRiskCases: 0
  });
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/cases/metrics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setStats({
          totalCases: data.totalCases,
          readyCases: data.readyCases,
          highRiskCases: data.highRiskCases
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Poll every 10 seconds to keep stats updated
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full py-6 px-8 flex items-end justify-between border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex flex-col gap-1">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">Judicial Dashboard</h1>
            <p className="text-sm text-muted-foreground font-mono opacity-80">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Quick Stats */}
        <div className="flex items-center gap-6 mr-6 border-r border-border/50 pr-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-primary font-mono leading-none">
              {loading ? "-" : stats.totalCases}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Today&apos;s Cases</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-emerald-500 font-mono leading-none">
              {loading ? "-" : stats.readyCases}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Ready</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-rose-500 font-mono leading-none">
              {loading ? "-" : stats.highRiskCases}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">High Risk</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-background" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-3 pl-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-foreground">Hon. Morrison</p>
            <p className="text-xs text-muted-foreground">Courtroom 7</p>
          </div>
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
