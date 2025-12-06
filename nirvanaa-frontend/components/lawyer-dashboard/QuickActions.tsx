import { Button } from "@/components/ui/button";
import { Upload, FileText, MessageSquare, CalendarCheck } from "lucide-react";

export function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm h-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-playfair font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Common tasks & filings</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <Button variant="outline" className="h-full flex flex-col items-center justify-center gap-2 border-dashed border-border/60 hover:border-primary hover:bg-primary/5 transition-all group">
          <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-foreground">Upload Evidence</span>
        </Button>

        <Button variant="outline" className="h-full flex flex-col items-center justify-center gap-2 border-dashed border-border/60 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group">
          <div className="p-3 rounded-full bg-secondary group-hover:bg-emerald-500/20 transition-colors">
            <CalendarCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="font-medium text-foreground">Confirm Hearing</span>
        </Button>

        <Button variant="outline" className="h-full flex flex-col items-center justify-center gap-2 border-dashed border-border/60 hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
          <div className="p-3 rounded-full bg-secondary group-hover:bg-blue-500/20 transition-colors">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <span className="font-medium text-foreground">Draft Motion</span>
        </Button>

        <Button variant="outline" className="h-full flex flex-col items-center justify-center gap-2 border-dashed border-border/60 hover:border-amber-500 hover:bg-amber-500/5 transition-all group">
          <div className="p-3 rounded-full bg-secondary group-hover:bg-amber-500/20 transition-colors">
            <MessageSquare className="w-6 h-6 text-amber-500" />
          </div>
          <span className="font-medium text-foreground">Contact Client</span>
        </Button>
      </div>
    </div>
  );
}
