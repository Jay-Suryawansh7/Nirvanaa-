import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, Search, Filter } from "lucide-react";

// Mock data for demonstration
const MOCK_DOCUMENTS = [
  { id: 1, name: "Case_File_2024_001.pdf", type: "Petition", caseNumber: "CN-2024-001", size: "2.4 MB", date: "2024-12-01", status: "Verified" },
  { id: 2, name: "Evidence_List_A.docx", type: "Evidence", caseNumber: "CN-2024-001", size: "1.1 MB", date: "2024-12-02", status: "Pending" },
  { id: 3, name: "Court_Order_Interim.pdf", type: "Order", caseNumber: "CN-2023-884", size: "850 KB", date: "2024-11-28", status: "Verified" },
  { id: 4, name: "Witness_Statement_Key.pdf", type: "Statement", caseNumber: "CN-2024-003", size: "3.2 MB", date: "2024-12-05", status: "Rejected" },
  { id: 5, name: "Bail_Application.pdf", type: "Application", caseNumber: "CN-2024-005", size: "1.5 MB", date: "2024-12-06", status: "Pending" },
  { id: 6, name: "Hearing_Transcript_Nov.txt", type: "Transcript", caseNumber: "CN-2023-884", size: "120 KB", date: "2024-11-30", status: "Verified" },
];

export default function Documents() {
  const role = localStorage.getItem("role") || "Viewer";
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout role={role}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Document Repository</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5"/> All Documents
                </CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search files..."
                          className="pl-8 w-full sm:w-[250px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="hidden sm:table-cell">Case Number</TableHead>
                                <TableHead className="hidden md:table-cell">Size</TableHead>
                                <TableHead className="hidden md:table-cell">Upload Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="truncate max-w-[150px] sm:max-w-xs" title={doc.name}>{doc.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{doc.type}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline" className="whitespace-nowrap">{doc.caseNumber}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{doc.size}</TableCell>
                                        <TableCell className="hidden md:table-cell whitespace-nowrap">{doc.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                doc.status === "Verified" ? "default" : 
                                                doc.status === "Rejected" ? "destructive" : "secondary"
                                            }>
                                                {doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Download">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
