import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus, X } from "lucide-react";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

const initialUsers = [];

const roles = ["Doctor", "Patient", "Admin"];
const statuses = ["Active", "Suspended"];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: roles[0], status: statuses[0] });

  useEffect(() => {
    // Fetch all users and their permissions from the backend
    fetch("/backend/api/index.php/users/list-all")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && Array.isArray(data.data)) {
          // For each user, fetch their permissions
          Promise.all(
            data.data.map(async (user) => {
              const permRes = await fetch(`/backend/api/index.php/users/${user.id}/permissions`);
              const permData = await permRes.json();
              return {
                ...user,
                permissions: permData.status === "success" && Array.isArray(permData.data) ? permData.data : []
              };
            })
          ).then(usersWithPerms => setUsers(usersWithPerms));
        }
      });
  }, []);

  const openAddModal = () => {
    setForm({ name: "", email: "", role: roles[0], status: statuses[0] });
    setEditIdx(null);
    setModalOpen(true);
  };

  const openEditModal = (idx) => {
    setForm(users[idx]);
    setEditIdx(idx);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditIdx(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIdx !== null) {
      // Edit user
      const updated = [...users];
      updated[editIdx] = { ...form, created: users[editIdx].created, lastLogin: users[editIdx].lastLogin };
      setUsers(updated);
    } else {
      // Add user
      setUsers([
        ...users,
        {
          ...form,
          created: new Date().toISOString().slice(0, 10),
          lastLogin: "-"
        }
      ]);
    }
    closeModal();
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((_, i) => i !== idx));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <Button onClick={openAddModal} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add New User
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Created Date</th>
                    <th className="p-2 text-left">Last Login</th>
                    <th className="p-2 text-left">Permissions</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 font-semibold">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.status}</span>
                      </td>
                      <td className="p-2">{user.created || user.created_at}</td>
                      <td className="p-2">{user.lastLogin || user.last_login}</td>
                      <td className="p-2">
                        {user.permissions && user.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((perm, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-muted text-foreground text-xs">{perm}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(idx)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(idx)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fade-in">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="h-5 w-5" /></button>
              <h2 className="text-xl font-bold mb-4">{editIdx !== null ? "Edit User" : "Add New User"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700">
                    {editIdx !== null ? "Save Changes" : "Add User"}
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

export default UserManagement; 