import { TrendingUp, Users, MapPin, Pill } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "-",
      label: "Patients",
      description: "Patient statistics hidden for privacy"
    },
    {
      icon: TrendingUp,
      number: "-",
      label: "Success Rate",
      description: "Success rate hidden for privacy"
    },
    {
      icon: MapPin,
      number: "-",
      label: "Facilities",
      description: "Facility statistics hidden for privacy"
    },
    {
      icon: Pill,
      number: "-",
      label: "Medicines",
      description: "Medicine statistics hidden for privacy"
    }
  ];

  return (
    <div className="bg-blue-600 py-20 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Platform Statistics
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Statistics are hidden for privacy and security reasons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-100 mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold mb-2">
                {stat.label}
              </div>
              <div className="text-blue-200 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
