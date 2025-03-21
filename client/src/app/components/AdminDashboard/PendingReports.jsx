import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Check, X } from "lucide-react";

const PendingReports = ({ onApprove, onReject }) => {
  const [reports, setReports] = useState([]);
  const [reviewNotes, setReviewNotes] = useState({});
  const [modalImage, setModalImage] = useState(null); 

  useEffect(() => {
    fetch("https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/all")
      .then((res) => res.json())
      .then((data) => {
        const pending = data.data.filter(report => report.status === 'pending');
        setReports(pending); 
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl); 
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleNoteChange = (id, note) => {
    setReviewNotes({ ...reviewNotes, [id]: note });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Review Notes</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Image</TableHead> 
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.description}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {report.city}, {report.state}
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add review notes..."
                      value={reviewNotes[report.id] || ""}
                      onChange={(e) => handleNoteChange(report.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => onApprove(report.id, reviewNotes[report.id])} size="sm" className="mr-2">
                      <Check className="w-4 h-4 text-black" />
                    </Button>
                    <Button onClick={() => onReject(report.id)} size="sm" variant="destructive">
                      <X className="w-4 h-4 text-black" />
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
        </CardContent>
      </Card>

      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md max-w-md">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              X
            </button>
            <img src={modalImage} alt="Report Image" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReports;
