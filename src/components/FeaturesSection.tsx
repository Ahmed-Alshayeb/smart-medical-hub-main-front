
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Users, Star, Smartphone, Heart } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA-compliant platform with end-to-end encryption for all your medical data"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere with our round-the-clock platform"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with verified doctors, specialists, and healthcare professionals"
    },
    {
      icon: Star,
      title: "AI-Powered",
      description: "Advanced AI analysis for X-rays and intelligent health recommendations"
    },
    {
      icon: Smartphone,	
      title: "Mobile-First",
      description: "Seamless experience across all devices with our responsive design"
    },
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Designed with patient needs first, ensuring the best healthcare experience"
    }
  ];

  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose MedHub?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing healthcare with cutting-edge technology and patient-first approach
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
