import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api"; // Use centralized API
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

// API_URL handled in api.ts

const fetchCases = async () => {
    const res = await api.get("/cases");
    return res.data;
};

export default function LawyerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cases = [], isLoading } = useQuery({ queryKey: ["cases"], queryFn: fetchCases });
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
      caseNumber: "",
      caseTitle: "",
      courtType: "High Court",
      category: "Civil",
      nextHearingDate: "",
      documents: "" // Comma separated for "init" feature
  });

  const createCaseMutation = useMutation({
      mutationFn: async (data: any) => {
          const payload = {
              ...data,
              // Split documents by comma and trim
              documents: data.documents ? data.documents.split(",").map((d: string) => d.trim()) : []
          };
          await api.post("/cases", payload);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cases"] });
          toast.success("Case filed successfully");
          setIsOpen(false);
          setFormData({
              caseNumber: "",
              caseTitle: "",
              courtType: "High Court",
              category: "Civil",
              nextHearingDate: "",
              documents: ""
          });
      },
      onError: (error: any) => {
          toast.error("Failed to file case: " + (error.response?.data?.message || error.message));
      }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createCaseMutation.mutate(formData);
  };

  const upcomingHearings = cases.length;
  // Mock confirmation rate
  const confirmRate = 94;

  return (
    <AppLayout role="Lawyer">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Advocate Dashboard</h1>
        <div className="flex gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4"/> File New Case</Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>File a New Case</SheetTitle>
                        <SheetDescription>
                            Enter case details and upload initial documents (checklist).
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="caseNumber">Case Number</Label>
                            <Input id="caseNumber" name="caseNumber" value={formData.caseNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="caseTitle">Case Title</Label>
                            <Input id="caseTitle" name="caseTitle" value={formData.caseTitle} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="courtType">Court Type</Label>
                            <Input id="courtType" name="courtType" value={formData.courtType} onChange={handleInputChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="nextHearingDate">Next Hearing Date</Label>
                            <Input id="nextHearingDate" name="nextHearingDate" type="datetime-local" value={formData.nextHearingDate} onChange={handleInputChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="documents">Initial Documents (Comma separated names)</Label>
                            <Input id="documents" name="documents" placeholder="Petition, Affidavit..." value={formData.documents} onChange={handleInputChange} />
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={createCaseMutation.isPending}>
                                {createCaseMutation.isPending ? "Filing..." : "File Case"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
            <Button variant="outline">Check Notifications</Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmRate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingHearings}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Hearings</TabsTrigger>
          <TabsTrigger value="past">Past History</TabsTrigger>
          <TabsTrigger value="performance">My Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <p>Loading cases...</p> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Hearing Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {cases.map((c: any) => (
                           <TableRow key={c.id}>
                               <TableCell>{c.caseNumber}</TableCell>
                               <TableCell>{c.caseTitle}</TableCell>
                               <TableCell>{new Date(c.nextHearingDate).toLocaleDateString()}</TableCell>
                               <TableCell>
                                   <Button size="sm" onClick={() => navigate(`/dashboard/cases/${c.id}`)}>View Details</Button>
                               </TableCell>
                           </TableRow>
                       ))}
                       {cases.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No cases found. File a new case to get started.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past">
           <Card>
            <CardHeader>
              <CardTitle>Case History</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Historical data would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
