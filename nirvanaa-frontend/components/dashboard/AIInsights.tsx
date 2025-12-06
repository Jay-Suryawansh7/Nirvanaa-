import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, AlertTriangle, TrendingUp, Clock, Calendar, Scale } from "lucide-react";

interface Suggestion {
  id: string;
  type: "warning" | "opportunity" | "risk" | "schedule";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const suggestions: Suggestion[] = [
  {
    id: "1",
    type: "warning",
    title: "Missing Expert Report",
    description: "Defense has not submitted required expert witness report. Deadline in 2 days.",
    priority: "high"
  },
  {
    id: "2",
    type: "opportunity",
    title: "Readiness Improvement",
    description: "Requesting updated witness list could increase readiness by 15%.",
    priority: "medium"
  },
  {
    id: "3",
    type: "risk",
    title: "Predicted Delay Risk",
    description: "Based on submission patterns, 72% chance of motion extension request.",
    priority: "medium"
  },
  {
    id: "4",
    type: "schedule",
    title: "Scheduling Conflict",
    description: "Lead attorney has conflicting hearing in Courtroom 4 at 10:30 AM.",
    priority: "high"
  }
];

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  opportunity: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  risk: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  schedule: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
};

export function AIInsights() {
  return (
    <div className="h-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />
      
      {/* Header with glow effect */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-playfair font-semibold text-foreground">AI Insights</h2>
            <p className="text-sm text-muted-foreground">Intelligent case recommendations</p>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="flex flex-col gap-3 relative z-10">
        {suggestions.map((suggestion) => {
          const config = typeConfig[suggestion.type];
          const Icon = config.icon;

          return (
            <div 
              key={suggestion.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-start gap-3 bg-opacity-40 backdrop-blur-sm",
                config.bg,
                config.border
              )}
            >
              <div className={cn("mt-0.5", config.color)}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-start">
                  <span className={cn("font-medium text-sm text-foreground")}>
                    {suggestion.title}
                  </span>
                  {suggestion.priority === "high" && (
                    <Badge variant="destructive" className="text-[10px] h-4 px-1">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mediation Feasibility Score */}
      <div className="mt-auto pt-4 border-t border-border/50 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Mediation Feasibility</span>
          </div>
          <span className="text-sm font-bold text-primary">65%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: "65%" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Settlement probability: 65%. Both parties show openness to negotiation.
        </p>
      </div>
    </div>
  );
}
