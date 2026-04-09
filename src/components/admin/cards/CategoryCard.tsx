"use client";

import Image from "next/image";

interface CategoryCardProps {
  name: string;
  imageUrl?: string;
  slug: string;
  onClick?: (slug: string) => void;
}

export function CategoryCard({ name, imageUrl, slug, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => onClick?.(slug)}
      className="admin-card flex items-center gap-3 px-4 py-3 min-w-[180px] cursor-pointer transition-shadow hover:shadow-md"
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
    </button>
  );
}
