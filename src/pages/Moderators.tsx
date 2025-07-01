import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus, X, Eye, AlertTriangle, CheckCircle2 } from "lucide-react";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

type Moderator = {
  name: string;
  email: string;
  role: string;
  status: string;
  created: string;
  lastLogin: string;
  permissions: string[];
  activities: string[];
};

type ModeratorForm = {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  permissions: string[];
  activities: string[];
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  permissions?: string;
};

const roles = [
  "System Admin",
  "Medical Admin",
  "Pharmacy Admin",
  "Lab Admin",
  "Records Admin",
  "Appointments Admin",
  "Support Admin"
];
const statuses = ["Active", "Suspended"];
const allPermissions = [
  "Dashboard",
  "Moderators",
  "Users",
  "Doctors",
  "Patients",
  "Medical Records",
  "Appointments",
  "Hospital",
  "Pharmacy",
  "Lab",
  "Analytics",
  "Settings"
];

const initialModerators = [];

const Moderators = () => {
  const [moderators, setModerators] = useState<Moderator[]>(initialModerators);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPermsIdx, setViewPermsIdx] = useState<number | null>(null);
  const [viewActsIdx, setViewActsIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<ModeratorForm>({
    name: "",
    email: "",
    password: "",
    role: roles[0],
    status: statuses[0],
    permissions: allPermissions,
    activities: []
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const openAddModal = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: roles[0],
      status: statuses[0],
      permissions: allPermissions,
      activities: []
    });
    setEditIdx(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    const m = moderators[idx];
    setForm({
      name: m.name,
      email: m.email,
      password: "",
      role: m.role,
      status: m.status,
      permissions: m.permissions,
      activities: m.activities || []
    });
    setEditIdx(idx);
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditIdx(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePermChange = (perm: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email format.";
    if (editIdx === null && !form.password?.trim()) errs.password = "Password is required.";
    if (!form.role) errs.role = "Role is required.";
    if (!form.status) errs.status = "Status is required.";
    if (!form.permissions.length) errs.permissions = "At least one permission is required.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (editIdx !== null) {
      // Edit moderator
      const updated = [...moderators];
      updated[editIdx] = {
        ...updated[editIdx],
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        permissions: form.permissions
      };
      setModerators(updated);
    } else {
      // Add moderator
      setModerators([
        ...moderators,
        {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          created: new Date().toISOString().slice(0, 10),
          lastLogin: "-",
          permissions: form.permissions,
          activities: []
        }
      ]);
    }
    closeModal();
  };

  const handleDelete = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this moderator?")) {
      setModerators(moderators.filter((_, i) => i !== idx));
    }
  };

  // Filtering
  const filtered = moderators.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? m.status === filterStatus : true;
    const matchesRole = filterRole ? m.role === filterRole : true;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Card className="bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-2xl animate-fade-in-up">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold flex items-center gap-2 text-blue-700 dark:text-white">Moderators</span>
            </div>
            <Button onClick={openAddModal} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 px-6 py-2 rounded shadow-md transition-all duration-300">
              <UserPlus className="h-4 w-4" /> Add New Moderator
            </Button>
        </CardHeader>
        <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-2 mb-4 animate-fade-in-up">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              >
                <option value="">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-1/4 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              >
                <option value="">All Roles</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* Table */}
            <div className="overflow-x-auto animate-fade-in-up">
              <table className="min-w-full text-sm bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-md">
              <thead>
                <tr>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Full Name</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Email</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Role</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Creation Date</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Last Login</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Permissions</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Activities</th>
                    <th className="p-2 text-left font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {filtered.map((mod, idx) => (
                    <tr key={idx} className="border-t hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200">
                      <td className="p-2 font-semibold text-blue-900 dark:text-blue-200">{mod.name}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{mod.email}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{mod.role}</td>
                    <td className="p-2">
                        {mod.status === 'Active' ? (
                          <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 className="h-4 w-4 animate-pulse" /> Active</span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-500 font-semibold"><AlertTriangle className="h-4 w-4 animate-pulse" /> Suspended</span>
                        )}
                    </td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{mod.created}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{mod.lastLogin}</td>
                      <td className="p-2 underline cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors" onClick={() => setViewPermsIdx(idx)}>View</td>
                      <td className="p-2 underline cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors" onClick={() => setViewActsIdx(idx)}>View</td>
                    <td className="p-2 flex gap-2">
                        <Button size="sm" variant="outline" className="hover:scale-110 transition-transform" onClick={() => openEditModal(idx)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" className="hover:scale-110 transition-transform" onClick={() => handleDelete(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-4 text-gray-400">No moderators found.</td></tr>
                  )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        {/* Permissions Modal */}
        {viewPermsIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
              <button onClick={() => setViewPermsIdx(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="h-5 w-5" /></button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-green-600" /> Permissions</h2>
              <ul className="list-disc ml-6">
                {moderators[viewPermsIdx].permissions.map((perm, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-200">{perm}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Activities Modal */}
        {viewActsIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
              <button onClick={() => setViewActsIdx(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="h-5 w-5" /></button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-green-600" /> Activities</h2>
              <ul className="list-disc ml-6">
                {moderators[viewActsIdx].activities && moderators[viewActsIdx].activities.length > 0 ? moderators[viewActsIdx].activities.map((act, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-200">{act}</li>
                )) : <li className="text-gray-400">No activities found.</li>}
              </ul>
            </div>
          </div>
        )}
        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fade-in-up">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="h-5 w-5" /></button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-green-600" />{editIdx !== null ? "Edit Moderator" : "Add New Moderator"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Full Name</label>
                  <input name="name" value={form.name} onChange={handleInputChange} required className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`} />
                  {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleInputChange} required className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`} />
                  {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>
                {editIdx === null && (
                  <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleInputChange} required className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`} />
                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                  </div>
                )}
                <div>
                  <label className="block mb-1 font-medium">Role</label>
                  <select name="role" value={form.role} onChange={handleSelectChange} className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${errors.role ? 'border-red-500' : ''}`}>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select>
                  {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select name="status" value={form.status} onChange={handleSelectChange} className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${errors.status ? 'border-red-500' : ''}`}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map(perm => (
                      <label key={perm} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm)}
                          onChange={() => handlePermChange(perm)}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                  {errors.permissions && <div className="text-red-500 text-xs mt-1">{errors.permissions}</div>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" className="rounded-lg" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300">
                    {editIdx !== null ? "Save Changes" : "Add Moderator"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Moderators; 