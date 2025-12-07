import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
    LayoutDashboard, 
    Gavel, 
    Clock, 
    AlertCircle, 
    RefreshCcw, 
    Search, 
    Download,
    CheckCircle2,
    User,
    Building2,
    Send,
    FilePlus,
    Edit
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// --- Mock Data ---

const COURTROOMS = [
    { id: "1A", name: "Courtroom 1A", status: "In Session", judge: "Hon. Judge Sharma", currentCase: "State vs. Kumar", time: "10:00 AM - 12:00 PM", nextTime: "02:00 PM" },
    { id: "2B", name: "Courtroom 2B", status: "Available", judge: "Hon. Judge Iyer", currentCase: null, time: null, nextTime: "02:00 PM" },
    { id: "3A", name: "Courtroom 3A", status: "In Session", judge: "Hon. Judge Rao", currentCase: "Tax Dept vs. ABC Ltd", time: "11:30 AM - 03:00 PM", nextTime: "03:30 PM" },
    { id: "4C", name: "Courtroom 4C", status: "Maintenance", judge: null, currentCase: null, time: null, nextTime: "Tomorrow" },
    { id: "5B", name: "Courtroom 5B", status: "Reserved", judge: "Hon. Judge Singh", currentCase: null, time: null, nextTime: "04:00 PM" },
];

const PENDING_TASKS = [
    { id: 1, title: "Document Review Pending", count: 12, priority: "High", type: "documents" },
    { id: 2, title: "Hearing Notices to Send", count: 8, priority: "Medium", type: "notices", due: "2:00 PM" },
    { id: 3, title: "Case File Updates", count: 5, priority: "Medium", type: "files" },
    { id: 4, title: "Records Approval", count: 3, priority: "Low", type: "records" },
];

const TODAY_STATS = {
    total: 18,
    completed: 5,
    inProgress: 3,
    pending: 8,
    cancelled: 2
};

export default function CourtStaffCalendar() {
  const role = localStorage.getItem("role") || "Staff"; // Default/Fallback
  const [date] = useState<Date>(new Date(2025, 11, 7)); // Dec 7, 2025
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusColor = (status: string) => {
      switch(status) {
          case "In Session": return "bg-green-100 text-green-800 border-green-200";
          case "Available": return "bg-blue-100 text-blue-800 border-blue-200";
          case "Maintenance": return "bg-red-100 text-red-800 border-red-200";
          case "Reserved": return "bg-yellow-100 text-yellow-800 border-yellow-200";
          default: return "bg-gray-100 text-gray-800 border-gray-200";
      }
  };

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case "High": return "text-red-600 bg-red-50 border-red-200";
          case "Medium": return "text-orange-600 bg-orange-50 border-orange-200";
          case "Low": return "text-green-600 bg-green-50 border-green-200";
          default: return "text-gray-600";
      }
  };

  const filteredCourtrooms = COURTROOMS.filter(c => filterStatus === "all" || c.status === filterStatus);

  return (
    <AppLayout role={role}>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8" />
                Court Operations Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Overview for <span className="font-semibold text-foreground">{format(date, "MMMM d, yyyy")}</span>
              </p>
            </div>
             <div className="flex items-center gap-2">
                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search cases or courtrooms..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                    <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Report
                </Button>
            </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-4 flex flex-col justify-between h-full bg-primary/5">
                    <span className="text-sm font-medium text-muted-foreground">Hearings Today</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold">{TODAY_STATS.total}</span>
                        <span className="text-xs text-muted-foreground">Scheduled</span>
                    </div>
                    <Progress value={(TODAY_STATS.completed / TODAY_STATS.total) * 100} className="h-1.5 mt-3" />
                </CardContent>
            </Card>
            <Card>
                 <CardContent className="p-4 flex flex-col justify-between h-full">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Gavel className="w-3.5 h-3.5"/> In Session</span>
                    <div className="mt-2">
                        <span className="text-3xl font-bold text-green-600">{COURTROOMS.filter(c => c.status === 'In Session').length}</span>
                        <span className="text-sm text-muted-foreground ml-1">/ {COURTROOMS.length} Courts</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardContent className="p-4 flex flex-col justify-between h-full">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Pending Actions</span>
                    <div className="mt-2 text-orange-600">
                        <span className="text-3xl font-bold">{PENDING_TASKS.reduce((acc, t) => acc + t.count, 0)}</span>
                        <span className="text-sm text-muted-foreground ml-1">Items</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardContent className="p-4 flex flex-col justify-between h-full">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Completion Rate</span>
                    <div className="mt-2">
                        <span className="text-3xl font-bold">
                            {Math.round((TODAY_STATS.completed / (TODAY_STATS.total - TODAY_STATS.cancelled)) * 100)}%
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Courtroom Status */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary"/> Courtroom Assignments
                        </CardTitle>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[130px] h-8">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="In Session">In Session</SelectItem>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Reserved">Reserved</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCourtrooms.map(court => (
                                <div key={court.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors shadow-sm flex flex-col gap-3 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${
                                        court.status === 'In Session' ? 'bg-green-500' : 
                                        court.status === 'Available' ? 'bg-blue-500' :
                                        court.status === 'Maintenance' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                    
                                    <div className="flex justify-between items-start pl-2">
                                        <h3 className="font-bold text-lg">{court.name}</h3>
                                        <Badge variant="outline" className={`${getStatusColor(court.status)} border-0`}>
                                            {court.status === 'In Session' && <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse" />}
                                            {court.status}
                                        </Badge>
                                    </div>
                                    
                                    {court.judge && (
                                        <div className="pl-2 flex items-center gap-2 text-sm font-medium">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            {court.judge}
                                        </div>
                                    )}

                                    {court.currentCase && (
                                        <div className="pl-2 mt-1 p-2 rounded bg-muted/60 text-sm">
                                            <span className="text-xs text-muted-foreground uppercase font-bold block mb-0.5">Current Case</span>
                                            <span className="font-medium truncate block">{court.currentCase}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {court.time}
                                            </span>
                                        </div>
                                    )}

                                    {court.nextTime && (
                                         <div className="pl-2 text-xs text-muted-foreground mt-auto pt-2 border-t border-dashed">
                                            Next Hearing scheduled for <span className="font-medium text-foreground">{court.nextTime}</span>
                                         </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Col: Tasks & Actions */}
            <div className="space-y-6">
                
                {/* Pending Tasks */}
                <Card>
                    <CardHeader className="pb-3 bg-muted/20">
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500"/> Pending Administrative Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         <ScrollArea className="h-[300px]">
                            <div className="divide-y">
                                {PENDING_TASKS.map(task => (
                                    <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center group cursor-pointer">
                                        <div className="space-y-1">
                                            <div className="font-medium flex items-center gap-2">
                                                {task.title}
                                                <Badge variant="outline" className={`px-1.5 py-0 text-[10px] h-5 ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {task.count} items awaiting action
                                                {task.due && <span className="block text-xs text-red-500 font-medium">Due by {task.due}</span>}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md font-bold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                            <Building2 className="w-5 h-5"/> 
                            <span className="text-xs">Update Status</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                            <FilePlus className="w-5 h-5"/>
                            <span className="text-xs">File Doc</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                            <Send className="w-5 h-5"/>
                            <span className="text-xs">Send Notice</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-primary hover:text-primary hover:bg-primary/5">
                            <Edit className="w-5 h-5"/>
                            <span className="text-xs">Update Case</span>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">{TODAY_STATS.pending}</div>
                            <div className="text-sm opacity-90">Hearings Remaining</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}
