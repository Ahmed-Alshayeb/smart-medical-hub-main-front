
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden animated-background">
      {/* Background Pattern with Animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%227%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 animate-wave"></div>
      
      {/* Advanced Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full floating-element animate-pulse-glow" style={{ animationDelay: "0s", animationDuration: "4s" }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full floating-element animate-heartbeat" style={{ animationDelay: "1s", animationDuration: "5s" }}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full floating-element animate-float" style={{ animationDelay: "2s", animationDuration: "6s" }}></div>
      <div className="absolute top-32 left-1/3 w-8 h-8 bg-white/15 rounded-full floating-element animate-bounce-in" style={{ animationDelay: "0.5s", animationDuration: "3s" }}></div>
      <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-white/10 rounded-full floating-element animate-zoom-in" style={{ animationDelay: "1.5s", animationDuration: "4s" }}></div>
      
      {/* Medical Icons Floating */}
      <div className="absolute top-24 right-1/4 text-4xl animate-rotate-in floating-element" style={{ animationDelay: "0.8s" }}>💊</div>
      <div className="absolute bottom-24 left-1/6 text-3xl animate-flip-in floating-element" style={{ animationDelay: "1.2s" }}>🏥</div>
      <div className="absolute top-1/3 right-1/6 text-2xl animate-bounce-in floating-element" style={{ animationDelay: "1.8s" }}>🩺</div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            Your Complete
            <span className="text-blue-200 animate-pulse typing-animation"> Healthcare</span>
            <br />
            <span className="animate-zoom-in stagger-2">Solution Hub</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed animate-fade-in-up stagger-2">
            Book appointments, find hospitals, order medicines, schedule lab tests, 
            and get AI-powered medical analysis - all in one integrated platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-3">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold hover-scale hover-shine animate-pulse-glow transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg hover-scale hover-tilt transition-all duration-300"
            >
              <PlayCircle className="mr-2 h-5 w-5 animate-heartbeat" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-bounce-in stagger-4 hover-scale">
              <div className="text-3xl font-bold text-blue-200 animate-pulse-glow">50K+</div>
              <div className="text-blue-100">Patients Served</div>
            </div>
            <div className="animate-bounce-in stagger-5 hover-scale">
              <div className="text-3xl font-bold text-blue-200 animate-pulse-glow">2,500+</div>
              <div className="text-blue-100">Doctors</div>
            </div>
            <div className="animate-bounce-in stagger-6 hover-scale">
              <div className="text-3xl font-bold text-blue-200 animate-pulse-glow">500+</div>
              <div className="text-blue-100">Hospitals</div>
            </div>
            <div className="animate-bounce-in stagger-4 hover-scale">
              <div className="text-3xl font-bold text-blue-200 animate-pulse-glow">98%</div>
              <div className="text-blue-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
