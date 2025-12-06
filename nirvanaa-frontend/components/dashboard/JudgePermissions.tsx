import { Shield, Lock, CheckCircle2, AlertOctagon } from "lucide-react";

const capabilities = [
  "Issue continuances instantly",
  "Approve settlements < $50k",
  "Request expedited evidence",
  "Sanction attorney warnings"
];

const restrictions = [
  "Cannot override statutory mandatory minimums",
  "Transfer cases across jurisdictions"
];

export function JudgePermissions() {
  return (
    <div className="w-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-secondary text-primary">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-playfair font-semibold text-foreground">Judge Permissions</h2>
          <p className="text-sm text-muted-foreground">Access & capability overview</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Capabilities
        </h3>
        <ul className="space-y-2">
          {capabilities.map((capability, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-foreground/80 bg-secondary/20 p-2 rounded-lg border border-border/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {capability}
            </li>
          ))}
        </ul>
      </div>

      {/* Restrictions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
        <h3 className="text-sm font-medium text-rose-500 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Restrictions
        </h3>
        <ul className="space-y-2">
          {restrictions.map((restriction, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/10 p-2 rounded-lg border border-border/30 opacity-75">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {restriction}
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-2 mt-2 text-[10px] text-muted-foreground bg-secondary/30 p-2 rounded border border-border/30">
          <AlertOctagon className="w-3 h-3 mt-0.5 text-amber-500" />
          <span>Case filing modifications are handled by Court Staff pursuant to Rule 204(c).</span>
        </div>
      </div>
    </div>
  );
}
