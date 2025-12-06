import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Briefcase, FileText, ChevronRight } from "lucide-react";

interface Case {
  id: string;
  caseNumber: string;
  parties: string;
  status: string;
  hearingTime: string;
  nextAction: string;
}

export function MyCaseList() {
  const [cases, setCases] = useState<Case[]>([]);
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
        
        // Map backend DB fields to UI fields
        const myCases = data.slice(0, 5).map((c: any) => ({
            id: c.id,
            caseNumber: c.caseNumber, // Correct field
            parties: c.title, // Correct field
            status: c.status,
            hearingTime: "09:00 AM", // Placeholder
            nextAction: c.readinessScore < 50 ? "Submit Docs" : "Confirm Attendance"
        }));
        
        setCases(myCases);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6 flex items-center justify-center shadow-sm h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm h-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-playfair font-semibold text-foreground">My Active Cases</h2>
        <p className="text-sm text-muted-foreground">Hearings & deadlines</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {cases.map((caseItem) => (
          <div 
            key={caseItem.id}
            className="group flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/50 bg-card/40 hover:bg-card transition-all duration-300 cursor-pointer min-h-[5rem]"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary">
                 <Briefcase className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{caseItem.caseNumber}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    {caseItem.status}
                  </span>
                </div>
                <h3 className="font-medium text-foreground truncate pr-4 text-base">{caseItem.parties}</h3>
                <div className="flex items-center gap-2 text-xs text-rose-500 font-medium animate-pulse">
                    <FileText className="w-3 h-3" />
                    Action: {caseItem.nextAction}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 text-sm font-mono font-medium text-foreground">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {caseItem.hearingTime}
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                    View
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
