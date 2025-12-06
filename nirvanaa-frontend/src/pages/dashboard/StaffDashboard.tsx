import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const fetchCases = async () => {
    const res = await api.get("/cases");
    return res.data;
};

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { data: cases = [], isLoading } = useQuery({ queryKey: ["cases"], queryFn: fetchCases });

  return (
    <AppLayout role="Staff">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Court Staff Portal</h1>
        <div className="flex gap-2">
            <Button>Scan Documents</Button>
        </div>
      </div>
      
      <div className="grid gap-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">Cases waiting for document check</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Summons Dispatched</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-xs text-muted-foreground">Updated today</p>
                  </CardContent>
              </Card>
          </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Case Registry & Status</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? <p>Loading cases...</p> : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case No</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Advocate</TableHead>
                            <TableHead>Next Hearing</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cases.map((c: any) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.caseNumber}</TableCell>
                                <TableCell className="font-medium">{c.caseTitle}</TableCell>
                                <TableCell>{c.category}</TableCell>
                                <TableCell>
                                    {c.assignedLawyerName ? (
                                        <Badge variant="outline">{c.assignedLawyerName}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">Unassigned</span>
                                    )}
                                </TableCell>
                                <TableCell>{new Date(c.nextHearingDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={c.status === "SCHEDULED" ? "default" : "secondary"}>
                                        {c.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" variant="ghost" onClick={() => navigate(`/dashboard/cases/${c.id}`)}>
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
