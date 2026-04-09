"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "../data-table";

const pathToTitle: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Order Management",
  "/admin/customers": "Customers",
  "/admin/coupons": "Coupon Code",
  "/admin/categories": "Categories",
  "/admin/transactions": "Transaction",
  "/admin/brands": "Brand",
  "/admin/products/add": "Add Products",
  "/admin/products/media": "Product Media",
  "/admin/products/list": "Product List",
  "/admin/products/reviews": "Product Reviews",
  "/admin/roles": "Admin Role",
  "/admin/authority": "Control Authority",
};

export function AdminNavbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const title = pathToTitle[pathname] || "Dashboard";

  return (
    <header className="h-16 bg-[var(--admin-bg-white)] border-b border-[var(--admin-border-light)] flex items-center justify-between px-6 shrink-0">
      {/* Left: Page Title */}
      <h1 className="text-dashboard-title text-[var(--admin-brand-secondary)]">
        {title}
      </h1>

      {/* Center: Search */}
      <div className="relative hidden md:block">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-grey)]" />
        <input
          type="text"
          placeholder="Search data, users, or reports"
          className="admin-input pl-9 pr-4 py-2 w-[320px] text-sm"
        /> */}
        <SearchBar
          placeholder="Search data, users, or reports"
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="admin-icon-btn relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--admin-error)] rounded-full" />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="admin-icon-btn"
        >
          {darkMode ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>
        <div className="w-9 h-9 rounded-full bg-[var(--admin-brand-secondary)] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
