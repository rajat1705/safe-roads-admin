import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ReportStatus = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching report data
    setTimeout(() => {
      const dummyReports = [
        { id: "1", description: "Pothole on Main Street", status: "Pending", details: "Reported on March 20, awaiting review." },
        { id: "2", description: "Fallen stop sign", status: "Approved", details: "Approved on March 18, repair scheduled." },
        { id: "3", description: "Broken streetlight", status: "Under Review", details: "Under review by the city council." },
      ];
      const foundReport = dummyReports.find((r) => r.id === reportId);
      setReport(foundReport);
      setLoading(false);
    }, 1000);
  }, [reportId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading report details...</p>;
  }

  if (!report) {
    return <p className="text-center text-red-500">Report not found.</p>;
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-semibold">{report.description}</div>
          <Badge
            variant={
              report.status === "Pending" ? "warning" :
              report.status === "Approved" ? "success" : "secondary"
            }
          >
            {report.status}
          </Badge>
          <p className="text-gray-600">{report.details}</p>
          <Button onClick={() => window.history.back()} className="text-black">Back</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportStatus;
