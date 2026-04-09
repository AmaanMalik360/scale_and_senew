"use client";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FilterOption } from "@/types/filters";

interface CheckboxInputProps {
  type: "checkbox";
  filterKey: string;
  value: string[];
  options: FilterOption[];
  onChange: (type: "checkbox", filterKey: string, value: string[]) => void;
}

export default function CheckboxInput({ type, filterKey, value, options, onChange }: CheckboxInputProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    const newValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);
    onChange(type, filterKey, newValue);
  };

  return (
    <div className="space-y-3">
      {options.map(opt => (
        <div key={opt.value} className="flex items-center space-x-3">
          <Checkbox
            id={`${filterKey}-${opt.value}`}
            checked={value.includes(opt.value)}
            onCheckedChange={(checked) =>
              handleChange(opt.value, checked as boolean)
            }
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
    </div>
  );
}
