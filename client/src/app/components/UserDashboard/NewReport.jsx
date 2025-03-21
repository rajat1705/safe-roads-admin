import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const NewReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState({ description: "", details: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("New Report Submitted:", report);
      setLoading(false);
      navigate("/UserDashboard");
    }, 1000);
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Create New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={report.description}
              onChange={(e) => setReport({ ...report, description: e.target.value })}
              placeholder="Report Title"
              required
            />
            <Textarea
              value={report.details}
              onChange={(e) => setReport({ ...report, details: e.target.value })}
              placeholder="Report Details"
              required
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="outline" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewReport;