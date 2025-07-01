import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Calendar, Microscope, ArrowLeft, Globe, Phone, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Labs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/backend/api/index.php/labs")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data && Array.isArray(data.data.labs)) {
          setLabs(data.data.labs);
        } else {
          setError("Failed to load labs.");
        }
      })
      .catch(() => setError("Failed to load labs."))
      .finally(() => setLoading(false));
  }, []);

  const filteredLabs = labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lab.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 animated-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Medical Labs</h1>
          <p className="text-xl text-purple-100 animate-fade-in-up stagger-2">
            Book lab tests and medical checkups easily
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-8 animate-fade-in hover-scale shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for labs by name or address..."
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
            <span className="text-lg text-purple-600">Loading labs...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-red-600">{error}</span>
          </div>
        ) : filteredLabs.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-muted-foreground">No labs found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLabs.map((lab, index) => (
              <Card key={lab.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in card-hover hover-shine" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <Microscope className="text-3xl text-purple-600 animate-heartbeat" />
                  </div>
                  <CardTitle className="text-lg text-right">{lab.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{lab.rating}</span>
                    </div>
                    <span className="text-gray-500">({lab.total_reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 animate-bounce" />
                    <span className="text-right flex-1">{lab.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lab.phone && lab.phone !== "-" && (
                      <Button asChild variant="outline" className="flex items-center gap-1">
                        <a href={`tel:${lab.phone}`}><Phone className="h-4 w-4" />Call</a>
                      </Button>
                    )}
                    {lab.website && lab.website !== "-" && (
                      <Button asChild variant="outline" className="flex items-center gap-1">
                        <a href={lab.website.startsWith('http') ? lab.website : `https://${lab.website}`} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4" />Website</a>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="hover-scale hover-tilt transition-all duration-300"
                      onClick={() => navigate(`/book-appointment?lab=${lab.id}`)}
                    >
                      Book Appointment
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover-scale animate-pulse-glow transition-all duration-300"
                      onClick={() => navigate(`/labs/${lab.id}`)}
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

export default Labs;
