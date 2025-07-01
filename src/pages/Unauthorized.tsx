import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Home, Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-200/30 dark:bg-red-800/30 rounded-full floating-element animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200/30 dark:bg-orange-800/30 rounded-full floating-element animate-heartbeat"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200/30 dark:bg-yellow-800/30 rounded-full floating-element animate-float"></div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg animate-zoom-in hover-scale">
          <CardHeader className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <Shield className="h-16 w-16 text-red-600 animate-pulse" />
                <Lock className="absolute -top-2 -right-2 h-8 w-8 text-orange-500 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent animate-fade-in-up">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 animate-fade-in-up stagger-2">
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 animate-fade-in-up stagger-3">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                This page requires special permissions that your account doesn't have.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please contact your administrator if you believe this is an error.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate(-1)} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold hover-scale transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="w-full h-12 hover-scale transition-all duration-300"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Need help? Contact support at</p>
              <a 
                href="mailto:support@medical.com" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
              >
                support@medical.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Unauthorized; 