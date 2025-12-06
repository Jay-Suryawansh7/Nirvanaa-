import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Handshake, User, Clock, ArrowRight, History, CheckCircle2 } from "lucide-react";

interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
}

const timeline: TimelineStep[] = [
  { status: "Mediation Requested", date: "Dec 1, 2024", completed: true, current: false },
  { status: "Mediator Assigned", date: "Dec 2, 2024", completed: true, current: false },
  { status: "Initial Session", date: "Dec 8, 2024", completed: false, current: true },
  { status: "Follow-up Session", date: "TBD", completed: false, current: false },
  { status: "Resolution", date: "TBD", completed: false, current: false },
];

const mediator = {
  name: "Hon. Patricia Williams",
  role: "Senior Mediator",
  experience: "15+ years",
  successRate: "78%",
  image: "" // Placeholder if we had avatars
};

export function MediationCenter() {
  return (
    <div className="w-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary text-primary">
          <Handshake className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-playfair font-semibold text-foreground">Mediation Center</h2>
          <p className="text-sm text-muted-foreground">Alternative dispute resolution</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Handshake className="w-4 h-4" />
          Initiate Mediation
        </Button>
        <Button variant="outline" className="w-full gap-2 hover:border-primary/50">
          <User className="w-4 h-4" />
          Assign Mediator
        </Button>
        <Button variant="ghost" className="w-full gap-2 hover:bg-secondary/50">
          <History className="w-4 h-4" />
          View History
        </Button>
      </div>

      {/* Timeline */}
      <div className="py-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Mediation Timeline</h3>
        <div className="relative pl-2">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-secondary" />
          
          <div className="flex flex-col gap-6">
            {timeline.map((step, index) => (
              <div key={index} className="flex items-start gap-4 relative z-10 group">
                {/* Node */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center bg-card transition-colors duration-300",
                  step.completed 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : step.current
                      ? "border-primary shadow-[0_0_10px_rgba(212,175,55,0.3)] animate-pulse"
                      : "border-secondary"
                )}>
                  {step.completed && (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                  {step.current && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 flex justify-between items-center pt-0.5">
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      step.current ? "text-primary" : "text-foreground"
                    )}>
                      {step.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{step.date}</span>
                  </div>
                  {step.current && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-0">
                      In Progress
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mediator Profile */}
      <div className="mt-2 pt-6 border-t border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Assigned Mediator</h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <User className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-semibold text-foreground group-hover:text-primary transition-colors">{mediator.name}</span>
              <span className="text-xs text-muted-foreground">{mediator.role}</span>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Experience: <span className="text-foreground">{mediator.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Success Rate: <span className="text-emerald-500">{mediator.successRate}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
