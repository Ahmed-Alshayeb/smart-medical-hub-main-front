import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Hospital, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  specialization: string;
  image?: string;
}

const Clinics = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/backend/api/index.php/clinics")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data && Array.isArray(data.data.clinics)) {
          setClinics(data.data.clinics);
        } else {
          setError("Failed to load clinics.");
        }
      })
      .catch(() => setError("Failed to load clinics."))
      .finally(() => setLoading(false));
  }, []);

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.specialization.toLowerCase().includes(search.toLowerCase()) ||
      clinic.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-purple-400 dark:from-gray-900 dark:to-gray-800 pb-12">
      {/* Navigation Bar */}
      <Navigation />

      {/* Search Bar Section */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg px-6 py-6 w-full max-w-2xl -mt-10 z-10 relative flex gap-2">
          <Input
            type="text"
            placeholder="Search for clinics by name, specialization, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 shadow-none"
          />
          <Button variant="default" className="px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Placeholder for clinic image upload (for future add/edit form) */}
      {/* <Input type="file" accept="image/*" /> */}

      {/* Clinics List */}
      <div className="max-w-6xl mx-auto mt-12">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-16 animate-fade-in">
            <Hospital className="mx-auto h-10 w-10 mb-4 text-red-300" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : filteredClinics.length === 0 ? (
          <div className="text-center text-gray-100 dark:text-gray-400 py-16 animate-fade-in">
            <Hospital className="mx-auto h-10 w-10 mb-4 text-blue-100" />
            <p className="text-lg font-semibold">No clinics found.</p>
            <p className="text-sm">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-900 animate-zoom-in">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Hospital className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-700 dark:text-white mb-1">{clinic.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{clinic.specialization}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="block text-gray-600 dark:text-gray-400 text-sm">
                    <strong>Address:</strong> {clinic.address}
                  </span>
                  <span className="block text-gray-600 dark:text-gray-400 text-sm">
                    <strong>Phone:</strong> {clinic.phone}
                    {clinic.phone && clinic.phone !== "-" && (
                      <Button asChild variant="outline" className="ml-2 px-2 py-1 text-xs">
                        <a href={`tel:${clinic.phone}`}><Phone className="h-4 w-4" />Call</a>
                      </Button>
                    )}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/book-appointment?clinic=${clinic.id}`)}>
                    Book Appointment
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600" onClick={() => navigate(`/clinics/${clinic.id}`)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clinics; 