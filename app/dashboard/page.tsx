"use client";

import { usePRData } from "@/hooks/usePRData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { handleDownloadPDF } from "@/utils/handleDownloadPdf";
import OverviewCharts from "@/components/OverviewCharts";
import ContributorsView from "@/components/ContributorsView";
import PullRequestsTable from "@/components/PullRequestTable";
import ReportSection from "@/components/ReportSection";
import { useState } from "react";

export default function DashboardPage() {
  const { data, loading } = usePRData();
  const [downloading, setDownloading] = useState(false);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading analytics...</p>
    );

  return (
    <main
      id="dashboard-content"
      className="h-screen px-10 py-12 space-y-8 bg-linear-to-br from-indigo-50 to-white rounded-xl shadow-md"
    >
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          📊 PR Analytics Dashboard
        </h1>
        <Button
          onClick={async () => {
            setDownloading(true);
            await handleDownloadPDF("dashboard-content");
            setDownloading(false);
          }}
          className="flex gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={downloading}
        >
          {downloading ? (
            "Generating..."
          ) : (
            <>
              <Download size={18} /> Download PDF
            </>
          )}
        </Button>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewCharts data={data} />
        </TabsContent>

        <TabsContent value="contributors">
          <ContributorsView data={data} />
        </TabsContent>

        <TabsContent value="pulls">
          <PullRequestsTable data={data} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportSection data={data} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
