import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Bot, Send, Loader2, Hospital } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";

const AiAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAiResult(null);
      setError("");
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    setAiResult(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/lung-diagnosis-php/predict.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setAiResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatHistory((prev) => [...prev, { sender: "You", message: chatInput }]);
    try {
      const res = await fetch("/lung-diagnosis-php/chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: "starnova", message: data.reply }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { sender: "starnova", message: "Sorry, there was an error." }]);
    } finally {
      setChatInput("");
      setChatLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center bg-background py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="mb-10 shadow-xl rounded-2xl bg-card text-card-foreground border border-border w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Hospital className="h-6 w-6 text-primary" /> AI X-Ray Analysis
              </CardTitle>
              <CardDescription>Upload your X-ray images to get AI-powered preliminary analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <AnimatePresence>
                  {imagePreview && (
                    <motion.img
                      key="preview"
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-48 object-contain rounded-xl border shadow-md mb-2 bg-muted"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </AnimatePresence>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="max-w-xs cursor-pointer"
                />
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  className="w-full flex justify-center"
                >
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className="flex items-center gap-2 px-6 py-2 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 shadow-md rounded-full"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Loader2 className="animate-spin h-5 w-5 text-primary-foreground" />
                        </motion.span>
                        Analyzing...
                      </span>
                    ) : (
                      <>
                        <UploadCloud className="h-5 w-5" /> Analyze Image
                      </>
                    )}
                  </Button>
                </motion.div>
                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive mt-2">{error}</motion.div>}
                <AnimatePresence>
                  {aiResult && (
                    <motion.div
                      key="ai-result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                      className="mt-4 w-full text-center bg-muted/80 rounded-xl shadow-lg p-4 border border-muted"
                    >
                      <h3 className="text-xl font-bold mb-2 text-primary">AI Result</h3>
                      <div className="text-lg font-semibold text-primary mb-1">{aiResult.prediction}</div>
                      <div className="text-muted-foreground mb-1">Confidence: {aiResult.confidence}</div>
                      <div className="text-foreground mt-2">{aiResult.description}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <Card className="shadow-xl rounded-2xl bg-card text-card-foreground border border-border w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="h-6 w-6 text-primary" /> starnova Chat
              </CardTitle>
              <CardDescription>Chat with the AI assistant about your results or any medical questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4 px-1">
                <AnimatePresence initial={false}>
                  {chatHistory.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.sender === "You" ? 40 : -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: msg.sender === "You" ? 40 : -40 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col items-${msg.sender === "You" ? "end" : "start"}`}
                    >
                      <span className={`px-4 py-2 rounded-2xl shadow-md mb-1 max-w-xs break-words ${msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"} animate-fade-in`}>{msg.message}</span>
                      <span className="text-xs text-muted-foreground mt-1">{msg.sender}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
                  disabled={chatLoading}
                  className="rounded-full px-4 py-2 shadow-sm bg-background text-foreground"
                />
                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }}>
                  <Button onClick={handleSendChat} disabled={chatLoading || !chatInput.trim()} className="rounded-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    {chatLoading ? (
                      <motion.span
                        className="inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Loader2 className="animate-spin h-5 w-5 text-primary-foreground" />
                      </motion.span>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AiAnalysis; 