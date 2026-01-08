'use client';

import Image from 'next/image';

export default function Sidebar() {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-2 shadow-notion-sm">
        {/* Valyu Logo - Home */}
        <a
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-md bg-black hover:bg-black/90 transition-notion"
          aria-label="Home"
        >
          <Image
            src="/nabla.png"
            alt="Home"
            width={22}
            height={22}
            className="rounded"
          />
        </a>
      </div>
    </div>
  );
}
