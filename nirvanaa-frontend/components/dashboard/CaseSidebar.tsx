import { useState, useEffect } from "react";
import { 
  X, 
  User, 
  FileText, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CaseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string | null;
}

const lawyers = [
  { name: "Sarah Mitchell", role: "Plaintiff Attorney", status: "confirmed", pending: false },
  { name: "James Rodriguez", role: "Defense Attorney", status: "pending", pending: true },
  { name: "Emily Chen", role: "Associate Counsel", status: "confirmed", pending: false },
];

const witnesses = [
  { name: "Dr. Robert Hayes", role: "Expert Witness", confirmed: true },
  { name: "Maria Santos", role: "Key Witness", confirmed: true },
  { name: "Thomas Wright", role: "Character Witness", confirmed: false },
];

const documents = [
  { name: "Initial Complaint.pdf", type: "Filing", uploaded: "Dec 1, 2024" },
  { name: "Evidence Bundle A.pdf", type: "Evidence", uploaded: "Dec 3, 2024" },
  { name: "Witness Deposition.pdf", type: "Testimony", uploaded: "Dec 4, 2024" },
  { name: "Motion to Compel.pdf", type: "Motion", uploaded: "Dec 5, 2024" },
];

const notes = [
  { author: "Judge Morrison", time: "2h ago", content: "Reviewed plaintiff's motion. Awaiting defense response." },
  { author: "Court Clerk", time: "4h ago", content: "All parties notified of schedule change." },
];

export function CaseSidebar({ isOpen, onClose }: CaseSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["lawyers", "witnesses"]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border z-50 shadow-2xl transition-transform duration-300 ease-out transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border bg-card/50 backdrop-blur-md relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 hover:bg-secondary hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex flex-col gap-1 mt-2">
            <span className="font-mono text-sm text-primary">CIV-2024-0892</span>
            <h2 className="text-2xl font-playfair font-semibold text-foreground">Smith v. Johnson Corp</h2>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Ready for Hearing</Badge>
            <Badge variant="outline" className="text-muted-foreground">High Priority</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar pb-8">
          {/* Assigned Lawyers */}
          <div className="border-b border-border/50">
            <SectionHeader 
              id="lawyers" 
              icon={Scale} 
              title="Assigned Lawyers" 
              count={lawyers.length} 
              expanded={expandedSections.includes("lawyers")}
              onToggle={toggleSection}
            />
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              expandedSections.includes("lawyers") ? "max-h-[500px]" : "max-h-0"
            )}>
              <div className="p-4 pt-0 gap-3 flex flex-col">
                {lawyers.map((lawyer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{lawyer.name}</span>
                        <span className="text-xs text-muted-foreground">{lawyer.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lawyer.pending ? (
                        <Badge variant="outline" className="border-amber-500/50 text-amber-500 text-[10px] bg-amber-500/5">
                          Pending
                        </Badge>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Witness List */}
          <div className="border-b border-border/50">
            <SectionHeader 
              id="witnesses" 
              icon={User} 
              title="Witness List" 
              count={witnesses.length} 
              expanded={expandedSections.includes("witnesses")}
              onToggle={toggleSection}
            />
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              expandedSections.includes("witnesses") ? "max-h-[500px]" : "max-h-0"
            )}>
              <div className="p-4 pt-0 gap-3 flex flex-col">
                {witnesses.map((witness, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{witness.name}</span>
                      <span className="text-xs text-muted-foreground">{witness.role}</span>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full border",
                      witness.confirmed 
                        ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                        : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                    )}>
                      {witness.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="border-b border-border/50">
            <SectionHeader 
              id="documents" 
              icon={FileText} 
              title="Documents" 
              count={documents.length} 
              expanded={expandedSections.includes("documents")}
              onToggle={toggleSection}
            />
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              expandedSections.includes("documents") ? "max-h-[500px]" : "max-h-0"
            )}>
              <div className="p-4 pt-0 gap-3 flex flex-col">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-secondary text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{doc.name}</span>
                        <span className="text-xs text-muted-foreground">{doc.type} • {doc.uploaded}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mediation Willingness */}
          <div className="border-b border-border/50">
            <SectionHeader 
              id="mediation" 
              icon={Scale} 
              title="Mediation Willingness" 
              expanded={expandedSections.includes("mediation")}
              onToggle={toggleSection}
            />
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              expandedSections.includes("mediation") ? "max-h-[500px]" : "max-h-0"
            )}>
              <div className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="block text-xs text-emerald-500 mb-1">Plaintiff</span>
                    <span className="font-semibold text-emerald-400">Willing</span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="block text-xs text-amber-500 mb-1">Defendant</span>
                    <span className="font-semibold text-amber-400">Uncertain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Notes */}
          <div className="border-b border-border/50">
            <SectionHeader 
              id="notes" 
              icon={MessageSquare} 
              title="Case Notes" 
              count={notes.length} 
              expanded={expandedSections.includes("notes")}
              onToggle={toggleSection}
            />
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              expandedSections.includes("notes") ? "max-h-[500px]" : "max-h-0"
            )}>
              <div className="p-4 pt-0 gap-3 flex flex-col">
                {notes.map((note, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-primary">{note.author}</span>
                      <span className="text-[10px] text-muted-foreground">{note.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ 
  id, 
  icon: Icon, 
  title, 
  count, 
  expanded, 
  onToggle 
}: { 
  id: string; 
  icon: React.ElementType; 
  title: string; 
  count?: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(id)}
      className="flex items-center justify-between w-full p-4 hover:bg-secondary/30 transition-colors border-l-2 border-transparent hover:border-primary"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-md bg-secondary text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm text-foreground">{title}</span>
        {count !== undefined && (
          <Badge variant="outline" className="ml-2 bg-transparent border-border text-muted-foreground text-xs">
            {count}
          </Badge>
        )}
      </div>
      
      {expanded ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

