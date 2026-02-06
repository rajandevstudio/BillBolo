"use client";

import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  basePath,
  search,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  search?: string;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (search) params.set("search", search);
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 2),
    Math.min(totalPages, page + 1)
  );

  return (
    <div className="flex justify-center mt-8 md:mt-10">
      <div className="flex items-center gap-1 bg-white border rounded-xl shadow-sm p-1">
        {/* Prev */}
        <Link
          href={buildUrl(Math.max(1, page - 1))}
          className={`px-3 py-2 rounded-lg text-sm transition
          ${
            page === 1
              ? "opacity-40 pointer-events-none"
              : "hover:bg-gray-100"
          }`}
        >
          Previous
        </Link>

        {/* Page numbers */}
        {pages.map((p) => (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                p === page
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {p}
          </Link>
        ))}

        {/* Next */}
        <Link
          href={buildUrl(Math.min(totalPages, page + 1))}
          className={`px-3 py-2 rounded-lg text-sm transition
          ${
            page === totalPages
              ? "opacity-40 pointer-events-none"
              : "hover:bg-gray-100"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
