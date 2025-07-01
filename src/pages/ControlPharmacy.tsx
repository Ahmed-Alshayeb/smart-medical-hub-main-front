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

const initialItems = [];

const statuses = ["Available", "Out of Stock"];
const categories = ["Painkiller", "Antibiotic", "Antiseptic", "Supplement", "Other"];

export default function ControlPharmacy() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", manufacturer: "", expiry: "", batch: "", status: "Available", category: "Painkiller", stock: "", price: "", image: null });

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (editItem) {
      setItems(items.map(i => i.id === editItem.id ? { ...editItem, ...form, stock: Number(form.stock), price: Number(form.price) } : i));
    } else {
      setItems([...items, { ...form, id: Date.now(), stock: Number(form.stock), price: Number(form.price) }]);
    }
    setModalOpen(false);
    setEditItem(null);
    setForm({ name: "", type: "", manufacturer: "", expiry: "", batch: "", status: "Available", category: "Painkiller", stock: "", price: "", image: null });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Control Pharmacy</CardTitle>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditItem(null); setForm({ name: "", type: "", manufacturer: "", expiry: "", batch: "", status: "Available", category: "Painkiller", stock: "", price: "", image: null }); }}> <Plus className="mr-2 h-4 w-4" /> Add Item </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editItem ? "Edit Item" : "Add Item"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
                  <Input placeholder="Manufacturer" value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} />
                  <Input placeholder="Expiry Date" type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                  <Input placeholder="Batch Number" value={form.batch} onChange={e => setForm(f => ({ ...f, batch: e.target.value }))} />
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                  <Input placeholder="Price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  <Input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
                  {form.image && <div className="mt-2 text-xs text-gray-500">Selected: {form.image.name}</div>}
                  <Button className="w-full" onClick={handleSave}>{editItem ? "Save Changes" : "Add Item"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.manufacturer}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "Available" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{item.status}</span></TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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