import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import JudgeDashboard from "./pages/dashboard/JudgeDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import CaseDetails from "./pages/dashboard/CaseDetails";
import Calendar from "./pages/dashboard/Calendar";
import Documents from "./pages/dashboard/Documents";
import Contacts from "./pages/dashboard/Contacts";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute allowedRoles={["JUDGE"]} />}>
            <Route path="/dashboard/judge" element={<JudgeDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["LAWYER"]} />}>
            <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
            <Route path="/dashboard/staff" element={<StaffDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["JUDGE", "LAWYER", "STAFF"]} />}>
             <Route path="/dashboard/cases/:id" element={<CaseDetails />} />
             <Route path="/dashboard/calendar" element={<Calendar />} />
             <Route path="/dashboard/documents" element={<Documents />} />
             <Route path="/dashboard/contacts" element={<Contacts />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
