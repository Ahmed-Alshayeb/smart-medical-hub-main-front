import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hospital, Mail, Lock, MapPin, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";

// This is a design-only reference for the clinic registration form.
const RegisterClinicDesign = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg animate-zoom-in hover-scale">
          <CardHeader className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <Hospital className="h-16 w-16 text-blue-600 animate-heartbeat" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Create Clinic Account (Design Only)
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 animate-fade-in-up stagger-2">
              Register your clinic to access all our medical services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 animate-fade-in-up stagger-3">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="clinicName" className="text-right block">Clinic Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Hospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="clinicName"
                    type="text"
                    placeholder="Enter clinic name"
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-right block">Specialization <span className="text-red-500">*</span></Label>
                <Input
                  id="specialization"
                  type="text"
                  placeholder="Enter specialization"
                  className="h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-right block">Clinic Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter full address"
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right block">Phone Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoImage" className="text-right block">Clinic Logo (optional)</Label>
                <Input
                  id="logoImage"
                  type="file"
                  accept="image/*"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseImage" className="text-right block">Upload Clinic License/Documentation <span className="text-red-500">*</span></Label>
                <Input
                  id="licenseImage"
                  type="file"
                  accept="image/*,application/pdf"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">Email <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 text-right hover-scale transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button className="w-full mt-4" type="button" disabled>
                Create Account (Design Only)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterClinicDesign; 