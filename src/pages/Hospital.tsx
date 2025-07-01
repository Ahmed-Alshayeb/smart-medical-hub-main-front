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
import { Search, Plus, Edit, Trash2, Building2, Users, Stethoscope, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle, XCircle, Activity, Bed, Car, Wifi, Shield } from "lucide-react";
import { toast } from "sonner";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const mockHospitalData = {};
const mockDepartments = [];
const mockStaff = [];
const mockFacilities = [];

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
    case "operational":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 inline mr-1" />Active</Badge>;
    case "maintenance":
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-4 w-4 inline mr-1" />Maintenance</Badge>;
    case "inactive":
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-4 w-4 inline mr-1" />Inactive</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

const Hospital = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hospitalData, setHospitalData] = useState(mockHospitalData);
  const [departments, setDepartments] = useState(mockDepartments);
  const [staff, setStaff] = useState(mockStaff);
  const [facilities, setFacilities] = useState(mockFacilities);
  const [hospitalImage, setHospitalImage] = useState(null);
  const [departmentImage, setDepartmentImage] = useState(null);

  // Stats calculations
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === 'active').length;
  const totalBeds = departments.reduce((sum, dept) => sum + dept.beds, 0);
  const operationalFacilities = facilities.filter(f => f.status === 'operational').length;

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staff.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditHospital = () => {
    setIsEditModalOpen(false);
    toast.success("Hospital information updated successfully");
  };

  const handleAddDepartment = () => {
    setIsDepartmentModalOpen(false);
    toast.success("Department added successfully");
  };

  const handleAddStaff = () => {
    setIsStaffModalOpen(false);
    toast.success("Staff member added successfully");
  };

  const handleAddFacility = () => {
    setIsFacilityModalOpen(false);
    toast.success("Facility added successfully");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hospital Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage hospital information, departments, staff, and facilities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalDepartments}</div>
                  <div className="text-sm text-gray-600">Departments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalStaff}</div>
                  <div className="text-sm text-gray-600">Staff Members</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                  <Bed className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalBeds}</div>
                  <div className="text-sm text-gray-600">Total Beds</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{operationalFacilities}</div>
                  <div className="text-sm text-gray-600">Operational</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{hospitalData.capacity}</div>
                  <div className="text-sm text-gray-600">Capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'departments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('departments')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Departments
          </Button>
          <Button
            variant={activeTab === 'staff' ? 'default' : 'outline'}
            onClick={() => setActiveTab('staff')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Staff
          </Button>
          <Button
            variant={activeTab === 'facilities' ? 'default' : 'outline'}
            onClick={() => setActiveTab('facilities')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Facilities
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hospital Information Card */}
            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Information
                </CardTitle>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Hospital Information</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Hospital Name</Label>
                        <Input value={hospitalData.name} onChange={(e) => setHospitalData({...hospitalData, name: e.target.value})} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input value={hospitalData.type} onChange={(e) => setHospitalData({...hospitalData, type: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <Label>Address</Label>
                        <Input value={hospitalData.address} onChange={(e) => setHospitalData({...hospitalData, address: e.target.value})} />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input value={hospitalData.city} onChange={(e) => setHospitalData({...hospitalData, city: e.target.value})} />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input value={hospitalData.country} onChange={(e) => setHospitalData({...hospitalData, country: e.target.value})} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={hospitalData.phone} onChange={(e) => setHospitalData({...hospitalData, phone: e.target.value})} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={hospitalData.email} onChange={(e) => setHospitalData({...hospitalData, email: e.target.value})} />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input value={hospitalData.website} onChange={(e) => setHospitalData({...hospitalData, website: e.target.value})} />
                      </div>
                      <div>
                        <Label>Emergency Contact</Label>
                        <Input value={hospitalData.emergencyContact} onChange={(e) => setHospitalData({...hospitalData, emergencyContact: e.target.value})} />
                      </div>
                      <div>
                        <Label>Hospital Logo / Documentation (optional)</Label>
                        <Input type="file" accept="image/*" onChange={e => setHospitalImage(e.target.files?.[0] || null)} />
                        {hospitalImage && <div className="mt-2 text-xs text-gray-500">Selected: {hospitalImage.name}</div>}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleEditHospital}>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">{hospitalData.name}</div>
                        <div className="text-sm text-gray-600">{hospitalData.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Address</div>
                        <div className="text-sm text-gray-600">{hospitalData.address}</div>
                        <div className="text-sm text-gray-600">{hospitalData.city}, {hospitalData.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Contact</div>
                        <div className="text-sm text-gray-600">{hospitalData.phone}</div>
                        <div className="text-sm text-gray-600">Emergency: {hospitalData.emergencyContact}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Email & Website</div>
                        <div className="text-sm text-gray-600">{hospitalData.email}</div>
                        <div className="text-sm text-gray-600">{hospitalData.website}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Established</div>
                        <div className="text-sm text-gray-600">{hospitalData.established}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">License</div>
                        <div className="text-sm text-gray-600">{hospitalData.license}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Department Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Departments</span>
                      <Badge className="bg-green-100 text-green-800">{activeDepartments}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Departments</span>
                      <span className="font-semibold">{totalDepartments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Staff Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Staff</span>
                      <Badge className="bg-green-100 text-green-800">{activeStaff}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Staff</span>
                      <span className="font-semibold">{totalStaff}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Facility Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Operational</span>
                      <Badge className="bg-green-100 text-green-800">{operationalFacilities}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Facilities</span>
                      <span className="font-semibold">{facilities.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDepartmentModalOpen} onOpenChange={setIsDepartmentModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Department Name</Label>
                      <Input placeholder="Enter department name" />
                    </div>
                    <div>
                      <Label>Department Head</Label>
                      <Input placeholder="Enter department head" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input placeholder="Enter description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Staff Count</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label>Bed Count</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                    <div>
                      <Label>Department Documentation (optional)</Label>
                      <Input type="file" accept="image/*" onChange={e => setDepartmentImage(e.target.files?.[0] || null)} />
                      {departmentImage && <div className="mt-2 text-xs text-gray-500">Selected: {departmentImage.name}</div>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDepartmentModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddDepartment}>Add Department</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Departments ({filteredDepartments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Head</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Beds</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDepartments.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell className="font-semibold">{dept.name}</TableCell>
                          <TableCell>{dept.head}</TableCell>
                          <TableCell>{dept.staff}</TableCell>
                          <TableCell>{dept.beds}</TableCell>
                          <TableCell>{getStatusBadge(dept.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{dept.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input placeholder="Enter position" />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="Enter email" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsStaffModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddStaff}>Add Staff</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Members ({filteredStaff.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-semibold">{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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
          </div>
        )}

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isFacilityModalOpen} onOpenChange={setIsFacilityModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Facility</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Facility Name</Label>
                      <Input placeholder="Enter facility name" />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="Surgical">Surgical</SelectItem>
                          <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                          <SelectItem value="Critical Care">Critical Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input type="number" placeholder="Enter capacity" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Last Maintenance</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Next Maintenance</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsFacilityModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddFacility}>Add Facility</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Facilities ({filteredFacilities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Facility</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Next Maintenance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFacilities.map((facility) => (
                        <TableRow key={facility.id}>
                          <TableCell className="font-semibold">{facility.name}</TableCell>
                          <TableCell>{facility.type}</TableCell>
                          <TableCell>{getStatusBadge(facility.status)}</TableCell>
                          <TableCell>{facility.capacity}</TableCell>
                          <TableCell>{facility.lastMaintenance}</TableCell>
                          <TableCell>{facility.nextMaintenance}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Hospital; 