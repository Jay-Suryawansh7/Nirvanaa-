import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MapPin, Briefcase, Plus } from "lucide-react";

// Mock data
const CONTACTS = [
  { id: 1, name: "Hon. Justice Sharma", role: "Judge", type: "Judge", email: "j.sharma@court.gov.in", phone: "+91 11-2338-1234", location: "Courtroom 304", avatar: "JS" },
  { id: 2, name: "Adv. Rajesh Verma", role: "Senior Counsel", type: "Lawyer", email: "rajesh.verma@legal.com", phone: "+91 98765-43210", location: "Verma Associates", avatar: "RV" },
  { id: 3, name: "Sarah Jenkins", role: "Court Clerk", type: "Staff", email: "sarah.j@court.gov.in", phone: "+91 11-2338-5678", location: "Registry Office", avatar: "SJ" },
  { id: 4, name: "Hon. Justice Iyer", role: "Judge", type: "Judge", email: "k.iyer@court.gov.in", phone: "+91 11-2338-4321", location: "Courtroom 501", avatar: "JI" },
  { id: 5, name: "Adv. Meera Kapoor", role: "Defense Attorney", type: "Lawyer", email: "meera.k@legalsolutions.in", phone: "+91 99887-77665", location: "Kapoor Legal", avatar: "MK" },
  { id: 6, name: "Amit Singh", role: "Bailiff", type: "Staff", email: "amit.s@court.gov.in", phone: "+91 98989-12121", location: "Security Desk", avatar: "AS" },
];

export default function Contacts() {
  const role = localStorage.getItem("role") || "Viewer";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContacts = CONTACTS.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || contact.type.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AppLayout role={role}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-primary">Contacts Directory</h1>
           <p className="text-muted-foreground">Manage and view professional contacts linked to your cases.</p>
        </div>
        <Button>
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
                   <ContactGrid contacts={filteredContacts} />
                </TabsContent>
                <TabsContent value="judge" className="mt-6">
                   <ContactGrid contacts={filteredContacts} />
                </TabsContent>
                <TabsContent value="lawyer" className="mt-6">
                   <ContactGrid contacts={filteredContacts} />
                </TabsContent>
                <TabsContent value="staff" className="mt-6">
                   <ContactGrid contacts={filteredContacts} />
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
    </AppLayout>
  );
}

function ContactGrid({ contacts }: { contacts: typeof CONTACTS }) {
    if (contacts.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">No contacts found.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map(contact => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {contact.avatar}
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
