import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Heart, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect based on user role/account type
        if (user?.role === 'admin') {
          navigate('/dashboard', { replace: true });
        } else if (user?.role === 'doctor') {
          navigate('/doctors', { replace: true });
        } else if (user?.role === 'patient') {
          navigate('/patients', { replace: true });
        } else if (user?.role === 'clinic') {
          navigate('/clinics', { replace: true });
        } else if (user?.role === 'hospital') {
          navigate('/hospitals', { replace: true });
        } else if (user?.role === 'pharmacy') {
          navigate('/pharmacy', { replace: true });
        } else if (user?.role === 'laboratory') {
          navigate('/labs', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 animate-fade-in-up stagger-2">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 animate-fade-in-up stagger-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 text-right transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 h-12 text-right transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover-scale transition-colors">
                  Forgot password?
                </a>
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover-scale animate-pulse-glow transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Logging in...
                  </div>
                ) : (
                  <>
                    Login
                    <ArrowRight className="mr-2 h-4 w-4 animate-bounce" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover-scale transition-colors">
                Create new account
              </a>
            </div>

            {/* Roles and Permissions Info */}
            <div className="mt-8 p-4 rounded-lg bg-muted/60 border border-muted animate-fade-in">
              <h3 className="text-lg font-bold mb-2 text-primary">Roles & Permissions</h3>
              <div className="space-y-2 text-left">
                <div>
                  <span className="font-semibold text-primary">Admin:</span>
                  <span className="ml-2 text-foreground">Full access to dashboard, user management, all control panels, analytics, settings, and all system features.</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">dashboard</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">user_management</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">moderators</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">control_doctors</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">control_patients</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">control_pharmacy</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">medical_records</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">appointments</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">analytics</span>
                    <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs">settings</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Doctor:</span>
                  <span className="ml-2 text-foreground">Access to dashboard, appointments, medical records, and patient management.</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">dashboard</span>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">appointments</span>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">medical_records</span>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">patients</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-green-700">Patient:</span>
                  <span className="ml-2 text-foreground">Access to dashboard, appointments, and personal medical records.</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">dashboard</span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">appointments</span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">medical_records</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-purple-700">Moderator:</span>
                  <span className="ml-2 text-foreground">Access to dashboard, user management, and moderation features.</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">dashboard</span>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">user_management</span>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">moderators</span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-pink-700">Clinic/Hospital/Pharmacy/Laboratory:</span>
                  <span className="ml-2 text-foreground">Access to dashboard and their respective management panels.</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs">dashboard</span>
                    <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs">appointments</span>
                    <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs">medical_records</span>
                    <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs">settings</span>
                  </div>
                </div>
              </div>
              {/* Demo Accounts Section */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2 text-primary">Demo Accounts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-primary/10">
                    <span className="font-bold text-primary">Admin</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">admin@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">admin123</span>
                  </div>
                  <div className="p-3 rounded bg-blue-100/60">
                    <span className="font-bold text-blue-700">Doctor</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">doctor@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">doctor123</span>
                  </div>
                  <div className="p-3 rounded bg-green-100/60">
                    <span className="font-bold text-green-700">Patient</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">patient@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">patient123</span>
                  </div>
                  <div className="p-3 rounded bg-purple-100/60">
                    <span className="font-bold text-purple-700">Moderator</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">moderator@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">moderator123</span>
                  </div>
                  <div className="p-3 rounded bg-pink-100/60">
                    <span className="font-bold text-pink-700">Clinic</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">clinic@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">clinic123</span>
                  </div>
                  <div className="p-3 rounded bg-pink-200/60">
                    <span className="font-bold text-pink-700">Hospital</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">hospital@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">hospital123</span>
                  </div>
                  <div className="p-3 rounded bg-pink-300/60">
                    <span className="font-bold text-pink-700">Pharmacy</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">pharmacy@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">pharmacy123</span>
                  </div>
                  <div className="p-3 rounded bg-pink-400/60">
                    <span className="font-bold text-pink-700">Laboratory</span><br/>
                    <span className="text-xs">Email:</span> <span className="font-mono select-all">lab@medical.com</span><br/>
                    <span className="text-xs">Password:</span> <span className="font-mono select-all">lab123</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="hover-scale hover-tilt transition-all duration-300" disabled={isLoading}>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="hover-scale hover-tilt transition-all duration-300" disabled={isLoading}>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
