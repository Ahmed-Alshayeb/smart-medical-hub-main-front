import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  MapPin, 
  Pill, 
  Microscope, 
  MessageCircle, 
  Bot,
  Calendar,
  Users,
  Shield,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ServiceCard from "@/components/ServiceCard";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import Clinics from "./Clinics";

const allItems = [
  { type: "doctor", name: "Dr. John Doe" },
  { type: "hospital", name: "City Hospital" },
  { type: "pharmacy", name: "Health Pharmacy" },
  { type: "lab", name: "LabX" }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Local search results
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApiSearch = async () => {
    setApiLoading(true);
    setApiError("");
    try {
      // Replace with your real API endpoint
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setApiResults(data.results || []);
    } catch (err) {
      setApiError("No results found or API error.");
      setApiResults([]);
    }
    setApiLoading(false);
  };

  const services = [
    {
      icon: Calendar,
      title: "Doctor Appointments",
      description: "Book appointments with specialist doctors based on your needs",
      color: "bg-blue-500",
      href: "/doctors"
    },
    {
      icon: MapPin,
      title: "Hospital Locator",
      description: "Find nearby hospitals and clinics with GPS integration",
      color: "bg-green-500",
      href: "/hospitals"
    },
    {
      icon: Pill,
      title: "Online Pharmacy",
      description: "Order medicines online with home delivery tracking",
      color: "bg-purple-500",
      href: "/pharmacy"
    },
    {
      icon: Microscope,
      title: "Lab Booking",
      description: "Schedule lab tests and get results directly in your account",
      color: "bg-orange-500",
      href: "/labs"
    },
    {
      icon: MessageCircle,
      title: "Telemedicine",
      description: "Consult with doctors online through secure chat and video calls",
      color: "bg-teal-500",
      href: "/telemedicine"
    },
    {
      icon: Bot,
      title: "AI X-Ray Analysis",
      description: "Get AI-powered preliminary analysis of your X-ray images",
      color: "bg-pink-500",
      href: "/ai-analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <HeroSection />
      
      {/* Quick Search with enhanced animation */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur animate-bounce-in hover-scale hover-shine">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="Search for doctors, hospitals, medicines, or lab tests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 h-12 text-lg transition-all duration-300 hover-scale animate-fade-in-up"
              />
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 hover-scale animate-pulse-glow animate-bounce-in" onClick={handleApiSearch}>
                Search
              </Button>
            </div>
            {/* Local search results */}
            {searchTerm && (
              <div className="mt-4">
                <div className="font-semibold mb-2">Local Results:</div>
                {filteredItems.length === 0 ? (
                  <div className="text-gray-500">No local results found.</div>
                ) : (
                  filteredItems.map((item, idx) => (
                    <div key={idx} className="text-gray-700">{item.type}: {item.name}</div>
                  ))
                )}
              </div>
            )}
            {/* API search results */}
            {apiLoading && <div className="mt-4 text-blue-600">Loading API results...</div>}
            {apiError && <div className="mt-4 text-red-600">{apiError}</div>}
            {apiResults.length > 0 && (
              <div className="mt-4">
                <div className="font-semibold mb-2">API Results:</div>
                {apiResults.map((item, idx) => (
                  <div key={idx} className="text-gray-700">{item.type}: {item.name}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services Grid with enhanced staggered animation */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-zoom-in typing-animation">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up stagger-2">
            Welcome to our healthcare platform. Service details are hidden for privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`animate-bounce-in card-hover hover-tilt hover-shine stagger-${(index % 6) + 1}`}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>

      <FeaturesSection />
      <StatsSection />

      {/* Footer with animations */}
      <footer className="bg-gray-900 text-white py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up hover-scale">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400 animate-heartbeat" />
                <span className="text-xl font-bold animate-zoom-in">Medical Care</span>
              </div>
              <p className="text-gray-400">
                Healthcare platform description hidden for privacy.
              </p>
            </div>
            <div className="animate-fade-in-up stagger-2 hover-scale">
              <h3 className="font-semibold mb-4 animate-flip-in">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Service 1</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Service 2</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Service 3</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Service 4</li>
              </ul>
            </div>
            <div className="animate-fade-in-up stagger-3 hover-scale">
              <h3 className="font-semibold mb-4 animate-flip-in">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Support 1</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Support 2</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Support 3</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Support 4</li>
              </ul>
            </div>
            <div className="animate-fade-in-up stagger-4 hover-scale">
              <h3 className="font-semibold mb-4 animate-flip-in">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Connect 1</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Connect 2</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Connect 3</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-scale">Connect 4</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in-up animate-pulse-glow">
            <p>&copy; 2024 Medical Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
