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
import { Search, Plus, Edit, Trash2, TestTube, Microscope, Users, Clock, AlertCircle, CheckCircle, XCircle, Activity, FileText, TrendingUp, Calendar, DollarSign, Zap } from "lucide-react";
import { toast } from "sonner";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const mockLabData = {};
const mockLabTests = [];
const mockEquipment = [];
const mockLabStaff = [];
const mockTestResults = [];

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
    case "operational":
    case "completed":
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 inline mr-1" />Active</Badge>;
    case "maintenance":
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-4 w-4 inline mr-1" />Maintenance</Badge>;
    case "pending":
      return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-4 w-4 inline mr-1" />Pending</Badge>;
    case "inactive":
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-4 w-4 inline mr-1" />Inactive</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

const Lab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [labData, setLabData] = useState(mockLabData);
  const [labTests, setLabTests] = useState(mockLabTests);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [labStaff, setLabStaff] = useState(mockLabStaff);
  const [testResults, setTestResults] = useState(mockTestResults);
  const [labImage, setLabImage] = useState(null);
  const [testImage, setTestImage] = useState(null);

  // Stats calculations
  const totalTests = labTests.length;
  const activeTests = labTests.filter(t => t.status === 'active').length;
  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(e => e.status === 'operational').length;
  const totalStaff = labStaff.length;
  const activeStaff = labStaff.filter(s => s.status === 'active').length;
  const completedTests = testResults.filter(r => r.status === 'completed').length;
  const pendingTests = testResults.filter(r => r.status === 'pending').length;
  const totalRevenue = labTests.reduce((sum, test) => sum + test.price, 0);

  const filteredTests = labTests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = labStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = testResults.filter(result =>
    result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditLab = () => {
    setIsEditModalOpen(false);
    toast.success("Laboratory information updated successfully");
  };

  const handleAddTest = () => {
    setIsTestModalOpen(false);
    toast.success("Laboratory test added successfully");
  };

  const handleAddEquipment = () => {
    setIsEquipmentModalOpen(false);
    toast.success("Equipment added successfully");
  };

  const handleAddStaff = () => {
    setIsStaffModalOpen(false);
    toast.success("Staff member added successfully");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Laboratory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage laboratory tests, equipment, staff, and test results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <TestTube className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalTests}</div>
                  <div className="text-sm text-gray-600">Available Tests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Microscope className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{operationalEquipment}</div>
                  <div className="text-sm text-gray-600">Operational Equipment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalStaff}</div>
                  <div className="text-sm text-gray-600">Lab Staff</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">SAR {totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
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
            variant={activeTab === 'tests' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tests')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tests
          </Button>
          <Button
            variant={activeTab === 'equipment' ? 'default' : 'outline'}
            onClick={() => setActiveTab('equipment')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Equipment
          </Button>
          <Button
            variant={activeTab === 'staff' ? 'default' : 'outline'}
            onClick={() => setActiveTab('staff')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Staff
          </Button>
          <Button
            variant={activeTab === 'results' ? 'default' : 'outline'}
            onClick={() => setActiveTab('results')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Results
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Laboratory Information Card */}
            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Laboratory Information
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
                      <DialogTitle>Edit Laboratory Information</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Laboratory Name</Label>
                        <Input value={labData.name} onChange={(e) => setLabData({...labData, name: e.target.value})} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input value={labData.type} onChange={(e) => setLabData({...labData, type: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <Label>Address</Label>
                        <Input value={labData.address} onChange={(e) => setLabData({...labData, address: e.target.value})} />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input value={labData.city} onChange={(e) => setLabData({...labData, city: e.target.value})} />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input value={labData.country} onChange={(e) => setLabData({...labData, country: e.target.value})} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={labData.phone} onChange={(e) => setLabData({...labData, phone: e.target.value})} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={labData.email} onChange={(e) => setLabData({...labData, email: e.target.value})} />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input value={labData.website} onChange={(e) => setLabData({...labData, website: e.target.value})} />
                      </div>
                      <div>
                        <Label>Emergency Contact</Label>
                        <Input value={labData.emergencyContact} onChange={(e) => setLabData({...labData, emergencyContact: e.target.value})} />
                      </div>
                      <div>
                        <Label>Lab Logo / Documentation (optional)</Label>
                        <Input type="file" accept="image/*" onChange={e => setLabImage(e.target.files?.[0] || null)} />
                        {labImage && <div className="mt-2 text-xs text-gray-500">Selected: {labImage.name}</div>}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleEditLab}>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <TestTube className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">{labData.name}</div>
                        <div className="text-sm text-gray-600">{labData.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Accreditation</div>
                        <div className="text-sm text-gray-600">{labData.accreditation}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Established</div>
                        <div className="text-sm text-gray-600">{labData.established}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Contact Information</div>
                        <div className="text-sm text-gray-600">{labData.phone}</div>
                        <div className="text-sm text-gray-600">{labData.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Website</div>
                        <div className="text-sm text-gray-600">{labData.website}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-semibold">Emergency Contact</div>
                        <div className="text-sm text-gray-600">{labData.emergencyContact}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Test Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Tests</span>
                      <Badge className="bg-green-100 text-green-800">{activeTests}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tests</span>
                      <span className="font-semibold">{totalTests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Equipment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Operational</span>
                      <Badge className="bg-green-100 text-green-800">{operationalEquipment}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Equipment</span>
                      <span className="font-semibold">{totalEquipment}</span>
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
                  <CardTitle className="text-lg">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <Badge className="bg-green-100 text-green-800">{completedTests}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <Badge className="bg-blue-100 text-blue-800">{pendingTests}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Laboratory Test</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Test Name</Label>
                      <Input placeholder="Enter test name" />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hematology">Hematology</SelectItem>
                          <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                          <SelectItem value="Microbiology">Microbiology</SelectItem>
                          <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input placeholder="Enter test description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price (SAR)</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input placeholder="e.g., 2-4 hours" />
                      </div>
                    </div>
                    <div>
                      <Label>Test Documentation (optional)</Label>
                      <Input type="file" accept="image/*" onChange={e => setTestImage(e.target.files?.[0] || null)} />
                      {testImage && <div className="mt-2 text-xs text-gray-500">Selected: {testImage.name}</div>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTest}>Add Test</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Laboratory Tests ({filteredTests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price (SAR)</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-semibold">{test.name}</TableCell>
                          <TableCell>{test.category}</TableCell>
                          <TableCell>{test.price}</TableCell>
                          <TableCell>{test.duration}</TableCell>
                          <TableCell>{getStatusBadge(test.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">{test.description}</TableCell>
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

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isEquipmentModalOpen} onOpenChange={setIsEquipmentModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Equipment Name</Label>
                      <Input placeholder="Enter equipment name" />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hematology">Hematology</SelectItem>
                          <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                          <SelectItem value="Microbiology">Microbiology</SelectItem>
                          <SelectItem value="Molecular Biology">Molecular Biology</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input placeholder="Enter location" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Last Calibration</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Next Calibration</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsEquipmentModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddEquipment}>Add Equipment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  Laboratory Equipment ({filteredEquipment.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Calibration</TableHead>
                        <TableHead>Next Calibration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipment.map((eq) => (
                        <TableRow key={eq.id}>
                          <TableCell className="font-semibold">{eq.name}</TableCell>
                          <TableCell>{eq.type}</TableCell>
                          <TableCell>{getStatusBadge(eq.status)}</TableCell>
                          <TableCell>{eq.location}</TableCell>
                          <TableCell>{eq.lastCalibration}</TableCell>
                          <TableCell>{eq.nextCalibration}</TableCell>
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
                      <Label>Specialization</Label>
                      <Input placeholder="Enter specialization" />
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
                  Laboratory Staff ({filteredStaff.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Specialization</TableHead>
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
                          <TableCell>{member.specialization}</TableCell>
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

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Test Results ({filteredResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Completed Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-semibold">{result.patientName}</TableCell>
                          <TableCell>{result.testName}</TableCell>
                          <TableCell>{result.orderDate}</TableCell>
                          <TableCell>{result.completedDate || '-'}</TableCell>
                          <TableCell>{getStatusBadge(result.status)}</TableCell>
                          <TableCell>{result.result || '-'}</TableCell>
                          <TableCell>{result.technician || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
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

export default Lab; 