"use client";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FilterOption } from "@/types/filters";

interface RadioInputProps {
  type: "radio";
  filterKey: string;
  value: string[];
  options: FilterOption[];
  allowCustom?: boolean;
  onChange: (type: "radio", filterKey: string, value: string[]) => void;
}

export default function RadioInput({ type, filterKey, value, options, allowCustom, onChange }: RadioInputProps) {
  const currentValue = value[0] ?? "";

  const handleChange = (newValue: string) => {
    onChange(type, filterKey, [newValue]);
  };

  return (
    <RadioGroup value={currentValue} onValueChange={handleChange} className="space-y-3">
      {options.map(opt => (
        <div key={opt.value} className="flex items-center space-x-3">
          <RadioGroupItem
            value={opt.value}
            id={`${filterKey}-${opt.value}`}
            className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
          />
          <Label
            htmlFor={`${filterKey}-${opt.value}`}
            className="text-sm font-light text-foreground cursor-pointer"
          >
            {opt.label}
          </Label>
        </div>
      ))}
      {allowCustom && (
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
      )}
    </RadioGroup>
  );
}
