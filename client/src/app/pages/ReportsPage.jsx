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
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lon: null,
  });
  const [locationError, setLocationError] = useState(null); 
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [locationName, setLocationName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("user"); // Default role is 'user'
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
          setLocationError(null); 
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "An error occurred while retrieving your location.";

          if (error.code === 1) {
            errorMessage = "You have denied location access. Please enable location permissions for this site in your browser settings to use this feature.";
          } else if (error.code === 2) {
            errorMessage = "Location services are unavailable. Please ensure location services are enabled in your browser/device settings.";
          } else if (error.code === 3) {
            errorMessage = "Location request timed out. Please try again.";
          }

          setLocationError(errorMessage); 
          setCurrentLocation({ lat: null, lon: null }); 
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Location unavailable";
    }
  };

  useEffect(() => {
    if (selectedReport?.location_lat && selectedReport?.location_lng) {
      fetchLocationName(
        selectedReport.location_lat,
        selectedReport.location_lng
      ).then(setLocationName);
    }
  }, [selectedReport]);

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

  const handleResolve = (id) => {
    fetch(
      `https://road-safety-backend-862776753006.asia-south1.run.app/api/incidents/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "resolved",
        }),
      }
    )
      .then((response) => response.json())
      .then((updatedReport) => {
        if (updatedReport) {
          setApprovedReports((prevReports) =>
            prevReports.filter((report) => report.id !== id)
          );

          setResolvedReports((prevResolvedReports) => [
            ...prevResolvedReports,
            updatedReport,
          ]);

          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === id ? { ...report, status: "resolved" } : report
            )
          );

          closeModal();
        }
      })
      .catch((err) => console.error("Error resolving report:", err));
  };

  const filteredReports = () => {
    const filteredByState = filters?.state
      ? reports.filter((report) => report.state === filters.state)
      : reports;

    const filteredByCity = filters?.city
      ? filteredByState.filter((report) => report.city === filters.city)
      : filteredByState;

    if (statusFilter === "all") return filteredByCity;
    if (statusFilter === "pending")
      return filteredByCity.filter((report) => report.status === "pending");
    if (statusFilter === "approved")
      return filteredByCity.filter((report) => report.status === "approved");
    if (statusFilter === "rejected")
      return filteredByCity.filter((report) => report.status === "rejected");
  };

  const openAdminLoginModal = () => {
    setIsAdminLoginModalOpen(true);
  };

  const closeAdminLoginModal = () => {
    setIsAdminLoginModalOpen(false);
  };

  const handleLogin = (email, password) => {
    const hardcodedEmail = "admin@gmail.com";
    const hardcodedPassword = "admin123";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      setUserRole("admin");
      closeAdminLoginModal();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setUserRole("user");
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
          {userRole === "user" ? (
            <Button variant="outline" onClick={openAdminLoginModal}>
              Login as Admin
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
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
                            {report.issue_type.charAt(0).toUpperCase() +
                              report.issue_type.slice(1)}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-center">
                            {report.description.charAt(0).toUpperCase() +
                              report.description.slice(1)}
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
                                  : report.status === "resolved"
                                  ? "bg-blue-500"
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

        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                {selectedReport && (
                  <>
                    <p>
                      <strong>Issue Type:</strong> {selectedReport.issue_type}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedReport.description}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedReport.city},{" "}
                      {selectedReport.state}
                    </p>
                    <div className="mt-4">
                      {userRole === "admin" &&
                        selectedReport.status === "pending" && (
                          <>
                            <Button
                              className="mr-2"
                              onClick={() => handleApprove(selectedReport.id)}>
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(selectedReport.id)}>
                              Reject
                            </Button>
                          </>
                        )}

                      {userRole === "admin" &&
                        selectedReport.status === "approved" && (
                          <Button
                            className="mt-2"
                            onClick={() => handleResolve(selectedReport.id)}>
                            Resolve
                          </Button>
                        )}
                    </div>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAdminLoginModalOpen}
          onOpenChange={closeAdminLoginModal}
          className="relative z-[1000]">
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-[999]" />
          <DialogContent className="max-w-lg z-[1000] bg-white rounded-xl shadow-3xl p-6">
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>
                Please enter your credentials to log in as an admin.
              </DialogDescription>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(e.target.email.value, e.target.password.value);
                }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  className="w-full p-2 mb-4 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 mb-4 border rounded"
                />
                <Button variant="outline" type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full h-full">
        {locationError ? (
          <p className="text-center text-gray-600">{locationError}</p>
        ) : currentLocation.lat && currentLocation.lon ? (
          <MapContainer
            center={[currentLocation.lat, currentLocation.lon]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.location_lat, report.location_lng]}>
                <Popup>{report.issue_type}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p className="text-center text-gray-600">Fetching location...</p>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg z-[1000] bg-white rounded-xl shadow-xl p-8">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-semibold text-gray-900">
              {selectedReport?.issue_type}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-md mt-2">
              {selectedReport?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedReport?.image_url && (
            <div className="mt-6 flex justify-center">
              <img
                src={selectedReport.image_url}
                alt="Report"
                className="max-w-full h-72 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <div className="mt-6 space-y-4 text-gray-700">
            <p className="text-lg">
              <strong className="text-gray-900">📍 Location:</strong>{" "}
              <span className="text-gray-800">{locationName}</span>
            </p>
            <p className="text-lg">
              <strong className="text-gray-900">🏛️ State:</strong>{" "}
              <span className="text-gray-800">{selectedReport?.state}</span>
            </p>
            <p className="text-lg">
              <strong className="text-gray-900">🗓️ Reported on:</strong>{" "}
              <span className="text-gray-800">
                {new Date(selectedReport?.created_at).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              <strong className="text-gray-900">⚠️ Severity:</strong>{" "}
              <span className="text-gray-800 capitalize">
                {selectedReport?.severity}
              </span>
            </p>
            <p className="text-lg flex items-center">
              <strong className="text-gray-900">🔒 Status:</strong>
              <span
                className={`text-sm font-medium px-3 py-1 ml-2 rounded-full ${
                  selectedReport?.status === "pending"
                    ? "bg-yellow-300 text-gray-800"
                    : selectedReport?.status === "approved"
                    ? "bg-green-400 text-white"
                    : selectedReport?.status === "rejected"
                    ? "bg-red-400 text-white"
                    : selectedReport?.status === "resolved"
                    ? "bg-blue-400 text-white"
                    : ""
                }`}>
                {selectedReport?.status?.toUpperCase()}
              </span>
            </p>
          </div>

          {userRole === "admin" && (
            <div className="mt-8 flex justify-end space-x-4">
              {selectedReport?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedReport?.id)}
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition duration-300">
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(selectedReport?.id)}
                    className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition duration-300">
                    Approve
                  </Button>
                </>
              )}

              {selectedReport?.status === "approved" && (
                <Button
                  variant="outline"
                  onClick={() => handleResolve(selectedReport?.id)}
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition duration-300">
                  Resolved
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;