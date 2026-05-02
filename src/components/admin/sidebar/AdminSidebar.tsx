"use client";

import { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

interface NavLeaf {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  children?: never;
}

interface NavParent {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: never;
  children: NavLeaf[];
}

type NavItem = NavLeaf | NavParent;

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
      {
        label: "Categories",
        icon: FolderOpen,
        children: [
          { label: "All Categories", icon: List, href: "/admin/categories" },
          { label: "Attributes", icon: Layers, href: "/admin/categories/attributes" },
        ],
      },
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

  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => pathname.startsWith(child.href));
  };

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    () =>
      navigation.reduce<Record<string, boolean>>((acc, section) => {
        section.items.forEach((item) => {
          if (item.children) {
            acc[item.label] = hasActiveChild(item);
          }
        });
        return acc;
      }, {})
  );

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isLeafActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/categories") return pathname.startsWith("/admin/categories") && !pathname.startsWith("/admin/categories/attributes");
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
                const Icon = item.icon;

                if (item.children) {
                  const isOpen = openAccordions[item.label] ?? false;
                  const parentHasActive = hasActiveChild(item);
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleAccordion(item.label)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          parentHasActive
                            ? "text-[var(--admin-brand-primary)] bg-[var(--admin-accent)]"
                            : "text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)]"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[var(--admin-grey)]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[var(--admin-grey)]" />
                        )}
                      </button>
                      {isOpen && (
                        <ul className="mt-0.5 ml-4 pl-2 border-l border-[var(--admin-border-light)] space-y-0.5">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const childActive = isLeafActive(child.href);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    childActive
                                      ? "bg-[var(--admin-brand-primary)] text-white"
                                      : "text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)]"
                                  }`}
                                >
                                  <ChildIcon className="w-[16px] h-[16px] shrink-0" />
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                const active = isLeafActive(item.href);
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
