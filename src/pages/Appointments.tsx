import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Calendar, User, CheckCircle, XCircle, Clock, Download, Filter, LayoutList, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const mockAppointments = [];
const uniqueDoctors = [];
const uniqueClinics = [];
const mockPatients = [];
const appointmentTypes = [];
const statusOptions = [];

function exportAppointmentsToCSV(appointments, filename = "appointments.csv") {
  if (!appointments.length) return;
  const headers = [
    "Patient",
    "Doctor",
    "Clinic",
    "Date",
    "Time",
    "Type",
    "Status",
    "Notes"
  ];
  const rows = appointments.map(app => [
    app.patientName,
    app.doctorName,
    app.clinic,
    app.date,
    app.time,
    app.type,
    app.status,
    app.notes
  ]);
  const csvContent = [headers, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}

const statusBadge = (status) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-4 w-4 inline mr-1" />Upcoming</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 inline mr-1" />Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-4 w-4 inline mr-1" />Cancelled</Badge>;
    case "Confirmed":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 inline mr-1" />Confirmed</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

const getTodayCount = (appointments) => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.filter(a => a.date === today).length;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    clinic: "",
    date: "",
    time: "",
    type: "",
    status: "upcoming",
    notes: ""
  });
  const [view, setView] = useState('list');
  const [calendarDate, setCalendarDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterClinic, setFilterClinic] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [notifyPatient, setNotifyPatient] = useState(true);
  const [notifyDoctor, setNotifyDoctor] = useState(true);

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesDoctor = !filterDoctor || app.doctorName === filterDoctor;
    const matchesClinic = !filterClinic || app.clinic === filterClinic;
    const matchesAdvStatus = !filterStatus || app.status === filterStatus;
    const matchesDateFrom = !filterDateFrom || app.date >= filterDateFrom;
    const matchesDateTo = !filterDateTo || app.date <= filterDateTo;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesDoctor &&
      matchesClinic &&
      matchesAdvStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // Stats
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === "upcoming").length;
  const completed = appointments.filter(a => a.status === "completed").length;
  const today = getTodayCount(appointments);

  // For Daily View
  const selectedDay = calendarDate || new Date().toISOString().split('T')[0];
  const dailyAppointments = appointments.filter(app => app.date === selectedDay);

  const handleAdd = () => {
    if (!formData.patientName || !formData.doctorName || !formData.clinic || !formData.date || !formData.time || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newAppointment = {
      id: `A${String(appointments.length + 1).padStart(3, '0')}`,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      clinic: formData.clinic,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: formData.status || "upcoming",
      notes: formData.notes || "-"
    };
    setAppointments([newAppointment, ...appointments]);
    setIsAddModalOpen(false);
    setFormData({ patientName: "", doctorName: "", clinic: "", date: "", time: "", type: "", status: "upcoming", notes: "" });
    toast.success("Appointment added successfully");
  };

  const handleEdit = () => {
    if (!selectedAppointment || !formData.patientName || !formData.doctorName || !formData.clinic || !formData.date || !formData.time || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    const updatedAppointments = appointments.map(app =>
      app.id === selectedAppointment.id
        ? {
            ...app,
            patientName: formData.patientName,
            doctorName: formData.doctorName,
            clinic: formData.clinic,
            date: formData.date,
            time: formData.time,
            type: formData.type,
            status: formData.status || app.status,
            notes: formData.notes || app.notes
          }
        : app
    );
    setAppointments(updatedAppointments);
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
    setFormData({ patientName: "", doctorName: "", clinic: "", date: "", time: "", type: "", status: "upcoming", notes: "" });
    toast.success("Appointment updated successfully");
  };

  const handleDelete = () => {
    if (!selectedAppointment) return;
    setAppointments(appointments.filter(app => app.id !== selectedAppointment.id));
    setIsDeleteModalOpen(false);
    setSelectedAppointment(null);
    toast.success("Appointment deleted successfully");
  };

  const openEditModal = (app) => {
    setSelectedAppointment(app);
    setFormData({
      patientName: app.patientName,
      doctorName: app.doctorName,
      clinic: app.clinic,
      date: app.date,
      time: app.time,
      type: app.type,
      status: app.status,
      notes: app.notes
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (app) => {
    setSelectedAppointment(app);
    setIsDeleteModalOpen(true);
  };

  const handleExportCSV = () => {
    exportAppointmentsToCSV(filteredAppointments);
  };

  const handleClearFilters = () => {
    setFilterDoctor("");
    setFilterClinic("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setStatusFilter("all");
    setSearchTerm("");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Add New Appointment Button */}
        <div className="flex justify-end mb-4">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Patient Name</Label>
                    <Select value={formData.patientName} onValueChange={val => {
                      setFormData({ ...formData, patientName: val });
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select a patient" /></SelectTrigger>
                      <SelectContent>
                        {mockPatients.map(p => (
                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Doctor</Label>
                    <Select value={formData.doctorName} onValueChange={val => setFormData({ ...formData, doctorName: val })}>
                      <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                      <SelectContent>
                        {uniqueDoctors.map(doc => (
                          <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Clinic</Label>
                    <Select value={formData.clinic} onValueChange={val => setFormData({ ...formData, clinic: val })}>
                      <SelectTrigger><SelectValue placeholder="Select a clinic" /></SelectTrigger>
                      <SelectContent>
                        {uniqueClinics.map(clinic => (
                          <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                  <div>
                    <Label>Appointment Type</Label>
                    <Select value={formData.type} onValueChange={val => setFormData({ ...formData, type: val })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as "upcoming" | "completed" | "cancelled" })}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Notes</Label>
                    <textarea
                      className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Add any additional notes or instructions..."
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-6 mt-2">
                    <Label className="font-semibold">Notifications</Label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={notifyPatient} onChange={e => setNotifyPatient(e.target.checked)} /> Notify Patient
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={notifyDoctor} onChange={e => setNotifyDoctor(e.target.checked)} /> Notify Doctor
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 text-white font-semibold">Schedule</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Stats Cards */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <Card className="flex flex-row items-center gap-4 p-4 shadow-md bg-white/90 dark:bg-gray-900/90">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{total}</div>
                <div className="text-gray-600 text-sm">Total Appointments</div>
              </div>
            </Card>
            <Card className="flex flex-row items-center gap-4 p-4 shadow-md bg-white/90 dark:bg-gray-900/90">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{scheduled}</div>
                <div className="text-gray-600 text-sm">Scheduled Appointments</div>
              </div>
            </Card>
            <Card className="flex flex-row items-center gap-4 p-4 shadow-md bg-white/90 dark:bg-gray-900/90">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                <LayoutList className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{completed}</div>
                <div className="text-gray-600 text-sm">Completed Appointments</div>
              </div>
            </Card>
            <Card className="flex flex-row items-center gap-4 p-4 shadow-md bg-white/90 dark:bg-gray-900/90">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <CalendarDays className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{today}</div>
                <div className="text-gray-600 text-sm">Today's Appointments</div>
              </div>
            </Card>
          </div>
        </div>
        {/* Search, Filters, Export, and View Tabs */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Doctor</Label>
                  <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                    <SelectTrigger><SelectValue placeholder="All Doctors" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Doctors</SelectItem>
                      {uniqueDoctors.map(doc => (
                        <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Clinic</Label>
                  <Select value={filterClinic} onValueChange={setFilterClinic}>
                    <SelectTrigger><SelectValue placeholder="All Clinics" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Clinics</SelectItem>
                      {uniqueClinics.map(clinic => (
                        <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>Date From</Label>
                    <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <Label>Date To</Label>
                    <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                  <Button onClick={() => setIsFilterModalOpen(false)}>Apply</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
        {/* View Tabs */}
        <div className="flex gap-2 mb-4">
          <Button className={view === 'list' ? "bg-green-600 text-white font-semibold px-4 py-2 rounded-md" : "bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-md"} variant={view === 'list' ? "default" : "outline"} onClick={() => setView('list')}>
            List View
          </Button>
          <Button className={view === 'calendar' ? "bg-green-600 text-white font-semibold px-4 py-2 rounded-md" : "bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-md"} variant={view === 'calendar' ? "default" : "outline"} onClick={() => setView('calendar')}>
            Calendar View
          </Button>
          <Button className={view === 'daily' ? "bg-green-600 text-white font-semibold px-4 py-2 rounded-md" : "bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-md"} variant={view === 'daily' ? "default" : "outline"} onClick={() => setView('daily')}>
            Daily View
          </Button>
        </div>
        {/* View Content */}
        {view === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointments ({filteredAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>{app.patientName}</TableCell>
                        <TableCell>{app.doctorName}</TableCell>
                        <TableCell>{app.clinic}</TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{app.time}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{statusBadge(app.status)}</TableCell>
                        <TableCell>{app.notes}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(app)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteModal(app)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        {view === 'calendar' && (
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Select a date to view appointments</h2>
            <input type="date" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} className="border rounded px-3 py-2" />
            <div className="mt-6 w-full">
              <h3 className="font-semibold mb-2">Appointments on {calendarDate || '...'}</h3>
              <ul className="space-y-2">
                {appointments.filter(app => app.date === calendarDate).length === 0 && <li className="text-gray-500">No appointments for this date.</li>}
                {appointments.filter(app => app.date === calendarDate).map(app => (
                  <li key={app.id} className="p-3 rounded bg-blue-50 flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="font-semibold">{app.patientName}</span>
                    <span className="text-gray-500">{app.time}</span>
                    <span className="text-gray-500">{app.type}</span>
                    <span>{statusBadge(app.status)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        )}
        {view === 'daily' && (
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Select a day to view agenda</h2>
            <input type="date" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} className="border rounded px-3 py-2" />
            <div className="mt-6 w-full">
              <h3 className="font-semibold mb-2">Agenda for {selectedDay}</h3>
              <ul className="space-y-2">
                {dailyAppointments.length === 0 && <li className="text-gray-500">No appointments for this day.</li>}
                {dailyAppointments.map(app => (
                  <li key={app.id} className="p-3 rounded bg-green-50 flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="font-semibold">{app.patientName}</span>
                    <span className="text-gray-500">{app.time}</span>
                    <span className="text-gray-500">{app.type}</span>
                    <span>{statusBadge(app.status)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-patientName">Patient Name *</Label>
                <Input id="edit-patientName" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="Enter patient name" />
              </div>
              <div>
                <Label htmlFor="edit-doctorName">Doctor Name *</Label>
                <Input id="edit-doctorName" value={formData.doctorName} onChange={e => setFormData({ ...formData, doctorName: e.target.value })} placeholder="Enter doctor name" />
              </div>
              <div>
                <Label htmlFor="edit-clinic">Clinic *</Label>
                <Input id="edit-clinic" value={formData.clinic} onChange={e => setFormData({ ...formData, clinic: e.target.value })} placeholder="Enter clinic" />
              </div>
              <div>
                <Label htmlFor="edit-date">Date *</Label>
                <Input id="edit-date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-time">Time *</Label>
                <Input id="edit-time" type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-type">Type *</Label>
                <Input id="edit-type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="Enter appointment type" />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as "upcoming" | "completed" | "cancelled" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input id="edit-notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Enter notes (optional)" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Update Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Appointment</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete the appointment for <strong>{selectedAppointment?.patientName}</strong>?</p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appointments; 