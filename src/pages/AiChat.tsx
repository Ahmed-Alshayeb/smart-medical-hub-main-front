import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Send, 
  Bot, 
  User, 
  Upload, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings, 
  MessageSquare, 
  FileText, 
  Image, 
  Video, 
  Mic, 
  MicOff,
  Paperclip,
  MoreVertical,
  Sparkles,
  Brain,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  History,
  Trash2,
  Edit3,
  Share2,
  Search,
  Calendar,
  Filter,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import PageLayout, { FormSection, TableSection } from "@/components/PageLayout";
import Layout from "@/components/Layout";

// Mock chat data
const mockChatHistory = [
  {
    id: 1,
    type: "user",
    message: "I have been experiencing chest pain for the past few days. Should I be concerned?",
    timestamp: "2024-05-30T10:30:00",
    attachments: []
  },
  {
    id: 2,
    type: "ai",
    message: "Chest pain can be a serious symptom that requires immediate medical attention. While I can provide general information, I strongly recommend consulting with a healthcare professional for proper evaluation. Here are some important points to consider:\n\n• **Severity and Duration**: How intense is the pain and how long does it last?\n• **Associated Symptoms**: Are you experiencing shortness of breath, nausea, or sweating?\n• **Risk Factors**: Do you have a history of heart disease, diabetes, or high blood pressure?\n\n**When to Seek Emergency Care**:\n- Severe, crushing chest pain\n- Pain radiating to arm, jaw, or back\n- Shortness of breath\n- Nausea or dizziness\n\nPlease contact your doctor or visit an emergency room if symptoms are severe or concerning.",
    timestamp: "2024-05-30T10:31:00",
    attachments: [],
    isTyping: false
  },
  {
    id: 3,
    type: "user",
    message: "The pain is mild and comes and goes. It's more like a pressure feeling.",
    timestamp: "2024-05-30T10:32:00",
    attachments: []
  },
  {
    id: 4,
    type: "ai",
    message: "Even mild chest pressure should be evaluated by a healthcare provider. Here's what you should know:\n\n**Possible Causes of Chest Pressure**:\n• **Angina**: Reduced blood flow to heart\n• **Anxiety**: Stress-related chest tightness\n• **GERD**: Acid reflux symptoms\n• **Musculoskeletal**: Muscle strain or inflammation\n\n**Recommended Actions**:\n1. **Schedule an appointment** with your primary care physician\n2. **Monitor symptoms** - note frequency, duration, triggers\n3. **Avoid strenuous activity** until evaluated\n4. **Keep a symptom diary** to share with your doctor\n\n**Red Flags** (seek immediate care):\n- Pain worsens with activity\n- Associated with shortness of breath\n- Radiates to arm, jaw, or back\n- Accompanied by nausea or sweating\n\nWould you like me to help you prepare questions for your doctor?",
    timestamp: "2024-05-30T10:33:00",
    attachments: [],
    isTyping: false
  }
];

// Mock saved chat sessions
const mockSavedSessions = [
  {
    id: "session-1",
    title: "Chest Pain Consultation",
    date: "2024-05-30",
    messageCount: 4,
    context: "cardiology",
    preview: "I have been experiencing chest pain for the past few days..."
  },
  {
    id: "session-2",
    title: "Headache Symptoms",
    date: "2024-05-29",
    messageCount: 6,
    context: "neurology",
    preview: "I've been having persistent headaches for a week..."
  },
  {
    id: "session-3",
    title: "Skin Rash Question",
    date: "2024-05-28",
    messageCount: 3,
    context: "dermatology",
    preview: "I noticed a red rash on my arm..."
  }
];

const medicalContexts = [
  { value: "general", label: "General Health", icon: "🏥" },
  { value: "cardiology", label: "Cardiology", icon: "❤️" },
  { value: "neurology", label: "Neurology", icon: "🧠" },
  { value: "pediatrics", label: "Pediatrics", icon: "👶" },
  { value: "dermatology", label: "Dermatology", icon: "🩺" },
  { value: "orthopedics", label: "Orthopedics", icon: "🦴" },
  { value: "mental-health", label: "Mental Health", icon: "🧘" },
  { value: "emergency", label: "Emergency", icon: "🚨" }
];

const AiChat = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: "user", text: input }
    ]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "(AI response will appear here)" }
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative z-10">
        <Card className="w-full max-w-xl shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg animate-zoom-in hover-scale">
          <CardHeader className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <Bot className="h-12 w-12 text-purple-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              الدردشة الذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 animate-fade-in-up stagger-3">
            <div className="flex-1 overflow-y-auto max-h-96 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-2" style={{ minHeight: 300 }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-xs text-sm shadow ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-purple-100 dark:bg-purple-700 text-gray-900 dark:text-white"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 animate-pulse-glow" disabled={!input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiChat; 