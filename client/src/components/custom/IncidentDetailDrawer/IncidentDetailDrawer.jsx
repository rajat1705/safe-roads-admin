import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const incident = {
  "id": "ab3e1afa-56bc-4a2b-8bd7-f7567c86990a",
  "created_at": "2025-03-19T10:02:10.133055+00:00",
  "location_lat": 28.440534577591,
  "location_lng": 77.0414006710053,
  "location_text": "28.440535, 77.041401",
  "description": "sss",
  "issue_type": "lighting",
  "image_url": "",
  "status": "pending",
  "resolved_at": "",
  "user_id": "",
  "upvotes": "0",
  "downvotes": "0",
  "severity": "medium",
  "active": true,
  "weight": 6,
  "state": null,
  "city": null
}

const IncidentDetailDrawer = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} direction="right">
      <DrawerContent style={{ width: "35%" , maxWidth: "35%" }}>
        <DrawerHeader>
          <DrawerTitle>
            <h2 className="text-xl font-bold mb-4">Incident Report</h2>
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
          <Card>
            <CardContent className="p-4 space-y-2">
              <img src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" alt="Incident" className="rounded-lg bg-gray-100" style={{ objectFit: "contain", width: "100%", height: "200px" }} />
              <p><strong>State:</strong> {incident.state}</p>
              <p><strong>City:</strong> {incident.city}</p>
              <p><strong>Description:</strong> {incident.description}</p>
              <p><strong>Status:</strong> {incident.status}</p>
              <p><strong>Severity:</strong> {incident.severity}</p>
              <p><strong>Reported At:</strong> {incident.created_at}</p>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Incident Location</h3>
              <MapContainer
                center={[incident.location_lat, incident.location_lng]}
                zoom={13}
                style={{ height: "250px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[incident.location_lat, incident.location_lng]}>
                  <Popup>
                    Incident Location: {incident.issue_type}
                  </Popup>
                </Marker>
              </MapContainer>
            </CardContent>
          </Card>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};

export default IncidentDetailDrawer;