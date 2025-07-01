import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, Search, Heart, Video, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/backend/api/index.php/doctors")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data && Array.isArray(data.data.doctors)) {
          setDoctors(data.data.doctors);
        } else {
          setError("Failed to load doctors.");
        }
      })
      .catch(() => setError("Failed to load doctors."))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialization_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 animated-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Find the Right Doctor</h1>
          <p className="text-xl text-blue-100 animate-fade-in-up stagger-2">
            Connect with experienced specialists near you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 animate-fade-in hover-scale shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for doctors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-12 text-right hover-scale transition-all duration-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Telemedicine Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-teal-500 text-white animate-pulse-glow hover-scale">
          <CardContent className="p-6 text-center">
            <Video className="h-12 w-12 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2 animate-bounce-in">Video Consultation</h2>
            <p className="text-lg animate-fade-in-up stagger-2">Get a video consultation with your preferred doctor from home</p>
            <Button className="mt-4 bg-white text-green-600 hover:bg-gray-100 hover-scale animate-zoom-in">
              Start Now
            </Button>
          </CardContent>
        </Card>

        {/* Loading/Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-blue-600">Loading doctors...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-red-600">{error}</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-muted-foreground">No doctors found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <Card key={doctor.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in card-hover hover-shine" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full mb-4 flex items-center justify-center relative">
                    <Heart className="text-3xl text-blue-600 animate-heartbeat" />
                  </div>
                  <CardTitle className="text-xl text-right">{doctor.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold text-right">{doctor.specialization_name}</CardDescription>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-500">({doctor.total_reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 animate-wave" />
                      <span>{doctor.consultation_fee ? `Fee: $${doctor.consultation_fee}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 animate-bounce" />
                      <span>{doctor.address || "-"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doctor.phone && doctor.phone !== "-" && (
                      <Button asChild variant="outline" className="flex items-center gap-1">
                        <a href={`tel:${doctor.phone}`}><Phone className="h-4 w-4" />Call</a>
                      </Button>
                    )}
                    {doctor.email && doctor.email !== "-" && (
                      <Button asChild variant="outline" className="flex items-center gap-1">
                        <a href={`mailto:${doctor.email}`}><Mail className="h-4 w-4" />Email</a>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-scale animate-pulse-glow transition-all duration-300" onClick={() => navigate(`/book-appointment?doctor=${doctor.id}`)}>
                      <Calendar className="h-4 w-4 ml-2 animate-bounce" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="hover-scale hover-tilt transition-all duration-300" onClick={() => navigate(`/doctors/${doctor.id}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold mb-2">Instant Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Book your appointment in minutes</p>
          </Card>
          
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt stagger-2">
            <Video className="h-12 w-12 text-green-600 mx-auto mb-4 animate-heartbeat" />
            <h3 className="text-lg font-bold mb-2">Video Consultation</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Connect with your doctor online</p>
          </Card>
          
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt stagger-3">
            <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4 animate-pulse-glow" />
            <h3 className="text-lg font-bold mb-2">Certified Doctors</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">All doctors are licensed</p>
          </Card>
          
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt stagger-4">
            <Heart className="h-12 w-12 text-red-600 mx-auto mb-4 animate-heartbeat" />
            <h3 className="text-lg font-bold mb-2">Comprehensive Care</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Comprehensive medical services</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
