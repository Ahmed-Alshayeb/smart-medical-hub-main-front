import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const initialPatients = [];

const genders = ["Male", "Female"];
const statuses = ["Active", "Inactive"];
const insurances = ["Medicare", "Private", "None"];

export default function ControlPatients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [form, setForm] = useState({ name: "", gender: "Male", dob: "", status: "Active", address: "", insurance: "Medicare", email: "", phone: "", image: "" });

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (editPatient) {
      setPatients(patients.map(p => p.id === editPatient.id ? { ...editPatient, ...form } : p));
    } else {
      setPatients([...patients, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditPatient(null);
    setForm({ name: "", gender: "Male", dob: "", status: "Active", address: "", insurance: "Medicare", email: "", phone: "", image: "" });
  };

  const handleEdit = (patient) => {
    setEditPatient(patient);
    setForm({ ...patient });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  return (
    <Layout>
      <div className="px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Control Patients</CardTitle>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditPatient(null); setForm({ name: "", gender: "Male", dob: "", status: "Active", address: "", insurance: "Medicare", email: "", phone: "", image: "" }); }}> <Plus className="mr-2 h-4 w-4" /> Add Patient </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editPatient ? "Edit Patient" : "Add Patient"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                    <SelectContent>{genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Date of Birth" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  <Select value={form.insurance} onValueChange={v => setForm(f => ({ ...f, insurance: v }))}>
                    <SelectTrigger><SelectValue placeholder="Insurance" /></SelectTrigger>
                    <SelectContent>{insurances.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <Input placeholder="Profile Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                  <Button className="w-full" onClick={handleSave}>{editPatient ? "Save Changes" : "Add Patient"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <Input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell><img src={patient.image} alt={patient.name} className="w-10 h-10 rounded-full object-cover border" /></TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.dob}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs font-semibold ${patient.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{patient.status}</span></TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.insurance}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(patient)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(patient.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 