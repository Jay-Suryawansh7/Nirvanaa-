import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MapPin, Briefcase, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  type: z.string().min(1, "Type is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  organization: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fetchContacts = async () => {
    const res = await api.get("/contacts");
    return res.data;
};

export default function Contacts() {
  const role = localStorage.getItem("role") || "Viewer";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      role: "",
      type: "Lawyer",
      email: "",
      phone: "",
      location: "",
      organization: "",
      notes: ""
    }
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      await api.post("/contacts", data);
    },
    onSuccess: () => {
      toast.success("Contact added successfully");
      setIsAddOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error) => {
      toast.error("Failed to add contact");
      console.error(error);
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    createContactMutation.mutate(data);
  };

  const { data: contacts = [], isLoading } = useQuery({
      queryKey: ["contacts"],
      queryFn: fetchContacts
  });

  const filteredContacts = contacts.filter((contact: any) => {
    const matchesSearch = (contact.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (contact.role?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || (contact.type?.toLowerCase() || "") === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AppLayout role={role}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-primary">Contacts Directory</h1>
           <p className="text-muted-foreground">Manage and view professional contacts linked to your cases.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or role..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Contacts</TabsTrigger>
                    <TabsTrigger value="judge">Judges</TabsTrigger>
                    <TabsTrigger value="lawyer">Lawyers</TabsTrigger>
                    <TabsTrigger value="staff">Court Staff</TabsTrigger>
                </TabsList>

                {/* We render the same grid for all tabs, filtering is handled by state logic above to avoid duplication */}
                <TabsContent value="all" className="mt-6">
                   <ContactGrid contacts={filteredContacts} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="judge" className="mt-6">
                   <ContactGrid contacts={filteredContacts} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="lawyer" className="mt-6">
                   <ContactGrid contacts={filteredContacts} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="staff" className="mt-6">
                   <ContactGrid contacts={filteredContacts} isLoading={isLoading} />
                </TabsContent>
            </Tabs>
        </div>

        <div className="w-full lg:w-1/4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <Button variant="outline" className="justify-start w-full">
                        <Mail className="mr-2 h-4 w-4" /> Message Registry
                    </Button>
                    <Button variant="outline" className="justify-start w-full">
                        <Briefcase className="mr-2 h-4 w-4" /> Find Lawyer
                    </Button>
                    <Button variant="outline" className="justify-start w-full">
                        <Phone className="mr-2 h-4 w-4" /> Emergency Contact
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add New Contact</SheetTitle>
            <SheetDescription>Enter the details for the new contact.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register("name")} placeholder="e.g. Adv. Rajesh Verma" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="type">Type</Label>
                 <Select onValueChange={(val) => form.setValue("type", val)} defaultValue="Lawyer">
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Judge">Judge</SelectItem>
                        <SelectItem value="Lawyer">Lawyer</SelectItem>
                        <SelectItem value="Staff">Court Staff</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="role">Role / Designation</Label>
                 <Input id="role" {...form.register("role")} placeholder="e.g. Senior Counsel" />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="email@example.com" />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="phone">Phone (Optional)</Label>
                 <Input id="phone" {...form.register("phone")} placeholder="+91..." />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="organization">Organization (Optional)</Label>
                 <Input id="organization" {...form.register("organization")} placeholder="e.g. Verma Associates" />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" {...form.register("location")} placeholder="e.g. Chamber 101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" {...form.register("notes")} placeholder="Additional notes..." />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={createContactMutation.isPending}>
                {createContactMutation.isPending ? "Adding..." : "Add Contact"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}

function ContactGrid({ contacts, isLoading }: { contacts: any[], isLoading: boolean }) {
    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">Loading contacts...</div>;
    }
    if (contacts.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">No contacts found.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact: any) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {contact.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg leading-none">{contact.name}</h3>
                                <Badge variant="secondary" className="text-xs">{contact.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" /> {contact.role}
                            </p>
                            <div className="pt-2 text-sm space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-3 w-3" /> {contact.email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3 w-3" /> {contact.phone}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-3 w-3" /> {contact.location}
                                </div>
                            </div>
                            <div className="pt-3 flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">View Profile</Button>
                                <Button size="sm" className="flex-1">Message</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
