import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EditReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({ description: "", details: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching report data
    setTimeout(() => {
      const dummyReports = [
        { id: "1", description: "Pothole on Main Street", details: "Needs urgent repair" },
        { id: "2", description: "Fallen stop sign", details: "Blocking pedestrian crossing" },
      ];
      const foundReport = dummyReports.find((r) => r.id === reportId);
      if (foundReport) setReport(foundReport);
      setLoading(false);
    }, 1000);
  }, [reportId]);

  const handleSave = () => {
    console.log("Updated Report:", report);
    navigate(-1); // Navigate back after saving (replace with API call later)
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading report details...</p>;
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Edit Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={report.description}
            onChange={(e) => setReport({ ...report, description: e.target.value })}
            placeholder="Report Title"
          />
          <Textarea
            value={report.details}
            onChange={(e) => setReport({ ...report, details: e.target.value })}
            placeholder="Report Details"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleSave} variant="outline">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditReport;
