import { useState } from "react";
import MyReportsList from "./MyReportsList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [myReports, setMyReports] = useState([
    { id: 1, description: "Pothole on Main Street", status: "Pending" },
    { id: 2, description: "Fallen stop sign", status: "Approved" },
    { id: 3, description: "Broken streetlight", status: "Under Review" },
  ]);

  const handleNewReport = () => {
    navigate("/NewReport");
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">My Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Reports</h2>
            <Button variant="outline" onClick={handleNewReport} className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> New Report
            </Button>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="review">Under Review</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <MyReportsList reports={myReports} />
            </TabsContent>
            <TabsContent value="pending">
              <MyReportsList reports={myReports.filter(report => report.status === "Pending")} />
            </TabsContent>
            <TabsContent value="approved">
              <MyReportsList reports={myReports.filter(report => report.status === "Approved")} />
            </TabsContent>
            <TabsContent value="review">
              <MyReportsList reports={myReports.filter(report => report.status === "Under Review")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;