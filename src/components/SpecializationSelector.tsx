import React from "react";
import { Label } from "@/components/ui/label";

/**
 * Props for SpecializationSelector component.
 */
export interface Specialization {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SpecializationSelectorProps {
  specializations: Specialization[];
  selected: string;
  onSelect: (value: string) => void;
}

/**
 * A reusable, accessible selector for medical specializations.
 * @param props SpecializationSelectorProps
 */
const SpecializationSelector: React.FC<SpecializationSelectorProps> = ({
  specializations,
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-4" role="radiogroup" aria-label="Medical Specializations">
      <div>
        <Label className="text-lg font-semibold" htmlFor="specialization-list">
          What type of consultation do you need?
        </Label>
        <p className="text-gray-600 text-sm mt-1">
          Select the medical specialty that best matches your needs
        </p>
      </div>
      <div
        id="specialization-list"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {specializations.map((spec) => (
          <button
            key={spec.value}
            type="button"
            role="radio"
            aria-checked={selected === spec.value}
            tabIndex={0}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selected === spec.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(spec.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(spec.value);
              }
            }}
            aria-label={spec.label}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{spec.icon}</span>
              <div>
                <h3 className="font-semibold">{spec.label}</h3>
                <p className="text-sm text-gray-600">Expert consultation</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SpecializationSelector); 