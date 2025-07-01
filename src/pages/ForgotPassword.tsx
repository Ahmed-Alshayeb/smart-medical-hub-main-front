import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Heart, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 animate-fade-in-up stagger-2">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 animate-fade-in-up stagger-3">
            {sent ? (
              <div className="text-center text-green-600 dark:text-green-400 font-semibold animate-fade-in-up">
                Password reset link sent to your email
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-6">
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
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover-scale animate-pulse-glow transition-all duration-300">
                  Send Reset Link
                  <ArrowRight className="mr-2 h-4 w-4 animate-bounce" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 