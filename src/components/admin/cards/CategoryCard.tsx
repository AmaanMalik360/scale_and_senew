"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface CategoryCardAction {
  icon: React.ReactNode;
  name: string;
  handler: () => void;
}

interface CategoryCardProps {
  name: string;
  imageUrl?: string;
  slug: string;
  onClick?: (slug: string) => void;
  actions?: CategoryCardAction[];
}

export function CategoryCard({ name, imageUrl, slug, onClick, actions }: CategoryCardProps) {
  const handleActionClick = (handler: () => void) => {
    handler();
  };

  const handleCardClick = () => {
    onClick?.(slug);
  };

  return (
    <DropdownMenu.Root>
      <div
        onClick={handleCardClick}
        className="admin-card flex items-center gap-3 px-4 py-3 min-w-[180px] cursor-pointer transition-shadow hover:shadow-md w-full"
      >
        {imageUrl ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--admin-bg)] shrink-0">
            <Image
              src={imageUrl}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            {/* <div className="w-12 h-12 rounded-lg bg-[var(--admin-border-light)] shrink-0 flex items-center justify-center">
            <span className="text-[var(--admin-grey)] text-xs">IMG</span>
          </div> */}
            <span className="text-sm font-semibold text-[var(--admin-text-primary)] text-left">
              {name}
            </span>
          </>
        )}
        {actions && actions.length > 0 && (
          <DropdownMenu.Trigger asChild>
            <button
              className="ml-auto p-1 text-[var(--admin-grey)] hover:text-[var(--admin-text-primary)] transition-colors cursor-pointer"
              aria-label="More actions"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
        )}
      </div>

      {actions && actions.length > 0 && (
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]"
            align="end"
            sideOffset={4}
          >
            {actions.map((action, index) => (
              <DropdownMenu.Item
                key={index}
                onSelect={() => handleActionClick(action.handler)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer outline-none"
              >
                {action.icon}
                <span>{action.name}</span>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      )}
    </DropdownMenu.Root>
  );
}
