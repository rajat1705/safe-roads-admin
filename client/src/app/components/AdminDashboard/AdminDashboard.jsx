import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [approvedReports, setApprovedReports] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [modalImage, setModalImage] = useState(null); 

  useEffect(() => {
    fetch("https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/all")
      .then((res) => res.json())
      .then((data) => {
        const approved = data.data.filter(report => report.status === 'approved');
        const pending = data.data.filter(report => report.status === 'pending');
        
        setApprovedReports(approved);
        setPendingReports(pending);
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  const handleApprove = (id, notes) => {
    const reportToApprove = pendingReports.find((report) => report.id === id);
    
    fetch(`https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/${id}/status`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "approved",
        notes: notes,
      }),
    })
      .then((response) => response.json())
      .then((updatedReport) => {
        if (updatedReport) {
          setPendingReports((prevPendingReports) =>
            prevPendingReports.filter((report) => report.id !== id)
          );
          setApprovedReports((prevApprovedReports) => [
            ...prevApprovedReports,
            updatedReport,
          ]);
        }
      })
      .catch((err) => console.error("Error updating report status:", err));
  };

  const handleReject = (id) => {
    setPendingReports((prevPendingReports) =>
      prevPendingReports.filter((report) => report.id !== id)
    );
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Reports</TabsTrigger>
          <TabsTrigger value="approved">Approved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{`${report.city}, ${report.state}`}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleApprove(report.id, "Approved after review")}
                      className="p-2 rounded-md"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(report.id)}
                      className="p-2 rounded-md ml-2"
                    >
                      Reject
                    </Button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleImageClick(report.image_url)}
                      className="text-blue-500"
                    >
                      View Image
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="approved">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{`${report.city}, ${report.state}`}</TableCell>
                  <TableCell>{report.notes || "No notes"}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleImageClick(report.image_url)}
                      className="text-blue-500"
                    >
                      View Image
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md max-w-md">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              X
            </button>
            <img src={modalImage} alt="Report" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
