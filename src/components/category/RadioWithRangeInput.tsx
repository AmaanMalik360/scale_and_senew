"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { RadioRangeFilterOption } from "@/types/filters";

interface RadioWithRangeInputProps {
  type: "radios_with_range";
  filterKey: string;
  value: { min?: number; max?: number } | string[];
  options: RadioRangeFilterOption[];
  allowCustom?: boolean;
  enforceBoth?: boolean;
  onChange: (type: "radios_with_range", filterKey: string, value: { min?: number; max?: number } | string[]) => void;
}

// Custom inputs accept PKR (major units); filter values emitted to the API
// are paisa (minor units), matching product_prices.amount on the backend.
const PKR_TO_PAISA = 100;

export default function RadioWithRangeInput({
  type,
  filterKey,
  value,
  options,
  allowCustom,
  enforceBoth = false,
  onChange
}: RadioWithRangeInputProps) {
  const currentRange = !Array.isArray(value) ? value : { min: undefined, max: undefined };

  // Find currently selected preset option
  const selectedOption = options.find(
    opt => !Array.isArray(value) && JSON.stringify(opt.values) === JSON.stringify(value)
  );

  // Custom is selected when the user picked "Custom", or when the applied range
  // matches no preset option.
  const isCustomSelected =
    (Array.isArray(value) && value[0] === "custom") ||
    (!selectedOption && (currentRange.min !== undefined || currentRange.max !== undefined));

  const [customRange, setCustomRange] = useState(() => ({
    min: isCustomSelected && currentRange.min !== undefined
      ? String(currentRange.min / PKR_TO_PAISA)
      : "",
    max: isCustomSelected && currentRange.max !== undefined
      ? String(currentRange.max / PKR_TO_PAISA)
      : "",
  }));

  const handleRadioChange = (selectedValue: string) => {
    if (selectedValue === "custom") {
      onChange(type, filterKey, ["custom"]);
    } else {
      const option = options.find(opt => opt.label === selectedValue);
      if (option) {
        onChange(type, filterKey, option.values);
      }
    }
    setCustomRange({ min: "", max: "" });
  };

  const handleCustomInputChange = (field: "min" | "max", raw: string) => {
    const next = { ...customRange, [field]: raw };
    setCustomRange(next);

    const minNum = next.min !== "" ? Math.round(Number(next.min) * PKR_TO_PAISA) : undefined;
    const maxNum = next.max !== "" ? Math.round(Number(next.max) * PKR_TO_PAISA) : undefined;

    if (enforceBoth) {
      if (minNum !== undefined && maxNum !== undefined) {
        onChange(type, filterKey, { min: minNum, max: maxNum });
      }
      return;
    }

    const range: { min?: number; max?: number } = {};
    if (minNum !== undefined) range.min = minNum;
    if (maxNum !== undefined) range.max = maxNum;
    if (range.min !== undefined || range.max !== undefined) {
      onChange(type, filterKey, range);
    }
  };

  return (
    <div className="space-y-3">
      <RadioGroup 
        value={selectedOption?.label ?? (isCustomSelected ? "custom" : "")} 
        onValueChange={handleRadioChange} 
        className="space-y-3"
      >
        {options.map(opt => (
          <div key={opt.label} className="flex items-center space-x-3">
            <RadioGroupItem
              value={opt.label}
              id={`${filterKey}-${opt.label}`}
              className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
            />
            <Label
              htmlFor={`${filterKey}-${opt.label}`}
              className="text-sm font-light text-foreground cursor-pointer"
            >
              {opt.label}
            </Label>
          </div>
        ))}
        
        {allowCustom && (
          <>
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="custom"
                id={`${filterKey}-custom`}
                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              <Label htmlFor={`${filterKey}-custom`} className="text-sm font-light cursor-pointer">
                Custom
              </Label>
            </div>
            
            {isCustomSelected && (
              <div className="flex items-center space-x-3 pl-7">
                <input
                  type="number"
                  placeholder="Min (Rs)"
                  value={customRange.min}
                  onChange={e => handleCustomInputChange("min", e.target.value)}
                  className="w-24 px-2 py-1 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                <span className="text-sm">to</span>
                <input
                  type="number"
                  placeholder="Max (Rs)"
                  value={customRange.max}
                  onChange={e => handleCustomInputChange("max", e.target.value)}
                  className="w-24 px-2 py-1 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
            )}
          </>
        )}
      </RadioGroup>
    </div>
  );
}
