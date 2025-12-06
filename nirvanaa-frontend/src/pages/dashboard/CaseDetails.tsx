import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, FileText, User, Users } from "lucide-react";
import { toast } from "sonner";

// API_URL is handled in api.ts

const fetchCaseDetails = async (id: string) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = localStorage.getItem("role") || "Viewer";
  
  const [date, setDate] = useState<Date | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: caseItem, isLoading, isError } = useQuery({
    queryKey: ["case", id],
    queryFn: () => fetchCaseDetails(id!),
    enabled: !!id
  });

  const rescheduleMutation = useMutation({
    mutationFn: async (newDate: Date) => {
      await api.patch(`/cases/${id}/reschedule`, { newDate: newDate.toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case", id] });
      toast.success("Hearing rescheduled successfully");
      setIsPopoverOpen(false);
    },
    onError: () => {
      toast.error("Failed to reschedule hearing");
    }
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
        rescheduleMutation.mutate(newDate);
    }
  };

  if (isLoading) return <div className="p-8">Loading case details...</div>;
  if (isError || !caseItem) return <div className="p-8 text-red-500">Error loading case details.</div>;

  return (
    <AppLayout role={role}>
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{caseItem.caseTitle}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline">{caseItem.caseNumber}</Badge>
                    <span>•</span>
                    <span>{caseItem.courtType}</span>
                    <span>•</span>
                    <span>{caseItem.category}</span>
                </div>
            </div>
            <Badge className="text-base px-4 py-1" variant={
                caseItem.readinessStatus === "READY" ? "default" : 
                caseItem.readinessStatus === "PARTIAL" ? "secondary" : "destructive"
            }>
                Readiness: {caseItem.computedScore}%
            </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Case Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <p className="font-medium">{caseItem.status}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Document Status</p>
                            <p className="font-medium">{caseItem.documentStatus}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-full"><User className="h-4 w-4"/></div>
                            <div>
                                <p className="font-medium">{caseItem.assignedLawyerName || "Assigned Lawyer"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {caseItem.assignedLawyerName ? "Advocate on Record" : "Waiting for assignment"}
                                </p>
                            </div>
                        </div>
                        <Badge variant={caseItem.lawyerConfirmation ? "default" : "outline"}>
                            {caseItem.lawyerConfirmation ? "Confirmed" : "Pending"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-full"><User className="h-4 w-4"/></div>
                            <div>
                                <p className="font-medium">Primary Witness</p>
                                <p className="text-xs text-muted-foreground">Waiting for confirmation</p>
                            </div>
                        </div>
                         <Badge variant={caseItem.witnessConfirmation ? "default" : "outline"}>
                            {caseItem.witnessConfirmation ? "Confirmed" : "Pending"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Next Hearing</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-4xl font-bold text-primary">
                            {new Date(caseItem.nextHearingDate).getDate()}
                        </p>
                        <p className="text-xl font-medium">
                            {new Date(caseItem.nextHearingDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-muted-foreground mt-2">{caseItem.hearingTime}</p>
                    </div>
                    
                    {role === "JUDGE" && (
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button className="w-full mt-4">Reschedule Hearing</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
