import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Doctors from "./pages/Doctors";
import Hospitals from "./pages/Hospitals";
import Pharmacy from "./pages/Pharmacy";
import Labs from "./pages/Labs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AiAnalysis from "./pages/AiAnalysis";
import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Moderators from "./pages/Moderators";
import MedicalRecords from "./pages/MedicalRecords";
import Appointments from "./pages/Appointments";
import Hospital from "./pages/Hospital";
import Lab from "./pages/Lab";
import AiChat from "./pages/AiChat";
import Analytics from "./pages/Analytics";
import Patients from "./pages/Patients";
import ControlDoctors from "@/pages/ControlDoctors";
import ControlPatients from "@/pages/ControlPatients";
import ControlPharmacy from "@/pages/ControlPharmacy";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Unauthorized from "@/pages/Unauthorized";
import Clinics from "./pages/Clinics";
import Notifications from "./pages/Notifications";
import Telemedicine from "./pages/Telemedicine";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/ai-analysis" element={<AiAnalysis />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/records" element={
              <ProtectedRoute requireAuth={true} requiredPermission="medical_records">
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute requireAuth={true} requiredPermission="appointments">
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/hospital" element={
              <ProtectedRoute requireAuth={true} requiredPermission="hospital">
                <Hospital />
              </ProtectedRoute>
            } />
            <Route path="/lab" element={
              <ProtectedRoute requireAuth={true} requiredPermission="lab">
                <Lab />
              </ProtectedRoute>
            } />
            <Route path="/ai-chat" element={
              <ProtectedRoute requireAuth={true} requiredPermission="aiChat">
                <AiChat />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute requireAuth={true} requiredPermission="aiChat">
                <AiChat />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requireAuth={true} requiredPermission="analytics">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute requireAuth={true} requiredPermission="patients">
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireAuth={true}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute requireAuth={true}>
                <Help />
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/users" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/moderators" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <Moderators />
              </ProtectedRoute>
            } />
            <Route path="/control-doctors" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <ControlDoctors />
              </ProtectedRoute>
            } />
            <Route path="/control-patients" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <ControlPatients />
              </ProtectedRoute>
            } />
            <Route path="/control-pharmacy" element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <ControlPharmacy />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
