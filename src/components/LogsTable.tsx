"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/buttons";

type Log = {
  id: string;
  webhookId: string | null;
  payload: any;
  status: string;
  createdAt: Date;
};

export default function LogsTable() {
  const searchParams = useSearchParams();
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock data - replace with real data fetching
  const logs: Log[] = [];
  const totalPages = 1;
  const currentPage = 1;

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader
              field="createdAt"
              currentField={sortField}
              order={sortOrder}
              onClick={toggleSort}
            >
              Timestamp
            </SortableHeader>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Webhook ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payload Summary
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.webhookId || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {JSON.stringify(log.payload).slice(0, 100)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="secondary">Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No logs found matching your criteria
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" disabled={currentPage <= 1}>
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="secondary" disabled={currentPage >= totalPages}>
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  field,
  currentField,
  order,
  onClick,
  children,
}: {
  field: string;
  currentField: string;
  order: string;
  onClick: (field: string) => void;
  children: React.ReactNode;
}) {
  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => onClick(field)}
    >
      <div className="flex items-center">
        {children}
        {currentField === field &&
          (order === "asc" ? (
            <ArrowUpIcon className="ml-1 h-3 w-3" />
          ) : (
            <ArrowDownIcon className="ml-1 h-3 w-3" />
          ))}
      </div>
    </th>
  );
}
