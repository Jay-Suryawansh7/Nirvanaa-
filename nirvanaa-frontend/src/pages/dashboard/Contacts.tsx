import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Contacts() {
  const role = localStorage.getItem("role") || "Viewer";
  
  return (
    <AppLayout role={role}>
      <h1 className="text-3xl font-bold mb-6 text-primary">Contacts Directory</h1>
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Professional Contacts</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="p-8 text-center text-muted-foreground">
                <p>Contacts directory coming soon.</p>
                <p>Will list Judges, Lawyers, and Court Staff associated with your cases.</p>
            </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
