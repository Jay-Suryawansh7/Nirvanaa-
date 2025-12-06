import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AppLayout } from "@/components/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";

// API_URL handled by api.ts

const fetchCases = async () => {
  const res = await api.get("/cases");
  return res.data;
};

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const { data: cases = [], isLoading, isError, error } = useQuery({ queryKey: ["cases"], queryFn: fetchCases });

  if (isError) {
      return (
          <AppLayout role="Judge">
              <div className="p-8 text-red-500">
                  <h2 className="text-xl font-bold">Error loading dashboard</h2>
                  <p>{(error as any)?.response?.data?.message || (error as Error).message}</p>
                  <div className="flex gap-4 mt-4">
                      <Button onClick={() => window.location.reload()}>Retry</Button>
                      <Button variant="outline" onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("role");
                          window.location.href = "/login";
                      }}>Logout</Button>
                  </div>
              </div>
          </AppLayout>
      );
  }

  // Calculate Stats
  const totalCases = cases.length;
  const readyCases = cases.filter((c: any) => c.readinessStatus === "READY").length;
  const partialCases = cases.filter((c: any) => c.readinessStatus === "PARTIAL").length;
  const pendingCases = cases.filter((c: any) => c.readinessStatus === "NOT_READY").length;

  return (
    <AppLayout role="Judge">
      <h1 className="text-3xl font-bold mb-6 text-primary">Judge's Chambers</h1>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Hearing</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyCases}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partially Ready</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partialCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCases}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Case Readiness Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading cases...</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Hearing Date</TableHead>
                    <TableHead>Lawyer Conf</TableHead>
                    <TableHead>Witness Conf</TableHead>
                    <TableHead>Docs Ready</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.caseNumber}</TableCell>
                      <TableCell>{c.caseTitle}</TableCell>
                      <TableCell>{new Date(c.nextHearingDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{c.lawyerConfirmation ? "✅" : "❌"}</TableCell>
                      <TableCell className="text-center">{c.witnessConfirmation ? "✅" : "❌"}</TableCell>
                      <TableCell className="text-center">{c.documentStatus === "READY" ? "✅" : "⚠️"}</TableCell>
                      <TableCell>
                        <Badge variant={c.readinessStatus === "READY" ? "default" : c.readinessStatus === "PARTIAL" ? "secondary" : "destructive"}>
                          {c.computedScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/cases/${c.id}`)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
