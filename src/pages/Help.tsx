import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  FileText,
  BookOpen,
  Video,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  User,
  Calendar,
  CreditCard,
  Activity
} from "lucide-react";
import Layout from "@/components/Layout";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";

const faqs = [
  { 
    id: 1,
    category: "General",
    q: "How do I reset my password?", 
    a: "Go to Settings > Security and use the Change Password form. You'll need your current password and then enter your new password twice to confirm." 
  },
  { 
    id: 2,
    category: "General",
    q: "How do I contact support?", 
    a: "Use the contact form below or email support@medicalcare.com. Our support team typically responds within 24 hours during business days." 
  },
  { 
    id: 3,
    category: "General",
    q: "Where can I find documentation?", 
    a: "Visit the Documentation link in the quick links section. We have comprehensive guides for all features and frequently asked questions." 
  },
  { 
    id: 4,
    category: "Appointments",
    q: "How do I book an appointment?", 
    a: "Navigate to the Book Appointment page, select your preferred doctor, choose a date and time, and complete the booking form." 
  },
  { 
    id: 5,
    category: "Appointments",
    q: "Can I cancel or reschedule my appointment?", 
    a: "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time through your appointments dashboard." 
  },
  { 
    id: 6,
    category: "Medical Records",
    q: "How do I access my medical records?", 
    a: "Your medical records are available in the Medical Records section. You can view, download, and share them with healthcare providers." 
  },
  { 
    id: 7,
    category: "Billing",
    q: "How do I pay for my consultation?", 
    a: "We accept various payment methods including credit cards, bank transfers, and digital wallets. Payment is processed securely through our platform." 
  },
  { 
    id: 8,
    category: "Technical",
    q: "What browsers are supported?", 
    a: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version." 
  }
];

const supportCategories = [
  { id: 1, name: "Technical Support", icon: <HelpCircle className="h-5 w-5" />, description: "Help with technical issues" },
  { id: 2, name: "Account Issues", icon: <User className="h-5 w-5" />, description: "Password, login, and account problems" },
  { id: 3, name: "Appointments", icon: <Calendar className="h-5 w-5" />, description: "Booking, cancellation, and scheduling" },
  { id: 4, name: "Medical Records", icon: <FileText className="h-5 w-5" />, description: "Access and management of health records" },
  { id: 5, name: "Billing & Payments", icon: <CreditCard className="h-5 w-5" />, description: "Payment issues and billing questions" },
  { id: 6, name: "General Inquiry", icon: <MessageCircle className="h-5 w-5" />, description: "General questions and feedback" }
];

const quickLinks = [
  { name: "User Guide", icon: <BookOpen className="h-4 w-4" />, href: "/docs/user-guide", description: "Complete user manual" },
  { name: "Video Tutorials", icon: <Video className="h-4 w-4" />, href: "/docs/videos", description: "Step-by-step video guides" },
  { name: "API Documentation", icon: <FileText className="h-4 w-4" />, href: "/docs/api", description: "Developer documentation" },
  { name: "Download App", icon: <Download className="h-4 w-4" />, href: "/download", description: "Mobile app download" },
  { name: "System Status", icon: <Activity className="h-4 w-4" />, href: "/status", description: "Check system availability" }
];

const Help = () => {
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    category: "", 
    subject: "",
    message: "" 
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const handleSubmitSupport = (e) => {
    e.preventDefault();
    console.log("Submitting support request:", form);
    // Reset form
    setForm({ name: "", email: "", category: "", subject: "", message: "" });
  };

  const sections = [
    {
      id: "search",
      title: "Search Help",
      visible: true,
      component: (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
                <p className="text-gray-600">Search our knowledge base or browse categories</p>
              </div>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for help..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      visible: true,
      component: (
        <TableSection title="Common Questions">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg">
                <button 
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{faq.category}</Badge>
                    <span className="font-semibold text-blue-700 dark:text-blue-400">{faq.q}</span>
                  </div>
                  {expanded === faq.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {expanded === faq.id && (
                  <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TableSection>
      )
    },
    {
      id: "contact",
      title: "Contact Support",
      visible: true,
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormSection title="Send us a message" onSubmit={handleSubmitSupport}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    placeholder="Your Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="">Select a category</option>
                  {supportCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
          </FormSection>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Other Ways to Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@medicalcare.com</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+20 123 456 7890</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM (GMT+2)</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-sm text-gray-600">123 Medical District, Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "quick-links",
      title: "Quick Links",
      visible: true,
      component: (
        <TableSection title="Helpful Resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Card key={link.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {link.icon}
                    <h4 className="font-semibold">{link.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TableSection>
      )
    }
  ];

  return (
    <Layout>
      <PageLayout
        title="Help & Support"
        subtitle="Find answers to your questions and get the help you need"
        sections={sections}
        showSearch={false}
        showFilters={false}
        showActions={false}
      />
    </Layout>
  );
};

export default Help; 