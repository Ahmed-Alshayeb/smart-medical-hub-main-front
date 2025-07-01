import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Image, BarChart, Filter, UploadCloud, User, Calendar, File, Eye } from "lucide-react";
import { toast } from "sonner";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

interface MedicalRecord {
  id: string;
  title: string;
  description: string;
  patientName: string;
  date: string;
  fileType: "pdf" | "jpg" | "csv" | "png";
  fileSize: string;
  tags: string[];
  restricted: boolean;
}

const mockMedicalRecords = [];

const placeholderFileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const placeholderFileName = "sample-medical-record.pdf";

const fileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8 text-blue-600" />;
    case "jpg":
    case "png":
      return <Image className="h-8 w-8 text-green-600" />;
    case "csv":
      return <BarChart className="h-8 w-8 text-purple-600" />;
    default:
      return <File className="h-8 w-8 text-gray-400" />;
  }
};

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileData, setFileData] = useState<Partial<MedicalRecord>>({
    title: "",
    description: "",
    patientName: "",
    date: "",
    fileType: "pdf",
    fileSize: "",
    tags: [],
    restricted: true
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewFileIdx, setViewFileIdx] = useState<number | null>(null);
  const [csvTable, setCsvTable] = useState<string[][] | null>(null);

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper: Validate file type
  const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'csv'];
  const isValidType = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return validTypes.includes(ext);
  };

  // Helper: Get file type for UI
  const getFileType = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'jpeg') return 'jpg';
    if (['pdf', 'jpg', 'csv', 'png'].includes(ext)) return ext;
    return 'pdf';
  };

  // Helper: Suggest tags
  const suggestTags = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const baseTags = baseName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    return Array.from(new Set([ext, ...baseTags].filter(Boolean)));
  };

  // Handle file selection (input or drop)
  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid = arr.filter(isValidType);
    if (valid.length < arr.length) {
      toast.error("Some files were not supported and were skipped.");
    }
    setSelectedFiles(valid);
    setUploadProgress(valid.map(() => 0));
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // File input handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  // Remove file
  const removeFile = (idx: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== idx));
    setUploadProgress(progress => progress.filter((_, i) => i !== idx));
  };

  // Simulate upload progress
  const simulateUpload = (cb: () => void) => {
    let progress = [...uploadProgress];
    let i = 0;
    const interval = setInterval(() => {
      progress = progress.map((p, idx) => (p < 100 ? Math.min(100, p + Math.random() * 30) : 100));
      setUploadProgress([...progress]);
      if (progress.every(p => p === 100) || i++ > 20) {
        clearInterval(interval);
        cb();
      }
    }, 200);
  };

  // Upload handler
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    setUploadProgress(selectedFiles.map(() => 0));
    simulateUpload(() => {
      const newRecords = selectedFiles.map((file, idx) => {
        const ext = getFileType(file);
        const tags = suggestTags(file);
        return {
          id: `MR${String(records.length + idx + 1).padStart(3, '0')}`,
          title: file.name,
          description: '',
          patientName: '',
          date: new Date().toISOString().split('T')[0],
          fileType: ext as 'pdf' | 'jpg' | 'csv' | 'png',
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          tags,
          restricted: true
        };
      });
      setRecords([ ...newRecords, ...records ]);
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setUploadProgress([]);
      toast.success("Files uploaded successfully");
    });
  };

  // CSV parsing helper
  const parseCSV = async (file: File): Promise<string[][]> => {
    const text = await file.text();
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map(line => line.split(","));
  };

  // Helper: Find uploaded file for a record
  const findUploadedFileForRecord = (record: MedicalRecord, uploadedFiles: File[]) => {
    // Try to match by file name and file size (since id is generated after upload)
    return uploadedFiles.find(f => f.name === record.title && Math.abs(f.size - parseFloat(record.fileSize) * 1024 * 1024) < 1024);
  };

  // File preview modal content
  const renderFileView = (record: MedicalRecord) => {
    // Try to find the uploaded file for this record
    const uploadedFile = findUploadedFileForRecord(record, selectedFiles);
    if (!uploadedFile) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 py-8">
          <FileText className="h-12 w-12 mb-2 text-gray-400" />
          <div className="font-semibold">Preview not available for this record.</div>
          <div className="text-xs mt-1">Download unavailable.</div>
        </div>
      );
    }
    const ext = record.fileType;
    if (ext === 'jpg' || ext === 'png') {
      return <img src={URL.createObjectURL(uploadedFile)} alt={record.title} className="max-w-full max-h-96 mx-auto rounded border" />;
    }
    if (ext === 'pdf') {
      return <iframe src={URL.createObjectURL(uploadedFile)} title={record.title} className="w-full h-96 rounded border" />;
    }
    if (ext === 'csv') {
      if (csvTable && record.title === (selectedFiles[viewFileIdx ?? -1]?.name)) {
        return (
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-xs border rounded">
              <tbody>
                {csvTable.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-blue-50 font-semibold' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-2 py-1 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (!csvTable && record.title === (selectedFiles[viewFileIdx ?? -1]?.name)) {
        parseCSV(uploadedFile).then(table => setCsvTable(table));
        return <div className="text-center text-gray-400 py-8">Loading CSV preview...</div>;
      } else {
        return null;
      }
    }
    // Restore the <a> tag with download attribute for uploaded files
    return <div className="text-gray-500">Preview not supported. <a href={URL.createObjectURL(uploadedFile)} download={record.title} className="text-blue-600 underline">Download</a></div>;
  };

  // Add this helper for file upload preview (thumbnail/icon)
  const renderUploadPreview = (file: File) => {
    const ext = getFileType(file);
    if (ext === 'jpg' || ext === 'png') {
      return <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 object-cover rounded border" />;
    }
    if (ext === 'pdf') {
      return <FileText className="h-12 w-12 text-blue-600" />;
    }
    if (ext === 'csv') {
      return <BarChart className="h-12 w-12 text-purple-600" />;
    }
    return <File className="h-12 w-12 text-gray-400" />;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header and Upload Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
          </div>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2">
                <UploadCloud className="h-5 w-5" /> Upload New File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload New Medical Record</DialogTitle>
              </DialogHeader>
              <div
                className={`space-y-4 ${dragActive ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                tabIndex={0}
                aria-label="File upload area"
                role="region"
              >
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer bg-white dark:bg-gray-800" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  <UploadCloud className="h-10 w-10 text-blue-500 mb-2" aria-hidden="true" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Drag & drop files here, or click to select</span>
                  <input
                    id="fileUpload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".pdf,.jpg,.jpeg,.png,.csv"
                    multiple
                    style={{ display: 'none' }}
                    aria-label="Choose files to upload"
                  />
                </div>
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={file.name + idx} className="flex items-center gap-4 p-2 border rounded-lg bg-gray-50 dark:bg-gray-900/40">
                        {renderUploadPreview(file)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" title={file.name}>{file.name}</div>
                          <div className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • {getFileType(file).toUpperCase()} • Last modified: {file.lastModified ? new Date(file.lastModified).toLocaleDateString() : ''}</div>
                          <div className="text-xs text-gray-400 mt-1">Tags: {suggestTags(file).join(", ")}</div>
                          <div className="w-full bg-gray-200 rounded h-2 mt-2">
                            <div className="bg-blue-500 h-2 rounded" style={{ width: `${uploadProgress[idx] || 0}%` }} />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" aria-label="Remove file" onClick={e => { e.stopPropagation(); removeFile(idx); }}>
                          <span aria-hidden="true">✕</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => { setIsUploadModalOpen(false); setSelectedFiles([]); setUploadProgress([]); }}>Cancel</Button>
                  <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || uploadProgress.some(p => p > 0 && p < 100)}>
                    {uploadProgress.some(p => p > 0 && p < 100) ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecords.map((record, idx) => (
            <Card key={record.id} className="relative shadow-md bg-white/90 dark:bg-gray-900/90 animate-fade-in">
              {/* Restricted badge */}
              {record.restricted && (
                <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">Restricted</span>
              )}
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {fileTypeIcon(record.fileType)}
                <div>
                  <CardTitle className="text-lg">{record.title}</CardTitle>
                  <div className="text-xs text-gray-500">{record.description}</div>
                </div>
                <Button variant="ghost" size="icon" aria-label="View file" className="ml-auto" onClick={() => setViewFileIdx(idx)}>
                  <Eye className="h-5 w-5 text-blue-600" />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 mr-1 text-gray-400" /> {record.patientName}
                  <Calendar className="h-4 w-4 ml-4 mr-1 text-gray-400" /> {record.date}
                  <File className="h-4 w-4 ml-4 mr-1 text-gray-400" /> {record.fileSize} - {record.fileType.toUpperCase()}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {record.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{tag}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* File View Modal */}
        {viewFileIdx !== null && filteredRecords[viewFileIdx] && (
          <Dialog open={true} onOpenChange={() => { setViewFileIdx(null); setCsvTable(null); }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>View File: {filteredRecords[viewFileIdx].title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">{renderFileView(filteredRecords[viewFileIdx])}</div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => { setViewFileIdx(null); setCsvTable(null); }}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default MedicalRecords; 