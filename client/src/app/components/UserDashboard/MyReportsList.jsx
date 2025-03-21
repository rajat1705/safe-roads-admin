import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyReportsList = ({ reports }) => {
  const navigate = useNavigate();

  if (!reports || reports.length === 0) {
    return <p className="text-center text-gray-500">No reports found.</p>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{report.description}</h3>
            <Badge variant={
              report.status === "Pending" ? "warning" :
              report.status === "Approved" ? "success" : "secondary"
            }>
              {report.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate(`/ReportStatus/${report.id}`)}
            >
              Report ID: {report.id}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate(`/EditReport/${report.id}`)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyReportsList;
