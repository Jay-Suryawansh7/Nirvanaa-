import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
    Calendar as CalendarIcon, 
    MapPin, 
    Briefcase, 
    Plus, 
    MoreHorizontal, 
    ChevronLeft, 
    ChevronRight,
    Gavel,
    Users,
    FileText,
    Coffee,
    Car
} from "lucide-react";
import { format, isSameDay, parseISO, isToday, addDays, subDays } from "date-fns";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- Types & Mock Data ---

type EventType = 'court' | 'meeting' | 'internal' | 'deadline' | 'personal' | 'travel';

interface ScheduleItem {
  id: string;
  title: string;
  type: EventType;
  startTime: string; // "HH:mm" 24h format for easier calculation
  endTime: string;
  date: string; // "YYYY-MM-DD"
  location?: string;
  description?: string;
  client?: string;
}

const MOCK_SCHEDULE: ScheduleItem[] = [
    // Dec 7, 2025
    {
        id: "1",
        title: "Client Meeting - John Doe",
        type: "meeting",
        startTime: "09:00",
        endTime: "10:00",
        date: "2025-12-07",
        location: "Office - Conf Room A",
        client: "John Doe",
        description: "Initial consultation regarding property dispute."
    },
    {
        id: "2",
        title: "Court Appearance - State vs. Kumar",
        type: "court",
        startTime: "10:30",
        endTime: "12:00",
        date: "2025-12-07",
        location: "Courtroom 1",
        description: "Bail hearing. Ensure all documents are ready.",
        client: "Vijay Kumar"
    },
    {
        id: "3",
        title: "Lunch Break",
        type: "personal",
        startTime: "12:00",
        endTime: "13:00",
        date: "2025-12-07",
        description: "Personal time."
    },
    {
        id: "4",
        title: "Document Review - Tax Case",
        type: "deadline",
        startTime: "13:30",
        endTime: "14:30",
        date: "2025-12-07",
        location: "Office",
        description: "Review financial statements and audit reports."
    },
    {
        id: "5",
        title: "Team Meeting",
        type: "internal",
        startTime: "15:00",
        endTime: "16:00",
        date: "2025-12-07",
        location: "Conference Room",
        description: "Weekly sync with junior associates."
    },
    {
        id: "6",
        title: "Client Consultation - New Case",
        type: "meeting",
        startTime: "16:30",
        endTime: "17:30",
        date: "2025-12-07",
        location: "Virtual (Zoom)",
        client: "Sarah Jenkins",
        description: "Video call regarding potential contract breach case."
    },
    // Dec 9 data (just to populate calendar indicators)
    { id: "7", title: "Court Hearing", type: "court", startTime: "09:00", endTime: "11:00", date: "2025-12-09" }
];

const EVENT_COLORS: Record<EventType, string> = {
    court: "bg-red-100 border-red-200 text-red-800 hover:bg-red-50",
    meeting: "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-50",
    internal: "bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-50",
    deadline: "bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-50",
    personal: "bg-green-100 border-green-200 text-green-800 hover:bg-green-50",
    travel: "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-50"
};

const EVENT_ICONS: Record<EventType, any> = {
    court: Gavel,
    meeting: Users,
    internal: Briefcase,
    deadline: FileText,
    personal: Coffee,
    travel: Car
};

// --- Helper Components & Logic ---

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM (18:00)

const getPositionStyle = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    // Scale: 8:00 is 0. Each hour is 80px.
    const HOUR_HEIGHT = 80;
    const START_HOUR = 8;

    const startOffset = ((startH - START_HOUR) * 60 + startM);
    const duration = ((endH * 60 + endM) - (startH * 60 + startM));

    const top = (startOffset / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT;

    return { top: `${top}px`, height: `${height}px` };
};

