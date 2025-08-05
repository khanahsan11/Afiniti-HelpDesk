"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/buttons";
export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });

    router.push(`/admin/logs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            defaultValue={searchParams.get("search") || ""}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Webhook ID or payload"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={searchParams.get("status") || ""}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="dateFrom"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          From
        </label>
        <input
          type="date"
          name="dateFrom"
          id="dateFrom"
          defaultValue={searchParams.get("dateFrom") || ""}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="dateTo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          To
        </label>
        <input
          type="date"
          name="dateTo"
          id="dateTo"
          defaultValue={searchParams.get("dateTo") || ""}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <Button type="submit" variant="secondary">
        Apply Filters
      </Button>
    </form>
  );
}
