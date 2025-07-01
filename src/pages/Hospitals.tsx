import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Search, Heart, ArrowLeft, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/backend/api/index.php/hospitals")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data && Array.isArray(data.data.hospitals)) {
          setHospitals(data.data.hospitals);
        } else {
          setError("Failed to load hospitals.");
        }
      })
      .catch(() => setError("Failed to load hospitals."))
      .finally(() => setLoading(false));
  }, []);

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hospital.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation />
      
      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Button 
          variant="outline" 
          className="mb-4 hover-scale animate-fade-in"
          onClick={() => window.location.href = '/'}
        >
          <ArrowLeft className="h-4 w-4 ml-2 animate-bounce" />
          Back to Home
        </Button>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-16 animated-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Hospitals & Medical Centers Directory</h1>
          <p className="text-xl text-teal-100 animate-fade-in-up stagger-2">
            Find the nearest hospitals and medical centers with comprehensive info
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
                  placeholder="Search for hospitals or medical centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-12 text-right hover-scale transition-all duration-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading/Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-green-600">Loading hospitals...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-red-600">{error}</span>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="col-span-2 text-center text-muted-foreground py-12 text-lg animate-fade-in">
            No hospitals found. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHospitals.map((hospital, index) => (
              <Card key={hospital.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in card-hover hover-shine" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-right mb-2">{hospital.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{hospital.type || "General"}</Badge>
                        {hospital.emergency && (
                          <Badge variant="destructive" className="animate-pulse">
                            24/7 Emergency
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-start gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-semibold">{hospital.rating}</span>
                        </div>
                        <span className="text-gray-500">({hospital.total_reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900 dark:to-green-900 rounded-lg flex items-center justify-center">
                      <Heart className="text-2xl text-teal-600 animate-heartbeat" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 animate-bounce" />
                      <span className="text-right flex-1">{hospital.address}</span>
                      <Button asChild variant="outline" className="flex items-center gap-1">
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer">
                          Directions
                        </a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 animate-shake" />
                      <span className="text-right flex-1">{hospital.phone}</span>
                      {hospital.phone && hospital.phone !== "-" && (
                        <Button asChild variant="outline" className="flex items-center gap-1">
                          <a href={`tel:${hospital.phone}`}>Call</a>
                        </Button>
                      )}
                    </div>
                    {hospital.website && hospital.website !== "-" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <Button asChild variant="outline" className="flex items-center gap-1">
                          <a href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`} target="_blank" rel="noopener noreferrer">Website</a>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="hover-scale hover-tilt transition-all duration-300"
                      onClick={() => navigate(`/book-appointment?hospital=${hospital.id}`)}
                    >
                      Book Appointment
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 hover-scale animate-pulse-glow transition-all duration-300"
                      onClick={() => navigate(`/hospitals/${hospital.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
