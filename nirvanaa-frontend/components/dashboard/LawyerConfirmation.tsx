import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface ConfirmationStatus {
  id: string;
  type: "24h" | "1h";
  confirmed: boolean;
  timestamp?: string;
}

const confirmationData: ConfirmationStatus[] = [
  { id: "1", type: "24h", confirmed: true, timestamp: "Dec 5, 2024 at 09:15 AM" },
  { id: "2", type: "1h", confirmed: false },
];

export function LawyerConfirmation() {
  return (
    <div className="w-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-playfair font-semibold text-foreground">Lawyer Confirmation</h2>
          <p className="text-sm text-muted-foreground">Hearing attendance status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {confirmationData.map((status) => (
          <div 
            key={status.id}
            className={cn(
              "p-4 rounded-xl border relative overflow-hidden transition-all duration-300 group",
              status.confirmed 
                ? "bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/50" 
                : "bg-amber-950/20 border-amber-500/20 hover:border-amber-500/50"
            )}
          >
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-sm font-medium text-foreground">
                {status.type === "24h" ? "24-Hour" : "1-Hour"} Confirmation
              </span>
              {status.confirmed ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1 relative z-10">
              <Badge 
                variant="outline" 
                className={cn(
                  "w-fit border-0 px-2 py-0.5",
                  status.confirmed 
                    ? "bg-emerald-500/20 text-emerald-500" 
                    : "bg-amber-500/20 text-amber-500"
                )}
              >
                {status.confirmed ? "Confirmed" : "Not Confirmed"}
              </Badge>
              {status.timestamp ? (
                <span className="text-[10px] text-muted-foreground mt-1">{status.timestamp}</span>
              ) : (
                <span className="text-[10px] text-muted-foreground mt-1">Awaiting confirmation</span>
              )}
            </div>

            {/* Background Icon Watermark */}
            <div className="absolute -bottom-4 -right-4 text-foreground/5 transform -rotate-12 pointer-events-none">
              <Clock className="w-20 h-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
