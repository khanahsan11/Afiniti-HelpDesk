import { Suspense } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/cards";
import { Button } from "@/components/ui/buttons";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import LogsTable from "@/components/LogsTable";
import SearchFilters from "@/components/SearchFilters";

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Webhook Logs</h1>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <SearchFilters />
          </CardHeader>
          <CardBody>
            <Suspense fallback={<div>Loading logs...</div>}>
              <LogsTable />
            </Suspense>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
