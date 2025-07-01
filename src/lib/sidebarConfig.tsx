import {
  BarChart2,
  Users,
  Hospital,
  FlaskConical,
  DollarSign,
  User,
  FileText,
  Calendar,
  Settings,
  UserCog,
  ClipboardList,
  UserCheck,
  UserPlus,
  ActivitySquare,
  MessageSquare
} from "lucide-react";

// Sidebar navigation groups and links configuration
const sidebarGroups = [
  {
    label: "General",
    links: [
      { label: "Dashboard", icon: <Settings className="h-5 w-5" />, path: "/dashboard", control: null, requireAuth: true },
    ],
  },
  {
    label: "Management",
    links: [
      { label: "User Management", icon: <UserCog className="h-5 w-5" />, path: "/users", control: null, requireAdmin: true },
      { label: "Moderators", icon: <UserCheck className="h-5 w-5" />, path: "/moderators", control: null, requireAdmin: true },
    ],
  },
  {
    label: "Medical",
    links: [
      { label: "Medical Records", icon: <FileText className="h-5 w-5" />, path: "/records", control: "medical_records", requireAuth: true },
      { label: "Appointments", icon: <Calendar className="h-5 w-5" />, path: "/appointments", control: "appointments", requireAuth: true },
      { label: "Hospital", icon: <Hospital className="h-5 w-5" />, path: "/hospital", control: "hospital", requireAuth: true },
      { label: "Lab", icon: <FlaskConical className="h-5 w-5" />, path: "/lab", control: "lab", requireAuth: true },
    ],
  },
  {
    label: "Analytics & AI",
    links: [
      { label: "Analytics", icon: <BarChart2 className="h-5 w-5" />, path: "/analytics", control: null, requireAuth: true },
      { label: "AI Chat", icon: <MessageSquare className="h-5 w-5" />, path: "/chat", control: "aiChat", requireAuth: true },
    ],
  },
  {
    label: "Control Panel",
    links: [
      { label: "Control Doctors", icon: <UserPlus className="h-5 w-5" />, path: "/control-doctors", control: "control_doctors", requireAdmin: true },
      { label: "Control Patients", icon: <Users className="h-5 w-5" />, path: "/control-patients", control: "control_patients", requireAdmin: true },
      { label: "Control Pharmacy", icon: <UserPlus className="h-5 w-5" />, path: "/control-pharmacy", control: "control_pharmacy", requireAdmin: true },
    ],
  },
  {
    label: "Settings",
    links: [
      { label: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings", control: null, requireAuth: true },
      { label: "Help", icon: <ActivitySquare className="h-5 w-5" />, path: "/help", control: null, requireAuth: true },
    ],
  },
];

export default sidebarGroups; 