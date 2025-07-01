import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight, Lock, Mail, User, UserCheck, Hospital, Pill, FlaskConical, User2, BadgeCheck, FileCheck2, Stamp, MapPin, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"" | "doctor" | "patient" | "hospital" | "pharmacy" | "laboratory" | "clinic">("");
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [syndicateImage, setSyndicateImage] = useState<File | null>(null);
  const [practiceImage, setPracticeImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClinic, setIsClinic] = useState(false);
  const [hasPharmacy, setHasPharmacy] = useState(false);

  const accountTypes = [
    { value: "doctor", label: "Doctor", icon: <UserCheck className="inline h-4 w-4 mr-1" /> },
    { value: "patient", label: "Patient", icon: <User className="inline h-4 w-4 mr-1" /> },
    { value: "hospital", label: "Hospital", icon: <Hospital className="inline h-4 w-4 mr-1" /> },
    { value: "pharmacy", label: "Pharmacy", icon: <Pill className="inline h-4 w-4 mr-1" /> },
    { value: "laboratory", label: "Laboratory", icon: <FlaskConical className="inline h-4 w-4 mr-1" /> },
    { value: "clinic", label: "Clinic", icon: <Hospital className="inline h-4 w-4 mr-1" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", accountType);
      // Add files if present
      if (licenseImage) formData.append("license", licenseImage);
      if (syndicateImage) formData.append("syndicate", syndicateImage);
      if (practiceImage) formData.append("practice", practiceImage);
      // Add more fields as needed (phone, address, etc.)
      // Example: formData.append("phone", phone);
      if (accountType === "pharmacy") formData.append("is_clinic", isClinic ? "1" : "0");
      if (accountType === "clinic") formData.append("has_pharmacy", hasPharmacy ? "1" : "0");
      const res = await fetch("/backend/api/index.php/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/30 rounded-full floating-element animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 dark:bg-purple-800/30 rounded-full floating-element animate-heartbeat"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200/30 dark:bg-green-800/30 rounded-full floating-element animate-float"></div>
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg animate-zoom-in hover-scale">
          <CardHeader className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <Heart className="h-16 w-16 text-blue-600 animate-heartbeat" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Create New Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 animate-fade-in-up stagger-2">
              Create your account to access all our medical services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 animate-fade-in-up stagger-3">
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="space-y-2">
                <Label htmlFor="accountType" className="text-right block">Account Type <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {accountTypes.map(type => (
                    <button
                      type="button"
                      key={type.value}
                      className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center gap-1 hover-scale ${accountType === type.value ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-700 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'}`}
                      onClick={() => setAccountType(type.value as "" | "doctor" | "patient" | "hospital" | "pharmacy" | "laboratory" | "clinic")}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
                {accountType === "" && <div className="text-xs text-red-500 mt-1 animate-fade-in">Please select an account type</div>}
              </div>

              {/* Conditional Fields for Doctor, Hospital, Pharmacy, Laboratory */}
              {(accountType === "doctor" || accountType === "hospital" || accountType === "pharmacy" || accountType === "laboratory") && (
                <div className="space-y-4 animate-fade-in-up stagger-2">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-right block">National ID</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="nationalId"
                        type="text"
                        placeholder="Enter your National ID"
                        className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseImage" className="text-right block">Upload License Document (Ministry of Health) <span className="text-red-500">*</span></Label>
                    <Input
                      id="licenseImage"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setLicenseImage(e.target.files?.[0] || null)}
                      required
                    />
                    {licenseImage && <div className="mt-2 text-xs text-gray-500">Selected: {licenseImage.name}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="syndicateImage" className="text-right block">Upload Syndicate Certificate <span className="text-red-500">*</span></Label>
                    <Input
                      id="syndicateImage"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setSyndicateImage(e.target.files?.[0] || null)}
                      required
                    />
                    {syndicateImage && <div className="mt-2 text-xs text-gray-500">Selected: {syndicateImage.name}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practiceImage" className="text-right block">Upload Practice License <span className="text-red-500">*</span></Label>
                    <Input
                      id="practiceImage"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setPracticeImage(e.target.files?.[0] || null)}
                      required
                    />
                    {practiceImage && <div className="mt-2 text-xs text-gray-500">Selected: {practiceImage.name}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-right block">Facility Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter full address"
                        className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Fields for Clinic and Pharmacy */}
              {(accountType === "clinic" || accountType === "pharmacy") && (
                <div className="space-y-4 animate-fade-in-up stagger-2">
                  <div className="space-y-2">
                    <Label htmlFor="facilityName" className="text-right block">{accountType === 'clinic' ? 'Clinic' : 'Pharmacy'} Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="facilityName"
                      type="text"
                      placeholder={`Enter ${accountType === 'clinic' ? 'clinic' : 'pharmacy'} name`}
                      className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-right block">Specialization <span className="text-red-500">*</span></Label>
                    <Input
                      id="specialization"
                      type="text"
                      placeholder="Enter specialization"
                      className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-right block">{accountType === 'clinic' ? 'Clinic' : 'Pharmacy'} Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter full address"
                      className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right block">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoImage" className="text-right block">{accountType === 'clinic' ? 'Clinic' : 'Pharmacy'} Logo (optional)</Label>
                    <Input
                      id="logoImage"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseImage" className="text-right block">Upload {accountType === 'clinic' ? 'Clinic' : 'Pharmacy'} License/Documentation <span className="text-red-500">*</span></Label>
                    <Input
                      id="licenseImage"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setLicenseImage(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  {accountType === "clinic" && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasPharmacy"
                        checked={hasPharmacy}
                        onChange={e => setHasPharmacy(e.target.checked)}
                        className="accent-blue-600"
                      />
                      <label htmlFor="hasPharmacy" className="text-sm">This clinic offers pharmacy services</label>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right block">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover-scale"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover-scale"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {/* Conditional Fields for Patient */}
              {accountType === "patient" && (
                <div className="space-y-4 animate-fade-in-up stagger-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-right block">Gender <span className="text-red-500">*</span></Label>
                    <div className="flex gap-4 justify-center">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="gender" value="male" required className="accent-blue-600" />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="gender" value="female" required className="accent-pink-600" />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-right block">Date of Birth <span className="text-red-500">*</span></Label>
                    <Input
                      id="dob"
                      type="date"
                      className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span>Add Medical Insurance</span>
                      <Switch name="insurance" className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300" />
                    </label>
                  </div>
                </div>
              )}
              {error && <div className="text-red-500 text-center animate-fade-in">{error}</div>}
              {success && <div className="text-green-600 text-center animate-fade-in">{success}</div>}
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover-scale animate-pulse-glow transition-all duration-300" disabled={accountType === "" || loading}>
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight className="mr-2 h-4 w-4 animate-bounce" />
              </Button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account? {" "}
                <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover-scale transition-colors">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register; 