import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lon: null,
  });
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const userRole = "admin"; // Example: "admin" or "user"
  const location = useLocation();
  const filters = location.state;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    fetch(
      "https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/all"
    )
      .then((res) => res.json())
      .then((data) => {
        setReports(data.data);
        setPendingReports(
          data.data.filter((report) => report.status === "pending")
        );
        setApprovedReports(
          data.data.filter((report) => report.status === "approved")
        );
        setRejectedReports(
          data.data.filter((report) => report.status === "rejected")
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleApprove = (id) => {
    const updatedReport = pendingReports.find((report) => report.id === id);

    fetch(
      `https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      }
    )
      .then((response) => response.json())
      .then((updatedReportData) => {
        if (updatedReportData) {
          setPendingReports((prevReports) =>
            prevReports.filter((report) => report.id !== id)
          );
          setApprovedReports((prevApprovedReports) => [
            ...prevApprovedReports,
            updatedReportData,
          ]);

          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === id ? { ...report, status: "approved" } : report
            )
          );
          closeModal();
        }
      })
      .catch((err) => console.error("Error updating report status:", err));
  };

  const handleReject = (id) => {
    fetch(
      `https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
        }),
      }
    )
      .then((response) => response.json())
      .then((updatedReport) => {
        if (updatedReport) {
          setPendingReports((prevReports) =>
            prevReports.filter((report) => report.id !== id)
          );
          setRejectedReports((prevRejectedReports) => [
            ...prevRejectedReports,
            updatedReport,
          ]);

          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === id ? { ...report, status: "rejected" } : report
            )
          );
          closeModal();
        }
      })
      .catch((err) => console.error("Error rejecting report:", err));
  };

  const filteredReports = () => {
    const filteredByState = filters?.state
      ? reports.filter((report) => report.state === filters.state)
      : reports;

    const filteredByCity = filters?.city
      ? filteredByState.filter((report) => report.city === filters.city)
      : filteredByState;

    if (statusFilter === "all") return filteredByCity;
    if (statusFilter === "pending") return filteredByCity.filter((report) => report.status === "pending");
    if (statusFilter === "approved") return filteredByCity.filter((report) => report.status === "approved");
    if (statusFilter === "rejected") return filteredByCity.filter((report) => report.status === "rejected");
  };

  const openAdminLoginModal = () => {
    setIsAdminLoginModalOpen(true);
  };

  const closeAdminLoginModal = () => {
    setIsAdminLoginModalOpen(false);
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-[3fr_2fr] bg-gray-100 pl-0">
      <div className="flex flex-col justify-start items-center lg:items-start p-10 w-full h-full overflow-auto">
        <h1 className="text-5xl font-bold text-gray-800 text-center lg:text-left">
          Nearby Reports
        </h1>
        <p className="text-lg text-gray-600 mt-2 text-center lg:text-left">
          Issues reported around your location
        </p>
        {filters && (
          <div className="text-lg text-gray-700 mt-4">
            <p>
              <strong>State:</strong> {filters.state || "Any"}
            </p>
            <p>
              <strong>City:</strong> {filters.city || "Any"}
            </p>
          </div>
        )}

        <div className="flex justify-end mb-4 w-full">
          <Button variant="outline" onClick={openAdminLoginModal}>
            Login as Admin
          </Button>
        </div>

        <Card className="w-full max-w-4xl shadow-lg bg-white p-6 rounded-lg mt-6 overflow-hidden">
          <CardTitle className="text-2xl font-semibold text-center mb-4">
            Recent Reports
          </CardTitle>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-600">Loading reports...</p>
            ) : (
              <>
                <div className="max-h-[450px] overflow-y-auto">
                  <Table className="min-w-full bg-white shadow-md rounded-lg">
                    <TableHeader className="text-white">
                      <TableRow>
                        <TableHead className="py-3 px-4 text-center">
                          Issue Type
                        </TableHead>
                        <TableHead className="py-3 px-4 text-center">
                          Description
                        </TableHead>
                        <TableHead className="py-3 px-4 text-center">
                          City
                        </TableHead>
                        <TableHead className="py-3 px-4 text-center">
                          State
                        </TableHead>
                        <TableHead className="py-3 px-4 text-center">
                          Status
                        </TableHead>
                        <TableHead className="py-3 px-4 text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports().map((report, index) => (
                        <TableRow
                          key={report.id}
                          className={
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }>
                          <TableCell className="py-3 px-4 text-center">
                            {report.issue_type}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {report.description}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {report.city}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {report.state}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-white text-sm ${
                                report.status === "pending"
                                  ? "bg-yellow-500"
                                  : report.status === "approved"
                                  ? "bg-green-500"
                                  : report.status === "rejected"
                                  ? "bg-red-500"
                                  : ""
                              }`}>
                              {report.status.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            <Button
                              variant="outline"
                              className="text-sm px-3 py-1 rounded"
                              onClick={() => openModal(report)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-full lg:min-w-[500px] p-4">
        <div className="h-full w-full rounded-lg shadow-lg overflow-hidden">
          {currentLocation.lat && currentLocation.lon ? (
            <MapContainer
              center={[currentLocation.lat, currentLocation.lon]}
              zoom={13}
              className="w-full h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[currentLocation.lat, currentLocation.lon]}>
                <Popup>You are here</Popup>
              </Marker>
              {reports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.location_lat, report.location_lng]}>
                  <Popup>{report.issue_type}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <p className="flex items-center justify-center h-full text-gray-600">
              Fetching location...
            </p>
          )}
        </div>
      </div>

      <Dialog
        open={isAdminLoginModalOpen}
        onOpenChange={setIsAdminLoginModalOpen}>
        <DialogContent className="max-w-lg z-[1000] bg-white rounded-xl shadow-2xl p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Admin Login
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm mt-1">
              Please enter your admin credentials to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={closeAdminLoginModal}>
              Close
            </Button>
            <Button variant="outline">Login</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg z-[1000] bg-white rounded-xl shadow-2xl p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {selectedReport?.issue_type}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm mt-1">
              {selectedReport?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedReport?.image_url && (
            <div className="mt-5 flex justify-center">
              <img
                src={selectedReport.image_url}
                alt="Report"
                className="max-w-full h-60 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="mt-6 space-y-2 text-gray-700">
            <p className="text-lg">
              <strong className="text-gray-900">📍 City:</strong>{" "}
              {selectedReport?.city}
            </p>
            <p className="text-lg">
              <strong className="text-gray-900">🏛️ State:</strong>{" "}
              {selectedReport?.state}
            </p>
            <p className="text-lg flex items-center">
              <strong className="text-gray-900">🔒 Status: </strong>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  selectedReport?.status === "pending"
                    ? "bg-yellow-400 text-gray-800"
                    : selectedReport?.status === "approved"
                    ? "bg-green-400 text-gray-800"
                    : selectedReport?.status === "rejected"
                    ? "bg-red-400 text-gray-800"
                    : ""
                }`}>
                {selectedReport?.status?.toUpperCase()}{" "}
              </span>
            </p>
          </div>

          {userRole === "admin" && (
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => handleReject(selectedReport?.id)}>
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => handleApprove(selectedReport?.id)}>
                Approve
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;