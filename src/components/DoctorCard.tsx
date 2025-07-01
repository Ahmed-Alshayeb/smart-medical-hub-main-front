import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Clock3, Users, Building2, CreditCard } from "lucide-react";

/**
 * Props for DoctorCard component.
 */
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  patients: number;
  image: string;
  hospital: string;
  consultationFee: number;
  languages: string[];
  education: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  selected: boolean;
  onClick: () => void;
}

/**
 * A reusable, accessible card for displaying doctor information.
 * @param props DoctorCardProps
 */
const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, selected, onClick }) => {
  return (
    <button
      type="button"
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 hover:border-gray-300"
      }`}
      aria-pressed={selected}
      aria-label={`Select doctor ${doctor.name}`}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{doctor.rating}</span>
            </div>
          </div>
          <p className="text-blue-600 font-medium mb-1">{doctor.specialization}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              <span>{doctor.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{doctor.patients}+ patients</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>SAR {doctor.consultationFee}</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="mr-2">
              {doctor.languages.join(", ")}
            </Badge>
            <Badge variant="outline">{doctor.education}</Badge>
          </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(DoctorCard); 