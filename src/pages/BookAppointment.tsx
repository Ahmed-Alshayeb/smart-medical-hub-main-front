import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  CalendarDays,
  CheckCircle,
  AlertCircle,
  Star,
  Clock3,
  Building2,
  FileText,
  CreditCard,
  Shield,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Users,
  Activity,
  Zap,
  RefreshCw,
  Baby,
  Heart,
  Bone,
  Eye,
  Brain,
  Smile,
  Wand2
} from "lucide-react";
import { toast } from "sonner";
import DoctorCard from "@/components/DoctorCard";
import SpecializationSelector from "@/components/SpecializationSelector";

// ErrorBoundary component
function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  useEffect(() => {
    const errorHandler = (event) => {
      setError(event.error || event.reason || 'Unknown error');
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">An error occurred</h2>
        <pre className="bg-red-100 p-4 rounded text-left overflow-x-auto">{String(error)}</pre>
        <p className="mt-4">Please refresh the page or contact support.</p>
      </div>
    );
  }
  return children;
}

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filteredDoctors = [];

  const specializations = [
    { value: 'General Surgery', label: 'General Surgery', icon: <Stethoscope className="h-5 w-5 mr-2 text-blue-600" /> },
    { value: 'Pediatrics and Neonatology', label: 'Pediatrics and Neonatology', icon: <Baby className="h-5 w-5 mr-2 text-yellow-500" /> },
    { value: 'Cardiology and Vascular', label: 'Cardiology and Vascular', icon: <Heart className="h-5 w-5 mr-2 text-red-500" /> },
    { value: 'Dermatology and Cosmetics', label: 'Dermatology and Cosmetics', icon: <Wand2 className="h-5 w-5 mr-2 text-pink-500" /> },
    { value: 'Orthopedics', label: 'Orthopedics', icon: <Bone className="h-5 w-5 mr-2 text-gray-500" /> },
    { value: 'Ophthalmology', label: 'Ophthalmology', icon: <Eye className="h-5 w-5 mr-2 text-purple-600" /> },
    { value: 'Psychiatry and Neurology', label: 'Psychiatry and Neurology', icon: <Brain className="h-5 w-5 mr-2 text-pink-400" /> },
    { value: 'Dentistry', label: 'Dentistry', icon: <Smile className="h-5 w-5 mr-2 text-gray-400" /> },
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Accepts +20 1X XXX XXXX or 01X XXX XXXX
    const cleaned = phone.replace(/\s|-/g, '');
    // Accept +20XXXXXXXXXX or 01XXXXXXXXX
    return /^((\+20)?1[0125][0-9]{8}|01[0125][0-9]{8})$/.test(cleaned);
  };

  const validatePatientInfo = () => {
    if (!patientInfo.name.trim()) return "Full name is required";
    if (!patientInfo.phone.trim()) return "Phone number is required";
    if (!validatePhone(patientInfo.phone)) return "Please enter a valid Egyptian phone number";
    if (!patientInfo.email.trim()) return "Email address is required";
    if (!validateEmail(patientInfo.email)) return "Please enter a valid email address";
    return null;
  };

  const handleNext = useCallback(() => {
    if (step === 1 && selectedSpecialization) {
      setStep(2);
    } else if (step === 2 && selectedDoctor) {
      setStep(3);
    } else if (step === 3 && selectedDate && selectedTime && selectedType) {
      setStep(4);
    } else if (step === 4 && validatePatientInfo()) {
      setIsConfirmationModalOpen(true);
    }
  }, [step, selectedSpecialization, selectedDoctor, selectedDate, selectedTime, selectedType, validatePatientInfo]);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      toast.info("Going back to previous step");
    }
  };

  const generateAppointmentId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `APT-${timestamp}-${random}`.toUpperCase();
  };

  const handleBookAppointment = () => {
    setIsLoading(true);
    const newAppointmentId = generateAppointmentId();
    setAppointmentId(newAppointmentId);
    
    // Simulate booking process
    toast.info("Processing your appointment...");
    setTimeout(() => {
      setIsConfirmationModalOpen(false);
      setIsLoading(false);
      setShowSuccessModal(true);
      toast.success("Appointment booked successfully! You will receive a confirmation email shortly.");
    }, 2000);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setStep(1);
    setSelectedSpecialization("all");
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
    setPatientInfo({
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      notes: ""
    });
    setSearchTerm("");
    setAppointmentId("");
  };

  const handleSkipToStep = (targetStep) => {
    if (targetStep === 2 && selectedSpecialization) {
      setStep(2);
      toast.success("Jumped to doctor selection!");
    } else if (targetStep === 3 && selectedDoctor) {
      setStep(3);
      toast.success("Jumped to scheduling!");
    } else if (targetStep === 4 && selectedDate && selectedTime && selectedType) {
      setStep(4);
      toast.success("Jumped to patient information!");
    } else {
      toast.error("Please complete the previous steps first");
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getSelectedAppointmentType = () => {
    return [];
  };

  const calculateTotal = () => {
    const appointmentType = getSelectedAppointmentType();
    const doctorFee = selectedDoctor?.consultationFee || 0;
    return (appointmentType?.price || 0) + doctorFee;
  };

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!selectedSpecialization;
      case 2:
        return !!selectedDoctor;
      case 3:
        return !!(selectedDate && selectedTime && selectedType);
      case 4:
        return !!(patientInfo.name && patientInfo.phone && patientInfo.email);
      default:
        return false;
    }
  };

  const canProceedToStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return true;
      case 2:
        return isStepComplete(1);
      case 3:
        return isStepComplete(1) && isStepComplete(2);
      case 4:
        return isStepComplete(1) && isStepComplete(2) && isStepComplete(3);
      default:
        return false;
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('20') && cleaned.length === 12) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('1') && cleaned.length === 10) {
      return `+20${cleaned}`;
    } else if (cleaned.startsWith('01') && cleaned.length === 11) {
      return `+20${cleaned.slice(1)}`;
    }
    return phone;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        if (step < 4 && isStepComplete(step)) {
          handleNext();
        } else if (step === 4 && validatePatientInfo()) {
          handleBookAppointment();
        }
      } else if (event.key === 'Escape') {
        if (isConfirmationModalOpen) {
          setIsConfirmationModalOpen(false);
        }
        if (showSuccessModal) {
          setShowSuccessModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [step, selectedSpecialization, selectedDoctor, selectedDate, selectedTime, selectedType, patientInfo, isConfirmationModalOpen, showSuccessModal, handleNext, handleBookAppointment, isStepComplete, validatePatientInfo]);

  // Auto-advance when all fields are complete
  useEffect(() => {
    if (step === 1 && selectedSpecialization) {
      // Auto-advance after 2 seconds if user doesn't click next
      const timer = setTimeout(() => {
        if (step === 1) {
          toast.info("Press Next to continue or select a different specialization");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, selectedSpecialization]);

  const getStepProgress = () => {
    const totalSteps = 4;
    const completedSteps = [selectedSpecialization, selectedDoctor, selectedDate && selectedTime && selectedType, patientInfo.name && patientInfo.phone && patientInfo.email].filter(Boolean).length;
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Book Your Appointment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule a consultation with our expert medical professionals
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span>Progress: {Math.round(getStepProgress())}%</span>
              </span>
              <span className="flex items-center gap-1">
                <span>Step {step} of 4</span>
              </span>
              <span className="flex items-center gap-1">
                <span>Ctrl+Enter: Next</span>
              </span>
              <span className="flex items-center gap-1">
                <span>Esc: Close modals</span>
              </span>
            </div>
      </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <button
                    onClick={() => canProceedToStep(stepNumber) && handleSkipToStep(stepNumber)}
                    disabled={!canProceedToStep(stepNumber)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      step >= stepNumber 
                        ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' 
                        : canProceedToStep(stepNumber)
                        ? 'bg-white border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-600'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{stepNumber}</span>
                    )}
                  </button>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
              </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {step === 1 && <Stethoscope className="h-5 w-5" />}
                    {step === 2 && <User className="h-5 w-5" />}
                    {step === 3 && <Calendar className="h-5 w-5" />}
                    {step === 4 && <FileText className="h-5 w-5" />}
                    {step === 1 && "Select Specialization"}
                    {step === 2 && "Choose Doctor"}
                    {step === 3 && "Schedule Appointment"}
                    {step === 4 && "Patient Information"}
            </CardTitle>
          </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Specialization Selection */}
                  {step === 1 && (
                    <SpecializationSelector
                      specializations={specializations}
                      selected={selectedSpecialization}
                      onSelect={setSelectedSpecialization}
                    />
                  )}

                  {/* Step 2: Doctor Selection */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Label>Search Doctors</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search by name or specialization..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-48">
                          <Label>Filter by Specialization</Label>
                          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Specializations" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Specializations</SelectItem>
                              {specializations.map((specialization) => (
                                <SelectItem key={specialization.value} value={specialization.value}>
                                  {specialization.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {Array.isArray(filteredDoctors) && filteredDoctors.length > 0 ? (
                          filteredDoctors.map((doctor) =>
                            doctor && doctor.id ? (
                              <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                selected={selectedDoctor?.id === doctor.id}
                                onClick={() => setSelectedDoctor(doctor)}
                              />
                            ) : null
                          )
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No doctors found matching your criteria</p>
                            <Button 
                              variant="outline" 
                              onClick={() => setSearchTerm("")}
                              className="mt-2"
                            >
                              Clear Search
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Schedule Appointment */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Selected Doctor</h3>
                        {selectedDoctor && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <img
                              src={selectedDoctor.image}
                              alt={selectedDoctor.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{selectedDoctor.name}</h4>
                              <p className="text-blue-600">{selectedDoctor.specialization}</p>
                </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Appointment Type</Label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appointment type" />
                            </SelectTrigger>
                            <SelectContent>
                              {[]}
                            </SelectContent>
                          </Select>
              </div>

                        <div>
                          <Label>Select Date</Label>
                          <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                              {getAvailableDates().map((date) => (
                                <SelectItem key={date} value={date}>
                                  {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                      <div>
                        <Label>Select Time</Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                          {[]}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Patient Information */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={patientInfo.name}
                            onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label>Phone Number *</Label>
                          <Input
                            value={patientInfo.phone}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              setPatientInfo({...patientInfo, phone: formatted});
                            }}
                            placeholder="+20 100 123 4567"
                            className={patientInfo.phone && !validatePhone(patientInfo.phone) ? 'border-red-500' : ''}
                          />
                          {patientInfo.phone && !validatePhone(patientInfo.phone) && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid Egyptian phone number</p>
                          )}
                        </div>
                        <div>
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            value={patientInfo.email}
                            onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                            placeholder="your.email@example.com"
                            className={patientInfo.email && !validateEmail(patientInfo.email) ? 'border-red-500' : ''}
                          />
                          {patientInfo.email && !validateEmail(patientInfo.email) && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                          )}
                        </div>
                        <div>
                          <Label>Age</Label>
                          <Input
                            type="number"
                            value={patientInfo.age}
                            onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                            placeholder="25"
                          />
                        </div>
                        <div>
                          <Label>Gender</Label>
                          <Select value={patientInfo.gender} onValueChange={(value) => setPatientInfo({...patientInfo, gender: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Additional Notes</Label>
                  <Textarea
                          value={patientInfo.notes}
                          onChange={(e) => setPatientInfo({...patientInfo, notes: e.target.value})}
                          placeholder="Any specific symptoms or concerns you'd like to discuss..."
                          rows={3}
                  />
                </div>
              </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={step === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        {step === 1 && "Select a specialization to continue"}
                        {step === 2 && "Choose a doctor to continue"}
                        {step === 3 && "Select date, time, and type to continue"}
                        {step === 4 && "Fill in required information to book"}
                      </div>
              <Button 
                        onClick={handleNext}
                        disabled={
                          (step === 1 && !selectedSpecialization) ||
                          (step === 2 && !selectedDoctor) ||
                          (step === 3 && (!selectedDate || !selectedTime || !selectedType)) ||
                          (step === 4 && (!patientInfo.name || !patientInfo.phone || !patientInfo.email))
                        }
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {step === 4 ? "Book Appointment" : "Next"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Appointment Summary */}
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Appointment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDoctor && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedDoctor.name}</h4>
                        <p className="text-sm text-blue-600">{selectedDoctor.specialization}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedDate && selectedTime && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedTime}</span>
                      </div>
                    </div>
                  )}

                  {selectedType && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{getSelectedAppointmentType()?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{getSelectedAppointmentType()?.duration} minutes</span>
                      </div>
                    </div>
                  )}

                  {selectedDoctor && selectedType && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="font-bold text-lg text-blue-600">
                          SAR {calculateTotal()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Consultation Fee:</span>
                          <span>SAR {selectedDoctor.consultationFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Appointment Type:</span>
                          <span>SAR {getSelectedAppointmentType()?.price}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Step {step} of 4</span>
                        <span className="text-blue-600 font-medium">
                          {step === 1 && "Select Specialization"}
                          {step === 2 && "Choose Doctor"}
                          {step === 3 && "Schedule Appointment"}
                          {step === 4 && "Patient Information"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getStepProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Why Choose Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Expert Medical Professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure Online Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 Customer Support</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Appointments
              </Button>
                </CardContent>
              </Card>

              {/* Appointment Tips */}
              <Card className="bg-white/90 dark:bg-gray-900/90 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Appointment Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="text-gray-600">• أحضر بطاقة الرقم القومي والتأمين الصحي</p>
                    <p className="text-gray-600">• جهز قائمة بالأدوية الحالية</p>
                    <p className="text-gray-600">• احضر قبل الموعد بـ 15 دقيقة</p>
                    <p className="text-gray-600">• حضر أسئلتك للطبيب</p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <p className="font-semibold text-red-700 dark:text-red-300">الطوارئ: 123</p>
                    <p className="text-red-600 dark:text-red-400">لطوارئ الإسعاف في مصر</p>
                  </div>
          </CardContent>
        </Card>
      </div>
    </div>

          {/* Confirmation Modal */}
          <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Confirm Appointment
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Please review your appointment details before confirming:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Doctor:</span>
                      <span>{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{getSelectedAppointmentType()?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Patient:</span>
                      <span>{patientInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">SAR {calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsConfirmationModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBookAppointment} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Success Modal */}
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Appointment Booked Successfully!
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Your appointment has been successfully booked!
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Appointment ID:</span>
                      <span>{appointmentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Doctor:</span>
                      <span>{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{getSelectedAppointmentType()?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Patient:</span>
                      <span>{patientInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">SAR {calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSuccessModalClose}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BookAppointment; 