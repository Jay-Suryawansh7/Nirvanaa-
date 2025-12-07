import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const documentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  caseId: z.string().uuid("Case ID must be a valid UUID"),
  checklistItem: z.string().min(1, "Checklist item is required"),
  mimeType: z.string().optional(),
  size: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const fetchDocuments = async () => {
    const res = await api.get("/documents");
    return res.data;
};

export default function Documents() {
  const role = localStorage.getItem("role") || "Viewer";
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      fileName: "",
      caseId: "",
      checklistItem: "",
      mimeType: "application/pdf",
      size: "1.2 MB" 
    }
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormValues) => {
      // Mock file upload logic - just sending metadata
      await api.post("/documents", {
        ...data,
        fileUrl: "https://example.com/mock-file.pdf",
        status: "PENDING"
      });
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      setIsUploadOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => {
      toast.error("Failed to upload document");
      console.error(error);
    }
  });

  const onSubmit = (data: DocumentFormValues) => {
    createDocumentMutation.mutate(data);
  };

  const { data: documents = [], isLoading } = useQuery({
      queryKey: ["documents"],
      queryFn: fetchDocuments
  });

  const filteredDocs = documents.filter((doc: any) => 
    (doc.fileName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (doc.checklistItem?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout role={role}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Document Repository</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
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
                                <TableHead className="hidden sm:table-cell">Checklist Item</TableHead>
                                <TableHead className="hidden md:table-cell">Size</TableHead>
                                <TableHead className="hidden md:table-cell">Upload Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Loading documents...
                                    </TableCell>
                                </TableRow>
                            ) : filteredDocs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDocs.map((doc: any) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="truncate max-w-[150px] sm:max-w-xs" title={doc.fileName}>{doc.fileName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{doc.mimeType?.split('/')[1]?.toUpperCase() || 'N/A'}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline" className="whitespace-nowrap">{doc.checklistItem}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{doc.size || 'N/A'}</TableCell>
                                        <TableCell className="hidden md:table-cell whitespace-nowrap">
                                            {doc.updatedAt ? format(new Date(doc.updatedAt), "MMM d, yyyy") : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                doc.status === "VERIFIED" ? "default" : 
                                                doc.status === "REJECTED" ? "destructive" : "secondary"
                                            }>
                                                {doc.status || "PENDING"}
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
      <Sheet open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Upload Document</SheetTitle>
            <SheetDescription>Enter document details. File upload is simulated.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input id="fileName" {...form.register("fileName")} placeholder="e.g. Case_Order.pdf" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID (UUID)</Label>
              <Input id="caseId" {...form.register("caseId")} placeholder="Case UUID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checklistItem">Type / Checklist Item</Label>
               <Select onValueChange={(val) => form.setValue("checklistItem", val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Petition">Petition</SelectItem>
                        <SelectItem value="Evidence">Evidence</SelectItem>
                        <SelectItem value="Order">Order</SelectItem>
                        <SelectItem value="Statement">Statement</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={createDocumentMutation.isPending}>
                {createDocumentMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