export default function Calendar() {
  const role = localStorage.getItem("role") || "Viewer";
  // Default to Dec 7, 2025 as per request
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 11, 7)); 
  const [filterType, setFilterType] = useState<string>("all");
  const [view, setView] = useState<"day" | "week">("day"); // Added view state

  // Handlers
  const handleNextDay = () => date && setDate(addDays(date, 1));
  const handlePrevDay = () => date && setDate(subDays(date, 1));
  const handleToday = () => setDate(new Date());

  // Derived Data
  const dailyEvents = useMemo(() => {
      if (!date) return [];
      const dateStr = format(date, "yyyy-MM-dd");
      return MOCK_SCHEDULE.filter(evt => {
          const matchDate = evt.date === dateStr;
          const matchType = filterType === "all" || evt.type === filterType;
          return matchDate && matchType;
      }).sort((a,b) => a.startTime.localeCompare(b.startTime));
  }, [date, filterType]);

  // Calendar Day Content (Dots)
  function CustomDayContent(props: DayContentProps) {
    const events = MOCK_SCHEDULE.filter(h => isSameDay(parseISO(h.date), props.date));
    return (
        <div className="relative w-full h-full flex items-center justify-center text-sm">
            <span>{format(props.date, "d")}</span>
            {events.length > 0 && (
                 <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
        </div>
    );
  }

  // Current Time Indicator Logic
  const isSelectedDateToday = date && isToday(date);
  const now = new Date();
  const currentMinutes = (now.getHours() - 8) * 60 + now.getMinutes();
  const currentTimeTop = (currentMinutes / 60) * 80; // 80px per hour
  const showTimeIndicator = isSelectedDateToday && now.getHours() >= 8 && now.getHours() <= 18;

  return (
    <AppLayout role={role}>
      <div className="flex flex-col space-y-6 h-[calc(100vh-100px)]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Schedule</h1>
              <p className="text-muted-foreground mt-1">Manage your daily agenda, court appearances, and meetings.</p>
            </div>
             <div className="flex items-center gap-2">
                <div className="hidden md:flex bg-muted rounded-md p-1 mr-2">
                    <Button 
                        variant={view === 'day' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setView('day')}
                        className="h-8"
                    >
                        Day
                    </Button>
                    <Button 
                        variant={view === 'week' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setView('week')}
                        className="h-8"
                    >
                        Week
                    </Button>
                </div>

                <Button variant="outline" className="hidden md:flex" onClick={handleToday}>Today</Button>
                <div className="flex bg-muted rounded-md p-1">
                    <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-8 w-8"><ChevronLeft className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-8 w-8"><ChevronRight className="h-4 w-4"/></Button>
                </div>
                <Button className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          
          {/* Calendar Widget (Left Sidebar) */}
          <Card className="lg:col-span-3 h-fit flex flex-col">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-primary"/> Calendar
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex justify-center pb-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                defaultMonth={date || new Date()} 
                components={{ DayContent: CustomDayContent }}
              />
            </CardContent>
            <div className="px-6 pb-6 space-y-4">
                <Separator />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Filter Events</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            <SelectItem value="court">Court Appearances</SelectItem>
                            <SelectItem value="meeting">Meetings</SelectItem>
                            <SelectItem value="deadline">Deadlines</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                        </SelectContent>
                    </Select> 
                </div>
            </div>
          </Card>

          {/* Daily Agenda View (Right Side) */}
          <Card className="lg:col-span-9 flex flex-col h-full min-h-[600px] border-none shadow-none lg:shadow-sm lg:border bg-transparent lg:bg-card">
            
            {/* Agenda Header */}
            <div className="p-4 border-b bg-card rounded-t-lg flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        <span className="text-xs font-bold uppercase">{date ? format(date, "MMM") : ""}</span>
                        <span className="text-xl font-bold">{date ? format(date, "d") : ""}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{date ? format(date, "EEEE") : "Select a date"}</h2>
                        <span className="text-sm text-muted-foreground">{date ? format(date, "MMMM d, yyyy") : ""}</span>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                    {dailyEvents.length} Events Scheduled
                </div>
            </div>

            {/* Timeline Scroll Area */}
            <ScrollArea className="flex-1 bg-card rounded-b-lg">
                <div className="p-4 relative min-h-[900px]"> {/* Ensure height for scrolling */}
                    
                    {/* Time Grid */}
                    <div className="relative ml-14 border-l h-[880px]"> {/* 11 hours * 80px */}
                        {HOURS.map((hour) => (
                            <div key={hour} className="absolute w-full border-t border-dashed border-muted-foreground/20" style={{ top: `${(hour - 8) * 80}px` }}> {/* 80px height */}
                                <span className="absolute -left-14 -top-2.5 text-xs text-muted-foreground font-medium w-10 text-right">
                                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                </span>
                            </div>
                        ))}

                        {/* Current Time Indicator (Only if today) */}
                        {showTimeIndicator && (
                            <div 
                                className="absolute w-full border-t-2 border-red-500 z-50 pointer-events-none"
                                style={{ top: `${currentTimeTop}px` }}
                            >
                                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
                            </div>
                        )}

                        {/* Events Render */}
                        {dailyEvents.map((evt) => {
                            const Icon = EVENT_ICONS[evt.type];
                            return (
                                <div
                                    key={evt.id}
                                    className={`absolute left-2 right-2 rounded-md border p-2 text-xs sm:text-sm shadow-sm transition-all hover:shadow-md cursor-pointer group overflow-hidden flex flex-col ${EVENT_COLORS[evt.type]} opacity-90 hover:opacity-100 z-10`}
                                    style={getPositionStyle(evt.startTime, evt.endTime)}
                                >
                                    <div className="flex justify-between items-start gap-1">
                                        <div className="font-semibold truncate flex items-center gap-1.5">
                                            <Icon className="w-3.5 h-3.5 flex-none" />
                                            <span className="truncate">{evt.title}</span>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1 -mt-1 hover:bg-black/10 text-current opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    
                                    <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] sm:text-xs opacity-90 truncate">
                                        <span>{evt.startTime} - {evt.endTime}</span>
                                        {evt.location && (
                                            <span className="flex items-center gap-0.5">
                                                <MapPin className="w-3 h-3" /> {evt.location}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {evt.client && (
                                        <div className="mt-1 font-medium bg-white/30 rounded px-1.5 py-0.5 w-fit">
                                            Client: {evt.client}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Empty State/Drag Area - Clickable Background */}
                        <div className="absolute inset-0 z-0 bg-transparent" onClick={() => console.log("Add event clicked")} />
                    </div>
                </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
