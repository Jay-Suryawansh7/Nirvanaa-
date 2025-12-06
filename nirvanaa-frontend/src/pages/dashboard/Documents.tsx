import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Documents() {
  const role = localStorage.getItem("role") || "Viewer";
  
  return (
    <AppLayout role={role}>
      <h1 className="text-3xl font-bold mb-6 text-primary">Document Repository</h1>
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> My Documents</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-8 text-center text-muted-foreground">
                <p>Document management system coming soon.</p>
                <p>Features to include: Case filings, orders, and evidence uploads.</p>
            </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
