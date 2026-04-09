"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "../ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FilterConfig, FilterStateItem } from "@/types/filters";
import { useRouter, useSearchParams } from "next/navigation";
import CheckboxInput from "./CheckboxInput";
import RadioInput from "./RadioInput";
import RadioWithRangeInput from "./RadioWithRangeInput";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  filterConfig: FilterConfig[];
  activeFilters: FilterStateItem[];
  onFiltersChange: (updated: FilterStateItem[]) => void;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  filterConfig,
  activeFilters,
  onFiltersChange,
}: FilterSortBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Local draft state — only committed on "Apply"
  const [draft, setDraft] = useState<FilterStateItem[]>(activeFilters);

  // Sync draft when sheet opens
  useEffect(() => {
    if (filtersOpen) setDraft(activeFilters);
  }, [filtersOpen, activeFilters]);

  // Handler for filter component changes
  const handleFilterChange = (type: FilterStateItem["type"], key: string, value: FilterStateItem["value"]) => {
    setDraft(prev => {
      const newDraft = [...prev];
      const existingIndex = newDraft.findIndex(item => item.key === key);
      
      if (existingIndex >= 0) {
        newDraft[existingIndex] = { type, key, value };
      } else {
        newDraft.push({ type, key, value });
      }
      
      return newDraft;
    });
  };

  const handleApply = () => {
    onFiltersChange(draft);
    setFiltersOpen(false);
  };

  const handleClear = () => {
    const empty: FilterStateItem[] = filterConfig.map(f => ({ 
      type: f.type, 
      key: f.key, 
      value: f.type === "checkbox" ? [] : [] 
    }));
    setDraft(empty);
    onFiltersChange(empty);
    setFiltersOpen(false);
  };

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sort_by", value);
    router.push(`?${next.toString()}`, { scroll: false });
  };

  const currentSort = searchParams.get("sort") ?? "featured";

  return (
    <section className="w-full px-6 mb-8 border-b border-border pb-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-light text-muted-foreground">{itemCount} items</p>

        <div className="flex items-center gap-4">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="font-light hover:bg-transparent">
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background border-none shadow-none flex flex-col">
              <SheetHeader className="mb-6 border-b border-border pb-4 flex-shrink-0">
                <SheetTitle className="text-lg font-light">Filters</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto space-y-8">
                {filterConfig.map((filter, idx) => {
                  // Get current value for this filter from draft
                  const draftItem = draft.find(item => item.key === filter.key);
                  const currentValue = draftItem?.value ?? (filter.type === "checkbox" ? [] : []);
                  
                  return (
                    <div key={filter.key}>
                      {idx > 0 && <Separator className="border-border mb-8" />}
                      <h3 className="text-sm font-light mb-4 text-foreground">{filter.label}</h3>

                      {filter.type === "checkbox" && (
                        <CheckboxInput
                          type="checkbox"
                          filterKey={filter.key}
                          value={currentValue as string[]}
                          options={filter.options}
                          onChange={handleFilterChange}
                        />
                      )}

                      {filter.type === "radio" && (
                        <RadioInput
                          type="radio"
                          filterKey={filter.key}
                          value={currentValue as string[]}
                          options={filter.options}
                          allowCustom={filter.allowCustom}
                          onChange={handleFilterChange}
                        />
                      )}

                      {filter.type === "radios_with_range" && (
                        <RadioWithRangeInput
                          type="radios_with_range"
                          filterKey={filter.key}
                          value={currentValue}
                          options={filter.options}
                          allowCustom={filter.allowCustom}
                          enforceBoth={filter.enforceBoth}
                          onChange={handleFilterChange}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 pt-4 pb-4 flex-shrink-0">
                <Button size="sm" className="w-full bg-black text-white hover:bg-gray-800 font-normal" onClick={handleApply}>
                  Apply Filters
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-white text-black border-black hover:bg-accent font-light" onClick={handleClear}>
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-none border-none rounded-none bg-background">
              {[
                ["featured", "Featured"],
                ["price-low", "Price: Low to High"],
                ["price-high", "Price: High to Low"],
                ["newest", "Newest"],
                ["name", "Name A-Z"],
              ].map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default FilterSortBar;