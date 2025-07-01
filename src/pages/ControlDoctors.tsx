import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Users,
  Stethoscope,
  Building2
} from "lucide-react";
import Layout from "@/components/Layout";
import PageLayout, { StatsSection, TableSection, FormSection } from "@/components/PageLayout";

// Mock data
const doctors = [];

const stats = [
  { label: "Total Doctors", value: doctors.length, icon: <User className="h-6 w-6 text-blue-600" />, color: "text-blue-600" },
  { label: "Active Doctors", value: doctors.filter(d => d.status === "active").length, icon: <Users className="h-6 w-6 text-green-600" />, color: "text-green-600" },
  { label: "Average Rating", value: "4.8", icon: <Star className="h-6 w-6 text-yellow-600" />, color: "text-yellow-600", unit: "★" },
  { label: "Total Patients", value: doctors.reduce((sum, d) => sum + d.patients, 0), icon: <Stethoscope className="h-6 w-6 text-purple-600" />, color: "text-purple-600" }
];

const specializations = [
  "Cardiology", "Pediatrics", "Orthopedics", "Neurology", "Dermatology", 
  "Ophthalmology", "Dentistry", "Psychiatry", "Surgery", "Internal Medicine"
];

const departments = [
  "Heart Center", "Children's Hospital", "Bone & Joint Center", "Neurology Center",
  "Dermatology Clinic", "Eye Center", "Dental Clinic", "Mental Health Center"
];

const ControlDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    department: "",
    experience: "",
    gender: "Male",
    education: "",
    languages: [],
    consultationFee: "",
    hospital: ""
  });

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;
      const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
      const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesSpecialization && matchesDepartment;
    });
  }, [searchTerm, statusFilter, specializationFilter, departmentFilter]);

  const handleAddDoctor = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      department: "",
      experience: "",
      gender: "Male",
      education: "",
      languages: [],
      consultationFee: "",
      hospital: ""
    });
    setIsAddModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      department: doctor.department,
      experience: doctor.experience,
      gender: doctor.gender,
      education: doctor.education,
      languages: doctor.languages,
      consultationFee: doctor.consultationFee.toString(),
      hospital: doctor.hospital
    });
    setIsEditModalOpen(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleDeleteDoctor = (doctorId) => {
    // Handle delete logic
    console.log("Deleting doctor:", doctorId);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleRefresh = () => {
    // Refresh data
    console.log("Refreshing doctors data...");
  };

  const handleExport = () => {
    // Export data
    console.log("Exporting doctors data...");
  };

  const sections = [
    {
      id: "stats",
      title: "Doctors Statistics",
      visible: true,
      component: <StatsSection stats={stats} columns={4} />
    },
    {
      id: "doctors-table",
      title: "Doctors Management",
      visible: true,
      component: (
        <TableSection 
          title="Doctors List"
          actions={
            <Button onClick={handleAddDoctor} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-gray-500">{doctor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.department}</TableCell>
                      <TableCell>{doctor.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                          {doctor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDoctor(doctor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TableSection>
      )
    }
  ];

  return (
    <Layout>
      <PageLayout
        title="Control Doctors"
        subtitle="Manage doctors and their information"
        sections={sections}
        showSearch={true}
        showFilters={true}
        showActions={true}
        searchPlaceholder="Search doctors..."
        onSearch={setSearchTerm}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Add Doctor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>
          <FormSection title="Doctor Information" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Experience (e.g., 15 years)"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
              <Input
                placeholder="Education"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
              <Input
                placeholder="Consultation Fee"
                type="number"
                value={formData.consultationFee}
                onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
              />
              <Input
                placeholder="Hospital"
                value={formData.hospital}
                onChange={(e) => setFormData({...formData, hospital: e.target.value})}
              />
            </div>
          </FormSection>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          <FormSection title="Update Doctor Information" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Experience (e.g., 15 years)"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
              <Input
                placeholder="Education"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              />
              <Input
                placeholder="Consultation Fee"
                type="number"
                value={formData.consultationFee}
                onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
              />
              <Input
                placeholder="Hospital"
                value={formData.hospital}
                onChange={(e) => setFormData({...formData, hospital: e.target.value})}
              />
            </div>
          </FormSection>
        </DialogContent>
      </Dialog>

      {/* View Doctor Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedDoctor.avatar} />
                  <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                  <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  <Badge variant={selectedDoctor.status === "active" ? "default" : "secondary"}>
                    {selectedDoctor.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{selectedDoctor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedDoctor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{selectedDoctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {selectedDoctor.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{selectedDoctor.patients} patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{selectedDoctor.rating} rating</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Education</h4>
                <p className="text-gray-600">{selectedDoctor.education}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Languages</h4>
                <div className="flex gap-2">
                  {selectedDoctor.languages.map(lang => (
                    <Badge key={lang} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ControlDoctors; 