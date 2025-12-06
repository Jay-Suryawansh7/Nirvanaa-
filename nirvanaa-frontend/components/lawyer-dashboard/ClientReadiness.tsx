import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Users, FileCheck, CheckCircle2 } from "lucide-react";

interface Case {
  id: string;
  caseIdentifier: string;
  parties: string;
  status: string;
  readinessScore: number;
}

export function ClientReadiness() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/cases', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        
        // Simulating "My Clients" by taking the updated cases
        // In a real app, this would filter by lawyerID
        const myClients = data.slice(0, 5).map((c: Case) => ({
          name: c.parties,
          case: c.caseIdentifier,
          status: c.readinessScore === 100 ? "Ready" : "Prep Needed",
          progress: c.readinessScore
        }));
        
        setClients(myClients);
      } catch (error) {
        console.error("Failed to fetch client readiness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
    // Poll for updates
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = clients.filter(c => c.progress < 100).length;

  if (loading) return <div className="text-sm text-muted-foreground">Loading clients...</div>;

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm h-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-playfair font-semibold text-foreground">Client Readiness</h2>
        <p className="text-sm text-muted-foreground">Witness & document preparation</p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {clients.map((client, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground truncate max-w-[150px]" title={client.name}>{client.name}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{client.case}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className={cn(
                "px-2 py-0.5 rounded-full font-medium",
                client.progress === 100 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {client.status}
              </span>
              <span>{client.progress}%</span>
            </div>

            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-1">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  client.progress === 100 ? "bg-emerald-500" : "bg-primary"
                )}
                style={{ width: `${client.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-emerald-500 text-sm">{pendingCount} Actions Needed</h3>
          <p className="text-xs text-muted-foreground">Confirm attendance for clients with low readiness.</p>
        </div>
      </div>
    </div>
  );
}
