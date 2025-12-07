import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, FileUser, ChevronRight, Filter, Plus, MoreHorizontal, Gavel, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayContent, DayContentProps } from "react-day-picker";

// Mock Data
const MOCK_HEARINGS = [
  // Dec 9: 2 hearings
  { id: "1", caseNumber: "CIV-2025-001234", caseTitle: "State vs. Sharma", type: "Initial Hearing", time: "09:30 AM", date: "2025-12-09", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "High" },
  { id: "2", caseNumber: "FAM-2025-004521", caseTitle: "Verma Custody Case", type: "Mediation", time: "02:00 PM", date: "2025-12-09", location: "Room 102", judge: "Mediator Singh", status: "Confirmed", priority: "Medium" },

  // Dec 10: 3 hearings
  { id: "3", caseNumber: "CRIM-2025-008912", caseTitle: "State vs. Kumar", type: "Bail Hearing", time: "10:00 AM", date: "2025-12-10", location: "Courtroom 1", judge: "Hon. Justice Sharma", status: "Scheduled", priority: "Urgent" },
  { id: "4", caseNumber: "CIV-2025-001299", caseTitle: "Nirvanaa Corp vs. Local Retailers", type: "Case Review", time: "11:30 AM", date: "2025-12-10", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Postponed", priority: "Low" },
  { id: "5", caseNumber: "TAX-2025-003311", caseTitle: "Tax Dept vs. ABC Ltd", type: "Final Hearing", time: "03:00 PM", date: "2025-12-10", location: "Courtroom 5B", judge: "Hon. Justice Rao", status: "Confirmed", priority: "High" },

  // Dec 12: 1 hearing
  { id: "6", caseNumber: "CIV-2025-001555", caseTitle: "Land Dispute: Plot 42", type: "Pre-trial Conference", time: "11:00 AM", date: "2025-12-12", location: "Conf Room B", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium" },

  // Dec 15: 2 hearings
  { id: "7", caseNumber: "CRIM-2025-009001", caseTitle: "State vs. Unknown (Theft)", type: "Arraignment", time: "09:00 AM", date: "2025-12-15", location: "Courtroom 2", judge: "Hon. Justice Khan", status: "Scheduled", priority: "Medium" },
  { id: "8", caseNumber: "FAM-2025-004600", caseTitle: "Divorce Proceeding #44", type: "Final Hearing", time: "01:00 PM", date: "2025-12-15", location: "Courtroom 4", judge: "Hon. Justice Devi", status: "Confirmed", priority: "High" },

  // Dec 18: 4 hearings (Busy Day)
  { id: "9", caseNumber: "CIV-2025-002100", caseTitle: "Contract Breach: Tech vs. Vendor", type: "Initial Hearing", time: "09:30 AM", date: "2025-12-18", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium" },
  { id: "10", caseNumber: "CIV-2025-002101", caseTitle: "Contract Breach: Vendor Counter", type: "Initial Hearing", time: "10:30 AM", date: "2025-12-18", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium" },
  { id: "11", caseNumber: "CRIM-2025-009123", caseTitle: "State vs. Gang Leader", type: "Sentencing", time: "02:00 PM", date: "2025-12-18", location: "Courtroom 1 (High Security)", judge: "Hon. Justice Sharma", status: "Confirmed", priority: "Urgent" },
  { id: "12", caseNumber: "ADM-2025-000123", caseTitle: "Admin Review: License", type: "Administrative", time: "04:30 PM", date: "2025-12-18", location: "Office 202", judge: "Registrar", status: "Scheduled", priority: "Low" },

  // Dec 20: 1 hearing
  { id: "13", caseNumber: "CIV-2025-001800", caseTitle: "Public Interest Litigation #5", type: "Hearing", time: "10:00 AM", date: "2025-12-20", location: "Courtroom 1", judge: "Bench", status: "Confirmed", priority: "High" },

  // Dec 23: 2 hearings
  { id: "14", caseNumber: "CRIM-2025-009500", caseTitle: "State vs. Doe (Review)", type: "Case Review", time: "11:00 AM", date: "2025-12-23", location: "Courtroom 2", judge: "Hon. Justice Khan", status: "Rescheduled", priority: "Medium" },
  { id: "15", caseNumber: "CIV-2025-002500", caseTitle: "Construction Stay Order", type: "Urgent Motion", time: "04:00 PM", date: "2025-12-23", location: "Chambers", judge: "Hon. Justice Iyer", status: "Submitted", priority: "Urgent" },
];

export default function Calendar() {
  const role = localStorage.getItem("role") || "Viewer";
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 11, 7)); // Default to Dec 7, 2025 as requested or nearby
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getHearingsForDate = (checkDate: Date) => {
    return MOCK_HEARINGS.filter(h => isSameDay(parseISO(h.date), checkDate));
  };

  const filteredHearings = date ? getHearingsForDate(date).filter(h => {
    const typeMatch = filterType === "all" || h.type === filterType;
    const statusMatch = filterStatus === "all" || h.status === filterStatus;
    return typeMatch && statusMatch;
  }) : [];

  // Custom Day Component to render dots
  function CustomDayContent(props: DayContentProps) {
    // Only process mock data for December 2025
    const hearings = MOCK_HEARINGS.filter(h => isSameDay(parseISO(h.date), props.date));
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <span>{format(props.date, "d")}</span>
            {hearings.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                    {hearings.slice(0, 3).map((_, i) => (
                         <div key={i} className={`w-1 h-1 rounded-full ${hearings[i].priority === 'Urgent' ? 'bg-red-500' : 'bg-primary'}`} />
                    ))}
                    {hearings.length > 3 && <div className="w-1 h-1 rounded-full bg-muted-foreground" />}
                </div>
            )}
        </div>
    );
  }

  return (
    <AppLayout role={role}>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Department Calendar</h1>
              <p className="text-muted-foreground mt-1">Manage and view scheduled hearings and court appointments.</p>
            </div>
            <Button className="hidden md:flex">
                <Plus className="mr-2 h-4 w-4" /> Schedule New Hearing
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Widget */}
          <Card className="lg:col-span-4 h-fit">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-primary"/> Calendar View
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center pb-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                defaultMonth={new Date(2025, 11)} // Focus on Dec 2025
                components={{
                    DayContent: CustomDayContent
                }}
              />
            </CardContent>
            <div className="px-6 pb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Normal Priority
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Urgent / High Priority
                </div>
            </div>
          </Card>

          {/* Schedule List */}
          <Card className="lg:col-span-8 min-h-[500px]">
            <CardHeader className="border-b space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <CardTitle className="text-xl">
                    Schedule for <span className="text-primary">{date ? format(date, "MMMM d, yyyy") : "Selected Date"}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        {filteredHearings.length} hearing{filteredHearings.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Filter Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Initial Hearing">Initial Hearing</SelectItem>
                            <SelectItem value="Final Hearing">Final Hearing</SelectItem>
                            <SelectItem value="Bail Hearing">Bail Hearing</SelectItem>
                            <SelectItem value="Mediation">Mediation</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Postponed">Postponed</SelectItem>
                        </SelectContent>
                    </Select> 
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
               {filteredHearings.length > 0 ? (
                 <div className="space-y-4">
                   {filteredHearings.map((hearing) => (
                     <div 
                       key={hearing.id} 
                       className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-all shadow-sm hover:shadow-md cursor-pointer relative"
                     >
                       {/* Time Column */}
                       <div className="flex flex-col items-center justify-center min-w-[4.5rem] p-2 rounded bg-primary/5 text-primary">
                          <Clock className="w-5 h-5 mb-1 opacity-80" />
                          <span className="text-sm font-bold text-center leading-tight">{hearing.time.split(' ')[0]}</span>
                          <span className="text-[10px] uppercase font-medium opacity-70">{hearing.time.split(' ')[1]}</span>
                       </div>

                       {/* Content */}
                       <div className="flex-1 space-y-2 min-w-0">
                         <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors truncate pr-2">
                                    {hearing.caseTitle}
                                </h3>
                                <div className="text-xs font-mono text-muted-foreground mt-0.5">{hearing.caseNumber}</div>
                             </div>
                             <Badge 
                                variant={
                                    hearing.priority === "Urgent" ? "destructive" : 
                                    hearing.priority === "High" ? "default" : "secondary"
                                }
                                className="shrink-0"
                             >
                                {hearing.priority}
                             </Badge>
                         </div>

                         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
                           <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50">
                             <Gavel className="w-3.5 h-3.5" />
                             {hearing.type}
                           </span>
                           <span className="flex items-center gap-1.5">
                             <MapPin className="w-3.5 h-3.5" />
                             {hearing.location}
                           </span>
                           <span className="flex items-center gap-1.5">
                             <FileUser className="w-3.5 h-3.5" />
                             {hearing.judge}
                           </span>
                         </div>
                       </div>
                       
                       {/* Actions / Status */}
                       <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pl-0 sm:pl-2 pt-2 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className={`
                                ${hearing.status === 'Confirmed' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                                ${hearing.status === 'Postponed' ? 'text-orange-600 border-orange-200 bg-orange-50' : ''}
                            `}>
                                {hearing.status}
                            </Badge>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground animate-in fade-in-50">
                   <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                     <CalendarIcon className="w-8 h-8 opacity-40" />
                   </div>
                   <h3 className="text-lg font-medium">No hearings found</h3>
                   <p className="text-sm max-w-xs mx-auto mt-2 text-muted-foreground/80">
                     There are no hearings scheduled for this date matching your filters.
                   </p>
                   {role !== 'Viewer' && (
                        <Button variant="outline" className="mt-6">
                            <Plus className="mr-2 h-4 w-4" /> Schedule Hearing
                        </Button>
                   )}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
