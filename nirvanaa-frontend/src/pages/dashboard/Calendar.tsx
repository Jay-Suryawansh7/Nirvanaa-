import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function Calendar() {
  const role = localStorage.getItem("role") || "Viewer";
  
  return (
    <AppLayout role={role}>
      <h1 className="text-3xl font-bold mb-6 text-primary">Department Calendar</h1>
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Upcoming Schedule</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-8 text-center text-muted-foreground">
                <p>Calendar integration coming soon.</p> 
                <p>Here you will see scheduled hearings and appointments.</p>
            </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
