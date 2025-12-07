import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, FileUser, ChevronRight, Plus, MoreHorizontal, Gavel, FileText, User, Printer, History, Briefcase, StickyNote } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayContentProps } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Rich Mock Data with extended details
const MOCK_HEARINGS = [
  // Dec 9: 2 hearings
  { 
      id: "1", 
      caseNumber: "CIV-2025-001234", 
      caseTitle: "State vs. Sharma", 
      type: "Initial Hearing", 
      time: "09:30 AM", 
      endTime: "10:30 AM",
      date: "2025-12-09", 
      location: "Courtroom 3A", 
      judge: "Hon. Justice Iyer", 
      status: "Scheduled", 
      priority: "High",
      description: "First appearance for the civil dispute regarding breach of contract claims filed by the plaintiff. Expected to review initial motion papers.",
      plaintiff: "State of Maharashtra",
      defendant: "Ramesh Sharma",
      attorneys: ["Adv. Priya Desai (Defense)", "Adv. Rajesh Kumar (Prosecution)"],
      documents: ["Complaint.pdf", "Summons.pdf"],
      history: []
  },
  { 
      id: "2", 
      caseNumber: "FAM-2025-004521", 
      caseTitle: "Verma Custody Case", 
      type: "Mediation", 
      time: "02:00 PM", 
      endTime: "04:00 PM",
      date: "2025-12-09", 
      location: "Room 102", 
      judge: "Mediator Singh", 
      status: "Confirmed", 
      priority: "Medium",
      description: "Court-ordered mediation session to attempt settlement on custody arrangements before trial.",
      plaintiff: "Sita Verma",
      defendant: "Ram Verma",
      attorneys: ["Adv. Mehta", "Adv. Gupta"],
      documents: ["Mediation Order.pdf"],
      history: [{ date: "2025-11-20", event: "Initial Filing" }]
  },

  // Dec 10: 3 hearings
  { 
      id: "3", 
      caseNumber: "CRIM-2025-008912", 
      caseTitle: "State vs. Kumar", 
      type: "Bail Hearing", 
      time: "10:00 AM", 
      endTime: "11:00 AM",
      date: "2025-12-10", 
      location: "Courtroom 1", 
      judge: "Hon. Justice Sharma", 
      status: "Scheduled", 
      priority: "Urgent",
      description: "Urgent bail application hearing for the accused currently in custody.",
      plaintiff: "State",
      defendant: "Vijay Kumar",
      attorneys: ["Adv. P. Chidambaram (Defense)"],
      documents: ["Bail Application.pdf", "Police Report.pdf"],
      history: [{ date: "2025-12-05", event: "Arrest" }]
  },
  { 
      id: "4", 
      caseNumber: "CIV-2025-001299", 
      caseTitle: "Nirvanaa Corp vs. Local Retailers", 
      type: "Case Review", 
      time: "11:30 AM", 
      endTime: "12:00 PM",
      date: "2025-12-10", 
      location: "Courtroom 3A", 
      judge: "Hon. Justice Iyer", 
      status: "Postponed", 
      priority: "Low",
      description: "Regular case review to check status of discovery phase.",
      plaintiff: "Nirvanaa Corp",
      defendant: "Assoc. of Retailers",
      attorneys: ["Legal Team A", "Legal Team B"],
      documents: ["Status Report.pdf"],
      history: [{ date: "2025-10-10", event: "Filing" }]
  },
  { 
      id: "5", 
      caseNumber: "TAX-2025-003311", 
      caseTitle: "Tax Dept vs. ABC Ltd", 
      type: "Final Hearing", 
      time: "03:00 PM", 
      endTime: "05:00 PM",
      date: "2025-12-10", 
      location: "Courtroom 5B", 
      judge: "Hon. Justice Rao", 
      status: "Confirmed", 
      priority: "High",
      description: "Final arguments regarding tax liability for FY 2023-24.",
      plaintiff: "Income Tax Dept",
      defendant: "ABC Logistics Ltd",
      attorneys: ["Adv. Taxman", "Adv. Defender"],
      documents: ["Audit Report.pdf", "Submission.pdf"],
      history: [{ date: "2025-06-01", event: "Notice Issued" }]
  },
  
  // Dec 12: 1 hearing
  { id: "6", caseNumber: "CIV-2025-001555", caseTitle: "Land Dispute: Plot 42", type: "Pre-trial Conference", time: "11:00 AM", endTime: "12:00 PM", date: "2025-12-12", location: "Conf Room B", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium", description: "Pre-trial conference to list witnesses and evidence.", plaintiff: "Listing...", defendant: "Listing...", attorneys: [], documents: [], history: [] },

  // Dec 15: 2 hearings
  { id: "7", caseNumber: "CRIM-2025-009001", caseTitle: "State vs. Unknown (Theft)", type: "Arraignment", time: "09:00 AM", endTime: "09:30 AM", date: "2025-12-15", location: "Courtroom 2", judge: "Hon. Justice Khan", status: "Scheduled", priority: "Medium", description: "Formal reading of charges.", plaintiff: "State", defendant: "John Doe", attorneys: ["Public Defender"], documents: ["Charge Sheet"], history: [] },
  { id: "8", caseNumber: "FAM-2025-004600", caseTitle: "Divorce Proceeding #44", type: "Final Hearing", time: "01:00 PM", endTime: "04:00 PM", date: "2025-12-15", location: "Courtroom 4", judge: "Hon. Justice Devi", status: "Confirmed", priority: "High", description: "Final judgment expected.", plaintiff: "Wife", defendant: "Husband", attorneys: ["Adv. A", "Adv. B"], documents: ["Petition"], history: [] },

  // Dec 18: 4 hearings (Busy Day)
  { id: "9", caseNumber: "CIV-2025-002100", caseTitle: "Contract Breach: Tech vs. Vendor", type: "Initial Hearing", time: "09:30 AM", endTime: "10:30 AM", date: "2025-12-18", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium", description: "Initial hearing for contract dispute.", plaintiff: "Tech Corp", defendant: "Vendor Inc", attorneys: ["Corp Counsel"], documents: ["Contract"], history: [] },
  { id: "10", caseNumber: "CIV-2025-002101", caseTitle: "Contract Breach: Vendor Counter", type: "Initial Hearing", time: "10:30 AM", endTime: "11:30 AM", date: "2025-12-18", location: "Courtroom 3A", judge: "Hon. Justice Iyer", status: "Scheduled", priority: "Medium", description: "Counter-suit hearing.", plaintiff: "Vendor Inc", defendant: "Tech Corp", attorneys: ["Corp Counsel"], documents: ["Counter-Claim"], history: [] },
  { id: "11", caseNumber: "CRIM-2025-009123", caseTitle: "State vs. Gang Leader", type: "Sentencing", time: "02:00 PM", endTime: "03:30 PM", date: "2025-12-18", location: "Courtroom 1 (High Security)", judge: "Hon. Justice Sharma", status: "Confirmed", priority: "Urgent", description: "Sentencing hearing for convicted felon. High security protocols.", plaintiff: "State", defendant: "Don", attorneys: ["Adv. Criminal"], documents: ["Verdict"], history: [{ date: "2025-11-30", event: "Conviction" }] },
  { id: "12", caseNumber: "ADM-2025-000123", caseTitle: "Admin Review: License", type: "Administrative", time: "04:30 PM", endTime: "05:00 PM", date: "2025-12-18", location: "Office 202", judge: "Registrar", status: "Scheduled", priority: "Low", description: "Review of license suspension appeal.", plaintiff: "Licensee", defendant: "Authority", attorneys: [], documents: ["Appeal"], history: [] },

  // Dec 20: 1 hearing
  { id: "13", caseNumber: "CIV-2025-001800", caseTitle: "Public Interest Litigation #5", type: "Hearing", time: "10:00 AM", endTime: "01:00 PM", date: "2025-12-20", location: "Courtroom 1", judge: "Bench", status: "Confirmed", priority: "High", description: "Hearing on environmental impact PIL.", plaintiff: "NGO", defendant: "Govt", attorneys: ["Adv. Environmentalist"], documents: ["Petition"], history: [] },

  // Dec 23: 2 hearings
  { id: "14", caseNumber: "CRIM-2025-009500", caseTitle: "State vs. Doe (Review)", type: "Case Review", time: "11:00 AM", endTime: "11:30 AM", date: "2025-12-23", location: "Courtroom 2", judge: "Hon. Justice Khan", status: "Rescheduled", priority: "Medium", description: "Routine review of probation status.", plaintiff: "State", defendant: "Doe", attorneys: [], documents: [], history: [] },
  { id: "15", caseNumber: "CIV-2025-002500", caseTitle: "Construction Stay Order", type: "Urgent Motion", time: "04:00 PM", endTime: "04:30 PM", date: "2025-12-23", location: "Chambers", judge: "Hon. Justice Iyer", status: "Submitted", priority: "Urgent", description: "Ex-parte motion for stay order on construction.", plaintiff: "Resident", defendant: "Builder", attorneys: ["Adv. Property"], documents: ["Motion", "Affidavit"], history: [] },
];

import LawyerCalendar from "./LawyerCalendar";
import CourtStaffCalendar from "./CourtStaffCalendar";

function JudgeCalendar() {
  const role = localStorage.getItem("role") || "Viewer";
// ... (rest of JudgeCalendar remains unchanged)
  );
}

export default function Calendar() {
    const role = localStorage.getItem("role") || "Viewer";
    const roleLower = role.toLowerCase();
    
    // Check if user is a lawyer (case-insensitive)
    const isLawyer = roleLower.includes("lawyer") || roleLower.includes("advocate");
    
    // Check if user is court staff
    const isCourtStaff = roleLower.includes("staff") || roleLower.includes("clerk") || roleLower.includes("registry");

    if (isLawyer) {
        return <LawyerCalendar />;
    }

    if (isCourtStaff) {
        return <CourtStaffCalendar />;
    }

    // Default view (Judge)
    return <JudgeCalendar />;
}
