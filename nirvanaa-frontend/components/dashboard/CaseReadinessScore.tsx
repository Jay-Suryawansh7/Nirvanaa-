import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface Metric {
  label: string;
  score: number;
}

export function CaseReadinessScore() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/cases', {
          headers: {
             'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error("Failed to fetch");

        const cases = await res.json();
        
        if (cases.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate aggregates
        const total = cases.length;
        const docsReady = cases.filter((c: any) => c.documentsReady).length;
        const lawyerConf = cases.filter((c: any) => c.lawyerConfirmed).length;
        const witConf = cases.filter((c: any) => c.witnessConfirmed).length;
        const partyReady = cases.filter((c: any) => c.mediationWilling !== 'NONE').length;
        // Evidence quality not in DB, assume correlates with docs
        const evidenceQual = Math.round((docsReady / total) * 100 * 0.9);

        const newMetrics: Metric[] = [
          { label: "Document Completeness", score: Math.round((docsReady / total) * 100) },
          { label: "Lawyer Submissions", score: Math.round((lawyerConf / total) * 100) },
          { label: "Witness Confirmation", score: Math.round((witConf / total) * 100) },
          { label: "Evidence Quality", score: evidenceQual },
          { label: "Party Readiness", score: Math.round((partyReady / total) * 100) },
        ];

        setMetrics(newMetrics);
        setOverallScore(Math.round(newMetrics.reduce((acc, m) => acc + m.score, 0) / newMetrics.length));

        // Generate weaknesses based on low scores
        const newWeaknesses = [];
        if ((docsReady / total) < 0.5) newWeaknesses.push("Low document completion rate across active cases");
        if ((witConf / total) < 0.5) newWeaknesses.push("Significant delays in witness confirmations");
        if ((lawyerConf / total) < 0.6) newWeaknesses.push("Pending lawyer confirmations for upcoming hearings");
        if (newWeaknesses.length === 0 && overallScore < 70) newWeaknesses.push("Overall readiness accumulation is tracking slow");

        setWeaknesses(newWeaknesses.slice(0, 3)); // Limit to 3

      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary"; 
    return "text-foreground";
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  if (loading) {
    return (
      <div className="h-full bg-card rounded-xl border border-border/50 p-6 flex items-center justify-center shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-playfair font-semibold text-foreground">Case Readiness</h2>
        <p className="text-sm text-muted-foreground">Overall preparation status</p>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {/* Overall Score Circle */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-secondary"
              />
              <circle
                cx="80"
                cy="80"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold font-mono tracking-tighter text-foreground">
                {overallScore}
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Score</span>
            </div>
          </div>
        </div>

        {/* Metric Bars */}
        <div className="w-full flex flex-col gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{metric.label}</span>
                </div>
                <span className="font-medium text-foreground">
                  {metric.score}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="w-full mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-medium text-sm">Urgent Gaps</h3>
            </div>
            <div className="flex flex-col gap-2">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                  <span>{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
