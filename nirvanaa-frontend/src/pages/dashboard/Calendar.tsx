import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, FileUser, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface Case {
  id: string;
  caseNumber: string;
  caseTitle: string;
  nextHearingDate: string;
  hearingTime?: string;
  status: string;
  assignedLawyerName?: string;
}

export default function Calendar() {
  const role = localStorage.getItem("role") || "Viewer";
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await api.get("/cases");
      return response.data;
    },
  });

  // Filter hearings for the selected date
  const selectedDateHearings = cases?.filter((c) => 
    date && c.nextHearingDate && isSameDay(parseISO(c.nextHearingDate), date)
  ) || [];

  // Get all dates that have hearings (for calendar markers)
  // Note: Calendar component modifiers might need customization to show dots, 
  // currently we'll just rely on the side panel updating.

  return (
    <AppLayout role={role}>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Department Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage and view scheduled hearings and court appointments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar Widget */}
          <Card className="md:col-span-4 lg:col-span-3 h-fit">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-primary"/> Select Date
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center pb-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none"
              />
            </CardContent>
          </Card>

          {/* Schedule List */}
          <Card className="md:col-span-8 lg:col-span-9 min-h-[500px]">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  Schedule for <span className="text-primary">{date ? format(date, "MMMM d, yyyy") : "Selected Date"}</span>
                </CardTitle>
                <Badge variant="outline" className="px-3 py-1">
                  {selectedDateHearings.length} Hearing{selectedDateHearings.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : selectedDateHearings.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateHearings.map((hearing) => (
                    <div 
                      key={hearing.id} 
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/cases/${hearing.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 rounded bg-primary/10 text-primary">
                           <Clock className="w-5 h-5 mb-0.5" />
                           <span className="text-xs font-bold">{hearing.hearingTime || "10:00"}</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                            {hearing.caseTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileUser className="w-3.5 h-3.5" />
                              Case #{hearing.caseNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              Room 304
                            </span>
                             {hearing.assignedLawyerName && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                Adv. {hearing.assignedLawyerName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex items-center gap-3">
                         <Badge 
                            variant={hearing.status === "Closed" ? "secondary" : "default"}
                            className={
                              hearing.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" : 
                              hearing.status === "Pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200" : ""
                            }
                         >
                            {hearing.status}
                         </Badge>
                         <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CalendarIcon className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium">No hearings scheduled</h3>
                  <p className="text-sm max-w-sm mx-auto mt-2">
                    There are no court hearings or appointments scheduled for this date. Select another date from the calendar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
