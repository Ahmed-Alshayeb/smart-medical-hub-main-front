import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, ShoppingCart, Clock, Truck, Heart, ArrowLeft, Loader2, Package, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  specialization: string;
  image?: string;
}

const Pharmacy = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("/backend/api/index.php/pharmacies")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.data && Array.isArray(data.data.pharmacies)) {
          setPharmacies(data.data.pharmacies);
        } else {
          setError("Failed to load pharmacies.");
        }
      })
      .catch(() => setError("Failed to load pharmacies."))
      .finally(() => setLoading(false));
  }, []);

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(search.toLowerCase()) ||
      pharmacy.specialization.toLowerCase().includes(search.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-12">
      <Navigation />
      
      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Button 
          variant="outline" 
          className="mb-4 hover-scale animate-fade-in"
          onClick={() => window.location.href = '/'}
        >
          <ArrowLeft className="h-4 w-4 ml-2 animate-bounce" />
          العودة للصفحة الرئيسية
        </Button>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 animated-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">الصيدلية الإلكترونية</h1>
          <p className="text-xl text-green-100 animate-fade-in-up stagger-2">
            اطلب الأدوية والمكملات الغذائية مع التوصيل السريع
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar Section */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg px-6 py-6 w-full max-w-2xl -mt-10 z-10 relative flex gap-2">
            <Input
              type="text"
              placeholder="Search for pharmacies by name, specialization, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 shadow-none"
            />
            <Button variant="default" className="px-6">
              Search
            </Button>
          </div>
        </div>

        {/* Pharmacies List */}
        <div className="max-w-6xl mx-auto mt-12">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 animate-fade-in">
              <Package className="mx-auto h-10 w-10 mb-4 text-red-300" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          ) : filteredPharmacies.length === 0 ? (
            <div className="text-center text-gray-100 dark:text-gray-400 py-16 animate-fade-in">
              <Package className="mx-auto h-10 w-10 mb-4 text-blue-100" />
              <p className="text-lg font-semibold">No pharmacies found.</p>
              <p className="text-sm">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {filteredPharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-900 animate-zoom-in">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-blue-700 dark:text-white mb-1">{pharmacy.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{pharmacy.specialization}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="block text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Address:</strong> {pharmacy.address}
                    </span>
                    <span className="block text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Phone:</strong> {pharmacy.phone}
                      {pharmacy.phone && pharmacy.phone !== "-" && (
                        <Button asChild variant="outline" className="ml-2 px-2 py-1 text-xs">
                          <a href={`tel:${pharmacy.phone}`}><Phone className="h-4 w-4" />Call</a>
                        </Button>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/book-appointment?pharmacy=${pharmacy.id}`)}>
                      Book Appointment
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:from-green-600 hover:to-blue-600" onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt">
            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-bold mb-2">توصيل سريع</h3>
            <p className="text-gray-600 dark:text-gray-400">توصيل خلال ساعتين داخل المدينة</p>
          </Card>
          
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt stagger-2">
            <Heart className="h-12 w-12 text-red-600 mx-auto mb-4 animate-heartbeat" />
            <h3 className="text-xl font-bold mb-2">أدوية أصلية</h3>
            <p className="text-gray-600 dark:text-gray-400">جميع الأدوية من مصادر موثوقة ومرخصة</p>
          </Card>
          
          <Card className="text-center p-6 hover-scale animate-fade-in hover-tilt stagger-3">
            <Clock className="h-12 w-12 text-green-600 mx-auto mb-4 animate-wave" />
            <h3 className="text-xl font-bold mb-2">خدمة 24/7</h3>
            <p className="text-gray-600 dark:text-gray-400">متاحون لخدمتك على مدار الساعة</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
