import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, FileUser, ChevronRight, Plus, MoreHorizontal, Gavel, FileText, User, Printer, History, Briefcase, StickyNote } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayContentProps } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const hearingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caseId: z.string().min(1, "Case ID is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
  description: z.string().optional(),
});

type HearingFormValues = z.infer<typeof hearingSchema>;
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import LawyerCalendar from "./LawyerCalendar";
import CourtStaffCalendar from "./CourtStaffCalendar";

const fetchHearings = async () => {
    const res = await api.get("/hearings");
    return res.data;
};

function JudgeCalendar() {
  const role = localStorage.getItem("role") || "Viewer";
  const [date, setDate] = useState<Date | undefined>(new Date()); 
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const queryClient = useQueryClient();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<any | null>(null);

  const form = useForm<HearingFormValues>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      priority: "MEDIUM",
      type: "Initial Hearing"
    }
  });

  const createHearingMutation = useMutation({
    mutationFn: async (data: HearingFormValues) => {
      await api.post("/hearings", data);
    },
    onSuccess: () => {
      toast.success("Hearing scheduled successfully");
      setIsScheduleOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
    },
    onError: (error) => {
      toast.error("Failed to schedule hearing");
      console.error(error);
    }
  });

  const onSubmit = (data: HearingFormValues) => {
    createHearingMutation.mutate(data);
  };

  const { data: hearings = [] } = useQuery<FetchedHearing[]>({
      queryKey: ["hearings"],
      queryFn: fetchHearings
  });

  const getHearingsForDate = (checkDate: Date) => {
    return hearings.filter((h: FetchedHearing) => isSameDay(new Date(h.date), checkDate));
  };

  const filteredHearings = date ? getHearingsForDate(date).filter((h: FetchedHearing) => {
    const typeMatch = filterType === "all" || h.type === filterType;
    const statusMatch = filterStatus === "all" || h.status === filterStatus;
    return typeMatch && statusMatch;
  }) : [];

  function CustomDayContent(props: DayContentProps) {
    const dayHearings = hearings.filter((h: any) => isSameDay(new Date(h.date), props.date));
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <span>{format(props.date, "d")}</span>
            {dayHearings.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                    {dayHearings.slice(0, 3).map((_: any, i: number) => (
                         <div key={i} className={`w-1 h-1 rounded-full ${dayHearings[i].priority === 'URGENT' ? 'bg-red-500' : 'bg-primary'}`} />
                    ))}
                    {dayHearings.length > 3 && <div className="w-1 h-1 rounded-full bg-muted-foreground" />}
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
            <Button className="hidden md:flex" onClick={() => setIsScheduleOpen(true)}>
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
                defaultMonth={new Date(2025, 11)} 
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
                   {filteredHearings.map((hearing: any) => (
                     <div 
                       key={hearing.id} 
                       className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-all shadow-sm hover:shadow-md cursor-pointer relative"
                       onClick={() => setSelectedHearing(hearing)}
                     >
                       <div className="flex flex-col items-center justify-center min-w-[4.5rem] p-2 rounded bg-primary/5 text-primary">
                          <Clock className="w-5 h-5 mb-1 opacity-80" />
                          <span className="text-sm font-bold text-center leading-tight">{hearing.time.split(' ')[0]}</span>
                          <span className="text-xs font-medium opacity-70">{hearing.time.split(' ')[1]}</span>
                       </div>

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
                       
                       <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pl-0 sm:pl-2 pt-2 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className={`
                                ${hearing.status === 'Confirmed' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                                ${hearing.status === 'Postponed' ? 'text-orange-600 border-orange-200 bg-orange-50' : ''}
                            `}>
                                {hearing.status}
                            </Badge>
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedHearing(hearing)}>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Hearing</DropdownMenuItem>
                                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">Cancel Hearing</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHearing(hearing);
                                }}>
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
                        <Button variant="outline" className="mt-6" onClick={() => setIsScheduleOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Schedule Hearing
                        </Button>
                   )}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Hearing Details Sheet */}
      <Sheet open={!!selectedHearing} onOpenChange={(open) => !open && setSelectedHearing(null)}>
        <SheetContent className="w-full sm:max-w-xl p-0">
            {selectedHearing && (
              <ScrollArea className="h-full w-full p-6">
                <>
                    <SheetHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <Badge variant="outline" className="mb-2">{selectedHearing.caseNumber}</Badge>
                                <SheetTitle className="text-2xl leading-tight">{selectedHearing.caseTitle}</SheetTitle>
                                <SheetDescription className="text-base mt-1 flex items-center gap-2">
                                    <Badge variant={selectedHearing.priority === "Urgent" ? "destructive" : "secondary"}>
                                        {selectedHearing.priority} Priority
                                    </Badge>
                                    <Badge variant="outline">{selectedHearing.status}</Badge>
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                    
                    <div className="mt-8 space-y-6">
                        {/* Key Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date & Time</span>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{selectedHearing.date}</span>
                                </div>
                                <div className="text-sm text-muted-foreground pl-6">
                                    {selectedHearing.time} - {selectedHearing.endTime}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{selectedHearing.location}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Gavel className="w-4 h-4" /> Hearing Details
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-medium">{selectedHearing.type}</span>
                                    
                                    <span className="text-muted-foreground">Presiding:</span>
                                    <span className="font-medium">{selectedHearing.judge}</span>
                                    
                                    <span className="text-muted-foreground">Summary:</span>
                                    <span className="leading-relaxed">{selectedHearing.description}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Parties Involved
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card border p-3 rounded-md">
                                    <span className="text-xs text-muted-foreground block mb-1">Plaintiff</span>
                                    <span className="font-medium block">{selectedHearing.plaintiff}</span>
                                </div>
                                <div className="bg-card border p-3 rounded-md">
                                    <span className="text-xs text-muted-foreground block mb-1">Defendant</span>
                                    <span className="font-medium block">{selectedHearing.defendant}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground block mb-1">Legal Reps:</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedHearing.attorneys.map((att: any, i: number) => (
                                        <Badge key={i} variant="secondary" className="font-normal">{att}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator />
                        
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Documents & History
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedHearing.documents.length > 0 ? selectedHearing.documents.map((doc: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium">{doc}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ChevronRight className="w-3 h-3" /></Button>
                                    </div>
                                )) : <span className="text-sm text-muted-foreground italic">No documents attached.</span>}
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="mt-8 gap-2 sm:gap-0">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                         <Button variant="outline" className="w-full sm:w-auto">
                            <History className="mr-2 h-4 w-4" /> Reschedule
                        </Button>
                        <Button className="w-full sm:w-auto">
                            <StickyNote className="mr-2 h-4 w-4" /> Add Notes
                        </Button>
                    </SheetFooter>
                </>
              </ScrollArea>
            )}
        </SheetContent>
      </Sheet>

      <Sheet open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Schedule New Hearing</SheetTitle>
            <SheetDescription>Enter the details for the new hearing.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} placeholder="e.g. Initial Hearing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID (UUID)</Label>
              <Input id="caseId" {...form.register("caseId")} placeholder="Case UUID" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="date">Date</Label>
                 <Input id="date" type="date" {...form.register("date")} />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="type">Type</Label>
                 <Select onValueChange={(val) => form.setValue("type", val)} defaultValue="Initial Hearing">
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Initial Hearing">Initial Hearing</SelectItem>
                        <SelectItem value="Final Hearing">Final Hearing</SelectItem>
                        <SelectItem value="Bail Hearing">Bail Hearing</SelectItem>
                        <SelectItem value="Mediation">Mediation</SelectItem>
                        <SelectItem value="Case Review">Case Review</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="startTime">Start Time</Label>
                 <Input id="startTime" type="time" {...form.register("startTime")} />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="endTime">End Time</Label>
                 <Input id="endTime" type="time" {...form.register("endTime")} />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} placeholder="e.g. Courtroom 3A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
               <Select onValueChange={(val: any) => form.setValue("priority", val)} defaultValue="MEDIUM">
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" {...form.register("description")} placeholder="Add details..." />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={createHearingMutation.isPending}>
                {createHearingMutation.isPending ? "Scheduling..." : "Schedule Hearing"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}

export default function Calendar() {
    const role = localStorage.getItem("role") || "Viewer";
    const roleLower = role.toLowerCase();
    
    // Check if user is a lawyer (case-insensitive)
    const isLawyer = roleLower.includes("lawyer") || roleLower.includes("advocate");
    
    // Check if user is court staff
    const isCourtStaff = roleLower.includes("staff") || roleLower.includes("clerk") || roleLower.includes("registry");

    if (isLawyer) {
        return <LawyerCalendar />;
    }

    if (isCourtStaff) {
        return <CourtStaffCalendar />;
    }

    // Default view (Judge)
    return <JudgeCalendar />;
}
