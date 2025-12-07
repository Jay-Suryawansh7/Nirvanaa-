import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, FileText, Users, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

// API_URL is handled in api.ts

const fetchCaseDetails = async (id: string) => {
  try {
      const res = await api.get(`/cases/${id}`);
      return res.data;
  } catch (error) {
      console.error("Error fetching case details:", error);
      throw error;
  }
};

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = localStorage.getItem("role") || "Viewer";
  
  const [date, setDate] = useState<Date | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  console.log("Rendering CaseDetails for ID:", id);

  const { data: caseItem, isLoading, isError, error } = useQuery({
    queryKey: ["case", id],
    queryFn: () => {
        if (!id) throw new Error("Case ID is missing");
        return fetchCaseDetails(id);
    },
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
  
  if (isError || !caseItem) {
      // @ts-ignore
      const errorMessage = error?.response?.data?.message || error?.message || "Unknown error occurred";
      return (
        <div className="p-8 text-red-500">
            <h2 className="text-xl font-bold">Error loading case details</h2>
            <p>Reason: {errorMessage}</p>
            <p className="text-sm text-gray-500 mt-2">Check console for more details.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      );
  }

  return (
    <AppLayout role={role}>
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{caseItem.caseTitle}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="text-sm font-normal">{caseItem.caseNumber}</Badge>
                    <span>•</span>
                    <span className="font-medium">{caseItem.courtType}</span>
                    <span>•</span>
                    <span>{caseItem.category}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right hidden md:block">
                    <p className="text-sm text-muted-foreground">Readiness Score</p>
                    <p className={`text-2xl font-bold ${caseItem.readinessStatus === "READY" ? "text-green-600" : caseItem.readinessStatus === "PARTIAL" ? "text-yellow-600" : "text-red-600"}`}>
                        {caseItem.computedScore}%
                    </p>
                </div>
                {/* Visual Circle or anything could go here */}
            </div>
        </div>
        <Progress value={caseItem.computedScore} className="h-2 mt-6" />
      </div>

       <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
             <div className="grid gap-6 md:grid-cols-3">
                 <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Current Status</p>
                                <div className="text-lg font-medium flex items-center gap-2">
                                    <Badge variant={caseItem.status === "SCHEDULED" ? "default" : "secondary"}>
                                        {caseItem.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Document Readiness</p>
                                <div className="text-lg font-medium">
                                    {caseItem.documentStatus}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Filing Date</p>
                                <div className="text-lg font-medium">{new Date(caseItem.createdAt).toLocaleDateString()}</div>
                            </div>
                             <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                                <div className="text-lg font-medium">Just now</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Document Preview (Limit 3) */}
                     <Card>
                        <CardHeader>
                            <CardTitle>Recent Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {caseItem.documents && caseItem.documents.length > 0 ? (
                                <ul className="space-y-3">
                                    {caseItem.documents.slice(0, 3).map((doc: any, i: number) => (
                                        <li key={i} className="flex justify-between items-center p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-primary"/>
                                                <span className="font-medium">{doc.checklistItem}</span>
                                            </div>
                                            <Badge variant={doc.isReady ? "default" : "outline"}>{doc.isReady ? "Filed" : "Pending"}</Badge>
                                        </li>
                                    ))}
                                    {caseItem.documents.length > 3 && (
                                        <li className="text-center pt-2">
                                            <Button variant="link" onClick={() => (document.querySelector('[value="documents"]') as HTMLElement)?.click()}>View all documents</Button>
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No documents filed yet.</p>
                            )}
                        </CardContent>
                    </Card>
                 </div>

                 {/* Sidebar */}
                 <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Next Hearing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-5xl font-bold text-primary mb-2">
                                    {new Date(caseItem.nextHearingDate).getDate()}
                                </p>
                                <p className="text-xl font-medium">
                                    {new Date(caseItem.nextHearingDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground bg-background/50 py-1 px-3 rounded-full w-fit mx-auto">
                                    <Clock className="h-4 w-4"/>
                                    {caseItem.hearingTime || "10:00 AM"}
                                </div>
                            </div>
                            
                            {role === "JUDGE" && (
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button className="w-full mt-4" size="lg">Reschedule Hearing</Button>
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
        </TabsContent>

        <TabsContent value="documents">
             <Card>
                <CardHeader>
                    <CardTitle>Case Documents & Evidence</CardTitle>
                    <CardDescription>Legal documents filed by advocates and parties.</CardDescription>
                </CardHeader>
                <CardContent>
                    {caseItem.documents && caseItem.documents.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {caseItem.documents.map((doc: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 border rounded-xl hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                            <FileText className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{doc.checklistItem}</p>
                                            <p className="text-sm text-muted-foreground">Uploaded on {new Date(doc.updatedAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {doc.isReady ? <CheckCircle className="h-5 w-5 text-green-500"/> : <Clock className="h-5 w-5 text-yellow-500"/>}
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50"/>
                            <p className="text-lg font-medium">No Documents Found</p>
                            <p className="text-muted-foreground">Checklist has not been initialized or no uploads yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="participants">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                L
                            </div>
                            <div>
                                <p className="font-medium text-lg">{caseItem.assignedLawyerName || "Assigned Lawyer"}</p>
                                <p className="text-sm text-muted-foreground">
                                    {caseItem.assignedLawyerName ? "Advocate on Record" : "Waiting for assignment"}
                                </p>
                            </div>
                        </div>
                        <Badge className="px-3 py-1 text-sm" variant={caseItem.lawyerConfirmation ? "default" : "outline"}>
                            {caseItem.lawyerConfirmation ? "Confirmed" : "Pending Action"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-xl">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                                W
                            </div>
                            <div>
                                <p className="font-medium text-lg">Primary Witness</p>
                                <p className="text-sm text-muted-foreground">Key Testimony Provider</p>
                            </div>
                        </div>
                         <Badge className="px-3 py-1 text-sm" variant={caseItem.witnessConfirmation ? "default" : "outline"}>
                            {caseItem.witnessConfirmation ? "Confirmed" : "Pending Action"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="timeline">
            <Card>
                <CardHeader>
                    <CardTitle>Case Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                        <div className="relative pl-8">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background"/>
                            <p className="font-medium">Case Rescheduled</p>
                            <p className="text-sm text-muted-foreground">Today</p>
                        </div>
                        <div className="relative pl-8">
                             <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted ring-4 ring-background"/>
                             <p className="font-medium">Documents Uploaded</p>
                             <p className="text-sm text-muted-foreground">{new Date(caseItem.createdAt).toLocaleDateString()}</p>
                        </div>
                         <div className="relative pl-8">
                             <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted ring-4 ring-background"/>
                             <p className="font-medium">Case Filed</p>
                             <p className="text-sm text-muted-foreground">{new Date(caseItem.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </AppLayout>
  );
}
