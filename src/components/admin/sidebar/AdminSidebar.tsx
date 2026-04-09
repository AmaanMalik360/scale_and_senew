"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Tag,
  FolderOpen,
  Receipt,
  Briefcase,
  PlusCircle,
  Image,
  List,
  MessageSquare,
  UserCog,
  Shield,
  LogOut,
  ExternalLink,
  Store,
  BarChart3,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Main menu",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Order Management", icon: ClipboardList, href: "/admin/orders" },
      { label: "Customers", icon: Users, href: "/admin/customers" },
      { label: "Coupon Code", icon: Tag, href: "/admin/coupons" },
      { label: "Categories", icon: FolderOpen, href: "/admin/categories" },
      { label: "Transaction", icon: Receipt, href: "/admin/transactions" },
      { label: "Brand", icon: Briefcase, href: "/admin/brands" },
    ],
  },
  {
    title: "Product",
    items: [
      { label: "Add Products", icon: PlusCircle, href: "/admin/products/add" },
      { label: "Product Media", icon: Image, href: "/admin/products/media" },
      { label: "Product List", icon: List, href: "/admin/products/list" },
      {
        label: "Product Reviews",
        icon: MessageSquare,
        href: "/admin/products/reviews",
      },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Admin role", icon: UserCog, href: "/admin/roles" },
      { label: "Control Authority", icon: Shield, href: "/admin/authority" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[220px] min-h-screen bg-[var(--admin-bg-white)] border-r border-[var(--admin-border-light)] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <BarChart3 className="w-5 h-5 text-[var(--admin-brand-primary)]" />
        <span className="text-dashboard-title tracking-tight select-none">
          <span className="text-[var(--admin-brand-secondary)]">DEAL</span>
          <span className="text-[var(--admin-brand-primary)]">P</span>
          <span className="text-[var(--admin-brand-secondary)]">RT</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--admin-grey)]">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--admin-brand-primary)] text-white"
                          : "text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)]"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: User + Store */}
      <div className="mt-auto border-t border-[var(--admin-border-light)] p-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--admin-brand-secondary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Admin</p>
            <p className="text-[11px] text-[var(--admin-grey)] truncate">
              admin@store.com
            </p>
          </div>
          <button className="text-[var(--admin-grey)] hover:text-[var(--admin-error)] transition-colors shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)] rounded-lg transition-colors"
        >
          <Store className="w-[18px] h-[18px]" />
          Your Shop
          <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--admin-grey)]" />
        </Link>
      </div>
    </aside>
  );
}
