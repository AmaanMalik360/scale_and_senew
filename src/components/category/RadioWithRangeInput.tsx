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

export default function RadioWithRangeInput({ 
  type, 
  filterKey, 
  value, 
  options, 
  allowCustom, 
  enforceBoth = false, 
  onChange 
}: RadioWithRangeInputProps) {
  const [customRange, setCustomRange] = useState({ 
    min: "", 
    max: "" 
  });

  // Determine current selection
  const isCustomSelected = Array.isArray(value) && value[0] === "custom";
  const currentRange = !Array.isArray(value) ? value : { min: undefined, max: undefined };

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

  const handleCustomRangeChange = () => {
    const minNum = customRange.min ? Number(customRange.min) : undefined;
    const maxNum = customRange.max ? Number(customRange.max) : undefined;

    if (enforceBoth) {
      if (minNum !== undefined && maxNum !== undefined) {
        onChange(type, filterKey, { min: minNum, max: maxNum });
      }
    } else {
      const range: { min?: number; max?: number } = {};
      if (minNum !== undefined) range.min = minNum;
      if (maxNum !== undefined) range.max = maxNum;
      if (range.min !== undefined || range.max !== undefined) {
        onChange(type, filterKey, range);
      }
    }
  };

  // Find currently selected option
  const selectedOption = options.find(opt => {
    if (Array.isArray(value)) return false;
    return JSON.stringify(opt.values) === JSON.stringify(value);
  });

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
                  placeholder="Min"
                  value={customRange.min}
                  onChange={e => {
                    setCustomRange(p => ({ ...p, min: e.target.value }));
                    handleCustomRangeChange();
                  }}
                  className="w-20 px-2 py-1 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                <span className="text-sm">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={customRange.max}
                  onChange={e => {
                    setCustomRange(p => ({ ...p, max: e.target.value }));
                    handleCustomRangeChange();
                  }}
                  className="w-20 px-2 py-1 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
            )}
          </>
        )}
      </RadioGroup>
    </div>
  );
}
