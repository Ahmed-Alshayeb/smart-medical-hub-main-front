import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search, Edit, FileText, MessageCircle, Filter, SortAsc, SortDesc, Plus, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const patients = [];
const stats = [];

// Dummy translation function for i18n
const t = (s: string) => s;

const sortOptions = [
  { value: "name", label: t("Name") },
  { value: "age", label: t("Age") },
  { value: "status", label: t("Status") },
];

const statusFilters = [
  { value: "all", label: t("All") },
  { value: "active", label: t("Active") },
  { value: "inactive", label: t("Inactive") },
  { value: "critical", label: t("Critical") },
];

// Default role: admin (full access)
const DEFAULT_ROLE = "admin"; // or "doctor"

const Patients = () => {
  const [role] = useState(DEFAULT_ROLE); // Simulate role
  const [patientsList, setPatientsList] = useState([]);
  const [selected, setSelected] = useState(patientsList[0]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false); // Simulate loading
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    fileNumber: "",
    age: "",
    gender: "Male",
    bloodType: "O+",
    status: "active",
    contact: { email: "", phone: "", address: "" },
    medical: { doctor: "", insurance: "", insuranceNumber: "", history: "" },
    emergency: { name: "", relationship: "", phone: "" },
    chronic: [],
  });

  // Simulate loading state
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let list = patientsList.filter((p) =>
      (statusFilter === "all" || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.fileNumber.toLowerCase().includes(search.toLowerCase()))
    );
    list = list.sort((a, b) => {
      if (sortBy === "name") {
        return sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "age") {
        return sortDir === "asc" ? a.age - b.age : b.age - a.age;
      } else if (sortBy === "status") {
        return sortDir === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
    return list;
  }, [search, sortBy, sortDir, statusFilter, patientsList]);

  // Helper for avatar fallback (initials)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Status badge color
  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Accessibility: skip to content
  // (Add a skip link for screen readers)
  // ...

  // Add Patient
  const openAddModal = () => {
    setForm({
      name: "",
      fileNumber: `P-${String(patientsList.length + 1).padStart(3, "0")}`,
      age: "",
      gender: "Male",
      bloodType: "O+",
      status: "active",
      contact: { email: "", phone: "", address: "" },
      medical: { doctor: "", insurance: "", insuranceNumber: "", history: "" },
      emergency: { name: "", relationship: "", phone: "" },
      chronic: [],
      id: Math.max(0, ...patientsList.map(p => p.id)) + 1,
    });
    setEditMode(false);
    setModalOpen(true);
  };
  // Edit Patient
  const openEditModal = () => {
    setForm({ ...selected, age: String(selected.age) });
    setEditMode(true);
    setModalOpen(true);
  };
  // Save Patient (add or edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setPatientsList((prev) => prev.map((p) => (p.fileNumber === form.fileNumber ? { ...form, age: Number(form.age), id: p.id } : p)));
      setSelected({ ...form, age: Number(form.age) });
    } else {
      setPatientsList((prev) => [...prev, { ...form, age: Number(form.age) }]);
    }
    setModalOpen(false);
  };
  // Export to CSV
  const exportCSV = () => {
    const header = [
      "File Number", "Name", "Age", "Gender", "Blood Type", "Status", "Email", "Phone", "Address", "Doctor", "Insurance", "Insurance Number", "History", "Emergency Name", "Emergency Relationship", "Emergency Phone"
    ];
    const rows = patientsList.map((p) => [
      p.fileNumber, p.name, p.age, p.gender, p.bloodType, p.status, p.contact.email, p.contact.phone, p.contact.address, p.medical.doctor, p.medical.insurance, p.medical.insuranceNumber, p.medical.history, p.emergency.name, p.emergency.relationship, p.emergency.phone
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only">{t("Skip to main content")}</a>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Actions: New Patient & Export */}
        <div className="flex flex-wrap gap-2 mb-6 justify-end">
          {role === "admin" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={openAddModal} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-md hover:from-blue-700 hover:to-purple-700 transition-all" aria-label={t("Add New Patient")}>
                  <Plus className="h-4 w-4" /> {t("New Patient")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("Add New Patient")}</TooltipContent>
            </Tooltip>
          )}
          {role === "admin" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2" aria-label={t("Export to CSV")}> 
                  <Download className="h-4 w-4" /> {t("Export")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("Export to CSV")}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map(stat => (
            <Card key={stat.label} className="flex flex-col items-center p-4 shadow-md bg-white/90 dark:bg-gray-900/90 animate-fade-in">
              <div className="text-2xl font-bold">{stat.value} {stat.unit || ''}</div>
              <div className="text-gray-600 text-sm">{t(stat.label)}</div>
            </Card>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-8" id="main-content">
          {/* Patients List */}
          <div className="w-full md:w-1/3">
            <Card className="mb-4 animate-fade-in-up">
              <CardHeader>
                <CardTitle>{t("Patients")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("Search by name or file number...")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label={t("Search patients")}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
                  />
                  <Button variant="ghost" size="icon" aria-label={t("Filter by status")}
                    className="ml-2"
                    tabIndex={0}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue>{t(statusFilters.find(f => f.value === statusFilter)?.label || "All")}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusFilters.map(f => (
                        <SelectItem key={f.value} value={f.value}>{t(f.label)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" aria-label={t("Sort direction")}
                    onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                  >
                    {sortDir === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-24">
                      <SelectValue>{t(sortOptions.find(o => o.value === sortBy)?.label || "Name")}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{t(o.label)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-2 text-xs text-gray-500">
                  {t("Results")}: {filteredPatients.length}
                </div>
                <ul className="divide-y max-h-96 overflow-y-auto" aria-label={t("Patient list")}> 
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="py-3 px-2 flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-5 w-12 rounded" />
                      </li>
                    ))
                  ) : filteredPatients.length === 0 ? (
                    <li className="py-8 text-center text-gray-400 animate-fade-in">
                      <span role="img" aria-label="No results" className="text-3xl mb-2">🔍</span>
                      <div>{t("No patients found.")}</div>
                    </li>
                  ) : (
                    filteredPatients.map(p => (
                      <li
                        key={p.id}
                        className={`py-3 px-2 cursor-pointer rounded flex items-center gap-3 transition-colors duration-150 ${selected.id === p.id ? 'bg-blue-100 dark:bg-blue-900 font-bold' : 'hover:bg-blue-50 dark:hover:bg-blue-800'}`}
                        onClick={() => { setSelected(p); setDrawerOpen(true); }}
                        tabIndex={0}
                        aria-label={t(`Select patient ${p.name}`)}
                        onKeyDown={e => (e.key === "Enter" || e.key === " ") && (setSelected(p), setDrawerOpen(true))}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{p.name}</span>
                            <Badge variant="outline" className="ml-1 text-xs">{p.fileNumber}</Badge>
                          </div>
                          <div className="text-xs text-gray-500 truncate">{p.contact.email}</div>
                        </div>
                        <Badge className={`ml-2 ${statusColor(p.status)}`}>{t(p.status)}</Badge>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
          {/* Patient Details Drawer/Sheet */}
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="right" className="max-w-lg w-full animate-slide-in">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{getInitials(selected.name)}</AvatarFallback>
                  </Avatar>
                  <span>{selected.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{selected.fileNumber}</Badge>
                  <Badge variant="secondary" className="ml-2 text-xs">{selected.bloodType}</Badge>
                  <Badge className={`ml-2 ${statusColor(selected.status)}`}>{t(selected.status)}</Badge>
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500 mt-1">
                  {t("Age")}: {selected.age} | {t("Gender")}: {t(selected.gender)}
                </SheetDescription>
                <div className="flex gap-2 mt-2">
                  {(role === "admin" || role === "doctor") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" aria-label={t("Edit patient")} className="hover:bg-blue-100 dark:hover:bg-blue-900" onClick={openEditModal}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Edit Patient")}</TooltipContent>
                    </Tooltip>
                  )}
                  <Button size="icon" variant="outline" aria-label={t("View medical records")} className="hover:bg-blue-100 dark:hover:bg-blue-900">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" aria-label={t("Message patient")} className="hover:bg-blue-100 dark:hover:bg-blue-900">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>
              <Separator className="my-2" />
              <div className="mb-6">
                <h4 className="font-semibold mb-1 flex items-center gap-2">{t("Contact Information")}</h4>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Email")}: {selected.contact.email}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Phone")}: {selected.contact.phone}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Address")}: {selected.contact.address}</div>
              </div>
              <Separator className="my-4" />
              <div className="mb-6">
                <h4 className="font-semibold mb-1 flex items-center gap-2">{t("Medical Information")}</h4>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Assigned Doctor")}: {selected.medical.doctor}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Insurance Provider")}: {selected.medical.insurance}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Insurance Number")}: {selected.medical.insuranceNumber}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Medical History")}: {selected.medical.history}</div>
              </div>
              <Separator className="my-4" />
              <div className="mb-6">
                <h4 className="font-semibold mb-1 flex items-center gap-2">{t("Emergency Contact")} <Badge variant="destructive" className="ml-2 text-xs">{t("Important")}</Badge></h4>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Name")}: {selected.emergency.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Relationship")}: {selected.emergency.relationship}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t("Phone")}: {selected.emergency.phone}</div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2">{t("Chronic Conditions")}</h4>
                <ul className="list-disc ml-6">
                  {selected.chronic.map((c, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{t(c.name)} ({t("Since")}: {c.since}, {t("Severity")}: {t(c.severity)})</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Add/Edit Patient Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative animate-fade-in-up">
              <button onClick={() => setModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" aria-label={t("Close")}>×</button>
              <h2 className="text-xl font-bold mb-4">{editMode ? t("Edit Patient") : t("Add New Patient")}</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">{t("Name")}</label>
                  <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("File Number")}</label>
                  <input name="fileNumber" value={form.fileNumber} onChange={e => setForm({ ...form, fileNumber: e.target.value })} required className="w-full border rounded px-3 py-2" disabled={editMode} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">{t("Age")}</label>
                    <input name="age" type="number" min="0" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">{t("Gender")}</label>
                    <select name="gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border rounded px-3 py-2">
                      <option value="Male">{t("Male")}</option>
                      <option value="Female">{t("Female")}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">{t("Blood Type")}</label>
                    <input name="bloodType" value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Status")}</label>
                  <select name="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2">
                    <option value="active">{t("Active")}</option>
                    <option value="inactive">{t("Inactive")}</option>
                    <option value="critical">{t("Critical")}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Email")}</label>
                  <input name="email" type="email" value={form.contact.email} onChange={e => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Phone")}</label>
                  <input name="phone" value={form.contact.phone} onChange={e => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Address")}</label>
                  <input name="address" value={form.contact.address} onChange={e => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Assigned Doctor")}</label>
                  <input name="doctor" value={form.medical.doctor} onChange={e => setForm({ ...form, medical: { ...form.medical, doctor: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Insurance Provider")}</label>
                  <input name="insurance" value={form.medical.insurance} onChange={e => setForm({ ...form, medical: { ...form.medical, insurance: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Insurance Number")}</label>
                  <input name="insuranceNumber" value={form.medical.insuranceNumber} onChange={e => setForm({ ...form, medical: { ...form.medical, insuranceNumber: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Medical History")}</label>
                  <input name="history" value={form.medical.history} onChange={e => setForm({ ...form, medical: { ...form.medical, history: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Emergency Name")}</label>
                  <input name="emergencyName" value={form.emergency.name} onChange={e => setForm({ ...form, emergency: { ...form.emergency, name: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Emergency Relationship")}</label>
                  <input name="emergencyRelationship" value={form.emergency.relationship} onChange={e => setForm({ ...form, emergency: { ...form.emergency, relationship: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">{t("Emergency Phone")}</label>
                  <input name="emergencyPhone" value={form.emergency.phone} onChange={e => setForm({ ...form, emergency: { ...form.emergency, phone: e.target.value } })} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t("Cancel")}</Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">{editMode ? t("Save Changes") : t("Add Patient")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients; 