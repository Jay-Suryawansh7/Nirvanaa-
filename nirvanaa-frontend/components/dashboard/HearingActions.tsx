import { Button } from "@/components/ui/button";
import { Gavel, Bell, Pause, CalendarClock } from "lucide-react";

export function HearingActions() {
  return (
    <div className="w-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary text-primary">
          <Gavel className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-playfair font-semibold text-foreground">Hearing Actions</h2>
          <p className="text-sm text-muted-foreground">Quick command center</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-24 flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-playfair transition-all hover:scale-[1.02]"
        >
          <Gavel className="w-6 h-6" />
          Start Hearing
        </Button>

        <Button 
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary/50 text-foreground transition-all hover:scale-[1.02]"
        >
          <Bell className="w-6 h-6 text-primary" />
          Notify Lawyer
        </Button>

        <Button 
          variant="secondary"
          className="h-20 flex flex-col items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <Pause className="w-5 h-5" />
          Mark Adjourned
        </Button>

        <Button 
          variant="secondary"
          className="h-20 flex flex-col items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <CalendarClock className="w-5 h-5" />
          Reschedule
        </Button>
      </div>
    </div>
  );
}
